const url = $persistentStore.read("kuqitoken");
const headersStr = $persistentStore.read("kuqiheaders");

if (!url || !headersStr) {
    $notification.post("酷骑签到失败", "数据缺失", "未找到存储的URL或Headers，请先触发重写脚本");
    $done();
    return;
}

const headers = JSON.parse(headersStr);

const params = {
    url: url,
    headers: headers,
    timeout: 5000
};

$httpClient.get(params, function (errormsg, response, data) {
    if (errormsg) {
        console.log("酷骑签到请求失败: " + errormsg);
        $notification.post("签到失败", "请求错误", errormsg);
        $done();
        return;
    }

    console.log("签到响应状态码: " + (response ? response.status : "无状态码"));
    console.log("签到响应内容: " + (data || "无数据"));

    let result;
    try {
        result = data ? JSON.parse(data) : { msg: "无响应数据" };
    } catch (e) {
        result = { msg: "无法解析响应: " + (data || "无数据") };
    }

    if (response && response.status === 200 && result.code === 0) {
        $notification.post("酷骑签到成功", "状态码: " + response.status, result.msg || "签到完成");
    } else {
        $notification.post("酷骑签到失败", "状态码: " + (response ? response.status : "无状态码"), result.msg || "未知错误");
    }
    $done();
});