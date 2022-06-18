DOMAIN#

完全匹配域名。

DOMAIN-SUFFIX#

匹配域名后缀，例如 DOMAIN-SUFFIX,google.com 匹配 google.com 和 www.google.com。

DOMAIN-KEYWORD#

关键词匹配域名。

GEOIP#

通过 MaxMind GeoIP 匹配国家代码，比如 CN，可以添加 no-resolve 避免触发 DNS 解析。

IP-CIDR / IP-CIDR6#

IP CIDR 范围，可以添加 no-resolve 避免触发 DNS 解析。

DST-PORT#

目标端口。

RULE-SET#

规则集合，请参考规则集合。

rule-providers:
  proxy-domain:
    behavior: domain # 使用 domain 类规则集，可以使匹配更高效
    url: https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt
    interval: 86400
rules:
  - RULE-SET,proxy-domain,Proxy



