#!name = zxnw
#!desc = zxnw
#!date = 2024-10-25 15:16:38
#!tag = chen

[Script]

http-response ^https:\/\/w\.csgmall\.com\.cn\/gateway$ script-path=https://raw.githubusercontent.com/chneez/qx/refs/heads/main/loon/zxnw.js, requires-body=true, timeout=10, tag=zxnw

[MITM]
hostname = w.csgmall.com.cn