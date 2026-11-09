const scene = document.querySelector('#scene');
const pet = document.querySelector('#mascot');
const canvas = document.querySelector('#sprite');
const ctx = canvas.getContext('2d');
const shadow = document.querySelector('#shadow');
const stateLabel = document.querySelector('#state');
const feedback = document.querySelector('#feedback');
const pauseButton = document.querySelector('#pause');
const greetButton = document.querySelector('#greet');
const restartButton = document.querySelector('#restart');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const sheet = new Image();
const parts = new Image();
let frames = [], scale = 1, platforms = [], x = 0, direction = 1;
let paused = false, visible = true, hovering = false, focused = false, ready = false;
let frameId = 0, lastTime = 0, walkTime = 0, restTime = 1.1, greetingTime = 0;
let staticGreeting = false, lastSprite = -1, lastDirection = 0, currentFrame = 6;
let platformIndex = 0, jump = null, pendingGreeting = false, partsReady = false, sheetReady = false;
let greetingClock = 0;
const PET_WIDTH = 128, PET_HEIGHT = 144, SPEED = 42;
const TAKEOFF = .11, FLIGHT = .48, LANDING = .14;

// O atlas permanece intacto. Os recortes são calculados na memória do navegador.
function readFrames() {
  const scratch = document.createElement('canvas');
  scratch.width = sheet.width; scratch.height = sheet.height;
  const context = scratch.getContext('2d', { willReadFrequently: true });
  context.drawImage(sheet, 0, 0);
  const pixels = context.getImageData(0, 0, sheet.width, sheet.height).data;
  const cellW = sheet.width / 4, cellH = sheet.height / 2;
  for (let index = 0; index < 8; index++) {
    const ox = (index % 4) * cellW, oy = Math.floor(index / 4) * cellH;
    let left = cellW, right = 0, top = cellH, bottom = 0;
    for (let cy = 0; cy < cellH; cy++) {
      for (let cx = 0; cx < cellW; cx++) {
        if (pixels[((oy + cy) * sheet.width + ox + cx) * 4 + 3] < 100) continue;
        left = Math.min(left, cx); right = Math.max(right, cx);
        top = Math.min(top, cy); bottom = Math.max(bottom, cy);
      }
    }
    if (right <= left || bottom <= top) throw new Error('Pose vazia no atlas.');
    left = Math.max(0, left - 2); top = Math.max(0, top - 2);
    right = Math.min(cellW - 1, right + 2); bottom = Math.min(cellH - 1, bottom + 2);
    frames.push({ x: ox + left, y: oy + top, w: right - left + 1, h: bottom - top + 1 });
  }
  scale = Math.min(124 / Math.max(...frames.map(f => f.h)), 110 / Math.max(...frames.map(f => f.w)));
}

function measure() {
  const bounds = scene.getBoundingClientRect();
  const oldStart = platforms[0]?.left ?? 0;
  const oldLength = platforms.length ? platforms.at(-1).right - oldStart : 0;
  const progress = oldLength ? (x - oldStart) / oldLength : .2;
  platforms = [...scene.querySelectorAll('[data-platform]')]
    .filter(card => card.getClientRects().length)
    .map(card => { const rect = card.getBoundingClientRect(); return { left: rect.left - bounds.left + 32, right: rect.right - bounds.left - 32, y: rect.top - bounds.top + 1 }; });
  if (!platforms.length) return;
  platforms[0].left += 32;
  platforms.at(-1).right -= 32;
  x = platforms[0].left + Math.max(0, Math.min(1, progress)) * (platforms.at(-1).right - platforms[0].left);
  platformIndex = platforms.reduce((best, platform, i) => Math.abs((platform.left + platform.right) / 2 - x) < Math.abs((platforms[best].left + platforms[best].right) / 2 - x) ? i : best, 0);
  x = Math.max(platforms[platformIndex].left, Math.min(platforms[platformIndex].right, x));
  jump = null;
  if (ready) render(currentFrame);
}

function surface() {
  if (!jump) return { y: platforms[platformIndex].y, lift: 0 };
  const progress = Math.max(0, Math.min(1, (jump.time - TAKEOFF) / FLIGHT));
  return { y: jump.fromY + (jump.toY - jump.fromY) * progress, lift: 4 * 34 * progress * (1 - progress) };
}

function drawPart(cell, dx = 0, dy = 0) {
  const width = parts.width / 3, height = parts.height / 2;
  ctx.drawImage(parts, (cell % 3) * width, Math.floor(cell / 3) * height, width, height, dx, dy, 512, 512);
}

