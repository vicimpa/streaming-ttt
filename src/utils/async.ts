export function nextFrame(fn: () => any) {
  var raf = requestAnimationFrame(fn);
  return () => cancelAnimationFrame(raf);
}

export function nextTick(fn: () => any) {
  var _fn: (() => any) | null = fn;
  Promise.resolve().then(() => _fn?.());
  return () => { _fn = null; };
}

export function nextLoop(fn: () => any) {
  var timeout = setTimeout(fn);
  return () => clearTimeout(timeout);
}

export function nextTime(n: number, fn: () => any) {
  var timeout = setTimeout(fn, n);
  return () => clearTimeout(timeout);
}