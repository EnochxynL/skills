# 安装

[一个比 tmux 更友好的终端复用工具：Zellij 简介及使用技巧 ｜ 少数派会员 π+Prime](https://sspai.com/prime/story/get-started-with-zellij)

[通过 SSH 进行远程开发 - VSCode 编辑器](https://vscode.js.cn/docs/remote/ssh-tutorial)

## 服务端安装sshd

大多数linux发行版都预装了

## 服务端X11支持

[通过vscode + VcXsrv(or XMing) 来解决通过Remote -ssh连接到服务器无法显示GUI图像的问题_vscode vcxsrv-CSDN博客](https://blog.csdn.net/beginner_921/article/details/142493855)  
[vscode 远程(隧道/ssh) remote 开发 linux 显示远程桌面GUI 配置 SSH X11 服务 - Bubgit - 博客园](https://www.cnblogs.com/Bubgit/p/18829192)

[VScode配置X11转发！让你彻底摆脱显示屏！！！ - SkyXZ - 博客园](https://www.cnblogs.com/SkyXZ/p/18687026)

查看一下`cat /etc/ssh/sshd_config`这个文件，看看有没有`X11Forwarding yes`如果没有就加上

## 客户端X11支持

Windows用户下载安装x11srv，开始菜单中打开XLaunch 注意勾选Disable access control，其他选项不变，于是会有一个小图标在右下角托盘 鼠标移上去就会看到X客户端地址，例如我的电脑叫Cirno-Baka，就会显示Cirno-Baka:0.0

## 后台tmux支持

`sudo apt install tmux`

# 使用

## 连接

[SSH指定登录用户方法-CSDN博客](https://blog.csdn.net/cyl937/article/details/44203759)

[如何在 Linux 上通过 ssh 到 IPv6 地址](https://cn.console-linux.com/?p=10800)

在同一个局域网，至少同一个手机热点下。@前面是用户名，@后面是IP地址或计算机名

`ssh -X mowen@mowen-default-string`

`ssh -X wangshuai@172.17.27.100`

`ssh -X wangshuai@2001:da8:9000:a837:557e:9352:c7b8:551c`

输入密码，按道理就会显示bash界面了

[linux查看ssh当前访问的ip地址 - 一个小bu⑥ - 博客园](https://www.cnblogs.com/peijyStudy/p/18042909)

输入`ip addr`可以查看服务端的IP，输入`netstat -anp | grep :22 | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n`可以查看客户端的IP

`-X`是对于需要图形界面的情况使用的，当某些程序（如Java GUI和3D渲染）使用`-X`失败时，可以用`-Y`绕过部分安全检查，完全信任远程X客户端——仅在内网可信环境中使用！

## 后台tmux执行程序

[使用vscode远程服务器，让代码在vscode关闭后也在服务器后台运行_vscode连接服务器运行代码-CSDN博客](https://blog.csdn.net/weixin_45921929/article/details/131152042)

[ssh连接服务器跑程序神奇：tmux基础用法汇总 - 知乎](https://zhuanlan.zhihu.com/p/502849979)

[Linux 后台运行：掌握 nohup、tmux 和 screen | 文档中心](https://docs.infini-ai.com/posts/run-process-background.html)

[深度学习实验管理 -- tmux的使用 - 知乎](https://zhuanlan.zhihu.com/p/1924243949188515297)

[tmux常用命令及快捷方式 - 知乎](https://zhuanlan.zhihu.com/p/90464490)

三种方法，nohup tmux screen，nohup过于简单，tmux易于管理，是screen的后继替代品

- 新建一个后台会话`tmux new -s XYN`
- 用组合键断开会话：`Ctrl+B D`（1）先按一下Ctrl+B（这时不会有任何反应）；（2）再按一下D
- 回来后，显示你的所有会话`tmux ls`
- 重新连接会话`tmux a -t XYN`
- 一个会话内还可以创建多个窗口，使用`Ctrl+B C`
- 一个窗口内还可以划分多个面板，上下`Ctrl+B “`，左右`Ctrl+B %`，注意要按Shift才能打出标点符号
- 列出所有会话、窗口、面板，选择跳转`Ctrl+B S`，按esc可返回
- 每个窗口、会话、面板，都像bash一样，输入`exit`即可退出（删除）

## Linux客户端X11使用

[如何在 Linux 中使用 SSH 配置 X11 转发](https://cn.linux-terminal.com/?p=4775)

[将远程Wayland应用窗口转发到本地 - 星外之神的博客](https://wszqkzqk.github.io/2025/10/13/GUI-With-Remote-Headless-Wayland-Linux/)

[配置X11Forward显示远程图形界面 | RickyYel](https://blog.rickyyel.org/learn/configure-X11Forward-to-display-remote-GUI)

Linux端通常不用额外配置X11客户端地址，且客户端是X11或Wayland时都可以使用，但要特别注意需要`-X`参数，否则直接`Can't open display`。目前没有碰到过需要`-Y的`情况

可以查看`echo $DISPLAY`，发现是`m6-NF5468M6:10.0`，原因是sshd会自动将你的会话环境变量 `DISPLAY` 设置为 `localhost:10.0`（或者:11.0, :12.0 …，通常从 10 开始）。

这种情况下手动设置`export DISPLAY=172.29.18.30:0`反而不行，不知道为什么

## Window客户端X11使用

[(54 封私信 / 80 条消息) 从Windows远程显示Linux图形程序：SSH X11转发完整指南 - 知乎](https://zhuanlan.zhihu.com/p/27155499043)

[VScode远程连接Docker容器实现X11转发 - Z时代](https://utcz.com/a/75968.html)

我本以为直接按计算机名连就行，例如我的电脑名字叫Cirno-Baka，就`export DISPLAY=Cirno-Baka:0.0`，但是**不行**（之后再考虑为什么）

于是打开ipconfig或ip addr查看自己真实的IP地址，不过有种更便捷的方法，在SSH终端直接查看“客户端”的IP

[linux查看ssh当前访问的ip地址 - 一个小bu⑥ - 博客园](https://www.cnblogs.com/peijyStudy/p/18042909)

`netstat -anp | grep :22 | grep ESTABLISHED | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n`

然后输进去`export DISPLAY=172.20.10.7:0.0`。开一个图形画面`pcmanfm`试试看吧