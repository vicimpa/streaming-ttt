export function looper(fn: (time: number) => any) {
  var raf = requestAnimationFrame(_fn);

  function _fn(now: number) {
    raf = requestAnimationFrame(_fn);
    fn(now / 1000);
  }

  return () => {
    cancelAnimationFrame(raf);
  };
}