/**
 * @name: zxnw3.js (适配 QX & Loon)
 * @description: 自动重放请求 + 提取答案
 * @author: chneez
 * @version: 1.0.0
 * @update: 2024-06-20
 */

const API_CONFIG = {
  "https://w.csgmall.com.cn/gateway": {
    replayMethods: {
      "mdc.member.other.get": 5,
      "mdc.reward.viewTimeRecord.add": 3,
      "mdc.info.comment.add": 2,
    },
    extractMethods: ["mdc.member.other.get"],
  },
};

// 判断当前运行环境 (QX / Loon)
const ENV = (() => {
  if (typeof $task !== "undefined") return "QX";
  if (typeof $httpClient !== "undefined") return "Loon";
  return "Unknown";
})();

console.log(`✅ 当前运行环境: ${ENV}`);

const url = $request?.url;
const method = $request?.method;
const headers = $request?.headers;
const body = $request?.body;
const responseBody = $response?.body;

/**
 * 重放请求 (适配 QX & Loon)
 * @param {string} url - 请求URL
 * @param {object} options - { method, headers, body }
 * @param {function} callback - 回调函数
 */
function fetchRequest(url, options, callback) {
  if (ENV === "QX") {
    $task.fetch({
      url: url,
      method: options.method || "POST",
      headers: options.headers,
      body: options.body,
    }).then(
      (response) => callback(null, response, response.body),
      (error) => callback(error, null, null)
    );
  } else if (ENV === "Loon") {
    $httpClient.post(
      { url, headers: options.headers, body: options.body },
      (error, response, data) => callback(error, response, data)
    );
  } else {
    console.log("❌ 未知环境，无法发送请求");
  }
}

/**
 * 递归重放请求
 * @param {number} times - 剩余重放次数
 */
function replayRequest(times) {
  console.log(`🔄 尝试重放，剩余次数=${times}`);
  if (times <= 0) return;

  const delay = Math.floor(Math.random() * 1000) + 1000;
  setTimeout(() => {
    fetchRequest(
      url,
      { method, headers, body },
      (error, response, data) => {
        if (error) {
          console.log(`❌ 第 ${times} 次重放失败: ${error}`);
        } else {
          console.log(`✅ 第 ${times} 次重放成功`);
        }
        replayRequest(times - 1);
      }
    );
  }, delay);
}

/**
 * 提取答案并通知
 * @param {string} data - 响应数据
 */
function extractAnswers(data) {
  try {
    const jsonData = JSON.parse(data);
    const answers = jsonData?.data?.answers || [];
    console.log("📝 提取答案:", answers);
    if (ENV === "QX") {
      $notify("答案提取成功", "", answers.join(", "));
    } else if (ENV === "Loon") {
      $notification.post("答案提取成功", "", answers.join(", "));
    }
  } catch (e) {
    console.log("❌ 解析答案失败:", e);
  }
}

(function () {
  if (!url || !body) {
    console.log("❌ 请求数据不完整");
    $done({});
    return;
  }

  const apiConfig = API_CONFIG[url];
  if (!apiConfig) {
    $done({});
    return;
  }

  // 检查是否需要重放请求
  for (const [methodPattern, replayTimes] of Object.entries(apiConfig.replayMethods || {})) {
    if (body.includes(methodPattern)) {
      replayRequest(replayTimes);
      break;
    }
  }

  // 检查是否需要提取答案
  if (apiConfig.extractMethods?.some((m) => responseBody?.includes(m))) {
    extractAnswers(responseBody);
  }

  $done({});
})();
