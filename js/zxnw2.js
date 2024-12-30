// 检查请求头标记是否存在
const targetRequest = $request.headers?.["X-Target-Request"] === "true";

if (targetRequest) {
  try {
    const body = JSON.parse($response.body || "{}");

    // 提取正确答案
    const topics = body.mdc_daily_moudle_get_response?.topicList || [];
    const correctAnswers = topics.map(topic =>
      topic.itemList
        .filter(item => item.isRight.type === 1)
        .map(item => item.item)
    );

    // 拼接答案内容
    const answerMessage = correctAnswers
      .map((answers, index) => `题目 ${index + 1} 的答案: ${answers.join(", ")}`)
      .join("\n");

    // 发送通知
    $notify("正确答案", "已提取以下答案", answerMessage);

    // 返回原始响应体
    $done({ body: JSON.stringify(body) });
  } catch (error) {
    console.log("处理响应体出错:", error.message);
    $done({}); // 返回原始响应体，避免中断
  }
} else {
  // 非目标请求，直接放行
  $done({});
}
