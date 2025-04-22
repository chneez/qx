// 检查是否匹配目标URL
if ($request.url.includes("https://h5.youzan.com/wscump/checkin/checkinV2.json")) {
    console.log("匹配到签到请求，开始存储URL和Headers");

    // 存储URL
    $prefs.setValueForKey($request.url, "kuqitoken");
    console.log("已存储URL: " + $request.url);

    // 存储Headers（转换为JSON字符串）
    const headers = JSON.stringify($request.headers);
    $prefs.setValueForKey(headers, "kuqiheaders");
    console.log("已存储Headers: " + headers);

    // 通知用户
    $notify("签到脚本", "重写成功", "URL和Headers已存储");
    $done();
} else {
    console.log("未匹配目标URL: " + $request.url);
}

// 结束脚本，不修改请求
$done();