function drawGreeting() {
  // Corpo e pés ficam na mesma posição; somente o braço gira no ombro.
  const factor = 124 / 425;
  ctx.translate(PET_WIDTH / 2 - 256 * factor, PET_HEIGHT - 470 * factor);
  ctx.scale(factor, factor);
  ctx.save();
  ctx.translate(210, 270);
  const angle = greetingTime > 0 && !reduceMotion.matches ? Math.sin(greetingClock * 12) * .18 : 0;
  ctx.rotate(angle); ctx.translate(-170, -255);
  drawPart(1);
  ctx.restore(); drawPart(0);
}

function drawJump() {
  const factor = 124 / 425;
  if (direction < 0) { ctx.translate(PET_WIDTH, 0); ctx.scale(-1, 1); }
  ctx.translate(PET_WIDTH / 2 - 256 * factor, PET_HEIGHT - 470 * factor);
  ctx.scale(factor, factor);
  drawPart(jump.time < TAKEOFF ? 2 : jump.time < TAKEOFF + FLIGHT ? 3 : 4);
}

function render(index) {
  if (!ready || !platforms.length) return;
  currentFrame = index;
  if (index !== lastSprite || direction !== lastDirection || index === 7 || jump) {
    const frame = frames[index], w = frame.w * scale, h = frame.h * scale;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save(); ctx.scale(2, 2);
    if (partsReady && index === 7) drawGreeting();
    else if (partsReady && jump) drawJump();
    else {
      if (direction < 0 && index !== 7) { ctx.translate(PET_WIDTH, 0); ctx.scale(-1, 1); }
      ctx.drawImage(sheet, frame.x, frame.y, frame.w, frame.h, (PET_WIDTH - w) / 2, PET_HEIGHT - h, w, h);
    }
    ctx.restore(); lastSprite = index; lastDirection = direction;
  }
  const floor = surface();
  pet.style.transform = `translate(${x - PET_WIDTH / 2}px, ${floor.y - PET_HEIGHT - floor.lift}px)`;
  pet.classList.toggle('near-right', x > scene.clientWidth - 140);
  shadow.style.transform = `translate(${x - 22}px, ${floor.y - 2}px) scaleX(${1 - floor.lift / 65})`;
  shadow.style.opacity = String(1 - floor.lift / 45);
  scene.dataset.x = x.toFixed(2); scene.dataset.frame = String(index);
  scene.dataset.y = (floor.y - floor.lift).toFixed(2);
  scene.dataset.phase = jump ? jump.time < TAKEOFF ? 'takeoff' : jump.time < TAKEOFF + FLIGHT ? 'flight' : 'landing' : index === 7 ? 'greeting' : 'grounded';
}

function updateStatus() {
  const greeting = greetingTime > 0 || staticGreeting;
  const label = reduceMotion.matches ? 'Em repouso' : paused ? 'Passeio pausado' : jump ? 'Dando um pulinho' : greeting ? 'Recebendo carinho' : restTime > 0 || hovering || focused ? 'Olhando ao redor' : 'Explorando os cards';
  if (stateLabel.textContent !== label) stateLabel.textContent = label;
  pet.classList.toggle('is-greeting', greeting);
  pauseButton.textContent = reduceMotion.matches ? 'Movimento reduzido' : paused ? 'Retomar passeio' : 'Pausar passeio';
  pauseButton.setAttribute('aria-pressed', String(paused || reduceMotion.matches));
  pauseButton.disabled = !ready || reduceMotion.matches;
  scene.dataset.mode = reduceMotion.matches ? 'reduced' : paused ? 'paused' : greeting ? 'greeting' : 'active';
}

function canRun() { return ready && !paused && !reduceMotion.matches && visible && !document.hidden; }
function schedule() {
  updateStatus();
  if (canRun() && !frameId) { lastTime = 0; frameId = requestAnimationFrame(tick); }
  else if (!canRun() && frameId) { cancelAnimationFrame(frameId); frameId = 0; lastTime = 0; }
}
function tick(now) {
  frameId = 0;
  if (!canRun()) return;
  const dt = lastTime ? Math.min((now - lastTime) / 1000, .05) : 0;
  lastTime = now;
  let pose = 6;
  if (jump) {
    jump.time += dt;
    const progress = Math.max(0, Math.min(1, (jump.time - TAKEOFF) / FLIGHT));
    x = jump.fromX + (jump.toX - jump.fromX) * progress;
    pose = 2;
    if (jump.time >= TAKEOFF + FLIGHT + LANDING) {
      platformIndex = jump.target; x = jump.toX; jump = null; restTime = .16; pose = 6;
      lastSprite = -1;
      if (pendingGreeting) { pendingGreeting = false; startGreeting(); pose = 7; }
    }
  } else if (greetingTime > 0) {
    greetingClock += dt; greetingTime = Math.max(0, greetingTime - dt); pose = 7;
    if (!greetingTime) { restTime = .5; feedback.textContent = 'Ele gostou do carinho! Logo continua o passeio.'; }
  } else if (restTime > 0) { restTime = Math.max(0, restTime - dt); }
  else if (!hovering && !focused) {
    walkTime += dt; x += direction * SPEED * dt;
    const platform = platforms[platformIndex];
    const edge = direction > 0 ? platform.right : platform.left;
    if (direction > 0 ? x >= edge : x <= edge) {
      x = edge;
      const target = platformIndex + direction;
      if (target >= 0 && target < platforms.length) {
        const next = platforms[target];
        jump = { time: 0, target, fromX: x, toX: direction > 0 ? next.left : next.right, fromY: platform.y, toY: next.y };
        pose = 2;
      } else { direction *= -1; restTime = 1.6; walkTime = 0; }
    } else pose = Math.floor(walkTime / .12) % 6;
  }
  render(pose); updateStatus(); frameId = requestAnimationFrame(tick);
}

