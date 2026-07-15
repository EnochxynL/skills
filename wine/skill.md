---
name: wine
description: Use when running Windows applications on Linux via Wine — installing WineHQ, managing Wine prefixes, installing runtime libraries (MSVC/Mono/fonts) with Winetricks, and troubleshooting Chinese locale display issues.
metadata:
  hermes:
    tags:
      - wine
      - linux
      - windows-compatibility
      - winetricks
  related_skills:
    - ubuntu-24.04
    - msys2
---

# WineHQ — Linux 运行 Windows 程序

## Overview

Wine 是一个在 Linux/Unix 上运行 Windows 程序的兼容层，不是模拟器，而是将 Windows API 调用实时翻译为 POSIX 调用。WineHQ 是其官方构建版本，通常比发行版自带的 Wine 更新、兼容性更好。

## When to Use

* 在 Ubuntu 上安装或升级 WineHQ 时
* 使用 Winetricks 安装运行库、组件时
* 需要创建或管理独立的 WINEPREFIX 时
* Windows 程序中文显示为方块/乱码时
* 安装 MSVC/Mono/字体等依赖项时

## 常规配置

### 安装 WineHQ

[如何在 Ubuntu 上安装和使用 Wine 11 - sysgeek](https://www.sysgeek.cn/ubuntu-wine/)

[Debian/Ubuntu · WineHQ 官方 Wiki](https://gitlab.winehq.org/wine/wine/-/wikis/Debian-Ubuntu)

按 WineHQ 官方 Wiki 添加源后安装即可，版本比系统自带的新。

### 安装 Winetricks

[Winetricks 完全指南：在 Linux 上轻松管理 Wine 环境 - geek-blogs](https://geek-blogs.com/blog/winetricks-linux/)

[Where is Winetricks? | Bottles](https://docs.usebottles.com/faq/where-is-winetricks)

Winetricks 是 Wine 的辅助工具，用于安装运行库、字体、组件等。

## 可选配置

### 卸载 32 位 Wine

[Linux软件包循环依赖解决 彻底删除i386架构 更新软件源\_libsane-common-CSDN博客](https://blog.csdn.net/qq_62344659/article/details/142220396)

[Linux软件包循环依赖解决 彻底删除i386架构 更新软件源-易微帮](https://www.ewbang.com/community/article/details/1000066632.html)

### 安装 wine-mono

Wine 运行 .NET 程序需要 Mono 运行时。通过 Winetricks 或包管理器安装。

### 安装 MSVC 运行库

许多 Windows 程序依赖 Visual C++ 运行库。通过 Winetricks 安装 `vcrun` 系列组件。

### 安装中文字体

[Ubuntu Wine 完整安装 + 中文优化 - 知乎](https://www.zhihu.com/tardis/zm/art/1987566928080937360?source_id=1005)

[快速解决 Ubuntu 中 Wine 程序中文显示为方块 - CSDN](https://blog.csdn.net/srz2017/article/details/132351631)

[100% 解决 Wine 中文乱码问题 - 博客园](https://www.cnblogs.com/chk141/p/12220299.html)

Wine 中的程序默认使用 gbk 或 gb2312 编码，而 Linux 没有原生支持这些编码的字体，导致中文显示为方块或问号。

**安装中文字体：**

```bash
winetricks cjkfonts
```

**创建前缀时指定中文环境：**

```bash
WINEARCH=win32 WINEPREFIX=/home/user/wineprefix/mydir LC_ALL="zh_CN.UTF8" winecfg
```

**运行程序时临时覆盖语言设置：**

```bash
env LANG=zh_CN.UTF-8 wine /path/to/your/software.exe
```

## 运行

实测《绝区零》等游戏，双击 .exe 即可运行。具体兼容性取决于 Wine 版本和程序本身。

## Verification Checklist

* [ ] **Wine 已安装**

    ```bash
    wine --version
    ```
* [ ] **Winetricks 可用**

    ```bash
    winetricks --version
    ```
* [ ] **中文显示正常**

    ```bash
    # 运行 winecfg，界面应显示中文而非方块
    LC_ALL=zh_CN.UTF-8 winecfg
    ```
* [ ] **Wine Mono 已安装**

    ```bash
    wine uninstaller --list | grep Mono
    ```
