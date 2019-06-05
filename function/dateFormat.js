/**
 * 格式化Date对象
 * @param {Date} dateObj 日期对象
 * @param {String} formatStr 形如'YYYY-MM-DD hh:mm'
 */
function formatDate(dateObj, formatStr) {
  let str = formatStr;
  const Week = ['日', '一', '二', '三', '四', '五', '六'];
  str = str.replace(/yyyy|YYYY/, dateObj.getFullYear());
  str = str.replace(/yy|YY/, (dateObj.getYear() % 100) > 9 ? (dateObj.getYear() % 100).toString() : `0${dateObj.getYear() % 100}`);
  const month = dateObj.getMonth() + 1;
  str = str.replace(/MM/, month > 9 ? month.toString() : `0${month}`);
  str = str.replace(/M/g, month);
  str = str.replace(/w|W/g, Week[dateObj.getDay()]);
  str = str.replace(/dd|DD/, dateObj.getDate() > 9 ? dateObj.getDate().toString() : `0${dateObj.getDate()}`);
  str = str.replace(/d|D/g, dateObj.getDate());
  str = str.replace(/hh|HH/, dateObj.getHours() > 9 ? dateObj.getHours().toString() : `0${dateObj.getHours()}`);
  str = str.replace(/h|H/g, dateObj.getHours());
  str = str.replace(/mm/, dateObj.getMinutes() > 9 ? dateObj.getMinutes().toString() : `0${dateObj.getMinutes()}`);
  str = str.replace(/m/g, dateObj.getMinutes());
  str = str.replace(/ss|SS/, dateObj.getSeconds() > 9 ? dateObj.getSeconds().toString() : `0${dateObj.getSeconds()}`);
  str = str.replace(/s|S/g, dateObj.getSeconds());
  return str;
}
