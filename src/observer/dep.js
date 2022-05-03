/*
 *@Author: 赵元达
 *@Date: 2022-05-02 19:30:40
 *@parms:
 *@Description: 映射关系 收集watcher的
 */
let id = 0;
class Dep {
  // 每个属性我都给他一个dep dep可以存放watcher watcher还要存放这个dep
  constructor() {
    this.id = id++; // 这里一定要生成唯一的一个id
    this.subs = []; //存放watcher的
  }

  depend() {
    // dep 要存放这个watcher watcher要存放dep 多对多
    let watcher = Dep.target;
    if (watcher) {
      watcher.addDep(this); // watcher 存 dep
    }
  }
  /*
   *@Author: 赵元达
   *@Date: 2022-05-02 20:04:55
   *@parms:
   *@Description: dep 存 watcher
   */
  addSub(watcher) {
    this.subs.push(watcher);
  }

  /*
   *@Author: 赵元达
   *@Date: 2022-05-02 20:27:15
   *@parms:
   *@Description: 执行wachter函数里面的update方法
   */
  notify() {
    this.subs.forEach((watcher) => {
      watcher.update();
    });
  }
}
Dep.target = null; //这是个静态属性 所有的Dep 都是共享这个

export function pushTarget(watcher) {
  Dep.target = watcher;
}
export function popTarget() {
  Dep.target = null;
}

export default Dep;
