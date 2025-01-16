const responseBody = $response?.body || "{}";

try {
  // 解析响应体
  const data = JSON.parse(responseBody);
  const responseKey = "mdc_gx_knowledge_daily_moudle_get_response";
  const response = data[responseKey];

  if (!response) {
    $done({ body: responseBody }); // 无目标响应，直接返回
    return;
  }

  // 合并所有题目列表
  const allTopics = [
    ...(response.singleList || []),
    ...(response.multipleList || []),
    ...(response.trueFalseList || [])
  ];

  // 按 sort 排序
  allTopics.sort((a, b) => a.sort - b.sort);

  // 提取答案
  const sortedAnswers = allTopics.map((topic, index) => {
    const correctItems = (topic.itemList || [])
      .filter(item => item.isRight?.type === 1)
      .map(item => item.item || "")
      .join(""); // 合并多选答案
    return `${index + 1}${correctItems}`;
  });

  // 拼接答案通知
  const notificationContent = sortedAnswers.join("，");

  // 发送通知
  if (notificationContent) {
    $notify("答案提取成功", "按排序展示答案", notificationContent);
  }

  $done({ body: responseBody });
} catch (error) {
  console.log("解析响应体出错:", error.message);
  $done({ body: responseBody }); // 出错时返回原始响应体
}
