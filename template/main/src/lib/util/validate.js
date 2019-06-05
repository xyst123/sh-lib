// 校验数据
export default {
  isType(data, options) {
    const { type } = options;
    const realType = Object.prototype.toString.call(data);
    return { pass: realType.toLowerCase() === (`[object ${type}]`).toLowerCase() };
  },
  compare(data, options) {
    const { target, type } = options;
    const rs = {
      pass: true,
    };
    const number = Number(data);
    if (type === 'more') {
      rs.pass = number > target;
    } else if (type === 'less') {
      rs.pass = number < target;
    } else {
      rs.pass = number === target;
    }
    return rs;
  },
  isInteger(data) {
    return { pass: Number(data) === parseInt(data, 10) };
  },
  isChinese(data) {
    const rs = /^[\u4E00-\u9FA5]+$/.test(data);
    return { pass: rs };
  },
  isPhone(data) {
    const phone = String(data);
    const rs = /^1\d{10}$/.test(phone) || /^\d{3,4}-?\d{7,8}$/.test(phone);
    return { pass: rs };
  },
  isNotNaN(data) {
    return { pass: !Number.isNaN(data) };
  },
  isExist(data) {
    return { pass: Boolean(data) };
  },
  userDefine(data, options) {
    const { fn } = options;
    return { pass: fn && typeof fn === 'function' ? fn(data) : false };
  },
  check(validates = []) {
    const rs = {
      pass: true,
      errors: {},
      firstError: {},
    };
    validates.forEach((validate, index) => {
      const { value } = validate;
      validate.rules.forEach((rule) => {
        const realRule = (rule.rule || '').replace(/\s/g, '');
        let hasValidFn = false;
        const fn = this[realRule];
        if (!fn || typeof fn !== 'function') {
          console.error('校验数据——校验函数无效');
          return;
        }
        hasValidFn = true;
        const testResult = fn(value, rule.options || {});
        const testPass = testResult && testResult.pass;

        if (!testPass && hasValidFn) {
          const errorInfo = {
            value: validate.value,
            backData: rule.backData || {},
          };
          if (rs.pass) {
            rs.firstError = errorInfo;
          }
          rs.pass = false;
          const key = validate.id || index;
          const { errors } = rs;
          if (Array.isArray(errors[key])) {
            errors[key].push(errorInfo);
          } else {
            errors[key] = [errorInfo];
          }
        }
      });
    });
    return rs;
  },
};
