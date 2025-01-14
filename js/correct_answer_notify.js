// 获取响应体
let body = $response.body;
let response = JSON.parse(body);

// 解析正确答案
const questions = response.data.question_list;
let notificationContent = questions.map((q) => {
  const questionNumber = q.sort;
  let answer = "";

  // 根据题目类型解析答案
  if (q.type === 0 || q.type === 1) {
    // 单选题和多选题
    const correctOptions = q.correct_answer.flat(); // 多选题支持多个答案
    answer = correctOptions
      .map((optionId) => {
        const option = q.option.find((opt) => opt.id === optionId);
        if (option) {
          // 提取选项字母（A、B、C、D）
          const match = option.content.match(/<p>(.*?)<\/p>/);
          return match ? match[1].slice(0, 1) : ""; // 提取选项字母
        }
        return "";
      })
      .join(""); // 拼接为ABC等
  } else if (q.type === 3) {
    // 判断题
    answer = q.correct_answer[0] === "1" ? "对" : "错";
  }

  return `第${questionNumber}题: ${answer}`;
}).join("；"); // 使用分号分隔每题答案

// 推送通知
$notify("试题正确答案", "", notificationContent);

// 原样返回响应体
$done({ body });
