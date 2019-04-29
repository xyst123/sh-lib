function debounce(fn, delay = 200, immediate) {
  let timer = null;
  return function (...args) {
    timer && clearTimeout(timer);
    if (immediate) {
      if (!timer) {
        fn.apply(this, args)
      }
      timer = setTimeout(() => {
        timer = null
      }, delay)
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay)
    }
  }
}