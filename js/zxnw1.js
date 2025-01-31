const responseBody = $response?.body || "{}";

try {
  // 解析响应体
  const data = JSON.parse(responseBody);

  // 判断是否包含目标字段
  const topics = data.mdc_daily_moudle_get_response?.topicList || [];
  if (topics.length === 0) {
    $done({ body: responseBody });
    return;
  }

  // 提取正确答案
  const correctAnswers = topics.map((topic, index) =>
    `题${index + 1}: ` +
    (topic.itemList || [])
      .filter(item => item?.isRight?.type === 1)
      .map(item => item?.item || "未知")
      //.join(", ")
  );

  // 拼接通知内容
  const notificationContent = correctAnswers.join(",");

  // 发送通知
  if (notificationContent) {
    $notify("正确答案", "提取成功", notificationContent);
  }

  // 返回原始响应体
  $done({ body: responseBody });

} catch (error) {
  $done({ body: responseBody });
}
