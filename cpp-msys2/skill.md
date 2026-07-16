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

### 安装依赖库

[Windows下编译linux程序，报错解决方案_linux_不吃鱼的小时喵-华为开发者空间](https://huaweicloud.csdn.net/653f89f58c4ad05cd82a9f3f.html)

很多 Ubuntu 下的依赖包在 MSYS2 下有对应，需要手动安装，例如 Boost 叫 `mingw-w64-ucrt-x86_64-boost` 。

### pacman 常用包速查

[MSYS2 常用命令 - 腾讯云](https://cloud.tencent.cn/developer/article/2544149)

[FreeCAD Compile on MinGW](https://wiki.freecad.org/Compile_on_MinGW/tr)

[Build preparations for Windows (MSYS2) - C47 Wiki](https://gitlab.com/h2x/c47-wiki/-/wikis/Build-preparations-for-Windows)

核心开发包（以 UCRT64 为例）：

```bash
# 基础构建工具
pacman -S --needed base-devel git make wget zip unzip tar patch

# CMake + Ninja（推荐组合）
pacman -S mingw-w64-ucrt-x86_64-cmake
pacman -S mingw-w64-ucrt-x86_64-ninja

# Python 工具链
pacman -S mingw-w64-ucrt-x86_64-python
pacman -S mingw-w64-ucrt-x86_64-python-pip
pacman -S mingw-w64-ucrt-x86_64-python-wheel

# 交叉编译 / 多架构支持
pacman -S mingw-w64-ucrt-x86_64-gdb-multiarch
```

包名规律：通用工具不带 `python-` 前缀（如 ninja、cython），Python 绑定库带 `python-` 前缀（如 meson-python、sphinx）。

## 全局管理

MSYS2 没有 pyenv/uv 那样的版本管理器——每个子系统（ucrt64/mingw64/clang64）内 pacman 只保留一个 GCC 版本。多版本共存靠手动策略，CMake 生成器靠显式指定。

### 对接 CMake 构建系统

[MSYS2 - Using CMake in MSYS2](https://www.msys2.org/docs/cmake/#examples)

[msys2-toolchain - GitHub](https://github.com/nathanjhood/msys2-toolchain)

**始终显式指定 `-G`**，不要依赖默认值：

| 场景 | 生成器 | 说明 |
|---|---|---|
| 日常开发 | `-G Ninja` | MSYS2 推荐，快且少出错 |
| GNU Make 工作流 | `-G "MSYS Makefiles"` | 用 MSYS2 的 make |
| 纯 Windows 构建 | `-G "MinGW Makefiles"` | 用 mingw32-make |

```bash
cmake -G Ninja <source-dir> -DCMAKE_BUILD_TYPE=Release
cmake --build .
```

**锁定工具链**：创建 toolchain 文件确保可复现构建，而非依赖环境 PATH：

```cmake
# toolchain_ucrt64.cmake
set(TOOLCHAIN_DIR "C:/msys64/ucrt64")
set(CMAKE_C_COMPILER   ${TOOLCHAIN_DIR}/bin/gcc.exe)
set(CMAKE_CXX_COMPILER ${TOOLCHAIN_DIR}/bin/g++.exe)
set(CMAKE_AR           ${TOOLCHAIN_DIR}/bin/gcc-ar.exe)
set(CMAKE_RC_COMPILER  ${TOOLCHAIN_DIR}/bin/windres.exe)
set(CMAKE_FIND_ROOT_PATH ${TOOLCHAIN_DIR})
set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
```

用法：

```bash
cmake -DCMAKE_TOOLCHAIN_FILE=toolchain_ucrt64.cmake -G Ninja <source-dir>
```

### 对接 Meson 构建系统

MSYS2 原生支持 Meson——在 MSYS2 shell 中 Meson 自动识别 MinGW 编译器和路径：

```bash
pacman -S mingw-w64-ucrt-x86_64-meson
meson setup builddir
meson compile -C builddir
```

跨子系统编译时同样推荐用交叉文件（cross file）固定工具链路径。

### 多版本 GCC 共存与切换

[MSYS2 中安装 GCC 13.2.0 版本完整指南 - 博客园](https://www.cnblogs.com/yimeimanong/p/19549348)

[MSYS2 - Environments](https://www.msys2.org/docs/environments/)

不同子系统（ucrt64/mingw64/clang64/clangarm64）各自有独立的 GCC/Clang 版本，这是 MSYS2 原生支持的多版本切换方式：

```bash
# 打开不同终端即切换整套工具链
msys2_shell.cmd -ucrt64     # GCC + UCRT（推荐）
msys2_shell.cmd -mingw64    # GCC + MSVCRT
msys2_shell.cmd -clang64    # Clang + UCRT
```

**同一子系统内安装特定旧版本**（如果仓库已更新，需手动下载）：

1. 从 [repo.msys2.org](https://repo.msys2.org/mingw/mingw64/) 下载目标版本的 `.pkg.tar.zst`
2. 本地安装：

```bash
pacman -U mingw-w64-ucrt-x86_64-gcc-13.2.0-1-any.pkg.tar.zst \
         mingw-w64-ucrt-x86_64-gcc-libs-13.2.0-1-any.pkg.tar.zst
```

**锁定版本防止升级**——编辑 `/etc/pacman.conf`：

```ini
IgnorePkg = mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-gcc-libs
```

**Shell 级别快速切换**（手工管理多个安装路径）：

```bash
# 创建环境脚本
cat > ~/.gcc-ucrt64 << 'EOF'
export PATH="/ucrt64/bin:$PATH"
export CC="/ucrt64/bin/gcc"
export CXX="/ucrt64/bin/g++"
EOF

# 使用
source ~/.gcc-ucrt64
```

### 与 Windows SDK / MSVC 的交互

MSYS2 和 MSVC 是 Windows 上两套独立的 C/C++ 生态，C++ ABI 不兼容，**不能混用 .lib 和 .o**。

如果必须链接 MSVC 库，有两种务实路径：

**1. UCRT64 环境**——C 运行时层面对齐 MSVC。两者都用 ucrt，C 接口互通；但 C++ ABI 不同（libstdc++ vs MSVC STL），C++ 对象不可跨边界传递。

**2. Clang 的 MSVC 兼容模式**——在 MSYS2 shell 中调用 clang，但指定 MSVC 目标，使用 Windows SDK 的链接器和库：

```bash
clang --target=x86_64-pc-windows-msvc -fuse-ld=link.exe source.c -o output.exe
```

需要配合 Visual Studio 的 `vcvarsall.bat` 设置 `LIB` 和 `INCLUDE` 环境变量。

> 实际项目如果遇到 MinGW ↔ MSVC 互操作问题，最简单的方案是两端各编各的 C API，在 C 边界对接。

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
