if ($request.url.includes("https://h5.youzan.com/wscump/checkin/checkinV2.json")) {
    console.log("匹配到签到请求，开始存储URL和Headers");

    $persistentStore.write($request.url, "kuqitoken");
    console.log("已存储URL: " + $request.url);

    const headers = JSON.stringify($request.headers);
    $persistentStore.write(headers, "kuqiheaders");
    console.log("已存储Headers: " + headers);

    $notification.post("签到脚本", "重写成功", "URL和Headers已存储");
} else {
    console.log("未匹配目标URL: " + $request.url);
}

$done();