---
name: cpp-conan
description: Use when managing C++ dependencies with Conan — installing Conan, detecting compiler profiles, creating conanfile.py/conanfile.txt, installing dependencies via conan install, integrating with CMake via presets, and creating/distributing Conan packages.
metadata:
  hermes:
    tags:
      - conan
      - c++
      - package-management
      - cmake
  related_skills:
    - cpp-cmake
    - cpp-msvc
---

# Conan — C++ 包管理器（跨平台）

## Overview

Conan 是跨平台的 C/C++ 包管理器，采用**集中缓存 + 版本区分**的模型——工作方式类似 uv 或 Maven。每个包的每个版本在 `~/.conan2`（`CONAN_HOME`）缓存中只存一份，不同项目通过版本号引用，实现项目级隔离。

相比 vcpkg，Conan 更跨平台（Linux/macOS/Windows 一视同仁），且有官方的 [ConanCenter](https://conan.io/center) 作为公共包仓库。它通过向 CMake 注入 `CMakeUserPresets.json` + toolchain 文件来工作。

## When to Use

* 安装或配置 Conan 时
* 用 `conan profile detect` 检测编译器配置时
* 在项目中通过 Conan 添加/安装依赖时
* 理解 conanfile.py vs conanfile.txt 时
* 排查 CMake preset 未生效导致找不到依赖时
* 创建和发布自己的 Conan 包时

## Common Install

### 安装

[Conan 安装文档](https://docs.conan.org.cn/2/installation.html)

[Conan 下载页](https://conan.org.cn/downloads)

[Conan 环境变量](https://docs.conan.org.cn/2/reference/environment.html)

推荐从官方安装包安装（不用 pip/conda）。配置和缓存都在 `CONAN_HOME` 目录（默认 `~/.conan2`）。

```bash
conan --version
```

### 初次配置

```bash
conan profile detect --force
```

此命令为编译器、构建配置、架构、静态/共享库等定义配置集，生成默认 profile。

```bash
conan profile show   # 查看当前 profile
```

Profile 决定了包的二进制兼容性——不同 profile 设置会产生不同版本的预编译包或触发本地重编译。

## Optional Configure

### VS Code 集成

```json
"cmake.configureArgs": [
    "--preset conan-default"
]
```

### ROS 集成

[ROS — conan 2.26.2 documentation](https://docs.conan.io/2/integrations/ros.html)

## Project Manage

### 项目初始化

[创建你的第一个 Conan 包](https://docs.conan.org.cn/2/tutorial/creating_packages/create_your_first_package.html)

```bash
conan new cmake_lib -d name=myproject -d version=0.1.0
```

生成 `conanfile.py`——描述包的元信息、依赖和构建方式。

### 添加依赖

```bash
conan require add fmt/10.2.1
```

依赖写入 `conanfile.py` 的 `requires` 方法中。也可手动编辑。

### 安装依赖

```bash
conan install .
```

这一步：解析依赖图并下载/编译缺失的包到缓存，生成 `CMakeUserPresets.json`（内含指向 Conan toolchain 的 preset），并生成配套的 `.cmake` 文件告诉 CMake 去哪找依赖。

### 构建项目

```bash
cmake --preset conan-default   # 必须带 preset！
cmake --build .
```

**`--preset conan-default` 是必须的**——没有它，CMake 看不到 Conan 安装的依赖。

### CMake 不同构建配置

[Conan 版本控制](https://docs.conan.org.cn/2/tutorial/versioning.html)

```bash
# Release
conan install . -s build_type=Release
cmake --preset conan-release

# Debug
conan install . -s build_type=Debug
cmake --preset conan-debug
```

### 自包含部署

Conan 2.0 的 `--deployer=full_deploy` 将所有依赖**完整复制**到项目的 `full_deploy/` 目录，创建完全自包含的环境（类似 npm 的 `node_modules`）：

```bash
conan install . --deployer=full_deploy
```

### 创建和发布包

[其他重要的 Conan 特性](https://docs.conan.org.cn/2/tutorial/other_features.html)

```bash
conan create .                       # 本地构建并测试包
conan upload <pkg-ref> -r=myremote   # 上传到远程仓库
```

## Verification Checklist

* [ ] **Conan 可用**

    ```bash
    conan --version
    ```
* [ ] **profile 已配置**

    ```bash
    conan profile show
    ```
