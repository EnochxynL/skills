---
name: cpp-pio
description: Use when developing embedded/IoT C++ projects with PlatformIO — installing the VSCode extension, understanding platforms/frameworks/boards, managing packages with pio pkg, configuring platformio.ini, integrating with STM32CubeMX/ESP-IDF/Arduino, custom board definitions, and resolving network/download issues.
metadata:
  hermes:
    tags:
      - platformio
      - c++
      - embedded
      - iot
      - arduino
      - esp32
      - stm32
  related_skills:
    - cpp-cmake
    - cpp-msvc
    - cpp-gnu
---

# PlatformIO — 嵌入式 C++ 跨平台开发生态

## Overview

PlatformIO 是面向嵌入式开发的跨平台 IDE 工具链——它以 VSCode 扩展的形式工作，通过 `platformio.ini` 管理项目配置，由 pio 包管理器统一管理工具链、框架和库依赖。与 Keil/IAR 等传统 IDE 不同，PlatformIO 不绑定特定芯片厂商，一套配置适配数百种开发板和十几种框架。

PlatformIO 的核心抽象分为四层：**Platforms**（芯片架构和工具链）、**Frameworks**（软件生态，如 Arduino、STM32Cube、ESP-IDF）、**Boards**（具体板型配置）、**Projects**（`platformio.ini` 项目描述文件）。

## When to Use

* 安装 PlatformIO VSCode 扩展或排查 Python 环境问题时
* 理解 Platforms / Frameworks / Boards / Projects 的概念层级时
* 用 `pio pkg install` 管理包依赖、排查下载失败时
* 为 STM32 / ESP32 / MSPM0 / MCS51 等芯片创建项目时
* 配置 `platformio.ini`（build_src_filter、src_dir、ldscript）时
* 集成 CubeMX / ESP-IDF / Arduino 框架时
* 自定义非官方支持的 Board 配置时
* 用 stlink / JLink / stm32flash 烧录时

## Common Install

### 安装

