import { initState } from "./state";
import { compileToFunction } from "./compile/index";
// 在原型上添加一个init方法  这种思路很牛逼
export function initMixin(Vue) {
  // vue的初始化流程
  Vue.prototype._init = function (options) {
    console.log("初始化数据", options);
    // 数据的劫持
    const vm = this; //这里就是Vue那个对象
    vm.$options = options;

    // 初始化状态 传递vm就什么数据都能拿到了 我们再分割成一个文件用来写initState方法的
    initState(vm);

    // 如果用户传入了el属性 我们就需要将页面渲染出来
    // 如果用户传入了el，就需要实现挂载流程
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
  // vue的初始化流程
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    // 默认会先查找有没有render函数，没有render函数会采用template 再没有就用el中的内容
    if (!options.render) {
      // 对模板进行编译
      let template = options.template;
      if (!template && el) {
        // 用el里面的内容进行编译
        template = el.outerHTML; //取出全部的内容 与innerHTML不一样
      } else {
        // 用template里面的内容
      }
      console.log("tem", template);
      // 我们需要将template 转化成render方法 vue2.0是虚拟DOM
      // render是一个函数 里面会返回一个字符串
      const render = compileToFunction(template);
      options.render = render;
    }
  };
}
