// 008
// 获取请求体和请求头
const requestBody = $request?.body || "";
console.log("原始请求体:", requestBody);
console.log("请求体长度:", requestBody.length);

// 解析请求体
let parsedRequestBody = {};
try {
  if (requestBody.trim() !== "") {
    parsedRequestBody = JSON.parse(requestBody);
    console.log("请求体解析成功:", parsedRequestBody);
  } else {
    console.log("请求体为空，跳过解析");
    $done({});
    return;
  }
} catch (error) {
  console.log("请求体解析失败，可能是非JSON格式:", error.message);
  $done({});
  return;
}

// 检查是否匹配目标请求
if (parsedRequestBody.method === "mdc.daily.moudle.get") {
  console.log("匹配到目标请求体");

  // 解析响应体
  const responseBody = $response?.body || "{}";
  try {
    const data = JSON.parse(responseBody);
    console.log("响应体解析成功:", data);

    const topics = data.mdc_daily_moudle_get_response?.topicList || [];
    if (topics.length === 0) {
      console.log("未找到题目信息");
      $done({ body: responseBody });
      return;
    }

    const correctAnswers = topics.map((topic, index) =>
      `题目 ${index + 1} 的答案: ` +
      (topic.itemList || [])
        .filter(item => item?.isRight?.type === 1)
        .map(item => item?.item || "未知")
        .join(", ")
    );

    const notificationContent = correctAnswers.join("\n");
    if (notificationContent) {
      $notify("正确答案", "提取成功", notificationContent);
      console.log("答案通知内容:", notificationContent);
    } else {
      console.log("未找到正确答案");
    }

    $done({ body: responseBody });
  } catch (error) {
    console.log("响应体解析失败:", error.message);
    $done({ body: responseBody });
  }
} else {
  console.log("非目标请求，直接放行");
  $done({});
}
