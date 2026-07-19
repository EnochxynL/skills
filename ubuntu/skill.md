---
name: ubuntu
description: Ubuntu 24.04 (Lubuntu/Kubuntu) setup and configuration — apt sources, NVIDIA drivers, Fcitx5 Chinese input, Bluetooth dual-boot sync, auto-mount disks, KDE locale, development toolchain installation.
metadata:
  hermes:
    tags:
      - ubuntu
      - linux
      - setup
      - apt
      - nvidia
      - fcitx
      - kde
      - bluetooth
      - disk-mount
  related_skills:
    - wine
---

# Ubuntu 24.04 — 系统安装与配置

## Overview

Ubuntu 24.04 (Lubuntu/Kubuntu) 从安装到开发环境的完整配置指南。覆盖 apt 换源、NVIDIA 驱动、Fcitx5 中文输入法、Windows 双系统蓝牙同步、自动挂载磁盘、KDE 语言环境，以及日常开发工具链的安装。

## When to Use

* 在新机器上初始化或配置 Ubuntu 24.04 系统时
* 需要更换 apt 软件源或添加第三方源时
* 安装/修复 NVIDIA 驱动时
* 配置中文输入法（Fcitx5）时
* 双系统蓝牙设备配对同步时
* 设置开机自动挂载磁盘时
* 安装 Python/Node.js 等开发工具链时

## Common Install

[Index of /ubuntu-cdimage/lubuntu/releases/24.04/release/ | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/ubuntu-cdimage/lubuntu/releases/24.04/release/)

### 换源

