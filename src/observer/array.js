/*
 * @description 要重写7个数组方法 push unshift pop reverse sort splice shift
 * 但是slice不用因为它不会更改原来的数组
 * @author 赵元达 2022-03-12 15:06:40
 */
let oldArrMethods = Array.prototype;
// value.__proto__ = arrMethods 原型链的查找问题
// arrMethods.__proto = oldArrMethods
export let arrMethods = Object.create(oldArrMethods);

const methods = [
  "push",
  "unshift",
  "pop",
  "reverse",
  "sort",
  "splice",
  "shift",
];
methods.forEach((method) => {
  // console.log("aaa");
  // 这里面的this其实是windows 但是开启严格模式就是undefined
  arrMethods[method] = function (...arg) {
    // 必须这样 他才会真的修改 这里面的this就是实例对象 因为是谁调用的 谁就是this
    // 这里不能写成箭头函数 因为写成箭头函数this会undefined
    const res = oldArrMethods[method].call(this, ...arg);
    let ob = this.__ob__;
    // 如果是push unshift splice 这三个还添加了{}对象
    let insert = null; //用户插入的数据
    switch (method) {
      case "push":
      case "unshift":
        insert = arg;
        break;
      case "splice":
        // 这是拿到的新增的对象
        insert = arg.slice(2);
      default:
        break;
    }
    if (insert) ob.observeArr(insert);
    return res;
  };
});
