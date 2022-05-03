import { observe } from "./observer/index";
export function initState(vm) {
  const opt = vm.$options;
  // vue 的数据来源 属性 方法 数据 计算属性 watch
  // 判断一下是哪一种数据来源
  if (opt.props) {
    initProps(vm);
  }
  if (opt.methods) {
    initMethod(vm);
  }
  if (opt.data) {
    initData(vm);
  }
  if (opt.computed) {
    initComputed(vm);
  }
  if (opt.watch) {
    initWatch(vm, opt.watch);
  }
}
/*
 * @description
 * @author 赵元达 2022-03-12 10:39:59
 * @param
 * @return
 */
function initProps(vm) {}
function initMethod(vm) {}
function initData(vm) {
  // console.log("初始化的data", vm.$options.data());
  // 这个里面有两种情况 一个是data是一个函数 另外data本身就是一个对象 不过最终我们要的是对象
  // 还有如果是函数的化 我们想要this始终是vm本身 就要用到call方法
  let data = vm.$options.data;
  data = typeof data === "function" ? data.call(vm) : data;
  // 为了方便用户能拿到data 而不是使用vm.$options.data那种方式
  vm._data = data;
  // console.log("数据是：", data);

  // 对象劫持 用户改变了数据 我希望可以得到通知===》 刷新页面
  // MVVM模式 数据变化可以驱动视图变化

  // 加一个代理 目的是为了 通过vm.test 绑定到 vm._data.test
  for (let key in data) {
    proxy(vm, "_data", key);
  }

  // 写个函数作用是用来劫持对象==》原理是object.defineProperty()添加set和get
  observe(data); //响应式原理 我们单独建一个文件用来书写这种文件
}
function initComputed(vm) {}

/*
 *@Author: 赵元达
 *@Date: 2022-05-03 14:13:39
 *@parms:
 *@Description:
 */
function initWatch(vm, watch) {
  for (let key in watch) {
    let handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-03 14:21:09
 *@parms:
 *@Description: 创建watcher
 */
function createWatcher(vm, key, handler) {
  return vm.$watch(key, handler);
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 16:59:53
 *@parms:
 *@Description: 便捷代理
 */
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    },
  });
}
