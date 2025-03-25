# > 小红书
# 搜索页
http-response ^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v\d\/search\/(banner|hot)_list script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书搜索页, enable={xnhsuu_enable}
http-response ^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v\d\/search\/(hint|trending)\? script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书搜索页, enable={xnhsuu_enable}
http-response ^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v\d\/search\/notes\? script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书搜索页, enable={xnhsuu_enable}
# 开屏广告
http-response ^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v\d\/system_service\/config\? script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书开屏广告, enable={xnhsuu_enable}
http-response ^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v\d\/system_service\/splash_config script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书开屏广告, enable={xnhsuu_enable}
# 详情页,小部件
http-response ^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v\d\/note\/widgets script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书详情页, enable={xnhsuu_enable}
# 图片水印,视频水印
http-response ^https?:\/\/(edith|rec|www)\.xiaohongshu\.com\/api\/sns\/v\d\/note\/(imagefeed|live_photo\/save) script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书图片视频水印, enable={xnhsuu_enable}
http-response ^https?:\/\/(edith|rec|www)\.xiaohongshu\.com\/api\/sns\/v\d\/(followfeed|homefeed)\? script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书图片视频水印, enable={xnhsuu_enable}
http-response ^https?:\/\/(edith|rec|www)\.xiaohongshu\.com\/api\/sns\/(v2\/note\/feed|v3\/note\/videofeed)\? script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书图片视频水印, enable={xnhsuu_enable}
http-response ^https?:\/\/(edith|rec|www)\.xiaohongshu\.com\/api\/sns\/(v4\/note\/videofeed|v10\/note\/video\/save)\? script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书图片视频水印, enable={xnhsuu_enable}
# 评论区图片、live图水印，表情包下载
http-response ^https:\/\/edith\.xiaohongshu\.com\/api\/sns\/(v5\/note\/comment\/list|v3\/note\/comment\/sub_comments)\? script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书评论区去水印存储, enable={xnhsuu_enable}
http-response ^https:\/\/edith\.xiaohongshu\.com\/api\/sns\/v1\/interaction\/comment\/video\/download\? script-path=https://github.com/fmz200/wool_scripts/raw/main/Scripts/xiaohongshu/xiaohongshu.js, requires-body=true, timeout=60, tag=小红书评论区去水印下载, enable={xnhsuu_enable}