import { popTarget, pushTarget } from "./dep";
let id = 0;
class Watcher {
  constructor(vm, expFn, callback, options) {
    this.vm = vm;
    this.expFn = expFn;
    this.cb = callback;
    this.options = options;
    this.id = id++;
    // 默认因该让expFn执行  这个方法做了什么 （render方法 去vm上取值）
    this.getter = expFn;
    // 为了去重
    this.depsId = new Set();
    // 为了存dep
    this.deps = [];
    this.get(); //默认初始化 要取值
  }
  get() {
    // 如何让watcher和属性进行关联 ==》再defineproperty 因为vm取值会走defineproperty下面的get这个方法
    // 一个属性对应多个watcher 同时一个watcher可以对应多个属性

    // this 就是watcher
    pushTarget(this);
    // 这里就会去触发defineproperty 读值操作
    this.getter();
    // 执行完毕清空
    popTarget();
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep); //dep 存到watcher里面
      dep.addSub(this); // dep 存watcher
    }
  }
  // 更新试图
  update(){
    this.get()
  }
}
export default Watcher;
