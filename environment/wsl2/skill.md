---
name: wsl2
description: Use when setting up or troubleshooting WSL2 on Windows — installing WSL2 and Linux distributions via command line, managing distribution instances, understanding the registry model, and resolving common WSL2 pitfalls.
metadata:
  hermes:
    tags:
      - wsl2
      - wsl
      - windows
      - linux
      - ubuntu
---

# WSL2 — Windows 上的 Linux 子系统

## Overview

WSL2（Windows Subsystem for Linux 2）是 Windows 内置的 Linux 兼容层，运行完整的 Linux 内核。与虚拟机不同，WSL2 与 Windows 深度集成——文件系统互通、GUI 原生支持、GPU 直通、网络共享。每个 Linux 发行版通过"注册"机制被 Windows 管理，本质是注册表项 + ext4.vhdx 虚拟磁盘的组合。

核心概念：**平台与发行版分离**。WSL 平台是 Windows 的一项功能（通过 `wsl --install` 启用），发行版是注册到该平台上的实例。卸载发行版不会移除 WSL 平台本身。

## When to Use

* 在 Windows 上安装 WSL2 平台或注册 Linux 发行版时
* 通过命令行安装 Ubuntu 等发行版（脱离 Microsoft Store）时
* 管理 WSL 发行版实例（注册、注销、导出、导入）时
* 理解 WSL2 的注册表机制和文件系统结构时
* 卸载发行版或彻底移除 WSL 平台时
* 配置 WSL 代理、目录映射、换源时
* 解决 AppImage 运行、UDP 通信等 WSL2 特定问题时

## Common Install

### 应用商店安装 WSL2 并注册一个发行版

微软商店中的WSL发行版入口（如“Ubuntu”），本质上是一个**Appx应用包**——一个带有版本号的“安装器”。

- **商店安装入口与`wsl --install -d Ubuntu`是同一件事的两条路径**，底层都是从商店源下载相同的Appx包；
- **商店安装后，“安装入口”对于升级系统基本失去意义**——系统版本的大飞跃（如22.04→24.04）必须通过Linux内部命令`sudo do-release-upgrade`完成，商店更新只会更新安装器本身，不会动已有的ext4.vhdx；
- **新版商店已移除了Ubuntu 22.04等具体版本的独立条目**，只剩一个“Ubuntu”选项指向最新LTS，版本锁定能力完全丧失。

曾经在我使用命令行安装，并且回车的同时，Microsoft Store的Ubuntu 22.04.5 LTS条目的下载按钮自动变成了“正在下载”，看来msstore有自动发现已安装软件的能力。然而Ubuntu 22.04.5 LTS已下架，也就是说这样安装，msstore现在已经管不着了。

由于新版商店的安装入口只是一个空壳，且无法控制版本，因此只推荐使用命令行安装和卸载。

### 命令行安装 WSL2 并注册一个发行版

