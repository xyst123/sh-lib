/**
 * 遍历对象，防止遍历到原型中的属性
 * @param {Object} object 需要遍历的对象
 * @param {Function} handler 处理对象属性和值的函数
 */
function iterateObject(object, handler) {
  const keys = Object.keys(object);
  keys.forEach((key) => {
    const value = object[key];
    handler(value, key, object);
  });
}
