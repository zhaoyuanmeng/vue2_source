import { parseHtml } from "./parse";
import { generate } from "./generate";
/*
 * @description 生成render函数
 * @author 赵元达 2022-03-13 09:21:27
 * @param
 * @return render函数
 */
export function compileToFunction(template) {
  let root = parseHtml(template);

  // 生成代码
  let code = generate(root);

  // 这里面的this是vm
  let render = new Function(`with(this){return ${code}}`);
  console.log("render", render);
  return render;
}

// let vm = {arr:1}
// with(vm){
//   console.log(arr); //这里拿到的就是1 自动结构了
// }
