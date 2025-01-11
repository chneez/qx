
// 获取响应体
let body = $response.body;
let response = JSON.parse(body);

// 解析正确答案
const questions = response.data.question_list;
let notificationContent = questions.map((q) => {
  const questionNumber = q.sort;
  let answer = "";

  // 根据题目类型解析答案
  if (q.type === 0) {
    // 单选题
    const correctOptions = q.correct_answer[0];
    answer = correctOptions
      .map((optionId) => {
        const option = q.option.find((opt) => opt.id === optionId);
        return option ? option.content.match(/^[A-D]/)[0] : ""; // 提取选项的字母
      })
      .join("");
  } else if (q.type === 1) {
    // 多选题
    const correctOptions = q.correct_answer[0];
    answer = correctOptions
      .map((optionId) => {
        const option = q.option.find((opt) => opt.id === optionId);
        return option ? option.content.match(/^[A-D]/)[0] : ""; // 提取选项的字母
      })
      .join("");
  } else if (q.type === 3) {
    // 判断题
    answer = q.correct_answer === 1 ? "对" : "错";
  }

  return `${questionNumber}${answer}`;
}).join("、");

// 推送通知
$notify("试题正确答案", "", notificationContent);

// 原样返回响应体
$done({ body });