[Ubuntu 22.04/24.04 LTS 用 sed 快速换国内源 - 讲文张字 - 博客园](https://www.cnblogs.com/zhangwencheng/p/18472769)

[添加/删除用于测试更新的 Ubuntu“建议”存储库](https://cn.linux-terminal.com/?p=8530)

[Index of /ubuntu-ports/pool/universe/s/software-properties/](https://mirror.fi.ossplanet.net/ubuntu-ports/pool/universe/s/software-properties/)

[在Kubuntu中安装额外的驱动程序 drivers - Dev59](https://dev59.com/askubuntu/uUTGoIgBc1ULPQZFj26p)

如果安装时选中国（上海）时区，源会自动设为 `cn.archive.ubuntu.com`，通常路由到清华大学镜像，无需手动换源（云服务器/WSL 仍需手动）。

**手动换源**：编辑 `/etc/apt/sources.list.d/ubuntu.sources`，将 `URIs` 行的 `http://archive.ubuntu.com/ubuntu/` 改为 `http://cn.archive.ubuntu.com/ubuntu/`。

示例配置片段：

```yaml
Types: deb
URIs: http://cn.archive.ubuntu.com/ubuntu/
Suites: noble noble-updates noble-backports
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: http://security.ubuntu.com/ubuntu/
Suites: noble-security
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
```

等价于图形化操作：`software-properties-gtk`或`software-properties-qt`

### 驱动程序

如果黑屏或 nouveau 报错，则启动时在 GRUB 菜单选择 **Advanced options for Ubuntu** → 带 **(recovery mode)** 的内核 → 选择 **root** 进入终端，联网后执行命令。否则，正常启动执行命令即可：

```bash
nvidia-smi # 检查显卡
ubuntu-drivers devices # 检查驱动
sudo ubuntu-drivers autoinstall # 自动安装推荐驱动
```

等价于图形化操作：`kubuntu-driver-manager`

[ubuntu22.04安装Nvidia显卡驱动之后无法上网问题记录 - 知乎](https://zhuanlan.zhihu.com/p/1933076829876523734)

请务必`sudo apt upgrade`！否则内核更新后其他包未更新，会导致上网问题。如果问题已经出现，重启到 **Advanced options for Ubuntu** → 旧版内核 来联网，执行`sudo apt upgrade`

### 包管理器

[Nala - 功能丰富的 APT 命令行前端](https://cn.linux-terminal.com/?p=4419)

查看手动安装的包列表（建议刚安装系统时记录下已存在的包）：

```bash
apt-mark showmanual
```

推荐安装支持历史记录的 apt 前端 nala：

```bash
sudo apt install nala
```

### Windows时间同步

```bash
sudo timedatectl set-local-rtc 1
```

### Fcitx5中文输入法

[Using Fcitx 5 on Wayland - Fcitx](https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland#KDE_Plasma)

```bash
sudo apt update
sudo apt install $(check-language-support -l zh-hans)
```

还需要在`~/.config/fcitx5/profile`添加配置，示例配置片段：

```ini
[Groups/0]
# Group Name
Name=Default
# Layout
Default Layout=us
# Default Input Method
DefaultIM=pinyin

[Groups/0/Items/0]
# Name
Name=keyboard-us
# Layout
Layout=

[Groups/0/Items/1]
# Name
Name=pinyin
# Layout
Layout=

[GroupOrder]
0=Default


```

这等价于`fcitx5-configtool`中窗口右下角【添加输入法】、选择【Pinyin】、右下角【添加】

在Wayland可能无法使用：提醒用户在“系统设置”中找到“虚拟键盘”，从None切换到Fcitx 5，注销后重新登录即可使用

## Optional Configure

### 移除snap

由于依赖关系限制，建议手动使用`snap list`尝试挨个卸载。对于Ubuntu Studio 24.04，是这样的

```bash
sudo snap remove firefox
sudo snap remove thunderbird
sudo snap remove gnome-42-2204
sudo snap remove gnome-46-2404
sudo snap remove freeshow
sudo snap remove mesa-2404
sudo snap remove gtk-common-themes
sudo snap remove bare
sudo snap remove snapd-desktop-integration
sudo snap remove firmware-updater
sudo snap remove core22
sudo snap remove core24
sudo snap remove snapd
sudo nala remove snapd
```

### Windows蓝牙同步

[Ubuntu 22.04 解决和 Windows 共享蓝牙设备的问题 - Ofnoname - 博客园](https://www.cnblogs.com/ofnoname/p/18146776)

[Windows和Linux双系统蓝牙同步问题 - LukaOwO的个人博客 - 编程笔记&软件教程](https://blog.luka-owo.com/archives/windowshe-linuxshuang-xi-tong-lan-ya-tong-bu-wen-ti)

[dual boot - Installing bt-dualboot - Ask Ubuntu](https://askubuntu.com/questions/1558923/installing-bt-dualboot)

[Windows/Linux双系统共享蓝牙设备 - Dylan's Blog](https://du33169.tech/posts/notes/bluetoothdualpairing/)

本步骤需要用户配合重新启动，相关信息由用户手动提供

1. 在 Ubuntu 下配对并连接蓝牙设备。
2. 重启进入 Windows，重新配对连接该设备。
3. 在 Windows 中打开注册表编辑器，找到蓝牙设备键值，记下其配置（主要是配对密钥）。
4. 多数设备：重启回 Ubuntu，修改 `/var/lib/bluetooth/<适配器MAC>/<设备MAC>/info` 中的密钥为 Windows 下的值。
5. 特殊设备（低功耗设备）：有额外的`[IdentityResolvingKey]`、`[LongTermKey]`等多项字段匹配
6. 特殊设备（如更换 MAC 地址的鼠标）：每次重连后设备 MAC 变化，需要将旧文件夹重命名为新 MAC。

### 自动挂载

[Linux挂载新硬盘并设置开机自动挂载 - 知乎](https://zhuanlan.zhihu.com/p/683152942)

让用户选择是否执行步骤。

* 先用 `blkid` 获取正确 UUID。例如`UUID=48AEF791AEF77632`
* 在 `/etc/fstab` 中添加一行，按照“UUID、挂载点、挂载参数、是否备份、是否开机检查”格式挂载，例如：

```
UUID=48AEF791AEF77632 /media/enoch/DISK ntfs defaults 0 2
```

### KDE中文显示

[kreadconfig5 man | Linux Command Library](https://linuxcommandlibrary.com/man/kreadconfig5)

[kwriteconfig5 man | Linux Command Library](https://linuxcommandlibrary.com/man/kwriteconfig5)

读取配置

```bash
kreadconfig5 --file plasma-localerc --group Formats --key LANG # 基础语言环境
kreadconfig5 --file plasma-localerc --group Translations --key LANGUAGE # 翻译显示语言
```

写入配置

```bash
kwriteconfig5 --file plasma-localerc --group Translations --key LANGUAGE zh_CN:en_US
```

等价于图形化操作：`systemsettings5 kcm_translations`设置显示语言为中文，窗口右下角【添加语言】、选择【简体中文】、下方【添加】，适当排序，关闭窗口，注销后重新登录（或者重启）

### PCManFM文件管理器

```bash
sudo apt install --no-install-recommends pcmanfm-qt # --no-install-recommends 防止把整个 lxqt 安装。可用 nala 替代命令。
```

### 常用软件源

* pacstall源：[Chaotic PPR | Pacstall](https://ppr.pacstall.dev/)
* daeuniverse源：[daeuniverse.pages.dev](https://daeuniverse.pages.dev/)
* rizin源：[Install package home:RizinOrg / rizin](https://software.opensuse.org/download/package?package=rizin\&project=home%3ARizinOrg)
* Linux Uprising源：[Extra Ubuntu / Linux Mint Applications : “Linux Uprising” team](https://launchpad.net/~linuxuprising/+archive/ubuntu/apps/+index)
* ROS2源：[Ros2 | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirror.tuna.tsinghua.edu.cn/help/ros2/) [Ubuntu (deb packages) — ROS 2 Documentation: Jazzy documentation](https://docs.ros.org/en/jazzy/Installation/Ubuntu-Install-Debs.html)
* WineHQ源：[Wine Builds | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirror.tuna.tsinghua.edu.cn/help/wine-builds/) [Debian/Ubuntu · Wiki · wine / wine · GitLab](https://gitlab.winehq.org/wine/wine/-/wikis/Debian-Ubuntu)
* NodeSource源：[Repository Manual Installation · nodesource/distributions Wiki](https://github.com/nodesource/distributions/wiki/Repository-Manual-Installation)

## Verification Checklist

* [ ] **apt 源已配置**

    ```bash
    cat /etc/apt/sources.list.d/ubuntu.sources
    ```
* [ ] **NVIDIA 驱动正常**

    ```bash
    nvidia-smi
    ```
* [ ] **nala 已安装**

    ```bash
    nala --version
    ```
* [ ] **中文输入法可用**

    ```bash
    fcitx5 --version
    ```
* [ ] **Windows 时间同步已设置**

    ```bash
    timedatectl | grep "RTC in local TZ"
    ```
* [ ] **uv 已安装**

    ```bash
    uv --version
    ```
* [ ] **pnpm 已安装**

    ```bash
    pnpm --version
    ```
* [ ] **KDE 语言环境正确**

    ```bash
    kreadconfig5 --file plasma-localerc --group Translations --key LANGUAGE
    ```
