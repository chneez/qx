// 筛选目标请求
const requestBody = $request?.body || "";

// 判断请求体是否包含目标字段
if (requestBody.includes('"method":"mdc.daily.moudle.get"')) {
  console.log("匹配到目标请求:", requestBody);

  try {
    // 解析响应体
    const responseBody = $response?.body || "{}";
    const data = JSON.parse(responseBody);

    // 提取正确答案
    const topics = data.mdc_daily_moudle_get_response?.topicList || [];
    const correctAnswers = topics.map((topic, index) =>
      `题目 ${index + 1} 的答案: ` +
      topic.itemList
        .filter(item => item.isRight.type === 1)
        .map(item => item.item)
        .join(", ")
    );

    // 拼接通知内容
    const notificationContent = correctAnswers.join("\n");

    // 发送通知
    if (notificationContent) {
      $notify("正确答案", "提取成功", notificationContent);
      console.log("答案内容:", notificationContent);
    } else {
      console.log("未找到正确答案");
    }

    // 返回原始响应体
    $done({ body: responseBody });
  } catch (error) {
    console.log("处理响应体时出错:", error.message);
    $done({}); // 出现异常时返回原始响应
  }
} else {
  // 非目标请求，直接放行
  console.log("非目标请求，直接放行");
  $done({});
}