[在 VSCode 中开发 STM32 所有常见方式的全面对比](https://blog.csdn.net/qq_18677445/article/details/144444387)

[VSCode+PlatformIO 开发环境搭建](https://www.cnblogs.com/Biiigwang/p/17956569/vscode-platformio-development-environment-zrvbnw)

PlatformIO 直接从 VSCode 扩展市场安装。它依赖 Python 环境——Ubuntu 下需 `sudo apt install python3-venv`。安装后在 VSCode 左下方可呼出 PlatformIO 终端。当然，实际上 PlatformIO 是 Python 应用程序，可以在任何终端中使用，只要 PATH 中包含 `~/.platformio/penv/bin`。

### 网络配置

[Chinese mirror of the package registry · Issue #4345](https://github.com/platformio/platformio-core/issues/4345)

PlatformIO 从 GitHub 下载工具链和框架包，网络不畅时下载失败。在终端设置系统代理：

```powershell
$env:ALL_PROXY = "http://127.0.0.1:20171"
```

若开启代理后仍提示 `ProxyError: urllib3.exceptions.SSLError: [SSL: UNEXPECTED_EOF_WHILE_READING]`，说明系统代理不够——需要开 TUN 代理（V2RayN 而非 V2RayA）。

### 包管理

[PlatformIO IDE for VSCode](https://docs.platformio.org/en/latest/integration/ide/vscode.html#platformio-core-cli)

[pio pkg install](https://docs.platformio.org/en/stable/core/userguide/pkg/cmd_install.html#local-tar-or-zip-archive)

包分三种类型，可在 [PlatformIO Registry](https://registry.platformio.org/) 查找：

| 类型 | 说明 | 存放位置 |
|---|---|---|
| **library** | 项目扩展库 | `.pio/libdeps` 或 `~/.platformio/lib` |
| **platform** | 芯片架构开发平台 | `~/.platformio/platforms` |
| **tool** | 工具链、框架、SDK | `~/.platformio/packages` |

远程包和本地包文件夹名不同——本地包名带 `@src-` 后缀，如 `framework-arduinoespressif32-libs@src-1f9dc861b149f3c0343b297fc20b6727`。可以根据 Manager 前缀判断包类型：

```
Tool Manager: framework-arduinoespressif32-libs@5.5.0+sha.b66b5448e0 is already installed
Library Manager: ArduinoJson@6.21.5 has been installed!
```

压缩包内的 `package.json` 记载了解压后文件夹的名称。

```powershell
pio pkg list                               # 列出当前安装的包及其存放位置
pio pkg install                            # 安装 platformio.ini 中声明的所有依赖
pio pkg install --tool <package-name>      # 安装指定远程包，写入 platformio.ini
pio pkg install --tool "C:\path\to\file.zip"  # 安装本地包（PlatformIO 无法区分本地包类型，建议手动解压放置）
```

`MissingPackageManifestError: Could not find one of 'package.json' manifest files in the package` 说明包已损坏——手动下载解压覆盖即可。

### 下载器

```bash
sudo apt install stlink-gui
# 或从 GitHub release 下载 deb：https://github.com/stlink-org/stlink
# JLink：sudo apt install /path/to/JLink_Linux_V798i_x86_64.deb
```

在 VSCode 的 CMSIS 选项卡中点击运行，若弹出 "Arm Debugger not found"，安装 Arm Debugger 插件即可。

## Project Manage

### 创建项目

[build_src_filter](https://docs.platformio.org/en/stable/projectconf/sections/env/options/build/build_src_filter.html)

用 `pio project init` 在空项目中创建 `platformio.ini`。从零手写 `platformio.ini` 时必须指定 `build_src_filter` 和 `src_dir`，否则找不到源文件无法编译。

框架兼容性对照：

| 框架 | 注意事项 |
|---|---|
| **ESP-IDF** | sdkconfig 相当于 CubeMX/sysconfig。修改条目顺序会导致无效，有条件的话用 `pio run -t menuconfig` |
| **Arduino + ESP-IDF 混用** | 可能需要手动配置 sdkconfig（如 `CONFIG_FREERTOS_HZ=1000`） |
| **Arduino (STM32)** | Platform 只选 Arduino，不要选 CubeMX+Arduino——Arduino 自带 HAL 库，ST 官方未适配混用冲突 |
| **CubeMX 框架** | PlatformIO 自带 HAL 库，会与 CubeMX 生成的 HAL 冲突——不用 CubeMX 框架，手动配置 project |
| **CubeMX 软件（不用框架）** | STM32CubeMX 自己生成所有 HAL 库，无需 PlatformIO 框架 |
| **MCS51** | 无框架，`platform = intel_mcs51`，使用 SDCC 编译器 |
| **MSPM0** | 无官方支持，需第三方 platform：[Berkays/platform-ti-mspm0](https://github.com/Berkays/platform-ti-mspm0) |

### Keil 移植

[keil2pio: keil project convert platformio project](https://gitee.com/doudou0424/keil2pio)

[将Keil工程文件移植到VScode+Platformio环境下_platformio 导入keil-CSDN博客](https://blog.csdn.net/qinlu_CSDN/article/details/141600126)

没试过，也没必要。

### CubeMX 移植

[STM32Cube — PlatformIO latest documentation](https://docs.platformio.org/en/latest/frameworks/stm32cube.html#using-with-stm32cubemx)

[使用platformio+stm32cubemx开发stm32 - Jabari12 - 博客园](https://www.cnblogs.com/jabari12/p/18803350)

[stm32pio](https://github.com/ussserrr/stm32pio)

`stm32pio` 工具并不好用，不如手动配置。CubeMX 生成时 Toolchain 选 Makefile（需要 ld 连接脚本）。PlatformIO 的 STM32Cube 框架会链接内置 HAL 而非 CubeMX 生成的 HAL，因此**不使用任何框架**，手动编辑 `platformio.ini`：

```ini
[env]
platform = ststm32
board = genericSTM32F103C8
build_flags =
    -DSTM32F103xB
    -DUSE_HAL_DRIVER
    -ICore/Inc
    -IDrivers/STM32F1xx_HAL_Driver/Inc
    -IDrivers/CMSIS/Device/ST/STM32F1xx/Include
    -IDrivers/CMSIS/Include
build_src_filter =
    +<Core/Src>
    +<startup_stm32f103xb.s>
    +<Drivers/>
    -<Core/Src/syscalls.c>
    -<Core/Src/sysmem.c>
board_build.ldscript = ./STM32F103C8Tx_FLASH.ld
upload_protocol = stlink
debug_tool = stlink
[platformio]
src_dir = ./
```

这就等价于 `.uvprojx` 项目管理文件。

### 生成 HEX 文件

[PlatformIO 导出 HEX 文件](https://www.openpilot.cc/archives/3895)

编译后生成 HEX 需要特制脚本 `extra_script.py`，并在 `platformio.ini` 中指定：

```ini
extra_scripts = post:extra_script.py
```

### 串口烧录

[STM32 USART1 串口下载踩坑](https://www.jianshu.com/p/c5f14dd97628)

PlatformIO 和 stm32flash 可能无权限，解决方法：

```bash
sudo apt install stm32flash
sudo stm32flash -g 0x08000000 -b 115200 -w ".pio/build/genericSTM32F103C8/firmware.bin" "/dev/ttyUSB0"
# 或
sudo chmod 777 /dev/ttyUSB0
```

### 自定义 Boards

[How To Define Custom Board within Project](https://community.platformio.org/t/how-to-define-custom-board-within-project/39424)

[Custom Embedded Boards](https://docs.platformio.org/en/latest/platforms/creating_board.html)

[STC单片机 + PlatformIO IDE（非原生支持芯片的添加） - 灰信网（软件开发博客聚合）](https://www.freesion.com/article/6525657523/)

[platformIO里能不能自己添加没有的型号啊？ - 极海MCU极海MCU官方技术支持论坛](https://bbs.21ic.com/icview-3408366-1-1.html)

板型列表可通过 [PlatformIO Boards Explorer](https://platformio.org/boards) 或 `pio boards` 命令查询。自定义板型可参考 `~/.platformio/platforms/*/boards/` 下的 JSON 配置文件，或 [PlatformIO Development Platforms](https://github.com/platformio?query=platform-) 仓库下的 boards 目录。

## Verification Checklist

* [ ] **PlatformIO 可用**

    ```powershell
    pio --version
    ```
* [ ] **可搜索 Platforms**

    ```powershell
    pio boards
    ```
* [ ] **可安装依赖**

    ```powershell
    pio pkg install
    ```
