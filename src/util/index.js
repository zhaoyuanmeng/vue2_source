/*
 * @description 判断是不是对象
 * @author 赵元达 2022-03-12 10:45:23
 * @param data
 * @return boolean
 */
export function isObj(data) {
  if (typeof data === "object" && data !== null) {
    return true;
  } else {
    return false;
  }
}

/*
 * @description 设置响应式的
 * @author 赵元达 2022-03-12 15:23:09
 * @param
 * @return
 */
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false, // 不可枚举 所以循环的时候就不会查到这个属性
    configurable: false, //configrable 描述属性是否配置，以及可否删除
    value,
  });
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-03 10:00:05
 *@parms: callback
 *@Description: 为了比settimeout执行更早点设计的这个方法
 */
let cbs = [];
let wating = false;
export function nextTickPlus(cb) {
  cbs.push(cb);
  if (!wating) {
    // 异步更新 不是掉一次更新一次
    setTimeout(flushCallBacks, 0);
    wating = true;
  }
}

function flushCallBacks() {
  cbs.forEach((cb) => cb());
  wating = false;
}
