import { popTarget, pushTarget } from "./dep";
import { cacheWatcher } from "./scheduler";
let id = 0;
class Watcher {
  constructor(vm, expFn, callback, options) {
    this.vm = vm;
    this.expFn = expFn;
    if (typeof expFn == "string") {
      // 需要将那个表达式转化为函数
      this.getter = function () {
        // 这里相当于就是 vm.属性名 又会触发defineProperty的get方法==》就会记住这个用户watcher

        // 处理一下 vm['age.n']=>vm['age']['n']
        let path = expFn.split(".");
        let obj = vm;
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]];
        }
        return obj;
      };
    } else {
      // 默认因该让expFn执行  这个方法做了什么 （render方法 去vm上取值）
      this.getter = expFn;
    }
    this.cb = callback;
    this.user = !!options.user; //表示是不是用户watcher 强制转Boolean
    this.options = options;
    this.id = id++;

    // 为了去重
    this.depsId = new Set();
    // 为了存dep
    this.deps = [];
    this.value = this.get(); //默认初始化 要取值
  }
  get() {
    // 如何让watcher和属性进行关联 ==》再defineproperty 因为vm取值会走defineproperty下面的get这个方法
    // 一个属性对应多个watcher 同时一个watcher可以对应多个属性

    // this 就是watcher
    pushTarget(this);
    // 这里就会去触发defineproperty 读值操作
    let value = this.getter();
    // 执行完毕清空
    popTarget();
    return value;
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep); //dep 存到watcher里面
      dep.addSub(this); // dep 存watcher
    }
  }
  // 更新试图 异步的
  update() {
    // 每次更新视图 缓存下watcher 等一会一起更新
    cacheWatcher(this);
    // this.get()
  }
  run() {
    let newVal = this.get();
    let oldVal = this.value;
    // 为了保证数据
    this.value = newVal;
    // 只有是用户渲染watcher 才会去调用
    if (this.user) {
      this.cb.call(this.vm, newVal, oldVal);
    }
  }
}

// watcher 和 dep
// 我们将更新的功能封装成了一个watcher
// 渲染页面前 会将当前watcher放到Dep类上
// 在vue页面中页面渲染时使用的属性 需要进行依赖收集 收集对象的渲染watcher
// 取值时 给每个属性都加了一个dep属性 用于存储这个watcher（同一个watcher会对应多个dep）
// 每个属性可能对应多个视图 （多个视图肯定时多个watcher） 一个属性要对应多个watcher
// dep.depend() 通知dep去存放watcher==》Dep.target.addDep()=>去通知watcher去存dep

export default Watcher;
