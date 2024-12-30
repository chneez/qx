// 获取请求体
const requestBody = $request?.body || "";

// 判断是否包含目标字段
if (requestBody.includes('"method":"mdc.daily.moudle.get"')) {
  console.log("匹配到目标请求体:", requestBody);

  // 保存响应体处理逻辑
  $done({
    before: (response) => {
      try {
        const body = JSON.parse(response.body || "{}");

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

        // 返回原始响应
        return response.body;
      } catch (error) {
        console.log("处理响应体出错:", error.message);
        return response.body;
      }
    }
  });
} else {
  // 非目标请求，直接放行
  $done({});
}
