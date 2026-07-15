---
name: msys2
description: Use when working with MSYS2 on Windows — installing the MSYS2 environment, understanding mingw64/ucrt64/clang64 subsystems, installing build toolchains via pacman, and configuring terminal/VSCode/right-click menu integration.
metadata:
  hermes:
    tags:
      - msys2
      - mingw
      - windows
      - build-tools
      - gcc
      - pacman
  related_skills:
    - wine
---

# MSYS2 — Windows 原生编译环境

## Overview

MSYS2 是 Windows 上的类 Unix 编译环境，通过 pacman 包管理器安装 GCC/Clang 工具链，编译出的 .exe 程序不依赖任何模拟层，是 Windows 原生的。它与 Cygwin 的关键区别在于：MSYS2 的 mingw-w64 工具链产出的是纯 Windows 程序，不需要 cygwin.dll。

MSYS 终端本质上是一个 Windows 控制台窗口，提供 POSIX 路径模拟。Windows 原生的 .exe 程序完全可以在 MSYS 终端中运行，像在 cmd 或 PowerShell 中一样。

## When to Use

* 首次安装或配置 MSYS2 环境时
* 选择编译工具链（mingw64 / ucrt64 / clang64）时
* 通过 pacman 安装构建工具（base-devel、autotools、ntldd 等）时
* 配置 Windows Terminal、VS Code 或右键菜单集成时
* 需要为 C/C++ 项目搭建 Windows 原生编译环境时

## 常规配置

### 安装 MSYS2

MSYS2 通过官方安装包安装。安装完成后自动打开 UCRT64 终端。

### 查看初始安装的包

[git bash命令不够完善，想整合msys2该怎么办？ - CSDN](https://blog.csdn.net/liuruiaaa/article/details/149509995)

好习惯，安装后先查看默认安装的包

```bash
pacman -Qe
# base 2022.06-1
# filesystem 2025.05.08-2
# msys2-runtime 3.6.5-1
```

### 安装构建工具链

[MSYS2编译环境搭建 - 博客园](https://www.cnblogs.com/52fhy/p/15158765.html)

[MSYS2搭建编译环境 - freesion](https://www.freesion.com/article/46701287494/)

[MSYS2 使用指南 - 博客园](https://www.cnblogs.com/Undefined443/p/18993600)

以 UCRT64 为例，安装基本构建工具和 GCC 工具链

```bash
pacman -S base-devel                           # make 等基本构建工具
pacman -S mingw-w64-ucrt-x86_64-toolchain      # GCC 工具链（UCRT）
pacman -S mingw-w64-ucrt-x86_64-autotools      # autoconf/automake
```

三个工具链子系统的区别：

[MSYS2 mingw64、ucrt64、clang64 的区别 - 知乎](https://www.zhihu.com/question/463666011)

[MSYS2环境配置（ucrt64、mingw64、clang64） - CSDN](https://blog.csdn.net/old_power/article/details/148427307)

| 子系统 | 编译器 | C 运行时 | 推荐度 |
|---|---|---|---|
| **ucrt64** | GCC | UCRT | 官方推荐，UTF-8 支持最好 |
| mingw64 | GCC | MSVCRT | 传统选��，兼容老系统 |
| clang64 | Clang | UCRT | LLVM 生态用户首选 |

> 现在官方推荐优先使用 **ucrt64**，该环境已非常稳定，且对 UTF-8 语言环境支持更好。安装程序结束后自动运行的就是 UCRT 终端。

### 配置终端适配

[Terminals - MSYS2](https://www.msys2.org/docs/terminals/)

[Win10终端神器——Windows Terminal 与 MSYS2 MinGW64 集成记 | /dev/ttyS3 Blog](https://ttys3.dev/blog/windows-terminal-msys2-mingw64-setup)

### 配置 VS Code 适配

[MSYS2+VSCode：Windows下接近linux的C/C++编程环境搭建 - 知乎](https://zhuanlan.zhihu.com/p/1982834714722194966)

### 右键菜单集成

[使用msys2打造优雅的开发环境 - 飞鸿影 - 博客园](https://www.cnblogs.com/52fhy/p/15158765.html)

新建 `mingw64.reg`，双击导入即可：

```ini
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\Directory\Background\shell\mingw64]
@="MinGW64 Here"
"icon"="C:\\msys64\\mingw64.exe"

[HKEY_CLASSES_ROOT\Directory\Background\shell\mingw64\command]
@="C:\\msys64\\msys2_shell.cmd -mingw64 -here"
```

> 路径中的 `C:\\msys64\\` 需根据实际安装位置修改。

## 可选配置

### 安装打包用辅助工具

```bash
pacman -S mingw-w64-ucrt-x86_64-ntldd          # 依赖检测（打包发布用）
```

### 示例：RoboCup2D soccerwindow2 依赖

[Windows下编译linux程序，报错解决方案_linux_不吃鱼的小时喵-华为开发者空间](https://huaweicloud.csdn.net/653f89f58c4ad05cd82a9f3f.html)

很多 Ubuntu 下的依赖包在 MSYS2 下有对应，需要手动安装，例如 Boost 叫 `mingw-w64-ucrt-x86_64-boost` 。

## Verification Checklist

* [ ] **MSYS2 已安装**

    ```bash
    ls /mingw64/bin/gcc.exe
    ```
* [ ] **pacman 可更新**

    ```bash
    pacman -Syu
    ```
* [ ] **工具链可用**

    ```bash
    gcc --version
    g++ --version
    ```
* [ ] **make 可用**

    ```bash
    make --version
    ```
* [ ] **ntldd 可用**

    ```bash
    ntldd --version
    ```
