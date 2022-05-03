/*
 *@Author: 赵元达
 *@Date: 2022-05-03 14:25:36
 *@parms:
 *@Description:
 */
import Watcher from "./observer/watcher";

export function watch(key, handler, opt = {}) {
  opt.user = true; //表示是用户自己写的watcher
  new Watcher(this, key, handler, opt);
}
