---
name: cpp-gnu
description: Use when working with the GNU C++ toolchain on Linux — GNU Make, Automake, base-devel, Homebrew for library management, installing common libraries (Eigen, OSQP), and packaging/distributing binaries with ldd and ntldd.
metadata:
  hermes:
    tags:
      - gnu
      - make
      - automake
      - homebrew
      - linux
      - packaging
      - c++
  related_skills:
    - ubuntu-24.04
    - cpp-msys2
---

# GNU — Linux 原生 C++ 工具链

## Overview

GNU 工具链（GCC + GNU Make + binutils）是 Linux 下最基础的 C/C++ 构建生态，系统自带，开箱即用。优点是零配置即可编译，缺点是缺乏版本管理和依赖隔离——GCC 与系统 libc 高度绑定，不同项目很难用不同版本的编译器。

现代包管理器（vcpkg、conan）对纯 Makefile 项目适应性差，它们更适合 CMake 项目。因此 GNU 工具链主要适用于三个场景：轻量级单文件编译、已有 Makefile 的老项目维护、以及通过 Homebrew 补充 apt 未收录的开发库。

## When to Use

* 在 Ubuntu 上安装 base-devel 构建工具组时
* 编写或调试 Makefile 时
* 使用 Automake/autoconf 构建的项目（`./configure && make`）时
* 通过 Homebrew 安装 apt 中没有的开发库时
* 检查二进制文件的动态库依赖（ldd/ntldd）时
* 打包发布 C++ 程序时

## 常规配置

### GNU Make 与 base-devel 包组

`base-devel` 将 `make`、`m4`、`diffutils` 等核心开发工具打包在一起，是 C/C++ 开发的基础依赖：

```bash
sudo apt install base-devel
```

在 Ubuntu 下也有 `build-essential`，包含 `gcc`、`g++`、`make`、`libc6-dev` 等。Linux 下 GCC 和 libc 高度绑定，且系统常常自带 GNU Make。

Makefile 项目的标准构建流程：

```bash
make -j$(nproc)
```

简易 Linux 项目都基于 gcc + GNU Make 构建。但由于缺少项目级配置标准，vcpkg 和 conan 对其不适应——它们更偏好 CMake 项目。

