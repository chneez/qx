// 检查请求体是否为目标请求
const requestBody = $request?.body || "";
if (requestBody.includes('"method":"mdc.daily.moudle.get"')) {
  console.log("匹配到目标请求体:", requestBody);

  try {
    // 解析响应体
    const responseBody = $response?.body || "{}";
    const data = JSON.parse(responseBody);
    console.log("解析后的响应数据:", data);

    // 提取题目信息
    const topics = data.mdc_daily_moudle_get_response?.topicList || [];
    if (!topics.length) {
      console.log("未找到题目信息");
      $done({ body: responseBody });
      return;
    }

    // 提取正确答案
    const correctAnswers = topics.map((topic, index) =>
      `题目 ${index + 1} 的答案: ` +
      (topic.itemList || [])
        .filter(item => item?.isRight?.type === 1)
        .map(item => item?.item || "未知")
        .join(", ")
    );

    // 拼接通知内容
    const notificationContent = correctAnswers.join("\n");

    // 发送通知
    if (notificationContent) {
      $notify("正确答案", "提取成功", notificationContent);
      console.log("答案通知内容:", notificationContent);
    } else {
      console.log("未找到正确答案");
    }

    $done({ body: responseBody });
  } catch (error) {
    console.error("解析响应体出错:", error.message);
    $done({}); // 出现异常时返回原始响应
  }
} else {
  // 非目标请求，直接放行
  console.log("非目标请求，直接放行");
  $done({});
}
