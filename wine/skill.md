---
name: wine
description: Use when running Windows applications on Linux via Wine — installing WineHQ, managing WINEPREFIX isolation, configuring winecfg (Windows version/graphics/drives), installing runtime libraries (MSVC/Mono/fonts) with Winetricks, and troubleshooting Chinese locale display issues.
metadata:
  hermes:
    tags:
      - wine
      - linux
      - windows-compatibility
      - winetricks
      - wineprefix
  related_skills:
    - ubuntu-24.04
---

# WineHQ — Linux 运行 Windows 程序

## Overview

Wine 是一个在 Linux/Unix 上运行 Windows 程序的兼容层，不是模拟器——它将 Windows API 调用实时翻译为 POSIX 调用。WineHQ 是官方构建版本，通常比发行版自带的 Wine 更新。

Wine 通过 **WINEPREFIX**（前缀/容器）模拟 Windows 运行环境。每个 prefix 是一个独立目录，内部有自己的 `drive_c`（C 盘）、注册表、已安装的 DLL 和字体。多个 prefix 之间完全隔离，互不干扰。默认前缀是 `~/.wine`，所有命令不加 `WINEPREFIX` 环境变量时都在此操作。

## When to Use

* 在 Ubuntu 上安装或升级 WineHQ 时
* 使用 Winetricks 安装运行库、字体、组件时
* 需要为不同程序创建隔离的 WINEPREFIX 时
* 调整 Windows 版本伪装、虚拟桌面、驱动器映射时
* Windows 程序中文显示为方块/乱码时
* 需要安装 MSVC 运行库或 .NET 运行时时

## 常规配置

### 安装 WineHQ

