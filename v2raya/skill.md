
## 常规配置

[Debian / Ubuntu - v2rayA](https://v2raya.org/en/docs/prologue/installation/debian/)

### 从 deb 文件安装

[[Bug]: 更新 xray core 到最新版 v26.1.31 后报错 · Issue #8736 · 2dust/v2rayN](https://github.com/2dust/v2rayN/issues/8736)

由于最新仓库使用的是 xray 而非 v2ray 而我的服务商没有更新对 xray 的相关适配，因此下载旧版 deb 包手动安装。到 `https://github.com/v2rayA/v2raya-apt/tree/master/pool/main/v` 下载稳定版的 deb 包吧。

注意，`v2raya` 和 `v2ray` 都要安装，它们彼此是前后端的关系。

### 从软件源安装

[ubuntu仓库公钥过期 · v2rayA/v2rayA · Discussion #1745](https://github.com/v2rayA/v2rayA/discussions/1745)、

[daeuniverse.pages.dev](https://daeuniverse.pages.dev/)

### 开机自启为服务

`sudo systemctl enable v2raya.service`

## 可选配置

### WSL和局域网适配

[v2rayA 局域网共享 | 昌南魔法学院](https://www.v2raya.net/manual/intranet-sharing.html)

[WSL 2 通过 Windows V2RayN 代理上网权威指南 (2025版) | 逐梦](https://0xdadream.github.io/2025/06/29/wsl-2-tong-guo-windows-v2rayn-dai-li-shang-wang-quan-wei-zhi-nan-2025-ban/)

[WSL2 - 配置 Windows v2ray 代理指南 (学习用途) - 致橡树 / Oak](https://www.xxywithpq.cn/archives/1762936827947)

虽然这么说，但最后我还是独立安装了V2RayA，毕竟万一是服务器呢，我总要学会在无图形界面配置的

[linux上无图形界面的代理配置 - Colin404](https://colin404.com/posts/6c8fe101be60460aab05913129abec85/)

## 工具使用

### 命令行参数

[v2raya 开启 ipv6 支持 | Last Blog](https://blog.imlast.top/2023/08/18/v2raya-%E5%BC%80%E5%90%AF-ipv6-%E6%94%AF%E6%8C%81/)

[环境变量和命令行参数 - v2rayA](https://v2raya.org/docs/manual/variable-argument/)

在Windows中可以找services.msc找到相关服务。

`$env:HTTP_PROXY = "http://127.0.0.1:7897"`

### 服务商推荐

[Hax 免费 IPv6 only VPS | Tony's Blog](https://blog.iamsjy.com/2022/01/08/hax-free-ipv6-only-vps/)

[Hax:“永久免费”纯ipv6服务器注册、抢机、评测及部署节点全攻略 | 饭奇骏的博](https://fkjun.com/p/haxvps/)

[发现一个带 ipv6 节点的机场 - V2EX](https://www.v2ex.com/t/955566)

[哪里有ipv6的机场，不限流量最好，一个朋友需要-美国VPS综合讨论-全球主机交流论坛 - Powered by Discuz!](https://hostloc.com/thread-1285603-1-1.html)

对于ipv6，只要服务器机场支持就行，其实观察服务器地址就可以看出，v2rayA默认是开启了ipv6支持的。推荐机场：垃圾场

官网最新跳转地址：

```
垃圾场： https://goljc.cc/go?ljc
垃圾场Pro： https://goljc.cc/go?pro
ipv6boy： https://goljc.cc/go?v6b
https://my.ljcjsq.com/index.php#/register?code=LvPpeLVu
https://my.ipv6boy.com/index.php#/register?code=dzFllSvB
https://my.ipv6boy.com/index.php#/register?code=nNdMM3zS
```

我自己的邀请码： `https://my.1984080.xyz/index.php#/register?code=ee4I1kBK`

## Common Pitfalls

[Clash for Windows 使用教程 | 开源客户端订阅教程](https://airdocs.gitbook.io/generic/windows/clash)

[[咨询]关于不退出客户端的情况下（关闭代理/断开连接）的可行性 · Issue #4595 · 2dust/v2rayN](https://github.com/2dust/v2rayN/issues/4595)

[v2rayN_An existing connection was forcibly closed by the remote host. - 开发调优 - LINUX DO](https://linux.do/t/topic/113689)
