/*
 *@Author: 赵元达
 *@Date: 2022-05-02 17:03:25
 *@parms:
 *@Description:生成普通vnode
 */
export function createEle(vm, tag, data = {}, ...children) {
  return vnode(vm, tag, data, data.key, children, undefined);
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 17:03:28
 *@parms:
 *@Description: 创建textVnode
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
export function patch(oldVnode, vnode) {
  // if (!oldVnode) {
  //   return createElm(newVnode);
  // }
  if (oldVnode.nodeType == 1) {
    // 用vnode 来生成真实DOM 替换原来的DOM
    // DOM 操作原生的
    let elm = createElm(vnode);
    const parElm = oldVnode.parentNode; //找到父节点
    parElm.insertBefore(elm, oldVnode.nextSibling);
    parElm.removeChild(oldVnode);
    // 返回最新的DOM
    return elm;
  } else {
    vnode.el = oldVnode.el; //表示当前新节点 复用老节点

    // diff 如果标签名不一样 直接删掉老的 排序
    if (oldVnode.tag != vnode.tag) {
    }
    // 如果两个虚拟节点是文本节点 比较文本内容

    if (vnode.tag == undefined) {
      if (oldVnode.text != vnode.text) {
        vnode.el.textContent = vnode.text;
      }
      return;
    }

    // 如果标签一样 比较属性  传入新的虚拟节点 和老的属性 更新老的
    patchProps(vnode, oldVnode.props);

    // 比较孩子们 一个有儿子 一个没有
    let oldChildren = oldVnode.children || [];
    let newChildren = vnode.children || [];

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 双方都有儿子
    } else if (newChildren.length > 0) {
      //老的没儿子 新的有
      for (let i = 0; i < newChildren.length; i++) {
        let child = createElm(newChildren[i]);
        vnode.el.appendChild(child);
      }
    } else if (oldChildren.length > 0) {
      // 老的有儿子 老的没儿子
      vnode.el.innerHTML = ""; //直接删除老节点
    }
  }
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 18:03:40
 *@parms:
 *@Description: 创建真实DOM
 */
export function createElm(vnode) {
  let { tag, text, children, vm, data } = vnode;
  if (typeof tag == "string") {
    // if(createComponent(vnode)){
    //   return vnode.componentInstance.$el
    // }
    //元素
    vnode.el = document.createElement(tag); //虚拟节点会有一个el属性对应真实节点
    patchProps(vnode);
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

// 未完成 要补充上
function createComponent(vnode) {
  let i = vnode.data;
  if ((i = i.hook) && (i = i.init)) {
    i(vnode);
  }
  if (vnode.componentInstance) {
    return true;
  }
}

// 比对props
function patchProps(vnode, oldProps = {}) {
  let newProps = vnode.data || {};
  let el = vnode.el;

  // 如果老的有 新的没有 直接把老的有的删除

  // 比较style
  let newStyle = newProps.style;
  let oldStyle = oldProps.style;

  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = "";
    }
  }
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key);
    }
  }

  for (let key in newProps) {
    if (key !== "style") {
      for (let styleName in newProps) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}
