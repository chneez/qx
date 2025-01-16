/*
 * Quantumult X Script: 仅推送正确选项
 */

let body = $response.body; // 获取响应体
let obj = JSON.parse(body); // 解析 JSON 数据

// 检查数据是否包含有效内容
if (obj.mdc_daily_moudle_get_response && obj.mdc_daily_moudle_get_response.topicList) {
    let topics = obj.mdc_daily_moudle_get_response.topicList;
    let correctOptions = [];

    // 遍历题目列表，提取正确选项
    topics.forEach((topic) => {
        let correctAnswers = topic.itemList
            .filter((item) => item.isRight && item.isRight.type === 1) // 筛选正确选项
            .map((item) => item.item); // 获取选项编号 (A, B, C, D)

        if (correctAnswers.length > 0) {
            correctOptions.push(...correctAnswers); // 收集所有正确选项
        }
    });

    // 如果有正确选项，发送通知
    if (correctOptions.length > 0) {
        $notify("答题助手", "正确选项如下", correctOptions.join(", "));
    }
}

// 返回原始响应体
$done(body);