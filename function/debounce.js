/**
 * 防抖，防止函数短时间内连续触发
 * @param {Function} fn 需要处理的函数
 * @param {Number} delay 时间间隔毫秒数
 * @param {Boolean} immediate 是否立即触发
 */
function debounce(fn, delay = 200, immediate = true) {
  let timer = null;
  return function handler(...args) {
    if (timer) clearTimeout(timer);
    if (immediate) {
      if (!timer) {
        fn.apply(this, args);
      }
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}
