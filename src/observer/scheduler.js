/*
 *@Author: 赵元达
 *@Date: 2022-05-03 09:37:10
 *@parms:
 *@Description: watcher调度相关
 */
import { nextTickPlus } from "../util/index";
let queue = [];
let has = {}; //做列表的 列表维护存放了哪些watcher
let pending = false;
/*
 *@Author: 赵元达
 *@Date: 2022-05-03 09:37:34
 *@parms:
 *@Description:
 */
export function cacheWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    queue.push(watcher);
    has[id] = true;

    // 开启一次更新操作 批处理 （防抖）
    if (!pending) {
      nextTickPlus(flushSchedulerQueue, 0);
      pending = true;
    }
  }
}

function flushSchedulerQueue() {
  for (let index = 0; index < queue.length; index++) {
    queue[index].run();
  }
  queue = [];
  has = {};
  pending = false;
}
