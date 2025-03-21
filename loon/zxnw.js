// 获取响应体，默认为空对象字符串
const responseBody = $response ? $response.body : "{}";

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
        `${index + 1}: ` +
        (topic.itemList || [])
            .filter(item => item?.isRight?.type === 1)
            .map(item => item?.item || "未知")
            //.join(", ") // Loon 中无需在 map 中拼接，因为下面用 join
    );

    // 拼接通知内容
    const notificationContent = correctAnswers.join(",");

    // 发送通知
    if (notificationContent) {
        $notification.post("正确答案", "提取成功", notificationContent);
    }

    // 返回原始响应体
    $done({ body: responseBody });

} catch (error) {
    console.log("错误: " + error.message); // 添加日志，便于调试
    $done({ body: responseBody });
}