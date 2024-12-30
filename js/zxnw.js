// 检查请求体是否匹配指定条件
const requestBody = $request.body || "";

if (requestBody.includes('"method":"mdc.daily.moudle.get"')) {
  // 解析响应体
  const body = JSON.parse($response.body || "{}");

  // 提取正确答案
  const topics = body.mdc_daily_moudle_get_response?.topicList || [];
  const correctAnswers = topics.map(topic =>
    topic.itemList
      .filter(item => item.isRight.type === 1)
      .map(item => item.item)
  );

  // 拼接答案为通知内容
  const answerMessage = correctAnswers
    .map((answers, index) => `题目 ${index + 1} 的答案: ${answers.join(", ")}`)
    .join("\n");

  // 弹出通知
  $notify("正确答案", "已提取以下答案", answerMessage);
}

// 返回原始响应体
$done({});
