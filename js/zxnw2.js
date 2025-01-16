// 检查请求体是否为目标请求
const requestBody = $request?.body || "";
if (requestBody.includes('"method":"mdc.gx.knowledge.daily.moudle.get"')) {
  console.log("匹配到目标请求体:", requestBody);

  try {
    // 解析响应体
    const responseBody = $response?.body || "{}";
    const data = JSON.parse(responseBody);
    console.log("解析后的响应数据:", data);

    // 提取不同题型
    const response = data.mdc_gx_knowledge_daily_moudle_get_response || {};
    const multipleList = response.multipleList || [];
    const singleList = response.singleList || [];
    const trueFalseList = response.trueFalseList || [];

    // 解析多选题答案
    const multipleAnswers = multipleList.map((topic, index) =>
      `多选题 ${index + 1} 的答案: ` +
      (topic.itemList || [])
        .filter(item => item?.isRight?.type === 1)
        .map(item => item?.item || "未知")
        .join(", ")
    );

    // 解析单选题答案
    const singleAnswers = singleList.map((topic, index) =>
      `单选题 ${index + 1} 的答案: ` +
      (topic.itemList || [])
        .filter(item => item?.isRight?.type === 1)
        .map(item => item?.item || "未知")
        .join(", ")
    );

    // 解析判断题答案
    const trueFalseAnswers = trueFalseList.map((topic, index) =>
      `判断题 ${index + 1} 的答案: ` +
      (topic.itemList || [])
        .filter(item => item?.isRight?.type === 1)
        .map(item => item?.item || "未知")
        .join(", ")
    );

    // 合并所有答案
    const notificationContent = [
      ...multipleAnswers,
      ...singleAnswers,
      ...trueFalseAnswers,
    ].join("\n");

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
