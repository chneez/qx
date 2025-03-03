// 获取请求 
const url = $request.url;

// 初始化通知内容
let notificationMessage = "";

// 获取完整请求头
const headers = $request.headers;
const oldHeaders = JSON.parse($prefs.valueForKey("kqallheaders")) || {}; // 从存储中读取旧头部

// 比较新旧请求头差异
const changedHeaders = [];
for (const [key, value] of Object.entries(headers)) {
    if (oldHeaders[key] !== value) {
        changedHeaders.push([key, value]);
        oldHeaders[key] = value; // 先临时记录新值
    }
}

// 存储所有请求头（包括未变化的）
if (changedHeaders.length > 0 || Object.keys(headers).length === 0) { // 如果有变化或首次存储
    $prefs.setValueForKey(JSON.stringify(headers), "kqallheaders");
    // 构建通知内容
    changedHeaders.forEach(([key, value]) => {
        notificationMessage += `更新 Header: ${key} → ${value}\n`;
    });
} else {
    console.log("请求头未发生变化");
}

// 如果有更新则发送通知
if (notificationMessage) {
    $notify("酷骑", "请求头更新检测", notificationMessage.trim());
} else {
    console.log("无新请求头信息");
}

$done({});