[解决wsl --update 下载慢，或者下载失败 - 清浅L - 博客园](https://www.cnblogs.com/liangluck/p/18889007)  
[如何在Windows11上安装WSL2的Ubuntu22.04（包括换源）win11安装wsl2 ubuntu22.04-CSDN博客](https://blog.csdn.net/syqkali/article/details/131524540)  
[如何优雅地在windows上玩ROS（一个紧致的解决方案） - 知乎](https://zhuanlan.zhihu.com/p/414874250)

[WSL2创建多实例--发行版管理工具wsl2distromanager使用 - 技术不支持 - 博客园](https://www.cnblogs.com/linkyip/p/15965570.html)  
[本文之后，再无ROS安装问题 | 10分钟在Windows搭建好ROS开发环境 - 知乎](https://zhuanlan.zhihu.com/p/542154124)  
[使用 WSL 运行 Linux GUI 应用 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/gui-apps)

[Install Ubuntu on WSL 2 - Ubuntu on WSL documentation](https://documentation.ubuntu.com/wsl/stable/howto/install-ubuntu-wsl2/)

- `wsl --list --online`可以查看所有可在线安装的发行版。
- `wsl --install`（管理员身份）安装WSL平台本身**并安装默认Ubuntu发行版**。
- `wsl --install -d Ubuntu-22.04`可以指定安装特定版本。
- `wsl --install --from-file <镜像文件路径>`，直接从发行商官网下载`.wsl`的tar格式镜像文件，通过这样的命令安装，完全脱离微软商店的控制。

执行后可能需要重启。

首次启动新安装的发行版时，系统会要求创建Unix用户名和密码。完成后即可开始使用。

- 计算机盘符挂载在`/mnt`下。开箱即用，图形界面原生支持，无需配置。
- 似乎连显卡驱动都装好了，`nvidia-smi`有效

#### 实际原理：①安装Windows的WSL功能

`wsl --install`执行的是**一次性**的Windows功能配置。

- 自动启用虚拟机平台（VirtualMachinePlatform），安装WSL内核组件和WSLg（Linux GUI应用支持）
- 并默认安装一个Ubuntu发行版（可通过`-d`更改）。

**本质**：这是向Windows操作系统添加一项内置功能（[类似开启.NET](http://xn--5pq93jl1kqv3a.net/) Framework或Hyper-V），而非安装一个普通软件。因此，卸载WSL平台需要使用`wsl --uninstall`，因为这是在要求Windows移除自己的一个功能组件。

#### 实际原理：②注册一个 WSL 发行版

当你通过`wsl --install`安装或从商店点击安装时，WSL会执行“注册”操作：

- 在注册表`HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Lxss`下创建唯一的配置项，记录发行版名称、文件系统路径、WSL版本等信息；
- 创建文件关联和启动入口（如开始菜单中的Ubuntu快捷方式）。

**本质**：是让Windows“认识”并管理一个Linux系统，与Docker的`register`概念类似。对于已有的 `.vhdx` 虚拟硬盘文件系统，命令是 `wsl --import-in-place` ，而 `wsl --register` 命令并不存在。

## Optional Configure

### 卸载WSL平台本身（彻底移除）

`wsl --uninstall`此命令完整卸载的是“WSL平台”这一Windows功能，而非某个具体发行版。

## Instance Manage

### 命令行卸载发行版

[WSL 发行版卸载 - 知乎](https://zhuanlan.zhihu.com/p/487091950)

[如何解决国内安装 wsl2 子系统，Ubuntu下载慢的问题_wsl下载ubuntu速度慢-CSDN博客](https://blog.csdn.net/qq401195092/article/details/133717025)[“wsl --install -d Ubuntu-22.04”下载慢，中国地区离线安装 Ubuntu 22.04 WSL方法（亲测2025年5月6日） - 技术栈](https://jishuzhan.net/article/1920068379826835457)[提取 Windows UWP 应用商店的安装包以供离线安装 | Dejavu's Blog](https://blog.dejavu.moe/posts/install-uwp-offline/)

注意！如果要删除发行版的命令不是`--uninstall`而是`--unregister`！我输错结果把我WSL核心和Hyper-V全给卸了！`wsl --unregister <发行版名>`执行的是**逆向注册**：

- 删除Lxss注册表项
- **自动删除关联的ext4.vhdx虚拟磁盘文件**——即那几GB的Linux文件系统和所有用户数据！

**注意**：如果你是通过商店安装的发行版，`--unregister`只删除了“大胃王的身体”（vhdx），但那个体积很小的Appx应用包（“外卖盒”）可能仍残留在系统中。

如需备份，先执行`wsl --export <发行版名> <备份路径.tar>`导出后再卸载

`wsl --unregister <发行版名称>`卸载特定发行版并删除数据：注销发行版的注册表配置，并**永久删除关联的ext4.vhdx虚拟磁盘文件及所有数据！（警告**：数据不可恢复**）**

- 如果是从商店安装的，`--unregister`仅删除WSL实例，Microsoft Store安装的Ubuntu Appx包仍可能存在。下面有一种方法用命令行清理，当然，直接在“设置”中卸载更方便
  
  ```powershell
  # 查看所有Ubuntu相关Appx包
  Get-AppxPackage -AllUsers | Where-Object {$_.Name -like "*Ubuntu*"}
  
  # 卸载指定的Appx包
  Get-AppxPackage <包全名> | Remove-AppxPackage
  ```

### 列出初始安装的包

- 下面是Ubuntu 24.04默认安装的包。可能会有些许变化。
  
  ```bash
  enoch@DESKTOP-FLOWX13:/mnt/c/Users/enoch$ apt-mark showmanual
  base-files
  bash
  bsdutils
  coreutils
  dash
  debianutils
  diffutils
  findutils
  grep
  gzip
  hostname
  init
  libattr1
  login
  ncurses-base
  ncurses-bin
  ubuntu-minimal
  ubuntu-wsl
  util-linux
  ```

### 快捷运行

可以进入终端直接执行wsl的程序

```bash
wsl echo "Hello from Linux"
```

### 代理

[为 WSL2 一键设置代理 - 知乎](https://zhuanlan.zhihu.com/p/153124468)

### 目录适配

[Windows10内置Linux子系统（WSL）路径转换 - 雨水的命运 - 博客园](https://www.cnblogs.com/RainFate/p/16821186.html#_label2)

### 网络适配

[Networking | Docker Docs](https://docs.docker.com/desktop/features/networking/#use-cases-and-workarounds)

若容器内curl显示Failed to connect to host.podman.internal port 8000: Connection refused

容器内ping得host.docker.internal实际指向ip为10.255.255.254 宿主内ipconfig得Ethernet adapter vEthernet (WSL (Hyper-V firewall))的ip为172.24.0.1[How to fix WSL X11 Forwarding after Windows Update to 23H2 - Super User](https://superuser.com/questions/1846917/how-to-fix-wsl-x11-forwarding-after-windows-update-to-23h2)[Ubuntu-WSL2一键设置代理操作_10.255.255.254-CSDN博客](https://blog.csdn.net/qq_32939413/article/details/142628273)[(7 封私信) docker compose中的容器如何访问主机服务 - 知乎](https://zhuanlan.zhihu.com/p/444263754)

host.docker.internal域名解析错误，或数据没有转发。手动改成正确的IP。 [Podman container on Windows cannot access host by ip or dns. Linux and Mac OS do not have this issue. · Issue #13966 · containers/podman](https://github.com/containers/podman/issues/13966)[🐳 令人头疼的 docker 代理问题，我整理了解决方法和验证方案 | 阿森毛不多](https://www.assen.top/blog/2024-10-12-docker-proxy)[Connection refused on host.docker.internal - Docker Desktop - Docker Community Forums](https://forums.docker.com/t/connection-refused-on-host-docker-internal/136925)[Connection refused on docker container - Stack Overflow](https://stackoverflow.com/questions/36813690/connection-refused-on-docker-container)[Unable to connect to host service from inside Docker container - Docker Engine / Compose - Docker Community Forums](https://forums.docker.com/t/unable-to-connect-to-host-service-from-inside-docker-container/145749/4)[docker - Podman containers refuses connections to host.containers.internal - Stack Overflow](https://stackoverflow.com/questions/79596879/podman-containers-refuses-connections-to-host-containers-internal)[macos - Why am I getting "Connection Refused" when using "host.docker.internal" to hit the host's localhost? - Super User](https://superuser.com/questions/1743261/why-am-i-getting-connection-refused-when-using-host-docker-internal-to-hit-t)

以X11服务为例，把export DISPLAY=172.24.0.1:0.0即可正常转发

### 换源、基本依赖

## Common Pitfalls

### AppImage 支持
[appimage 错误dlopen(): error loading libfuse.so.2-CSDN博客](https://blog.csdn.net/qq_45677678/article/details/129855453)

运行appimage需要libfuse2

### UDP支持

[Windows主机无法从WSL-2来宾接收UDP数据包。-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/ask/sof/107189745)

WSL对UDP的支持不太好，默认只能单边通信！

## Verification Checklist

* [ ] **WSL 平台已安装**

    ```powershell
    wsl --version
    ```

* [ ] **发行版已注册并可进入**

    ```powershell
    wsl --list --verbose
    wsl
    ```

* [ ] **GUI 应用支持正常**

    ```bash
    nautilus --version
    ```

* [ ] **GPU 直通可用**

    ```bash
    nvidia-smi
    ```
