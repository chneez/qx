let url = $request.url;

// 只处理特定域名
if (!url.includes("youzan.com")) {
    $done({});
}

// 提取和更新 access_token
let match = url.match(/access_token=([^&]+)/);
if (match) {
    let newToken = match[1];
    let oldToken = $persistentStore.read("kuqitoken");
    if (newToken !== oldToken) {
        $persistentStore.write(newToken, "kuqitoken");
        $notify("酷骑", "更新", "新 access_token: " + newToken);
        console.log("🔹 新 access_token 已更新: " + newToken);
    }
}

// 处理请求头
let headers = $request.headers;
let oldHeaders = $persistentStore.read("kuqiheaders");
if (oldHeaders) {
    oldHeaders = JSON.parse(oldHeaders);
} else {
    oldHeaders = {};
}

let targetHeaders = ["Authorization", "Cookie", "User-Agent"];
let newHeaders = {};
let updates = [];

for (let key of targetHeaders) {
    if (headers[key]) {
        newHeaders[key] = headers[key];
    }
}

for (let [key, value] of Object.entries(newHeaders)) {
    if (oldHeaders[key] !== value) {
        updates.push("更新 " + key + ": " + value);
        oldHeaders[key] = value;
    }
}

let isFirst = !$persistentStore.read("kuqiheaders");
if (updates.length > 0 || isFirst) {
    $persistentStore.write(JSON.stringify(newHeaders), "kuqiheaders");
    if (updates.length > 0) {
        $notify("酷骑", "请求头更新", updates.join("\n"));
    } else if (isFirst) {
        $notify("酷骑", "首次存储", "已保存请求头");
    }
} else {
    console.log("无更新 - URL: " + url);
}

$done({});