import {parseHtml} from './parse'
import {generate} from './generate'
/*
 * @description 生成render函数
 * @author 赵元达 2022-03-13 09:21:27
 * @param
 * @return render函数
 */
export function compileToFunction(template) {
  let root = parseHtml(template);

  // 生成代码
  let code = generate(root)

  // render(){
  //   return _c('div',{id:'app',a:1},'hello')
  // }


  // html ==> ast ===> render函数 ===>虚拟DOM ==> 真实DOM


  
}



