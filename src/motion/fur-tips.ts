type Chunk = { command: string; values: number[] };
type Point = { x: number; y: number };

/** Encontra pontas convexas no contorno, sem confundi-las com as raízes dos tufos. */
export function findFurTips(chunks: Chunk[]) {
  const segments: { start: Point; end: Point; incoming: Point; outgoing: Point }[] = [];
  let point: Point = {x: 0, y: 0};
  for (const {command, values: v} of chunks) {
    if (command === 'M') { point = {x: v[0], y: v[1]}; continue; }
    if (command !== 'C' && command !== 'L') continue;
    const end = {x: v[v.length-2], y: v[v.length-1]};
    segments.push({start: point, end,
      outgoing: {x: v[0]-point.x, y: v[1]-point.y},
      incoming: command === 'C' ? {x: end.x-v[2], y: end.y-v[3]} : {x: end.x-point.x, y: end.y-point.y},
    });
    point = end;
  }
  const winding = Math.sign(segments.reduce((sum, s) => sum+s.start.x*s.end.y-s.end.x*s.start.y, 0));
  return segments.flatMap((segment, i) => {
    const next = segments[(i+1)%segments.length];
    if (Math.hypot(next.start.x-segment.end.x, next.start.y-segment.end.y) > .1) return [];
    const a = segment.incoming, b = next.outgoing;
    const al = Math.hypot(a.x,a.y), bl = Math.hypot(b.x,b.y);
    if (!al || !bl) return [];
    const dot = (a.x*b.x+a.y*b.y)/(al*bl);
    const cross = a.x*b.y-a.y*b.x;
    if (dot > .65 || cross*winding <= 0) return [];
    const dx = a.x/al-b.x/bl, dy = a.y/al-b.y/bl;
    const length = Math.hypot(dx,dy);
    return [{...segment.end, tx: -dy/length, ty: dx/length, phase: i*.37}];
  });
}
