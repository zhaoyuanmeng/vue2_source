//把data中的数据都使用object.definProperty重新定义
import { isObj, def } from "../util/index";
import { arrMethods } from "./array";
import Dep, { pushTarget } from "./dep";
/*
 * @description 观察者的一个类
 * @author 赵元达 2022-03-12 14:21:26
 * @param
 */

// 如果给对象新增一个属性不会触发视图更新
//
class Observer {
  constructor(data) {
    //给对象和数组也绑定上一个dep
    this.dep = new Dep();
    // 相当于设置了观察者
    def(data, "__ob__", this);
    if (Array.isArray(data)) {
      // console.log("asdasdasdasd");
      // console.log(data, "ssss");
      // 我们需要对数组进行处理 不要对数组下标进行get 和set
      // 我们还有检测那些改变数组值的方法
      data.__proto__ = arrMethods;

      // 如果数组里面是对象我们再监控
      this.observeArr(data);
    } else {
      // 我们要循环这个数据并且都给他使用defineProerty绑定上
      // 如果数据的层次太多 我们就会递归的去解析对象中的属性
      // console.log("observer", data);
      // 所以我们需要写一个函数去做添加get 和 set的事情
      this.walk(data);

      // console.log("observer-xiangyingshi", data);
    }
  }
  /*
   * @description
   * @author 赵元达 2022-03-12 14:27:45
   * @param 需要绑定的数据
   * @return 设置完defineProperty响应式数据
   */
  walk(data) {
    // 这个data{name:12,age:123,obj:{}} 递归调用
    // 我们先拿到key
    let keys = Object.keys(data);
    keys.forEach((key) => {
      // 书写一个公用的函数来依次绑定我们的对象数据
      defineReactive(data, key, data[key]);
    });
  }
  /*
   * @description 对数组里面的对象进行检测
   * @author 赵元达 2022-03-12 15:02:22
   * @param
   * @return
   */
  observeArr(data) {
    data.forEach((obj) => {
      observe(obj);
    });
  }
}
export function observe(data) {
  // console.log("observe", data);

  // 判断是不是一个对象 只有两种结果 不是对象就是数组
  let isobj = isObj(data);

  // 这里表示是数组
  if (data.__ob__) {
    return data.__ob__;
  }
  if (!isobj) {
    return;
  }
  return new Observer(data); //用来观测数据
}

/*
 * @description 公用的绑定响应式处理函数
 * @author 赵元达 2022-03-12 14:35:01
 * @param obj:需要响应式的对象 key：属性 val:属性值
 * @return
 */
export function defineReactive(obj, key, val) {
  // 在这里面进行递归调用 注意这里面传递的是val
  let childOb = observe(val);
  // console.log("数组", childOb);
  let dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      // 取值时 我希望将watcher和dep对应起来
      let watcher = Dep.target;
      if (watcher) {
        dep.depend(); // 让dep记住watcher 这是最核心的
        if (childOb) {
          childOb.dep.depend(); //让数组和对象也记住watcher
        }
      }
      // console.log("key-dep", dep);
      // console.log(watcher, "wac");
      return val;
    },
    set(newVal) {
      // 这里面可以判断是不是设置成了一个对象 如果是就要继续弄成响应式的
      if (isObj(newVal)) {
        observe(newVal);
      }
      if (newVal === val) return;
      val = newVal;
      // 触发更新
      dep.notify();
    },
  });
}
