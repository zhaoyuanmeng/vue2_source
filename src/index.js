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
// 通过引入文件的方式，给vue原型添加方法 也就是一个原型方法对应一个原型文件
export default Vue;
