import { initMixin, initRender } from "./init";
import { initGlobal } from "./global-api/index";
// vue 核心代码  这个文件只是vue的一个声明 相当于controller
function Vue(options) {
  // 运行vue的初始话操作 这里都是拿到原型方法因为下面已经引入了
  this._init(options);
}
// 这样我们就可以给Vue这个原型对象挂载方法了
initMixin(Vue);
initRender(Vue);
// 给Vue这个类上添加方法
initGlobal(Vue);

// diff测试相关
// ======== 这是渲染的整个流程
import { compileToFunction } from "./compile/index";
import { createElm, patch } from "./vdom/index";
let oldTemplate = `<div style="font-size:10px;color:red;">{{msg}}</div>`;
let vm1 = new Vue({
  data: {
    msg: "hellow",
  },
});
const render1 = compileToFunction(oldTemplate);
const oldNode = render1.call(vm1);
console.log("oldNode", oldNode);
document.body.appendChild(createElm(oldNode));

// ========
let newTemplate = `<p style="font-size:10px">{{msg}}</p>`;
let vm2 = new Vue({
  data: {
    msg: "aaaa",
  },
});
const render2 = compileToFunction(newTemplate);
const newNode = render2.call(vm2);
console.log("newNode1", newNode);

// 根据新的虚拟节点更新老的节点 老的能复用的尽量复用
patch(oldNode, newNode);
// 通过引入文件的方式，给vue原型添加方法 也就是一个原型方法对应一个原型文件
export default Vue;
