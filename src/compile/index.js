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

/*
 * @description 生成render函数
 * @author 赵元达 2022-03-13 09:21:27
 * @param
 * @return render函数
 */
export function compileToFunction(template) {
  let root = parseHtml(template);
  
}
function parseHtml(html) {
  while (html) {
    let textEnd = html.indexOf("<");
    if (textEnd == 0) {
      // 如果当前索引为0 有两种情况 开始标签 结束标签
      let startTagMatch = parseStartTag(); //通过这个方法获取到匹配的结果 tagName,attrs
      // 开始
      if(startTagMatch){
        start(startTagMatch.tagName,startTagMatch.attrs)
        continue
      }
      // 结束标签
      const endTagMatch  = html.match(endTag)
      if(endTagMatch){
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }
    let text 
    if(textEnd>0){
      text = html.substring(0,textEnd)
    }
    if(text){
      chars(text)
      advance(text.length)
    }



    function parseStartTag() {
      let start = html.match(startTagOpen);
      if (start) {
        const match = {
          tagName:start[1],
          attrs:[]
        }
        advance(start[0].length)
        let end 
        let attr
        while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
          match.attrs.push({name:attr[1],value:attr[3]||attr[4]})
          advance(attr[0].length)
        }
        if(end){
          advance(end[0].length)
        }
        return match
      }
      return false //不是开始标签
    }
    function advance(n) {
      html = html.substring(n);
    }
    function start(tagName,attrs){
      console.log(tagName,'start-tagName');
      console.log(attrs,'attrs');
    }
    function end(tagName){
      console.log(tagName,'end-tagName');
    }
    function chars(text){
      console.log(text,'text');
    }
}
}
// /*
//  * @description   ast 语法树
//  * @author 赵元达 2022-03-13 09:22:55
//  * @说明  是用对象描述原生语法的
//  * <div id="app">
//  *    <p>hello</p>
//  * </div>
//  * let root = {
//  *  tag:'div',
//  *  attrs:[{name:'id',value:'#app'}]
//  *  parent:null,
//  *  type:1,
//  *  children:[
//  *    tag:'p',
//  *    attrs:[],
//  *    parent:root,
//  *    type:1,
//  *    children:[
//  *      {
//  *        text:'hello',
//  *        type:3
//  *      }
//  *    ]
//  *  ]
//  * }
//  */
