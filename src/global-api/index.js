/*
 *@Author: 赵元达
 *@Date: 2022-05-06 15:30:16
 *@parms:
 *@Description: 全局API
 */

export function initGlobal(Vue) {
  Vue.options = {}; //用来存放全局的配置,每个组件初始化的时候都会和option选项合并

  // 相当于定义了一个静态的方法 全局类都可以调用
  Vue.mixins = function (options) {
    // this.options = mergeOptions(this.options, options);
    // this.options.beforeCreate = [fn1,fn2]
    return this;
  };
}