[Makefile — Conan 2.26.2 文档](https://docs.conan.io/2/integrations/makefile.html)

## 可选配置

### Automake / Autoconf

Automake 是 GNU Build System 的一部分，常见于开源项目的 `./configure && make && make install` 流程。由 `autoconf`/`automake` 包提供：

```bash
sudo apt install autoconf automake
```

新项目不建议用这种方式，配置相比 CMake 还是更繁琐。

### apt 安装依赖库

[osqp 安装教程 - CSDN](https://blog.csdn.net/chen_mp/article/details/119465098)

例如安装 Eigen 和 OSQP：

```bash
sudo apt install libeigen3-dev
sudo apt install libosqp-dev
```

部分库需要手动链接头文件路径（以 Eigen 为例）：

```bash
sudo ln -s /usr/include/eigen3/Eigen /usr/include/Eigen
```

### Homebrew（补充包管理器）

[开发自定义 Homebrew 程序包 - zhb127's blog](https://www.zhb127.xyz/archives/develop-custom-homebrew-formula)

[Homebrew installed libraries, how do I use them? - Ask Different](https://apple.stackexchange.com/questions/40704/homebrew-installed-libraries-how-do-i-use-them)

Homebrew 最初是 macOS 的包管理器，但 Linux 版同样好用。它与 apt 的分工：

- **apt**：日常应用程序、系统库
- **Homebrew**：apt 未收录的开发库，且实现依赖隔离——区分开系统所需包和开发所需包

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

核心概念：
- **Formula**：用 Ruby 描述的极简包安装流程，可直接从 `./configure && make` 生成
- **Bottle**：Formula 的预编译二进制包，安装更快

### pkg-config

[pkg-config 与 GNU Autotools 使用指南 - CSDN](https://blog.csdn.net/i7j8k9l/article/details/155909215)

pkg-config 是 Unix 下查询已安装库的编译/链接标志的标准工具。库安装时会提供 `.pc` 文件，记录头文件路径和链接器标志。当你在 Makefile 中看到形如 `` `pkg-config --cflags --libs gtk+-3.0` `` 的写法时，背后就是 pkg-config。

一些不在 apt 等系统包管理器收录的小众开源项目，所谓 `make install`，就是将项目编译后的可执行文件、库文件、头文件等安装到系统目录下，且会提供 `.pc` 文件。

```bash
# 列出系统上所有已知库
pkg-config --list-all

# 查询编译和链接标志
pkg-config --cflags gtk+-3.0    # -I/path/to/headers
pkg-config --libs gtk+-3.0      # -L/path/to/libs -lgtk-3

# 一键获取两者（Makefile 中常用）
pkg-config --cflags --libs gtk+-3.0
```

**`PKG_CONFIG_PATH`**——库安装到非标准位置（如 `/opt/`、`/usr/local/`）时，需将 `.pc` 文件所在目录加入此环境变量：

```bash
export PKG_CONFIG_PATH=/opt/myapp/lib/pkgconfig:$PKG_CONFIG_PATH
```

#### 在 Makefile 中的典型用法

```makefile
CFLAGS  = -Wall `pkg-config --cflags gtk+-3.0`
LDFLAGS = `pkg-config --libs gtk+-3.0`

myprogram: myprogram.c
	gcc $(CFLAGS) -o myprogram myprogram.c $(LDFLAGS)
```

这是 `make install` 之后最常见的"让编译器找到库"的方式——库的 `.pc` 文件放在 `pkgconfig/` 目录下，编译时通过 pkg-config 自动拼接正确的 `-I` 和 `-l` 参数。

> CMake 中也有 `FindPkgConfig` 模块可以调用 pkg-config（参见 cpp-cmake），但对于 GNU Make + Autotools 的项目，pkg-config 是原生的依赖解析方案。

#### 在 CMake 中的用法简介

`cmake --install` 本身不会自动生成 `.pc` 文件，它只会把构建产物拷贝到安装目录。要想安装后库能被 `pkg-config` 发现，需要在 `CMakeLists.txt` 里明确写出生成 `.pc` 文件的逻辑。旧方式：是手动写一个模板然后 configure 生成 `.pc` 文件；新方式：CMake 3.21+ 提供 `install(TARGETS ... EXPORT ...)` 和 `install(EXPORT ...)` 来自动生成 pkg-config 文件。

## 打包发布时检查依赖

[在 Windows 下打包 GTK 程序 - wszqkzqk](https://wszqkzqk.github.io/2022/09/09/%E5%9C%A8Windows%E4%B8%8B%E6%89%93%E5%8C%85GTK%E7%A8%8B%E5%BA%8F/)

[Linux 下查看可执行文件的动态库依赖 - CSDN](https://blog.csdn.net/braveyly/article/details/18798333)

[Linux 程序打包与发布 - CSDN](https://blog.csdn.net/gongfpp/article/details/120641612)

检查二进制文件依赖的共享库：

```bash
# Linux
ldd ./myprogram

# Windows（MSYS2 中）
ntldd ./myprogram.exe
```

打包时确保所有 `.so`（或 `.dll`）随程序一起分发，必要时静态链接 `libstdc++` 减少运行时依赖。

## Verification Checklist

* [ ] **GCC 可用**

    ```bash
    gcc --version
    g++ --version
    ```
* [ ] **GNU Make 可用**

    ```bash
    make --version
    ```
* [ ] **base-devel 已安装**

    ```bash
    dpkg -l | grep base-devel
    ```
* [ ] **ldd 可用**

    ```bash
    ldd /bin/ls
    ```
