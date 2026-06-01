/**
 * 运动 Token 抓取 (Loon http-request 重写脚本)
 *
 * Loon 重写配置:
 * http-request https://gx.sport.zeenshangmao.com/api/.* script-path=path/to/sport_token.js, tag=运动token抓取, requires-body=false
 *
 * 当微信小程序发起任意 API 请求时自动捕获 token 并存入持久化存储
 */

const token = $request.headers.token || $request.headers["token"];

if (token) {
    const old = $persistentStore.read("sport_token");
    if (token !== old) {
        $persistentStore.write(token, "sport_token");
        $notification.post("运动 token 已更新", "", token);
        console.log("sport_token saved: " + token);
    }
}

$done();