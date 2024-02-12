const $ = new Env('sycauth')

!(async () => {
  $.log('', `🔔 ${$.name}, 获取会话: 开始!`, '')
  


const auth = $request.headers["Authorization"];

  //$.log(`${$.name}`, `body: ${JSON.stringify($request.body)}`, '')

$.setjson(auth, 'woddev_auth')


  $.subt = '获取会话: 成功!'
})()
  .catch((e) => {
    $.subt = '获取会话: 失败!'
    $.desc = `原因: ${e}`
    $.log(`❌ ${$.name}, 获取会话: 失败! 原因: ${e}!`)
  })
  .finally(() => {
    $.msg($.name, $.subt, $.desc), $.log('', `🔔 ${$.name}, 获取会话: 结束!`, ''), $.done()
  })




