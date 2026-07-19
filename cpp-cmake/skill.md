---
name: cpp-cmake
description: Use when building C++ projects with CMake — configuring generators, writing CMakeLists.txt, managing dependencies via FetchContent/ExternalProject, CMakePresets, installing/packaging (CPack), generating pkg-config .pc files, and resolving common CMake build errors.
metadata:
  hermes:
    tags:
      - cmake
      - c++
      - build-system
      - fetchcontent
      - packaging
  related_skills:
    - cpp-msvc
    - cpp-msys2
    - cpp-gnu
    - cpp-conan
    - cpp-vcpkg
---

# CMake — C++ 构建系统

## Overview

CMake 是 C++ 生态的通用构建系统——它本身不编译代码，而是生成各平台的构建文件（Ninja、MSBuild、Unix Makefiles）。它通过 `CMakeLists.txt` 描述项目结构，通过 `CMakePresets.json` 固化配置选项，通过 CPack 生成安装包。

CMake 也提供两种内置的第三方依赖管理方案——FetchContent（配置阶段下载并纳入构建树）和 ExternalProject（构建阶段独立编译）——可以在不引入外部包管理器的情况下拉取和管理依赖。

## When to Use

* 下载/安装 CMake 时
* 创建或修改 CMakeLists.txt 时
* 生成项目：选择 -G 生成器、CMakePresets 配置时
* 通过 FetchContent 或 ExternalProject 拉取第三方源码依赖时
* 配置 install() 规则、生成 .pc 文件、用 CPack 打包时
* 遇到编译选项冲突（O2/RTC1）、main 重定义等 CMake 常见错误时

## Common Install

### 安装 CMake

**推荐**：Microsoft C++ Build Tools 一般在安装 MSVC 时自动勾选了 CMake，一般不需独立安装。我的路径为 `C:\Program Files (x86)\Microsoft Visual Studio\18\BuildTools\Common7\IDE\CommonExtensions\Microsoft\CMake\CMake\bin`。Linux 下可通过 apt 安装 `cmake`，macOS 下可通过 Homebrew 安装 `cmake`。

