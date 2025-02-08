let url = $request.url;
let match = url.match(/access_token=([^&]+)/);

if (match) {
    let newToken = match[1];
    let oldToken = $prefs.valueForKey("kuqitoken");

    if (newToken !== oldToken) {
        $prefs.setValueForKey(newToken, "kuqitoken");
        console.log("🔹 新 access_token 已更新: " + newToken);
      
    } else {
        
    }
}

$done({});