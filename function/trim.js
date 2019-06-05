/**
 * 去除字符串左右两边空字符
 * @param {String} string 需要处理的字符串
 */
function trim(string) {
  return String(string).replace(/^\s*|\s*$/g, '');
}
