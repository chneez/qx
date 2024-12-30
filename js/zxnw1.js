// 检查请求体是否包含目标字段
const requestBody = $request?.body || "";

if (requestBody.includes('"method":"mdc.daily.moudle.get"')) {
  console.log("匹配到目标请求:", requestBody);

  // 在请求头中添加标记，供响应处理脚本识别
  const headers = $request.headers || {};
  headers["X-Target-Request"] = "true";

  $done({ headers });
} else {
  // 放行非目标请求
  $done({});
}
