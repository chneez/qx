const url = $request.url;
const headers = $request.headers;

if (url.includes("https://h5.youzan.com/wscump/checkin/checkinV2.json")) {
    console.log("匹配到签到请求，开始存储URL和Headers");
    console.log("请求URL: " + url);
    console.log("请求Headers: " + JSON.stringify(headers));

    // 存储 URL
    if ($persistentStore.write(url, "kuqitoken")) {
        console.log("成功存储URL: " + url);
    } else {
        console.log("存储URL失败");
        $notification.post("酷骑签到脚本", "存储失败", "无法存储URL");
    }

    // 存储 Headers
    const headersStr = JSON.stringify(headers);
    if ($persistentStore.write(headersStr, "kuqiheaders")) {
        console.log("成功存储Headers: " + headersStr);
    } else {
        console.log("存储Headers失败");
        $notification.post("酷骑签到脚本", "存储失败", "无法存储Headers");
    }

    $notification.post("酷骑签到脚本", "重写成功", "URL和Headers已存储");
} else {
    console.log("未匹配目标URL: " + url);
}

$done({});
