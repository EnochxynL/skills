# 安装

[VSCode网页版（本地版）连接（远程）Docker容器的SSH服务 - 知乎](https://zhuanlan.zhihu.com/p/666975429)

[Install code-server: OS Instructions for VS Code | code-server Docs](https://coder.com/docs/code-server/install#debian-ubuntu)

在Ubuntu系统下直接下载deb包即可

```bash
curl -fOL <https://github.com/coder/code-server/releases/download/v$VERSION/code-server_${VERSION}_amd64.deb>
sudo dpkg -i code-server_${VERSION}_amd64.deb
```

# 使用

## SSH转发方式

[Securely Access & Expose code-server | code-server Docs](https://coder.com/docs/code-server/guide#port-forwarding-via-ssh)

Code Server默认只监听`127.0.0.1`，所以如果要在局域网的其他电脑访问，需要使用SSH转发端口，以端口8080为例`ssh -N -L 8080:127.0.0.1:8080 wangshuai@2001:da8:9000:a837:557e:9352:c7b8:551c`

此时SSH只负责端口转发，因此输入密码后不会有反应，不会显示bash

在服务端，或者另一个SSH上执行`code-server`，它默认是监听服务端的回环地址`127.0.0.1`，经过SSH转发后变成客户端的回环地址，因此你可以直接通过`http://127.0.0.1:8080`访问

## 监听地址方式

[本地开发服务器在局域网内共享与访问指南-Golang-PHP中文网](https://www.php.cn/faq/1659715.html)

[如何搭建 Code-Server：将 VS Code 搬到浏览器在日常的编程工作中，我们通常使用 VS Code 作为主 - 掘金](https://juejin.cn/post/7469096829142073363)

上面的情况有两种可能

1. **Web 服务绑定在 `127.0.0.1`（IPv4 回环）或 `::1`（IPv6 回环）**，服务器有真实的 IPv6 地址（`2001:da8:...`），但 Code Server 服务默认不在那个地址上“监听”。
2. **防火墙阻止了从外部访问该端口**（即使服务已经监听了 `::` 或 `0.0.0.0`）

对于ipv4，使用`code-server --host 0.0.0.0`或`code-server --bind-addr 0.0.0.0:8080`

对于ipv6，使用`code-server --host ::`或`code-server --bind-addr :::8080`

根据我的试验，ipv6设置对ipv4也生效，但ipv4设置对ipv6不生效

## 长期运行

[【Linux】浏览器写代码！部署code-server远程vscode网页-CSDN博客](https://blog.csdn.net/muxuen/article/details/130334319)

可以修改`~/.config/code-server/config.yaml`的默认监听地址，下一次就可以直接运行`code-server`不带参数了。密码等其他配置也位于此，配置例如这样

```yaml
(base) wangshuai@m6-NF5468M6:~$ cat ~/.config/code-server/config.yaml
bind-addr: "[::]:8080"
auth: password
password: 初始密码是随机数，可以改成你喜欢的密码（这是明文存储）
cert: false
```

这时我们可以在systemctl中开启服务，让其长期运行了

```bash
sudo systemctl enable --now code-server@$USER
# Now visit <http://127.0.0.1:8080>. Your password is in ~/.config/code-server/config.yaml
```