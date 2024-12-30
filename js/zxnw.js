try {
  // 确保脚本不会因 undefined 的 $response.body 崩溃
  const responseBody = $response?.body;

  // 如果响应体不存在，直接退出
  if (!responseBody) {
    console.log("响应体不存在，跳过处理");
    $done({});
    return;
  }

  // 尝试解析响应体
  const body = JSON.parse(responseBody);

  // 提取正确答案逻辑
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
} catch (error) {
  console.log("脚本执行错误：", error.message);
}

// 返回原始响应体
$done({});
