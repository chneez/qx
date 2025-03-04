// 获取请求
const url = $request.url;

// 初始化通知内容
const notificationLines = [];

// 获取完整请求头
const headers = $request.headers;
const oldHeaders = JSON.parse($prefs.valueForKey("kuqiheaders") || "{}"); // 从存储中读取旧头部，默认空对象

// 筛选必要的请求头（根据需求调整）
const necessaryHeaders = {};
const targetKeys = ["Authorization", "Cookie", "User-Agent"]; // 可根据需要修改
for (const [key, value] of Object.entries(headers)) {
    if (targetKeys.includes(key)) {
        necessaryHeaders[key] = value;
    }
}

// 比较新旧请求头差异
const changedHeaders = [];
for (const [key, value] of Object.entries(necessaryHeaders)) {
    if (oldHeaders[key] !== value) {
        changedHeaders.push([key, value]);
        oldHeaders[key] = value; // 更新旧头部记录
    }
}

// 存储请求头并发送通知
const isFirstStore = !$prefs.valueForKey("kuqiheaders"); // 检查是否首次存储
if (changedHeaders.length > 0 || isFirstStore) {
    $prefs.setValueForKey(JSON.stringify(necessaryHeaders), "kuqiheaders");
    changedHeaders.forEach(([key, value]) => {
        notificationLines.push(`更新 Header: ${key} → ${value}`);
    });
    if (notificationLines.length > 0) {
        $notify("酷骑", "请求头更新检测", notificationLines.join("\n"));
    } else if (isFirstStore) {
        $notify("酷骑", "首次存储", "已存储初始请求头");
    }
} else {
    console.log(`请求头未发生变化 - URL: ${url}`);
}

$done({});