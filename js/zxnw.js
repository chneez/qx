try {
  const requestBody = $request.body || "";

  if (requestBody.includes('"method":"mdc.daily.moudle.get"')) {
    const body = JSON.parse($response.body || "{}");

    const topics = body.mdc_daily_moudle_get_response?.topicList || [];
    const correctAnswers = topics.map(topic =>
      topic.itemList
        .filter(item => item.isRight.type === 1)
        .map(item => item.item)
    );

    const answerMessage = correctAnswers
      .map((answers, index) => `题目 ${index + 1} 的答案: ${answers.join(", ")}`)
      .join("\n");

    $notify("正确答案", "已提取以下答案", answerMessage);
  }
} catch (error) {
  console.log("脚本执行出错：", error.message);
}

// 返回原始响应体
$done({});
