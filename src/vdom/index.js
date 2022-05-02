/*
 *@Author: 赵元达
 *@Date: 2022-05-02 17:03:25
 *@parms:
 *@Description:
 */
export function createEle(vm, tag, data = {}, ...children) {
  return vnode(vm, tag, data, data.key, children, undefined);
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 17:03:28
 *@parms:
 *@Description:
 */
export function createTextEle(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 17:11:20
 *@parms:
 *@Description: 虚拟node
 */
function vnode(vm, tag, data, key, children, text) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    // ....
  };
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 17:57:07
 *@parms:
 *@Description: 比对
 */
export function patch(oldVnode, newVnode) {
  if (oldVnode.nodeType == 1) {
    console.log("真实元素");
    // 用vnode 来生成真实DOM 替换原来的DOM
    // DOM 操作原生的
    let elm = createElm(newVnode);
    const parElm = oldVnode.parentNode; //找到父节点
    parElm.insertBefore(elm, oldVnode.nextSibling);
    parElm.removeChild(oldVnode);
  }
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 18:03:40
 *@parms:
 *@Description: 创建真实DOM
 */
function createElm(vnode) {
  let { tag, text, children, vm, data } = vnode;
  if (typeof tag == "string") {
    //元素
    vnode.el = document.createElement(tag); //虚拟节点会有一个el属性对应真实节点
    children.forEach((child) => {
      // 深度遍历
      vnode.el.appendChild(createElm(child));
    });
  } else {
    // 文本
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