[如何在 Ubuntu 上安装和使用 Wine 11 - sysgeek](https://www.sysgeek.cn/ubuntu-wine/)

[Debian/Ubuntu · WineHQ 官方 Wiki](https://gitlab.winehq.org/wine/wine/-/wikis/Debian-Ubuntu)

按 WineHQ 官方 Wiki 添加源后安装，版本比系统自带的新。

### 安装 Winetricks

[Winetricks 完全指南：在 Linux 上轻松管理 Wine 环境 - geek-blogs](https://geek-blogs.com/blog/winetricks-linux/)

[Where is Winetricks? | Bottles](https://docs.usebottles.com/faq/where-is-winetricks)

[winetricks man page | Linux Command Library](https://linuxcommandlibrary.com/man/winetricks)

Winetricks 是 Wine 的辅助脚本，用于安装运行库、字体、组件到指定的 WINEPREFIX。

```bash
winetricks list          # 列出所有可用组件
winetricks list-download # 列出可下载的组件
```

### 卸载 32 位 Wine

[Linux软件包循环依赖解决 彻底删除i386架构 - CSDN](https://blog.csdn.net/qq_62344659/article/details/142220396)

[Linux软件包循环依赖解决 彻底删除i386架构 - 易微帮](https://www.ewbang.com/community/article/details/1000066632.html)

如果不需要运行 32 位程序，可移除 i386 架构以减少依赖。

## 可选配置

### Bottles（GUI 替代方案）

Bottles 是一个基于 Flatpak 的 Wine 前缀管理器，提供图形化界面管理 WINEPREFIX、Wine 版本切换、组件安装等。适合不想手敲命令的用户。

### Proton 系兼容层（游戏场景）

[ProtonUp-Qt](https://github.com/DavidoTek/ProtonUp-Qt)（Flatpak 中叫 ProtonPlus）是 Wine/Proton 版本管理器，可下载社区维护的兼容层。

Steam 游戏优先用 Proton（Valve 官方维护），非 Steam 游戏可通过 Bottles/Lutris 调用。社区版本如 **Proton GE**（集成媒体解码器补丁）、**dwproton**（集成 Dawn Winery 团队的日系/国产游戏修复 + dxvk-gplasync）对特定游戏兼容性更好。底层仍是 WINEPREFIX，用户不需手动管理——启动器自动创建、配置、安装依赖。

与 vanilla Wine 的关键区别：预置 DXVK/VKD3D、游戏专用补丁、无需手动 `WINEPREFIX=`；但 `winetricks` 组件仍需通过 GUI 按需安装（如 cjkfonts）。

## 手动环境管理

Wine 没有类似 `pyproject.toml` 或 `devcontainer.json` 的项目级配置文件，一切通过 WINEPREFIX 手动管理。核心操作模型：

```
WINEPREFIX (容器)
├── drive_c/          ← 模拟 C 盘
├── *.reg             ← 注册表（版本伪装等设置）
├── dosdevices/       ← 驱动器映射
└── 已安装组件         ← Mono、vcrun、cjkfonts 等
```

### 创建与管理 WINEPREFIX

每个 prefix 是独立的 Windows 环境。推荐为不同程序创建独立 prefix，避免 DLL 和注册表冲突。

[https://linuxcommandlibrary.com/man/winecfg](https://linuxcommandlibrary.com/man/winecfg)

```bash
# 创建并初始化（64位）
WINEPREFIX=~/my-prefix WINEARCH=win64 winecfg

# 创建 32 位 prefix（某些老程序必需）
WINEPREFIX=~/my-prefix WINEARCH=win32 wineboot

# 运行程序
WINEPREFIX=~/my-prefix wine /path/to/setup.exe
WINEPREFIX=~/my-prefix wine "C:\Program Files\App\app.exe"

# 删除 prefix
rm -rf ~/my-prefix
```

> `WINEARCH` 只在创建 prefix 时生效一次，之后不可更改。不指定时默认 win64。

### winecfg 设置

在指定 prefix 下运行 `winecfg` 打开配置面板。

#### Applications 标签页 — Windows 版本伪装
- 为全局或特定 .exe 设置不同的 Windows 版本（如 win7、win10）。部分程序需要伪装成旧版本才能正常运行。

```bash
# 命令行等效操作
wine reg add "HKCU\\Software\\Wine" /v Version /d win10
```

#### Graphics 标签页 — 显示设置：
- DPI 调整
- **模拟虚拟桌面**：将程序限制在固定尺寸窗口内（对改分辨率的游戏有用）
- 鼠标捕获、窗口装饰等

#### Drives 标签页 — 驱动器映射：
- 将 Linux 目录映射为 Windows 盘符。默认 `C:` → `drive_c`，`Z:` → `/`。可按需增减。

### Winetricks 组件安装

以下操作都发生在指定的 WINEPREFIX 内部，不影响其他 prefix。**创建 prefix 后，建议立即安装所需组件，再安装/运行目标程序。**

#### wine-mono（.NET 运行时）
Wine 运行 .NET 程序需要 Mono。新版 Wine 在创建 prefix 时会提示自动安装；如需手动安装 `WINEPREFIX=~/my-prefix wine-mono-installer`。

#### MSVC 运行库
许多 Windows 程序依赖 Visual C++ 运行库。常用版本从 `vcrun2005` 到 `vcrun2022`，不确定需要哪个时安装 `vcrun2019` 和 `vcrun2022` 覆盖大多数程序。

```bash
WINEPREFIX=~/my-prefix winetricks vcrun2022
```

#### 中文文字体与编码

[Ubuntu Wine 完整安装 + 中文优化 - 知乎](https://www.zhihu.com/tardis/zm/art/1987566928080937360?source_id=1005)

[快速解决 Ubuntu 中 Wine 程序中文显示为方块 - CSDN](https://blog.csdn.net/srz2017/article/details/132351631)

[100% 解决 Wine 中文乱码问题 - 博客园](https://www.cnblogs.com/chk141/p/12220299.html)

Wine 程序默认使用 gbk/gb2312 编码，而 Linux 没有原生支持这些编码的字体。

```bash
# 安装中文字体
WINEPREFIX=~/my-prefix winetricks cjkfonts

# 创建 prefix 时指定中文环境（推荐）
WINEARCH=win32 WINEPREFIX=~/my-prefix LC_ALL="zh_CN.UTF8" winecfg

# 运行程序时临时覆盖语言设置
env LANG=zh_CN.UTF-8 WINEPREFIX=~/my-prefix wine /path/to/program.exe
```

### 运行程序

实测《绝区零》等游戏，双击 .exe 即可运行。具体兼容性取决于 Wine 版本和程序本身。

性能调优环境变量（可选）：

```bash
WINEPREFIX=~/my-prefix WINEESYNC=1 WINEFSYNC=1 WINEDEBUG=-all wine app.exe
```

- `WINEESYNC=1` / `WINEFSYNC=1`：开启内核级同步，提升多线程程序性能
- `WINEDEBUG=-all`：关闭调试输出，减少终端日志

### 已知兼容性限制

Wine 运行在用户空间（Ring 3），无法模拟 Windows 内核（Ring 0），以下类型程序存在根本性限制：

**DRM 防篡改（Denuvo 等）：** DRM 检测到非标准 Windows 环境（Wine 的行为与真实 Windows 有细微差异）时可能拒绝运行。部分 Denuvo 游戏通过 Proton 可运行，但未必稳定，版本更新可能引入新的不兼容。

**内核级反作弊（Riot Vanguard、EAC、BattlEye）：** 这类系统在 Windows 上加载内核驱动来监控内存和进程。Wine 没有 Windows 内核，无法加载这些驱动。EAC 和 BattlEye 虽有 Linux 用户态客户端，但**需要游戏开发者手动开启 Proton 支持**——大部分竞技类网游（Valorant、Fortnite、PUBG、彩虹六号等）仍未放行。

**直接 syscall 调用：** 部分 DRM 绕过 Windows 库直接发起 syscall，syscall 号在 Wine 下与 Linux 原生 syscall 冲突，难以通用解决。

[Linux/Proton 反作弊兼容性矩阵与追踪](https://blog.hotdry.top/posts/2025/12/01/linux-proton-anticheat-compatibility-matrices/)

更实用的做法是在 [ProtonDB](https://www.protondb.com/) 和 [WineHQ AppDB](https://appdb.winehq.org/) 查询特定程序的兼容性报告。对于完全不兼容的程序，双系统 Windows 仍是唯一方案。

## Verification Checklist

* [ ] **Wine 已安装**

    ```bash
    wine --version
    ```
* [ ] **Winetricks 可用**

    ```bash
    winetricks --version
    ```
* [ ] **默认 prefix 可创建**

    ```bash
    winecfg
    ```
* [ ] **独立 prefix 可创建**

    ```bash
    WINEPREFIX=~/test-prefix WINEARCH=win64 winecfg
    rm -rf ~/test-prefix
    ```
* [ ] **中文显示正常**

    ```bash
    LC_ALL=zh_CN.UTF-8 winecfg   # 界面应显示中文而非方块
    ```
