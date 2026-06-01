/**
 * 运动打卡 - 每日自动上传 (Loon cron 脚本)
 *
 * Loon cron 配置:
 * cron "0 9 * * *" script-path=path/to/sport_checkin.js, tag=运动打卡
 *
 * 依赖 sport_token.js 先通过重写抓取 token 到持久化存储
 *
 * 请求链: 每个运动类型按顺序:
 *   activities/home -> sign/{sport} -> sign/{sport}Detail -> sign/isOpen -> sign/todayIsOpen
 * 间隔参考抓包: 同运动内 0.1s~2.7s, 运动间 4s~7.5s
 */

const BASE = "https://gx.sport.zeenshangmao.com";
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 26_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.74(0x18004a24) NetType/WIFI Language/zh_CN";
const REFERER = "https://servicewechat.com/wx5b6ff7970fcadcd6/28/page-frame.html";

// 从持久化存储读取 token（由 sport_token.js 重写脚本写入）
const TOKEN = $persistentStore.read("sport_token");

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

const HEADERS = {
    "Host": "gx.sport.zeenshangmao.com",
    "Connection": "keep-alive",
    "token": TOKEN,
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip,compress,br,deflate",
    "User-Agent": UA,
    "Referer": REFERER
};

/**
 * 发送 POST 请求
 */
async function doPost(path, body) {
    const res = await $httpClient.post({
        url: BASE + path,
        headers: HEADERS,
        body: JSON.stringify(body)
    });
    console.log("[" + (res.statusCode || "?") + "] " + path);
    return res;
}

/**
 * 执行一个运动类型的完整请求链
 */
async function doSport(sport, body) {
    await doPost("/api/activities/home", {});
    await sleep(rand(200, 800));

    await doPost("/api/sign/" + sport, body);
    await sleep(rand(200, 800));

    await doPost("/api/sign/" + sport + "Detail", {});
    await sleep(rand(200, 800));

    await doPost("/api/sign/isOpen", {});
    await sleep(rand(200, 800));

    await doPost("/api/sign/todayIsOpen", {});

    // 运动之间加间隔
    await sleep(rand(1000, 2500));
}

(async () => {
    try {
        if (!TOKEN) {
            $notification.post("运动打卡失败", "token 未获取", "请先在微信中打开运动小程序触发 token 抓取");
            $done();
            return;
        }

        // 广播体操 - 固定 100
        await doSport("gymnastics", { gymnastics: 100 });

        // 定点投篮 - shoot: 100-120, shoot_time: 550-650
        await doSport("shoot", { shoot: rand(100, 120), shoot_time: rand(550, 650) });

        // 运球 - touch_ball: 100-120, shoot_time: 150-200
        await doSport("DrawingBall", { touch_ball: rand(100, 120), shoot_time: rand(150, 200) });

        // 开合跳 - jumping_jack: 100-120, jumping_jack_time: 150-200
        await doSport("jumpingJack", { jumping_jack: rand(100, 120), jumping_jack_time: rand(150, 200) });

        $notification.post("运动打卡", "今日打卡完成", "");
    } catch (e) {
        $notification.post("运动打卡失败", String(e), "");
    }
    $done();
})();