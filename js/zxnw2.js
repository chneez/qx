// 检查响应体是否包含目标字段
const responseBody = $response?.body || "{}";
try {
  const data = JSON.parse(responseBody);

  // 确认是否为目标响应
  const response = data.mdc_gx_knowledge_daily_moudle_get_response;
  if (!response) {
    $done({ body: responseBody }); // 非目标响应，直接返回
    return;
  }

  // 存储题目与答案信息
  const results = [];

  // 排序并处理题目
  const processQuestions = (questionList, type) => {
    // 按 sort 字段排序
    questionList.sort((a, b) => a.sort - b.sort);
    questionList.forEach((question, index) => {
      const answers = (question.itemList || [])
        .filter(item => item.isRight?.type === 1)
        .map(item => item.item || "未知")
        .join(", ");
      results.push(
        `【${type}】${index + 1}. ${question.title}\n答案: ${answers}`
      );
    });
  };

  // 处理多选题
  processQuestions(response.multipleList || [], "多选题");

  // 处理单选题
  processQuestions(response.singleList || [], "单选题");

  // 处理判断题
  processQuestions(response.trueFalseList || [], "判断题");

  // 拼接通知内容
  const notificationContent = results.join("\n\n");

  // 发送通知
  if (notificationContent) {
    $notify("题目解析结果", "成功提取以下内容", notificationContent);
  }

  // 返回原始响应体
  $done({ body: responseBody });
} catch (error) {
  console.log("解析响应体出错:", error.message);
  $done({ body: responseBody }); // 解析出错时返回原始响应体
}
