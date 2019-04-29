function throttle(fn, delay = 200) {
  let before = Date.now();
  return function (...args) {
    const now = Date.now();
    if (now - before >= delay) {
      fn.apply(this, args);
      before = now
    }
  }
}