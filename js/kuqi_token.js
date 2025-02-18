// 获取请求 URL
const url = $request.url;

// 初始化通知内容
let notificationMessage = "";

// 解析 access_token
const match = url.match(/access_token=([^&]+)/);
if (match) {
    const newToken = match[1];  // 提取新的 access_token
    const oldToken = $prefs.valueForKey("kuqitoken");  // 获取存储中的旧 token

    // 只有当 token 变化时才更新
    if (newToken !== oldToken) {
        // 更新存储的 access_token
        $prefs.setValueForKey(newToken, "kuqitoken");
        notificationMessage += `更新 access_token: ${newToken}\n`;
    } else {
        console.log("access_token 未变化，无需更新");
    }
}

// 获取请求头中的 extra-data
const extraData = $request.headers['extra-data'];
if (extraData) {
    const oldExtraData = $prefs.valueForKey("extradata");  // 获取存储中的旧 extra-data

    // 只有当 extra-data 变化时才更新
    if (extraData !== oldExtraData) {
        // 存储新的 extra-data
        $prefs.setValueForKey(extraData, "extradata");
        notificationMessage += `更新 extra-data: ${extraData}\n`;
    } else {
        console.log("extra-data 未变化，无需更新");
    }
} else {
    console.log("请求头中没有 extra-data");
}

// 如果有更新，则发送通知
if (notificationMessage) {
    $notify("酷骑", "获取信息成功", notificationMessage.trim());
} else {
    console.log("没有更新的信息");
}

$done({});  // 释放资源