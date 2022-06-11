/*
京东618-京享红包，每日可中奖3次，最高19618元！
环境变量：hbCode、shareCode
https://u.jd.com/JC95RNG
0 0,20 * * * jd_618_red.js
*/
const $ = new Env('京东618-京享红包');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message = '';
$.shareCode = '9eIap';//助力邀请码
$.hbCode = 'JCUl71W';//红包码
let unionId = 2029434642; // 联盟id

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.hbCode) $.hbCode = process.env.hbCode;
  if (process.env.shareCode) $.shareCode = process.env.shareCode;
  if (process.env.unionId) unionId = process.env.unionId;
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
let newCookie = '', resMsg = '';

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  $.CryptoJS = require('crypto-js');
  $.appId = '6a98d'
  $.fingerprint = await generateFp();
  $.token = '';
  await requestAlgo();
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.JFCookie = getCookieStr(unionId);
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      console.log(`\n\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      getUA()
      await run();
    }
  }
  if (message) {
    $.msg($.name, ``, message);
    if ($.isNode()) {
      await notify.sendNotify(`${$.name}`, message);
    }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

async function run() {
  try {
    resMsg = ''
    let s = 0
    let t = 1
    do {
      $.flag = 0
      newCookie = ''
      await getUrl()
      if (!$.url1) {
        console.log('获取url1失败')
        t = 0
        break
      }
      await getUrl1()
      if (!$.url2) {
        console.log('获取url2失败')
        t = 0
        break
      }
      $.actId = $.url2.match(/mall\/active\/([^/]+)\/index\.html/) && $.url2.match(/mall\/active\/([^/]+)\/index\.html/)[1] || '2UboZe4RXkJPrpkp6SkpJJgtRmod'
      if ($.index === 1) console.log('$.actId', $.actId)
      // let arr = await Faker.getBody($.UA, $.url2)
      // await getEid(arr)
      if (!$.eid) {
        $.eid = -1
      }
      if (s === 0) {
        await getCoupons($.shareCode)
      } else {
        await getCoupons()
      }
      s++
      // await $.wait(parseInt(Math.random() * 5000 + 3000, 10))
    } while ($.flag === 1 && s < 10)
    if ($.index === 1 && t == 1) {
      // await $.wait(parseInt(Math.random() * 2000 + 1000, 10))
      await shareUnionCoupon()
    }
    if (resMsg) {
      message += `京东账号 ${$.index} ${$.UserName}\n${resMsg}https://u.jd.com/${$.hbCode}\n\n`
    }
    await $.wait(parseInt(Math.random() * 2000 + 2000, 10))
  } catch (e) {
    console.log(e)
  }
}