**备选**：从 [cmake.org](https://cmake.org) 下载独立安装，需检查 PATH。

注意 PATH 优先级——其他软件（如 Strawberry Perl）可能也包含 CMake。若使用 VSBuildTools 内置版，其他版本的 CMake 不应出现在 PATH 中，需要手动移除一下。

### 寻找编译器工具链

#### MSVC

[配！环！境！ - 秋叶冬雪 - 博客园](https://www.cnblogs.com/black-swallow/p/18519708)

[vcpkg install error:in triplet x64-windows: Unable to find a valid Visual Studio instance Could not locate a complete Visual Studio instance · Issue #22074 · microsoft/vcpkg](https://github.com/microsoft/vcpkg/issues/22074)  

[c - error: in triplet x64-windows: Unable to find a valid Visual Studio instance Could not locate a complete Visual Studio instance - Stack Overflow](https://stackoverflow.com/questions/75365556/error-in-triplet-x64-windows-unable-to-find-a-valid-visual-studio-instance-cou)  

[使用vcpkg一直报错？？？ Error: in triplet x64-windows: Unable to find a valid Visual Studio instance The fol-CSDN博客](https://blog.csdn.net/weixin_52236586/article/details/145348046)  

[Error: in triplet x64-windows: Unable to find a valid Visual Studio instance The following VS instan-CSDN博客](https://blog.csdn.net/ccf19881030/article/details/122725481)  

[【晴光春序】 Unable find valid Visual Studio instance - AcFun弹幕视频网 - 认真你就输啦 (?ω?)ノ- ( ゜- ゜)つロ](https://www.acfun.cn/a/ac48376843)  

[Error: in triplet x64-windows: Unable to find a valid Visual Studio instance The following VS instan-CSDN博客](https://blog.csdn.net/ccf19881030/article/details/122725481)

[17.10.34607.79 vcpkg error: in triplet x64-windows: Unable to find a valid Visual Studio instance - Developer Community](https://developercommunity.visualstudio.com/t/17103460779-vcpkg-error:-in-triplet/10586607?sort=active)  

[Improve check Visual Studio components by JackBoosY · Pull Request #314 · microsoft/vcpkg-tool](https://github.com/microsoft/vcpkg-tool/pull/314)

根据链接排查。目前尚未总结出方案。

## Optional Configure

### VS Code 集成

[vscode + cmake + vcpkg 搭建 C++ 开发环境 - 知乎](https://zhuanlan.zhihu.com/p/430835667)

[VS Code 变量引用](https://vscode.js.cn/docs/reference/variables-reference#_environment-variables)

VS Code 中配置 CMake 可以自动指定一些参数、环境变量、CMake 变量：

```json
"cmake.configureArgs": [
    "--preset conan-default"        // 使用 Conan preset
]
"cmake.configureSettings": {
    "CMAKE_TOOLCHAIN_FILE": "${env:VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake"  // 使用 vcpkg
}
"cmake.configureEnvironment": {
    "CONDA_PREFIX": "C:/Users/enoch/miniconda3", // 使用 conda 环境
    "ALL_PROXY": "http://127.0.0.1:20171"  // 配置代理加速
}
```

### Conda 联动

[使用 conda 作为 C++ 包管理器 - 知乎](https://zhuanlan.zhihu.com/p/353121634)

Conda 下部分 C++ 库（GSL、Pybind11）更适配 conda 的 Python 环境。用 `CMAKE_PREFIX_PATH` 指向 conda 环境：

```cmake
set(CMAKE_PREFIX_PATH "$ENV{CONDA_PREFIX}")
```

这样可以发现 conda 安装的 cpp 库，conda 在此实质上成为了包管理器。

## Project Manage

CMake 项目的依赖管理，可以通过：apt、conan、vcpkg、conda、cmake自己（FetchContent 拉取依赖）。

### 纯 CMake 项目初始化

VS Code 中按 `Ctrl+Shift+T`（CMake: Quick Start）可快速新建项目。手动创建最小 `CMakeLists.txt`：

```cmake
cmake_minimum_required(VERSION 3.16)
project(MyProject LANGUAGES CXX)

add_executable(myapp main.cpp)
```

#### 显式指定生成器

**始终显式指定 `-G`**，不要依赖默认值。常用选择：

| 平台 | 生成器 | 说明 |
|---|---|---|
| Windows（MSVC） | `-G "Ninja"` 或 `-G "Visual Studio 17 2022"` | Ninja 更快，VS 更适合调试 |
| Windows（MinGW） | `-G "MinGW Makefiles"` | MSYS2 中可用 |
| Linux | `-G "Ninja"` 或 `-G "Unix Makefiles"` | Ninja 推荐 |

```bash
cmake -G Ninja <source-dir> -DCMAKE_BUILD_TYPE=Release
cmake --build .
```

### CMakePresets

CMakePresets.json 将生成器、toolchain 文件、构建选项等固化为版本控制的配置文件，避免每次手敲参数。Conan 和 vcpkg 都利用 CMakeUserPresets.json 注入自己的 toolchain。

### FetchContent — 轻量级依赖管理

[CMake 管理外部依赖的模块 - CSDN](https://blog.csdn.net/u013318019/article/details/147656967)

[外部库管理终极方案：FetchContent vs ExternalProject - CSDN](https://wenku.csdn.net/column/5ho9nox8wi)

[HermeticFetchContent - improved dependency handling in CMake](https://tipi.build/blog/20250225-hfc-launch)

FetchContent 在**配置阶段**下载源码并通过 `add_subdirectory` 直接纳入主构建树，依赖的 target 对 IDE 索引友好，立即可用。

| 特性 | FetchContent | ExternalProject |
|---|---|---|
| 执行阶段 | 配置阶段（`cmake` 运行时） | 构建阶段（`make`/`ninja` 运行时） |
| Target 可用性 | 声明后立即可用 | 需手动创建 IMPORTED target |
| 适用依赖 | CMake 项目 | 任意构建系统 |
| 灵活性 | 简洁 | 高度可定制 |

**FetchContent 典型用法：**

```cmake
include(FetchContent)

FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG        release-1.11.0
)

FetchContent_MakeAvailable(googletest)

add_executable(my_test test.cpp)
target_link_libraries(my_test PRIVATE gtest_main)
```

**按"先查找，后下载"的原则：**

```cmake
find_package(fmt QUIET)
if(NOT fmt_FOUND)
    FetchContent_Declare(fmt
        GIT_REPOSITORY https://github.com/fmtlib/fmt.git
        GIT_TAG        10.2.1
    )
    FetchContent_MakeAvailable(fmt)
endif()
```

**适用场景**：头文件库（spdlog、nanopb）、中小型 CMake 依赖、CI/CD 确定性构建。

**局限性**：仅支持 CMake 构建的依赖；变量可能污染主项目（如 `BUILD_EXAMPLES`）；网络不稳定时 cmake 配置阶段会阻塞。

### ExternalProject — 隔离构建大型依赖

[一文搞懂 CMake ExternalProject - Runebook](https://runebook.dev/zh/docs/cmake/module/externalproject)

[CMake's ExternalProject: Common Pitfalls and the FetchContent Solution](https://runebook.dev/en/docs/cmake/module/externalproject)

ExternalProject 在**构建阶段**以独立进程执行外部项目的完整生命周期（下载→配置→编译→安装），适合非 CMake 构建或超大依赖。

```cmake
include(ExternalProject)

ExternalProject_Add(
    my_dependency
    GIT_REPOSITORY https://github.com/example/mylib.git
    GIT_TAG        v1.2.3
    CMAKE_ARGS     -DCMAKE_INSTALL_PREFIX=${CMAKE_BINARY_DIR}/installed
)

# 手动创建 IMPORTED target 让主项目引用
add_library(MyLib::mylib UNKNOWN IMPORTED)
set_target_properties(MyLib::mylib PROPERTIES
    IMPORTED_LOCATION "${CMAKE_BINARY_DIR}/installed/lib/libmylib.a"
    INTERFACE_INCLUDE_DIRECTORIES "${CMAKE_BINARY_DIR}/installed/include"
)
add_dependencies(my_app my_dependency)
target_link_libraries(my_app PRIVATE MyLib::mylib)
```

**适用场景**：非 CMake 构建（Makefile、Autotools、OpenSSL 的 Perl 脚本）、Superbuild 架构、需精确控制构建步骤。

**局限性**：target 不能直接在 CMakeLists.txt 中引用（库文件在构建阶段才存在）；必须手动管理依赖链（`add_dependencies`）；编译器设置不自动传递。

> 当项目依赖超过 10+ 个三方库时，考虑引入 vcpkg 或 Conan（参见 cpp-vcpkg / cpp-conan），而非手动用 FetchContent/ExternalProject 管理。

### 安装与打包

#### install() + CPack

[现代 CMake 学习（5）：安装与打包 (install & CPack) - 知乎](https://zhuanlan.zhihu.com/p/1925244374566025128)

在 CMakeLists.txt 中配置 `install()` 规则，配合 CPack 生成安装包。

#### 生成 pkg-config 的 .pc 文件

[CMake 中 pkg-config 详解 - CSDN](https://blog.csdn.net/Long_xu/article/details/149122823)

`cmake --install` 不会自动生成 .pc 文件，需在 CMakeLists.txt 中显式声明。

**CMake 3.20+ 新方式：**

```cmake
install(TARGETS mylib
  EXPORT mylib-targets
  PKGCONFIG_EXPORT mylib
  LIBRARY DESTINATION lib
  ARCHIVE DESTINATION lib
)
```

**旧方式（手动模板）：** 

写 `.pc.in` 文件，用 `configure_file()` 替换路径占位符后安装到 `lib/pkgconfig/`。

## Common Pitfalls

### O2/RTC1 编译选项冲突

[error D8016: "/O2"和"/RTC1"命令行选项不兼容 - 博客园](https://www.cnblogs.com/hshy/p/17950184)

MSVC Debug 模式默认启用 `/RTC1`（运行时检查），同时开 `/O2` 优化会冲突。**不要在 Debug 配置中强制设置优化级别**。

### main 在 CMakeCXXCompilerId.cpp.obj 中已定义

[main 在 CMakeCXXCompilerId.cpp.obj 中定义 - CSDN](https://blog.csdn.net/ZY2826/article/details/136901917)

CMake 配置阶段编译测试程序时与项目源文件中的 `main` 冲突。检查 CMakeLists.txt 是否错误地包含了测试文件。

## Verification Checklist

* [ ] **CMake 可用**

    ```bash
    cmake --version
    ```
* [ ] **可生成构建系统**

    ```bash
    cmake -G Ninja -B build -S .
    ```
* [ ] **可编译**

    ```bash
    cmake --build build
    ```