function greet() {
  if (!ready) return;
  if (jump) { pendingGreeting = true; feedback.textContent = 'Ele vai dar um oi assim que pousar no próximo card.'; return; }
  startGreeting(); render(7); schedule();
}
function startGreeting() {
  greetingClock = 0;
  greetingTime = canRun() ? 2.4 : 0; staticGreeting = !canRun();
  feedback.textContent = 'Oi! O cachorrinho recebeu seu carinho.';
}

pauseButton.addEventListener('click', () => {
  paused = !paused;
  if (!paused) { staticGreeting = false; greetingTime = 0; }
  feedback.textContent = paused ? 'O passeio está pausado. Clique em Retomar passeio quando quiser.' : 'O passeio continua.';
  schedule();
});
greetButton.addEventListener('click', greet); pet.addEventListener('click', greet);
restartButton.addEventListener('click', () => {
  direction = 1; x = platforms[0].left + 20; platformIndex = 0; jump = null; pendingGreeting = false;
  walkTime = 0; restTime = .8; greetingTime = 0; staticGreeting = false; lastSprite = -1;
  render(6); feedback.textContent = 'O cachorrinho voltou ao começo do percurso.'; schedule();
});
pet.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') hovering = true; });
pet.addEventListener('pointerleave', () => { hovering = false; });
pet.addEventListener('focus', () => { focused = pet.matches(':focus-visible'); });
pet.addEventListener('pointerdown', () => { focused = false; });
pet.addEventListener('blur', () => { focused = false; });
document.addEventListener('visibilitychange', schedule);
reduceMotion.addEventListener('change', () => {
  if (jump) { platformIndex = jump.target; x = jump.toX; jump = null; lastSprite = -1; }
  greetingTime = 0; staticGreeting = false; pendingGreeting = false; render(6);
  feedback.textContent = reduceMotion.matches ? 'Movimento reduzido ativo. O cachorrinho responde ao carinho sem se deslocar.' : 'O movimento acompanha a preferência do seu dispositivo.';
  schedule();
});
const resizeObserver = new ResizeObserver(measure); resizeObserver.observe(scene);
const intersectionObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: 0 });
intersectionObserver.observe(scene);

sheet.onload = () => {
  try {
    readFrames(); sheetReady = true; finishLoading();
  } catch (error) { failed(error); }
};
function finishLoading() {
  if (!sheetReady || !partsReady) return;
    ready = true; measure();
    pet.hidden = false; pet.disabled = false; greetButton.disabled = false; restartButton.disabled = false;
    scene.setAttribute('aria-busy', 'false'); render(6);
    feedback.textContent = reduceMotion.matches ? 'Movimento reduzido ativo. O cachorrinho responde ao carinho sem se deslocar.' : 'Passe o mouse sobre ele para fazê-lo parar. Clique para dar um oi.';
    schedule();
}
function failed(error) {
  scene.setAttribute('aria-busy', 'false'); stateLabel.textContent = 'Passeio indisponível';
  feedback.textContent = 'Não foi possível carregar o cachorrinho. Recarregue a página para tentar novamente.';
  shadow.hidden = true; console.error(error);
}
sheet.onerror = () => failed(new Error('Falha ao carregar dotinha-sprites.png.'));
sheet.src = new URL('./dotinha-sprites.png', import.meta.url).href;
parts.onload = () => { partsReady = true; finishLoading(); };
parts.onerror = () => failed(new Error('Falha ao carregar dotinha-parts.png.'));
parts.src = new URL('./dotinha-parts.png', import.meta.url).href;
window.addEventListener('pagehide', () => { cancelAnimationFrame(frameId); frameId = 0; });
window.addEventListener('pageshow', schedule);
