import Watcher from "./observer/watcher";

export function mountComponet(vm, el) {
  // 更新函数 数据变化后 会再次调用此函数
  let updataComponent = () => {
    // 调用render函数 生成虚拟dom
    vm._update(vm._render()); //后续更新调用
  };
  // 观察者模式 属性是 被观察者 刷新页面：观察者
  // updataComponent();
  new Watcher(
    vm,
    updataComponent,
    () => {
      console.log("试图更新了");
    },
    true
  ); //他是一个渲染watcher（true参数） 后续有其他的watcher
}
