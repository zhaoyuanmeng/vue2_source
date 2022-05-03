const cbs = [];
let wating = false;
function nextTick(cb) {
  cbs.push(cb);
  if (!wating) {
    // 异步更新 不是掉一次更新一次
    setTimeout(flushCallBacks, 0);
    console.log("asdads");
    wating = true;
  }
}

function flushCallBacks() {
  cbs.forEach((cb) => cb());
  wating = false;
}

nextTick(() => {
  console.log("1");
});

nextTick(() => {
  console.log("2");
});
