/*
 * @description 正则
 * @author 赵元达 2022-03-15 20:50:59
 * @param
 * @return
 */
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;
const comment = /^<!\--/;
const conditionalComment = /^<!\[/;

let root = null;
// 栈结构
let stack = [];

/*
 *@Author: 赵元达
 *@Date: 2022-05-09 18:58:06
 *@parms:
 *@Description: 构造语法树
 */
export function parseHtml(html) {
  while (html) {
    let textEnd = html.indexOf("<");
    if (textEnd == 0) {
      // 如果当前索引为0 有两种情况 开始标签 结束标签
      let startTagMatch = parseStartTag(); //通过这个方法获取到匹配的结果 tagName,attrs
      // 开始
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      // 结束标签
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    }
    let text;
    if (textEnd > 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      chars(text);
      advance(text.length);
    }

    function parseStartTag() {
      let start = html.match(startTagOpen);
      if (start) {
        const match = {
          tagName: start[1],
          attrs: [],
        };
        advance(start[0].length);
        let end;
        let attr;
        while (
          !(end = html.match(startTagClose)) &&
          (attr = html.match(attribute))
        ) {
          match.attrs.push({ name: attr[1], value: attr[3] || attr[4] });
          advance(attr[0].length);
        }
        if (end) {
          advance(end[0].length);
        }
        return match;
      }
      return false; //不是开始标签
    }
    function advance(n) {
      html = html.substring(n);
    }
    function start(tagName, attrs) {
      let parent = stack[stack.length - 1];
      let element = createElement(tagName, attrs);
      if (!root) {
        root = element;
      }
      element.parent = parent;
      if (parent) {
        parent.children.push(element);
      }
      stack.push(element);
    }
    function end(tagName) {
      let last = stack.pop();
      if (last.tag != tagName) {
        throw new Error("标签有错误");
      }
    }
    function chars(text) {
      let parent = stack[stack.length - 1];
      if (text) {
        parent.children.push({
          type: 3,
          text,
        });
      }
    }
    return root;
  }
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 13:39:01
 *@parms:
 *@Description: 构建语法树的节点
 */
function createElement(tagName, attrs) {
  return {
    tag: tagName,
    type: 1,
    children: [],
    parent: null,
    attrs,
  };
}

// html ==> ast ===> render函数 ===>虚拟DOM ==> 真实DOM

// 让字符串执行

// 如果字符串转成代码 eval 会消耗性能 也会有作用域的问题

// 可以采用模板引擎 new Function + with 实现

/*
 * @description   ast 语法树
 * @author 赵元达 2022-03-13 09:22:55
 * @说明  是用对象描述原生语法的
 * <div id="app">
 *    <p>hello</p>
 * </div>
 * let root = {
 *  tag:'div',
 *  attrs:[{name:'id',value:'#app'}]
 *  parent:null,
 *  type:1,
 *  children:[
 *    tag:'p',
 *    attrs:[],
 *    parent:root,
 *    type:1,
 *    children:[
 *      {
 *        text:'hello',
 *        type:3
 *      }
 *    ]
 *  ]
 * }
 */