function getCoupons(shareId = '') {
  return new Promise(async resolve => {
    let body = `{%22platform%22:4,%22unionActId%22:%2231137%22,%22actId%22:%222UboZe4RXkJPrpkp6SkpJJgtRmod%22,%22d%22:%22YwIZ0LQ%22,%22unionShareId%22:%22%22,%22type%22:1,%22eid%22:%22-1%22}`
    body = {
      "platform":4,"unionActId":"31142","actId":$.actId,"d":$.hbCode,"unionShareId":shareId,"type":1,"eid":$.eid
    }
    const h5st = await getH5stBody('getCoupons', $.toStr(body));
    let opts = {
      url: `https://api.m.jd.com/api?functionId=getCoupons&appid=u&_=${Date.now()}&loginType=2&body=${$.toStr(body)}&client=apple&clientVersion=8.3.6&h5st=${h5st}`,
      headers: {
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        'Cookie': `${cookie} ${newCookie}`,
        "User-Agent": $.UA,
      }
    }
    $.get(opts, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data, data);
          if (typeof res == 'object') {
            if (res.msg) console.log("红包领取结果：", res.msg)
            if (res.msg.indexOf('上限') === -1) {
              $.flag = 1
            }
            if (shareId && typeof res.data !== 'undefined' && typeof res.data.joinNum !== 'undefined') {
              console.log(`当前${res.data.joinSuffix}:${res.data.joinNum}`)
            }
            if (res.code == 0 && res.data) {
              let msg = ''
              if (res.data.type == 1) {
                msg = `获得[红包]🧧${res.data.discount}元 使用时间:${$.time('yyyy-MM-dd', res.data.beginTime)} ${$.time('yyyy-MM-dd', res.data.endTime)}`
              } else if (res.data.type == 3) {
                console.log(`获得[优惠券]🎟️满${res.data.quota}减${res.data.discount} 使用时间:${$.time('yyyy-MM-dd', res.data.beginTime)} ${$.time('yyyy-MM-dd', res.data.endTime)}`);
              } else if (res.data.type == 6) {
                console.log(`获得[打折券]]🎫满${res.data.quota}打${res.data.discount * 10}折 使用时间:${$.time('yyyy-MM-dd', res.data.beginTime)} ${$.time('yyyy-MM-dd', res.data.endTime)}`)
              } else {
                msg = `获得[未知]🎉${res.data.quota || ''} ${res.data.discount} 使用时间:${$.time('yyyy-MM-dd', res.data.beginTime)} ${$.time('yyyy-MM-dd', res.data.endTime)}`
                console.log(data)
              }
              if (msg) {
                resMsg += msg + '\n'
                console.log(msg)
              }
            }
          } else {
            console.log("领取红包🧧失败：", data)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function shareUnionCoupon() {
  return new Promise(resolve => {
    let opts = {
      url: `https://api.m.jd.com/api?functionId=shareUnionCoupon&appid=u&_=${Date.now()}&loginType=2&body={%22unionActId%22:%2231137%22,%22actId%22:%22${$.actId}%22,%22platform%22:4,%22unionShareId%22:%22${$.shareCode}%22,%22d%22:%22${$.hbCode}%22,%22supportPic%22:2,%22supportLuckyCode%22:0,%22eid%22:%22${$.eid}%22}&client=apple&clientVersion=8.3.6`,
      headers: {
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br",
        'Cookie': `${cookie} ${newCookie}`,
        "User-Agent": $.UA,
      }
    }
    $.get(opts, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${$.toStr(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // console.log(data)
          let res = $.toObj(data, data);
          if (typeof res == 'object') {
            if (res.code == 0 && res.data && res.data.shareUrl) {
              const reg = new RegExp($.hbCode + '\\?s=([^&]+)')
              const shareCode = res.data.shareUrl.match(reg) && res.data.shareUrl.match(reg)[1] || ''
              // $.shareCode = shareCode;
              // console.log(`账号${$.index} ${$.UserName}` + ' 分享码:' + shareCode)
              // if ($.shareCode) console.log(`以下账号会助力账号${$.index} ${$.UserName}的分享码：${$.shareCode}`)
            }
          } else {
            console.log("获取分享码失败：", data)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}


function getUrl1() {
  return new Promise(resolve => {
    const options = {
      url: $.url1,
      followRedirect: false,
      headers: {
        'Cookie': `${cookie} ${newCookie} ${$.JFCookie}`,
        "User-Agent": $.UA
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        setActivityCookie(resp)
        $.url2 = resp && resp['headers'] && (resp['headers']['location'] || resp['headers']['Location'] || '') || ''
        $.url2 = decodeURIComponent($.url2)
        $.url2 = $.url2.match(/(https:\/\/prodev\.m\.jd\.com\/mall[^'"]+)/) && $.url2.match(/(https:\/\/prodev\.m\.jd\.com\/mall[^'"]+)/)[1] || ''
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function getUrl() {
  return new Promise(resolve => {
    const options = {
      url: `https://u.jd.com/${$.hbCode}?s=${$.shareCode}`,
      followRedirect: false,
      headers: {
        'Cookie': `${cookie} ${newCookie} ${$.JFCookie}`,
        "User-Agent": $.UA
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        setActivityCookie(resp)
        $.url1 = data.match(/(https:\/\/u\.jd\.com\/jda[^']+)/) && data.match(/(https:\/\/u\.jd\.com\/jda[^']+)/)[1] || ''
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function setActivityCookie(resp) {
  let setcookies = resp && resp['headers'] && (resp['headers']['set-cookie'] || resp['headers']['Set-Cookie'] || '') || ''
  let setcookie = ''
  if (setcookies) {
    if (typeof setcookies != 'object') {
      setcookie = setcookies.split(',')
    } else setcookie = setcookies
    for (let ck of setcookie) {
      let name = ck.split(";")[0].trim()
      if (name.split("=")[1]) {
        if (newCookie.indexOf(name.split("=")[1]) == -1) newCookie += name.replace(/ /g, '') + '; '
      }
    }
  }
}

function getEid(arr) {
  return new Promise(resolve => {
    const options = {
      url: `https://gia.jd.com/fcf.html?a=${arr.a}`,
      body: `d=${arr.d}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": $.UA
      }
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`\nAPI查询请求失败 ‼️‼️`)
          throw new Error(err);
        } else {
          if (data.indexOf("*_*") > 0) {
            data = data.split("*_*", 2);
            data = JSON.parse(data[1]);
            $.eid = data.eid
            console.log(`eid获取成功：${$.eid}`)
          } else {
            console.log(`京豆api返回数据为空，请检查自身原因`)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

function getUA() {
  $.UA = `jdapp;iPhone;10.2.0;13.1.2;${randomString(40)};M/5.0;network/wifi;ADID/;model/iPhone8,1;addressid/2308460611;appBuild/167853;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;`
  $.eid = randomString(90).toUpperCase();
  console.log(`模拟eid：${$.eid}`)
}

function randomString(e) {
  e = e || 32;
  let t = "abcdef0123456789", a = t.length, n = "";
  for (i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}
async function getH5stBody(functionId, bodyInfo) {
  const signtime = Date.now();
  const stk = "appid,body,client,clientVersion,functionId";
  const bodySign = $.CryptoJS.SHA256(bodyInfo).toString($.CryptoJS.enc.Hex);
  let url = `https://api.m.jd.com?functionId=${functionId}&appid=u&_=${signtime}&loginType=2&body=${bodySign}&client=apple&clientVersion=8.3.6`;
  const timestamp = new Date(signtime).Format("yyyyMMddhhmmssSSS");
  let hash1 = $.enCryptMethodJD($.token, $.fingerprint.toString(), timestamp.toString(), $.appId.toString(), $.CryptoJS).toString($.CryptoJS.enc.Hex);
  let st = '';
  stk.split(',').map((item, index) => {
    st += `${item}:${getUrlData(url, item)}${index === stk.split(',').length - 1 ? '' : '&'}`;
  })
  const hash2 = $.CryptoJS.HmacSHA256(st, hash1.toString()).toString($.CryptoJS.enc.Hex);
  let h5st = ["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.token), "".concat(hash2), "".concat('3.0'), "".concat(signtime)].join(";");
  // console.log(h5st)
  return `${encodeURIComponent(h5st)}`
}

async function requestAlgo() {
  const options = {
    "url": `https://cactus.jd.com/request_algo?g_ty=ajax`,
    "headers": {
      'Authority': 'cactus.jd.com',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Accept': 'application/json',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Content-Type': 'application/json',
      'Origin': 'https://st.jingxi.com',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://st.jingxi.com/',
      'Accept-Language': 'zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7'
    },
    'body': JSON.stringify({
      "version": "3.0",
      "fp": $.fingerprint,
      "appId": $.appId,
      "timestamp": Date.now(),
      "platform": "web",
      "expandParams": ""
    })
  }
  return new Promise(async resolve => {
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`request_algo 签名参数API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['status'] === 200) {
              $.token = data.data.result.tk;
              let enCryptMethodJDString = data.data.result.algo;
              console.log(enCryptMethodJDString);
              if (enCryptMethodJDString) $.enCryptMethodJD = new Function(`return ${enCryptMethodJDString}`)();
              console.log(`获取签名参数成功！`)
              console.log(`token: ${$.token}`)
            } else {
              console.log('request_algo 签名参数API请求失败:')
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function generateFp() {
  const str = "0123456789", rmStrLen = 3, rd = Math.random() * 10 | 0, fpLen = 16
  let rmStr = "", notStr = ""
  !((num, str) => {
    let strArr = str.split(""), res = []
    for (let i = 0; i < num; i++) {
      let rd = Math.random() * (strArr.length - 1) | 0
      res.push(strArr[rd])
      strArr.splice(rd, 1)
    }
    rmStr = res.join(""), notStr = strArr.join("")
  })(rmStrLen, str)

  return ((size, num) => {
    let u = size, u2 = (fpLen - rmStrLen - size.toString().length) - size, res = ""
    while (u--) res += num[Math.random() * num.length | 0]
    res += rmStr
    while (u2--) res += num[Math.random() * num.length | 0]
    res += size
    return res
  })(rd, notStr)
}
function getUrlData(url, name) {
  if (typeof URL !== "undefined") {
    let urls = new URL(url);
    let data = urls.searchParams.get(name);
    return data ? data : '';
  } else {
    const query = url.match(/\?.*/)[0].substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] === name) {
        // return pair[1];
        return vars[i].substr(vars[i].indexOf('=') + 1);
      }
    }
    return ''
  }
}
Date.prototype.Format = function (fmt) {
  var e,
      n = this, d = fmt, l = {
        "M+": n.getMonth() + 1,
        "d+": n.getDate(),
        "D+": n.getDate(),
        "h+": n.getHours(),
        "H+": n.getHours(),
        "m+": n.getMinutes(),
        "s+": n.getSeconds(),
        "w+": n.getDay(),
        "q+": Math.floor((n.getMonth() + 3) / 3),
        "S+": n.getMilliseconds()
      };
  /(y+)/i.test(d) && (d = d.replace(RegExp.$1, "".concat(n.getFullYear()).substr(4 - RegExp.$1.length)));
  for (var k in l) {
    if (new RegExp("(".concat(k, ")")).test(d)) {
      var t, a = "S+" === k ? "000" : "00";
      d = d.replace(RegExp.$1, 1 == RegExp.$1.length ? l[k] : ("".concat(a) + l[k]).substr("".concat(l[k]).length))
    }
  }
  return d;
}

function getCookieStr(unionId) {
  // let hash = getHash();
  // let hash = 122270672;
  let hash = 123;
  let uuid = new Date().getTime() + '' + parseInt(2147483647 * Math.random());
  // let lr = {
  //   ckJda: '__jda',
  //   ckJdb: '__jdb',
  //   ckJdc: '__jdc',
  //   ckJdv: '__jdv',
  //   ckJdaExp: 15552000000,
  //   ckJdbExp: 1800000,
  //   ckDomain: 'jd.com',
  //   ckJdvEmbeddedExp: 86400000,
  //   ckJdvExp: 1296000000,
  //   _mbaSidSeq: [],
  // };
  let shortTime = uuid.substr(0, 10);
  let k = 1;
  let j = 1;
  let __jda = [hash, uuid, shortTime, shortTime, shortTime, j].join('.');
  let __jdb = [hash, k, uuid + '|' + j, shortTime].join('.');
  let __jdc = hash;
  let __jdv = [
    hash,
    'kong',
    `t_${unionId}_`,
    'jingfen',
    uuidRandom(32),
    new Date().getTime(),
  ].join('|');
  let __jdu = uuid;
  let mba_muid = uuid;
  let MSid = new Date().getTime() + '' + parseInt(1e16 * Math.random());
  let mba_sid = MSid + k;
  // let strList = `__jda=${__jda}; __jdb=${__jdb}; __jdc=${__jdc}; __jdv=${__jdv}; __jdu=${__jdu}; mba_muid=${mba_muid}; mba_sid=${mba_sid}; `;
  // return strList;
  let strList = `__jda=${__jda};`;
  return strList;
}
function uuidRandom(e = 40) {
  let t = '0123456789abcde',
    a = t.length,
    n = '';
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
}

// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}