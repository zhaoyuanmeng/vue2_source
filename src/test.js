const cbs = [];
let wating = false;
function nextTick(cb) {
  cbs.push(cb);
  if (!wating) {
    // 异步更新 不是掉一次更新一次
    setTimeout(flushCallBacks, 0);
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

// 这里settimeout只会执行最后一次 而且拿到的数据是最终更新好的
// 这种编程很牛逼
