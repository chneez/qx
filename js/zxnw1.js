// csgmall_parser.js
// 脚本用于匹配请求体中包含特定关键词并解析响应体

// 获取请求体
let requestBody = $request.body;

// 检查请求体中是否包含目标关键词
if (requestBody.includes('"method":"mdc.daily.moudle.get"')) {
    // 获取响应体
    let responseBody = $response.body;

    // 解析响应体为 JSON
    let json = JSON.parse(responseBody);

    // 示例：对 JSON 数据进行解析或修改
    console.log("Matched Response:", json); // 打印匹配的响应体
    // json.newField = "example"; // 示例：添加字段

    // 返回修改后的响应体
    $done({ body: JSON.stringify(json) });
} else {
    // 如果请求体不匹配，直接返回原始响应体
    $done({});
}
