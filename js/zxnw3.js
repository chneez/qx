const url = $request.url;
const method = $request.method;
const headers = $request.headers;
const body = $request.body;
const responseBody = $response?.body || "{}";

// ========== 配置区（可扩展） ==========
const API_CONFIG = {
  "https://w.csgmall.com.cn/gateway": {
    // 需要重放的 method 及对应次数
    replayMethods: {
      "mdc.member.other.get": 5,      // 重放 5 次
      "mdc.reward.viewTimeRecord.add": 2, // 重放 2 次
      "mdc.info.comment.add": 4,       // 重放 4 次
    },
    // 需要提取答案的 method
    extractMethods: ["mdc_daily_moudle_get_response"],
  },
  // 可以添加更多 API 的处理规则
};

// ========== 核心逻辑 ==========
function handleRequest() {
  const apiConfig = API_CONFIG[url];
  if (!apiConfig) {
    $done({}); // 不匹配的 API 直接放行
    return;
  }

  // 1. 检查是否需要重放请求
  for (const [methodPattern, replayTimes] of Object.entries(apiConfig.replayMethods || {})) {
    if (body?.includes(methodPattern)) {
      replayRequest(replayTimes); // 按配置次数重放
      break; // 匹配到就停止
    }
  }

  // 2. 检查是否需要提取答案
  const shouldExtract = apiConfig.extractMethods?.some((m) => responseBody?.includes(m));
  if (shouldExtract) {
    extractAnswers(responseBody);
  }

  // 3. 无论如何都放行原始请求
  $done({});
}

// ========== 功能函数 ==========
// 1. 重放请求（自定义次数，随机1-2秒间隔）
function replayRequest(times) {
  if (times <= 0) return;

  const delay = Math.floor(Math.random() * 1000) + 1000; // 1-2秒随机延迟

  setTimeout(() => {
    $task.fetch({
      url: url,
      method: method,
      headers: headers,
      body: body,
    }).then(
      (response) => console.log(`✅ 第 ${times} 次重放成功`),
      (error) => console.log(`❌ 第 ${times} 次重放失败: ${error.error}`)
    );

    replayRequest(times - 1); // 递归调用
  }, delay);
}

// 2. 提取答案（你的逻辑）
function extractAnswers(responseBody) {
  try {
    const data = JSON.parse(responseBody);
    const topics = data.mdc_daily_moudle_get_response?.topicList || [];
    if (topics.length === 0) return;

    const correctAnswers = topics.map((topic, index) =>
      `${index + 1}: ` +
      (topic.itemList || [])
        .filter((item) => item?.isRight?.type === 1)
        .map((item) => item?.item || "未知")
    );

    const notificationContent = correctAnswers.join(",");
    if (notificationContent) {
      $notify("✅ 正确答案", "提取成功", notificationContent);
    }
  } catch (error) {
    console.log("❌ 解析答案失败:", error);
  }
}

// ========== 执行入口 ==========
handleRequest();
