#!/usr/bin/env bash
# Gera os vídeos do site a partir dos Reels baixados em videos-instagram/.
#
# Para cada vídeo, o script cria em public/videos/:
#   <id>.webm        vídeo completo para o modal (VP9 + Opus, 720 × 1280)
#   <id>-take.webm   trecho curto e mudo para o item ativo dos carrosséis
#   <id>-take.mp4    o mesmo trecho em H.264, para navegadores sem VP9
#   <id>-thumb.webp  primeiro quadro do trecho, usado nos itens inativos
#
# Uso: bash scripts/build-videos.sh [--takes-only]
# Para gerar um único vídeo: ONLY=<id> bash scripts/build-videos.sh --takes-only
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/videos-instagram"
OUT="$ROOT/public/videos"
mkdir -p "$OUT"

# id | trechos do take, em segundos (início-fim, separados por vírgula)
TAKES=(
  "DexdqWWPZJa|22-29"
  "Db9m0XHR9Wg|0-6"
  "Dbq80l8vYnE|0-4"
  "DaEf0-5xv9u|0-3.8,19-22"
  "DY0rCRUx7P4|5-8,21-24"
  "DcESkYsxehd|14-20"
  "DcAWvG0uu_a|20-26"
  "DbTd0mqRbNr|0-6"
)

build_take() {
  local id="$1" ranges="$2" input="$3"
  local filter="" labels="" count=0
  IFS=',' read -ra parts <<< "$ranges"
  for part in "${parts[@]}"; do
    local start="${part%-*}" end="${part#*-}"
    filter+="[0:v]trim=start=$start:end=$end,setpts=PTS-STARTPTS,scale=540:960:flags=lanczos,fps=30[v$count];"
    labels+="[v$count]"
    count=$((count + 1))
  done
  filter+="${labels}concat=n=$count:v=1:a=0[out]"

  ffmpeg -v error -y -i "$input" -filter_complex "$filter" -map "[out]" -an \
    -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p \
    "$OUT/$id-take.webm"
  ffmpeg -v error -y -i "$input" -filter_complex "$filter" -map "[out]" -an \
    -c:v libx264 -crf 26 -preset slow -profile:v main -pix_fmt yuv420p -movflags +faststart \
    "$OUT/$id-take.mp4"
  ffmpeg -v error -y -i "$OUT/$id-take.mp4" -frames:v 1 -c:v libwebp -quality 82 "$OUT/$id-thumb.webp"
}

build_full() {
  local id="$1" input="$2"
  ffmpeg -v error -y -i "$input" \
    -vf "scale=720:1280:flags=lanczos" \
    -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -deadline good -cpu-used 3 -pix_fmt yuv420p \
    -c:a libopus -b:a 96k \
    "$OUT/$id.webm"
}

for entry in "${TAKES[@]}"; do
  [[ -n "${ONLY:-}" && "${entry%%|*}" != "$ONLY" ]] && continue
  id="${entry%%|*}"
  ranges="${entry#*|}"
  input="$(ls "$SRC"/*_"$id".mp4)"
  echo "take  $id ($ranges)"
  build_take "$id" "$ranges" "$input"
  if [[ "${1:-}" != "--takes-only" ]]; then
    echo "full  $id"
    build_full "$id" "$input"
  fi
done

ls -la "$OUT"
