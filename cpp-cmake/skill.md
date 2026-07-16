---
name: cpp-cmake
description: Use when building C++ projects with CMake, managing dependencies with vcpkg or Conan, configuring CMakePresets, integrating with VSCode, and resolving common CMake/vcpkg/Conan build issues on Windows.
metadata:
  hermes:
    tags:
      - cmake
      - vcpkg
      - conan
      - c++
      - build-system
      - package-management
  related_skills:
    - cpp-msvc
    - cpp-msys2
    - cpp-gnu
---

# CMake + vcpkg + Conan — C++ 构建与包管理

## Overview

CMake 是 C++ 生态的通用构建系统，生成各平台的 Makefile/项目文件。但它不管理依赖——依赖管理由 vcpkg（微软）和 Conan（JFrog）两套方案解决。

三者的协作方式：

| 工具 | 角色 | 类比 | 项目级隔离 | 集中缓存 |
|---|---|---|---|---|
| **CMake** | 构建系统 | 描述了"怎么编译" | — | — |
| **vcpkg** | 包管理器（微软） | npm + apt 的混合 | 清单模式（vcpkg.json） | 无链接，从缓存复制 |
| **Conan** | 包管理器（跨平台） | uv / Maven | 按版本区分 | 集中缓存 `~/.conan2` |

vcpkg 经典模式类似 apt/brew——全局安装库；清单模式类似 npm，项目级隔离。Conan 走集中缓存 + 版本区分路线，更像 uv。vcpkg 和 Conan 都通过向 CMake 注入 toolchain 文件来工作。

## When to Use

* 安装 CMake、vcpkg 或 Conan 时
* 创建新的 C++ CMake 项目时
* 通过 vcpkg 或 Conan 添加/管理项目依赖时
* 配置 CMakePresets.json 或 CMakeUserPresets.json 时
* 在 VS Code 中配置 CMake + vcpkg/Conan 集成时
* 遇到 CMake 编译冲突（O2/RTC1）、vcpkg 基线错误、或找不到 MSVC 实例时

## 常规配置

### 安装 CMake

**推荐**：Microsoft C++ Build Tools 自带 CMake，一般不需独立安装。我的路径为 `C:\Program Files (x86)\Microsoft Visual Studio\18\BuildTools\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin`。

