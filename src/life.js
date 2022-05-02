export function mountComponet(vm, el) {
  // 更新函数 数据变化后 会再次调用此函数
  let updataComponent = () => {
    // 调用render函数 生成虚拟dom
    vm._update(vm._render()); //后续更新调用
    // 用虚拟dom 生成真实dom
  };
  updataComponent();
}
