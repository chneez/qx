// 获取响应体
let body = $response.body;
let response = JSON.parse(body);

// 解析正确答案
const questions = response.data.question_list;
let notificationContent = questions.map((q) => {
  const questionNumber = q.sort; // 题目序号
  let answer = "";

  // 根据题目类型解析答案
  if (q.type === 0 || q.type === 1) {
    // 单选题或多选题
    const correctOptions = q.correct_answer.flat(); // 处理多选答案
    const letterMapping = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // 支持更多选项，如A, B, C, D, E, F, G...

    // 对于每个正确选项，找到它对应的字母
    answer = correctOptions
      .map((optionId) => {
        const index = q.option.findIndex((opt) => opt.id === optionId); // 找到选项索引
        return index >= 0 ? letterMapping[index] : ""; // 根据索引获取字母
      })
      .join(""); // 合并多个答案，适应多选题

  } else if (q.type === 3) {
    // 判断题
    const correctAnswer = q.correct_answer.flat()[0]; // 获取判断题答案
    answer = correctAnswer === "1" ? "对" : "错";
  }

  return `${questionNumber}${answer}`; // 返回格式：题号+答案
}).join("、"); // 使用顿号分隔每题答案

// 推送通知
$notify("试题正确答案", "", notificationContent);

// 原样返回响应体
$done({ body });