**备选**：从 [cmake.org](https://cmake.org) 下载独立安装，需检查 PATH。

注意 PATH 优先级——其他软件（如 Strawberry Perl）可能也包含 CMake。若使用 VSBuildTools 内置版，其他版本的 CMake 不应出现在 PATH 中。

### 安装 vcpkg

[CMake 项目中的 vcpkg | Microsoft Learn](https://learn.microsoft.com/zh-cn/vcpkg/users/buildsystems/cmake-integration)

[【C++】windows11环境 vcpkg 配置和教程 - CSDN](https://blog.csdn.net/yangyu0515/article/details/140839736)

[How to remove vcpkg - Stack Overflow](https://stackoverflow.com/questions/57296864/how-to-remove-vcpkg-and-all-libraries-installed-with-vcpkg)

**推荐**：自 VS 2022 起 vcpkg 已集成在 Visual Studio Installer 中，与 VSBuildTools 一起安装。激活 VS 环境后 `VCPKG_ROOT` 自动设置。

**备选**：clone 到 `C:\vcpkg`，运行 `bootstrap-vcpkg.bat` 生成 `vcpkg.exe`，手动添加到 PATH。

[vcpkg 镜像源替换 - CSDN](https://blog.csdn.net/weixin_41364246/article/details/140123907)

[vcpkg 配置攻略（镜像加速与集成使用）- 知乎](https://zhuanlan.zhihu.com/p/447391308)

网络问题的对策是开代理而非换源。在 VS Code 设置中配置：

```json
"cmake.configureEnvironment": {
    "ALL_PROXY": "http://127.0.0.1:20171"
}
```

### 安装 Conan

[Conan 安装文档](https://docs.conan.org.cn/2/installation.html)

[Conan 下载页](https://conan.org.cn/downloads)

[Conan 环境变量](https://docs.conan.org.cn/2/reference/environment.html)

推荐从官方安装包安装（不用 pip/conda）。Conan 配置和缓存都在 `CONAN_HOME` 环境变量指定的目录（默认 `~/.conan2`）。

初次使用刷新配置：

```bash
conan profile detect --force
```

此命令为编译器、构建配置、架构、静态/共享库等定义配置集。

## 可选配置

### Conda 联动

[使用 conda 作为 C++ 包管理器 - 知乎](https://zhuanlan.zhihu.com/p/353121634)

[CMake+Condaconda 打造 C++ 项目完美打包方案 - CSDN](https://blog.csdn.net/gitblog_00189/article/details/149010350)

Conda 下部分 C++ 库（如 GSL、Pybind11）更适配 conda 的 Python 环境。用 `CONDA_PREFIX` 环境变量定位，让 CMake 找到 C++ 库和头文件。可用 `CMAKE_FIND_ROOT_PATH` 或 `CMAKE_PREFIX_PATH` 指向 conda 环境：

```cmake
set(CMAKE_PREFIX_PATH "$ENV{CONDA_PREFIX}")
```

### VS Code CMake 集成

[vscode + cmake + vcpkg 搭建 C++ 开发环境 - 知乎](https://zhuanlan.zhihu.com/p/430835667)

[VS Code 变量引用](https://vscode.js.cn/docs/reference/variables-reference#_environment-variables)

**vcpkg 集成**——设置 `CMAKE_TOOLCHAIN_FILE`：

```json
"cmake.configureSettings": {
    "CMAKE_TOOLCHAIN_FILE": "${env:VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"
}
```

VSBuildTools 自带的 vcpkg 会在激活 VS 环境时自动设置 `VCPKG_ROOT`。

**Conan 集成**——添加 preset 参数：

```json
"cmake.configureArgs": [
    "--preset conan-default"
]
```

**Conda 联动**——配置环境变量：

```json
"cmake.configureEnvironment": {
    "CONDA_PREFIX": "C:/Users/enoch/miniconda3"
}
```

### vcpkg 清单模式 vs 经典模式

[清单模式 | Microsoft Learn](https://learn.microsoft.com/zh-cn/vcpkg/concepts/manifest-mode)

[经典模式 | Microsoft Learn](https://learn.microsoft.com/zh-cn/vcpkg/concepts/classic-mode)

| 模式 | 工作方式 | 类比 |
|---|---|---|
| **清单模式（推荐）** | 项目级 `vcpkg.json`，依赖按项目隔离 | npm + package.json |
| 经典模式 | 全局安装到 vcpkg 目录，所有项目共享 | apt / brew |

清单模式从缓存复制依赖到项目，类似 npm 的 `node_modules`，但没有硬链接。

## 自动项目管理

### 纯 CMake 项目

最简单的项目结构，无包管理器介入：

```bash
cmake -G Ninja <source-dir> -DCMAKE_BUILD_TYPE=Release
cmake --build .
```

VS Code 中按 `Ctrl+Shift+T`（CMake: Quick Start）可快速新建 CMake 项目。

### vcpkg + CMake 项目

[在 VS Code 中使用 CMake 安装和管理包 | Microsoft Learn](https://learn.microsoft.com/zh-cn/vcpkg/get_started/get-started-vscode?pivots=shell-bash)

[通过 CMake 安装和使用包 | Microsoft Learn](https://learn.microsoft.com/zh-cn/vcpkg/get_started/get-started?pivots=shell-bash)

```bash
# 初始化
vcpkg new --application      # 生成 vcpkg.json + vcpkg-configuration.json

# 添加依赖
vcpkg add port <package>
# 也可在 vcpkg.json 中手动编辑依赖列表

# CMake 配置期间自动运行 vcpkg install
cmake --preset default
```

vcpkg 提供 `vcpkg.cmake` toolchain 文件，传递给 CMake 后自动找到所有依赖。

### Conan + CMake 项目

[创建你的第一个 Conan 包](https://docs.conan.org.cn/2/tutorial/creating_packages/create_your_first_package.html)

[Conan 版本控制](https://docs.conan.org.cn/2/tutorial/versioning.html)

[其他重要的 Conan 特性](https://docs.conan.org.cn/2/tutorial/other_features.html)

```bash
# 初始化（生成 conanfile.py）
conan new cmake_lib -d name=myproject -d version=0.1.0

# 添加依赖
conan require add <package>/<version>

# 安装依赖（生成 CMakeUserPresets.json）
conan install .

# 构建（preset 是关键！）
cmake --preset conan-default
cmake --build .
```

**`--preset conan-default` 是必须的**——没有它就无法使用 conan 安装的依赖。

Conan 2.0 的 `--deployer=full_deploy` 参数可将所有依赖**完整复制**到项目 `full_deploy/` 目录，创建完全自包含的环境，类似 npm 的 `node_modules`。

### 安装与打包

[CMake install 和打包教程 - 知乎](https://zhuanlan.zhihu.com/p/1925244374566025128)

在 CMakeLists.txt 中配置 `install()` 规则，配合 CPack 生成安装包。

## 项目注意

### CMake 编译优化冲突

[error D8016: "/O2"和"/RTC1"命令行选项不兼容 - 博客园](https://www.cnblogs.com/hshy/p/17950184)

[错误 D8016: O2 和 RTC1 命令行选项不兼容 - CSDN](https://blog.csdn.net/weixin_43236428/article/details/106358360)

MSVC 在 CMake Debug 模式下默认启用 `/RTC1`（运行时检查），同时开 `/O2` 优化会冲突。**不要在 Debug 配置中强制设置优化级别**。

### main 已经在 CMakeCXXCompilerId.cpp.obj 中定义

[main 在 CMakeCXXCompilerId.cpp.obj 中定义 - CSDN](https://blog.csdn.net/ZY2826/article/details/136901917)

[同样问题 - AcFun](https://www.acfun.cn/a/ac48376818)

CMake 配置阶段编译测试程序时，与项目源文件中的 `main` 冲突。检查 `CMakeLists.txt` 是否错误地将测试文件加入了构建目标。

### vcpkg 基线错误

[vcpkg 与 CMake 集成的步骤 - CSDN](https://blog.csdn.net/fleetstar/article/details/145972431)

[vcpkg 报错：需指定基线的清单文件 - CSDN](https://ask.csdn.net/questions/8940915)

**不要手动创建 `vcpkg-configuration.json`**——用 `vcpkg new` 命令自动生成，确保基线（baseline）正确设置。

### vcpkg 找不到 Visual Studio 实例

[Error: in triplet x64-windows: Unable to find a valid Visual Studio instance - GitHub](https://github.com/microsoft/vcpkg/issues/22074)

[使用 vcpkg 一直报错？Unable to find a valid Visual Studio instance - CSDN](https://blog.csdn.net/weixin_52236586/article/details/145348046)

[Improve check Visual Studio components - vcpkg-tool PR #314](https://github.com/microsoft/vcpkg-tool/pull/314)

根本原因：vcpkg 需要完整的 MSVC 工具链。确保 Visual Studio Build Tools 已安装，且环境已激活（`Enter-VsDevShell` 或从 Developer Command Prompt 中运行）。

## Verification Checklist

* [ ] **CMake 可用**

    ```bash
    cmake --version
    ```
* [ ] **vcpkg 可用且能找到 MSVC**

    From a Developer Prompt:
    ```bash
    vcpkg --version
    ```
* [ ] **Conan 可用**

    ```bash
    conan --version
    ```
* [ ] **conan profile 已配置**

    ```bash
    conan profile show
    ```
* [ ] **CMakePresets 可正常生成构建**

    ```bash
    cmake --preset default   # vcpkg
    # 或
    cmake --preset conan-default   # conan
    ```
