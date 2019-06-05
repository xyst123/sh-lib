/**
 * 节流，降低函数触发频率
 * @param {Function} fn 需要处理的函数
 * @param {Number} delay 时间间隔毫秒数
 * @param {Boolean}
 */
function throttle(fn, delay = 200) {
  let before = Date.now();
  return function handler(...args) {
    const now = Date.now();
    if (now - before >= delay) {
      fn.apply(this, args);
      before = now;
    }
  };
}
