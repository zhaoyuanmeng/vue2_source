const defaultTagRe = /\{\{((?:.|\r?\n)+?)\}\}/g;
/*
 *@Author: 赵元达
 *@Date: 2022-05-02 14:13:32
 *@parms:
 *@Description: 返回_c('div',{id:'app',a:1},'hello')这种形式
 */
export function generate(el) {
  // 遍历树 将树拼成字符串
  let children = genChildren(el);
  // console.log(children);

  let code = `_c('${el.tag}',${
    el.attrs.length ? genProps(el.attrs) : undefined
  }${children ? `,${children}` : ""})`;

  // console.log("code", code);
  return code;
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 14:16:48
 *@parms:
 *@Description:
 */
function genProps(attrs) {
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    // 这里利用stringfy是为了要个单引号
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  // return `{${str.slice(0,-1)}}` 与下面效果一样
  return `{${str}}`;
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 14:28:54
 *@parms:
 *@Description:
 */
function gen(el) {
  if (el.type == 1) {
    return generate(el);
  } else {
    let text = el.text;

    if (!defaultTagRe.test(text)) {
      return `_v'('${text}')'`;
    } else {
      // 做成 'hh' + ass + 'asda'
      let token = [];
      let match;
      let lastIndex = (defaultTagRe.lastIndex = 0);
      while ((match = defaultTagRe.exec(text))) {
        // 看看有没有匹配的
        let index = match.index; //开始索引
        if (index > lastIndex) {
          // token里面放文本信息
          token.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        // 这里放的是变量 trim是去掉换行啥的
        token.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        token.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${token.join("+")})`;
    }
  }
}

/*
 *@Author: 赵元达
 *@Date: 2022-05-02 14:32:01
 *@parms:
 *@Description:
 */

function genChildren(el) {
  let children = el.children;
  if (children) {
    return children
      .map((c) => {
        return gen(c);
      })
      .join(",");
  }
  return false;
}
