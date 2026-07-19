---
name: cpp-vcpkg
description: Use when managing C++ dependencies with vcpkg — installing vcpkg, choosing manifest vs classic mode, creating vcpkg.json/vcpkg-configuration.json, adding ports, integrating with CMake via CMAKE_TOOLCHAIN_FILE, and resolving common vcpkg errors.
metadata:
  hermes:
    tags:
      - vcpkg
      - c++
      - package-management
      - cmake
      - microsoft
  related_skills:
    - cpp-cmake
    - cpp-msvc
---

# vcpkg — C++ 包管理器（微软）

## Overview

vcpkg 是微软维护的跨平台 C/C++ 包管理器，与 CMake 和 Visual Studio 深度集成。它没有集中缓存——依赖库被安装到项目本地或 vcpkg 全局目录，类似 npm。vcpkg 通过向 CMake 注入 toolchain 文件（`vcpkg.cmake`）让 CMake 自动找到已安装的库。

两种工作模式：

| 模式 | 工作方式 | 类比 |
|---|---|---|
| **清单模式（推荐）** | 项目级 `vcpkg.json`，依赖按项目隔离 | npm + package.json |
| 经典模式 | 全局安装到 vcpkg 目录，所有项目共享 | apt / brew |

清单模式下不会硬链接——缓存中的包被复制到项目构建目录。

## When to Use

* 安装或配置 vcpkg 时
* 选择清单模式 vs 经典模式时
* 用 `vcpkg new` 初始化项目时
* 添加/搜索 ports 时
* 排查 vcpkg 基线错误或找不到 MSVC 时
* 换镜像源或配置代理时

## Common Install

### 安装

[CMake 项目中的 vcpkg | Microsoft Learn](https://learn.microsoft.com/zh-cn/vcpkg/users/buildsystems/cmake-integration)

[vcpkg 配置和教程 - CSDN](https://blog.csdn.net/yangyu0515/article/details/140839736)

[How to remove vcpkg - Stack Overflow](https://stackoverflow.com/questions/57296864/how-to-remove-vcpkg-and-all-libraries-installed-with-vcpkg)

**推荐**：自 VS 2022 起 vcpkg 已集成在 Visual Studio Installer 中，与 VSBuildTools 一起安装。激活 VS 环境后 `VCPKG_ROOT` 自动设置。

**备选**：clone 到 `C:\vcpkg`，运行 `bootstrap-vcpkg.bat` 生成 `vcpkg.exe`，手动添加到 PATH。

### 网络配置

[vcpkg 配置攻略（镜像加速与集成使用）- 知乎](https://zhuanlan.zhihu.com/p/447391308)

[vcpkg 镜像源替换 - CSDN](https://blog.csdn.net/weixin_41364246/article/details/140123907)

网络问题优先开代理而非换源。在 VS Code 中配置：

```json
"cmake.configureEnvironment": {
    "ALL_PROXY": "http://127.0.0.1:20171"
}
```

## Project Manage

### vcpkg 清单模式

[清单模式 | Microsoft Learn](https://learn.microsoft.com/zh-cn/vcpkg/concepts/manifest-mode)

[经典模式 | Microsoft Learn](https://learn.microsoft.com/zh-cn/vcpkg/concepts/classic-mode)

[在 VS Code 中使用 CMake 安装和管理包 | Microsoft Learn](https://learn.microsoft.com/zh-cn/vcpkg/get_started/get-started-vscode?pivots=shell-bash)

[通过 CMake 安装和使用包 | Microsoft Learn](https://learn.microsoft.com/zh-cn/vcpkg/get_started/get-started?pivots=shell-bash)

**初始化：**

```bash
vcpkg new --application   # 生成 vcpkg.json + vcpkg-configuration.json
```

**添加依赖：**

```bash
vcpkg add port fmt
# 也可在 vcpkg.json 中手动编辑 "dependencies" 数组
```

**CMake 集成——设置 toolchain 文件：**

vcpkg 通过 `vcpkg.cmake` toolchain 注入 CMake。在 `CMakeLists.txt` 同级设置 `CMAKE_TOOLCHAIN_FILE` 后，CMake 配置期间自动运行 `vcpkg install` 安装所有声明在 `vcpkg.json` 中的依赖。

```bash
cmake --preset default
# 或显式指定：
cmake -B build -S . -DCMAKE_TOOLCHAIN_FILE="$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"
```

### CMakeLists.txt 中使用 vcpkg 的库

vcpkg 安装的库像系统库一样使用 `find_package` 即可：

```cmake
find_package(fmt CONFIG REQUIRED)
target_link_libraries(myapp PRIVATE fmt::fmt)
```

### Triplets

Triplet 指定目标平台和链接方式（如 `x64-windows`、`x64-windows-static`、`x64-linux`）。可在 `vcpkg.json` 中指定，或通过 `--triplet` 参数传递。

## Common Pitfalls

### vcpkg 基线错误

[vcpkg 与 CMake 集成的步骤 - CSDN](https://blog.csdn.net/fleetstar/article/details/145972431)

[vcpkg 报错：需指定基线的清单文件 - CSDN](https://ask.csdn.net/questions/8940915)

**不要手动创建 `vcpkg-configuration.json`**——用 `vcpkg new` 命令自动生成，确保基线正确设置。基线（baseline）锁定 vcpkg 仓库的快照版本，决定了所有 ports 的可用版本。

### vcpkg 找不到 Visual Studio 实例

[Error: in triplet x64-windows: Unable to find a valid Visual Studio instance - GitHub](https://github.com/microsoft/vcpkg/issues/22074)

[使用 vcpkg 一直报错？- CSDN](https://blog.csdn.net/weixin_52236586/article/details/145348046)

根本原因：vcpkg 需要完整的 MSVC 工具链，而不是单纯的 MSVC cl 编译器。确保 VS Build Tools 已安装且环境已激活。

## Verification Checklist

* [ ] **vcpkg 可用且能找到 MSVC**

    From a Developer Prompt:
    ```bash
    vcpkg --version
    ```
* [ ] **可搜索 ports**

    ```bash
    vcpkg search fmt
    ```
