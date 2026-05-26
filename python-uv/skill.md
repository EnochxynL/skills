---
name: python-uv
description: Use when managing Python environments with uv as a global environment manager, installing packages via uv pip, configuring cache and mirror sources, handling pkg_resources/setuptools compatibility, numpy version downgrades, src-layout extraPaths, and running CLI tools via uv tool install (uvx).
version: 1.0.0
author: Enochxyn
license: MIT
metadata:
  hermes:
    tags:
      - python
      - uv
      - environment-management
      - package-management
      - virtual-environment
  related_skills:
    - python-conda
    - python-uv-vscode
    - python-packages
---

# SKILL

## Python(UV) — 手动环境与自动项目管理

### Overview

uv 是一个极快的 Python 包安装器和解析器，由 Astral 开发（用 Rust 编写）。它的核心思路与 conda 类似：使用缓存把包集中存放，通过硬链接的方式链接到各个项目，从而实现依赖隔离。与 conda 不同的是，uv 可以安装 conda 没有的 pip 包和 ROCm 包。

uv虽然是围绕项目的（与conda的围绕环境不同），但完全可以把 uv 当作 conda 用，作为全局环境管理器。这样既有 conda 的 Python 版本管理、硬链接优点，又能够安装 conda 没有的 pip 和 ROCm 包。项目环境不必存在 `.venv` 下，直接在 home 下新建和项目文件夹同名的虚拟环境即可。

### When to Use

* 需要创建、激活或管理 uv python 虚拟环境时
* 需要使用 uv 安装包、添加依赖或同步项目依赖清单时
* 需要配置 uv 缓存路径、镜像源（UV\_DEFAULT\_INDEX）或环境变量时
* 需要初始化一个新的 uv python 项目（uv init）时
* 需要安装全局 CLI 工具（uv tool install / uvx）时
* 需要配置 src-layout 项目的 extraPaths 时

### 常规配置

#### 安装 uv

[Installation | uv](https://docs.astral.sh/uv/getting-started/installation/)

[Windows 安装 uv 并指定安装目录 - 图文 - ONEUE](https://www.oneue.com/articles/2430.html)

[Windows: \`uv tool update-shell\` saves but does not apply PATH change · Issue #17331 · astral-sh/uv](https://github.com/astral-sh/uv/issues/17331)

```bash
# 虽然可以通过 conda 或 scoop 安装，但是推荐官方脚本（推荐）
curl -LsSf https://astral.sh/uv/install.sh | sh

# 更新 PATH 以便运行 uv tool 可执行程序
uv tool update-shell
```

使用 `uv python list` 寻找本机的 Python 解释器。

#### 配置镜像源

uv 的配置通过环境变量控制，不放在文件中。在 `profile.ps1` 和 `.bashrc` 中设置，不污染系统环境变量：

```bash
export UV_DEFAULT_INDEX=https://pypi.tuna.tsinghua.edu.cn/simple/
```

### 可选配置

[设置 | uv 中文文档](https://uv.doczh.com/reference/settings/#cache-dir)

#### 配置缓存和环境位置

[缓存 | uv 中文文档](https://uv.doczh.com/concepts/cache/)

[uv 配置和简单使用\_uv cache-dir怎么配置-CSDN博客 uv 配置和简单使用\_uv配置缓存路径-CSDN博客](https://blog.csdn.net/cnkeysky/article/details/150272793)

**重要：uv 不支持跨盘/跨分区链接。** 缓存和环境必须位于同一文件系统分区上。

```bash
uv cache dir # 查看当前缓存路径

# 修改缓存位置
export UV_CACHE_DIR=/path/to/cache

# 修改项目环境位置（全局大环境模式）
export UV_PROJECT_ENVIRONMENT=/path/to/envs
```

将 `UV_PROJECT_ENVIRONMENT` 设为固定位置，可以像 conda 一样作为全局环境管理器使用。

### 手动环境管理

[配置项目 | uv 中文文档](https://uv.doczh.com/concepts/projects/config/#_9)

[使用环境 | uv 中文文档](https://uv.doczh.com/pip/environments/#_1)

#### 全局 CLI 工具安装

安装全局 CLI 工具（隔离环境，不污染 Python 依赖）。等同于 pipx，但更快

```bash
uv tool install <package-name>
```

可临时指定源：

```bash
uv tool install -i https://pypi.tuna.tsinghua.edu.cn/simple/ nodezator
```

#### 创建和激活虚拟环境

```bash
# 创建虚拟环境
uv venv
uv venv ~/my-project-env    # 指定名称和位置

# 激活
source ~/.<env-name>/bin/activate   # Linux/macOS
# 或 Windows:
# .\<env-name>\Scripts\activate
```

#### 包的手动安装

注意：在 uv 管理的虚拟环境中，务必使用 uv pip install，不要直接用 pip install

```bash
uv pip install <package-name> # 在虚拟环境中安装包（不添加依赖到 pyproject.toml）

uv pip install --editable ../my-package # 安装可编辑包
```

### 自动项目管理

[结构与文件 | uv 中文文档](https://uv.doczh.com/concepts/projects/layout/)

#### 生成项目配置

```bash
uv init
uv init my-project
# 生成 pyproject.toml 和 .python-version
```

#### 自动依赖管理

```bash
# 添加依赖（更新 pyproject.toml）
uv add numpy

# 删除依赖
uv remove numpy

# 添加可编辑包依赖
uv add --editable ../projects/bar/
```

应用依赖：自动安装`pyproject.toml`指定的包

```bash
uv sync
```

#### 脚本快捷方式

[mjlab/pyproject.toml at main · mujocolab/mjlab](https://github.com/mujocolab/mjlab/blob/main/pyproject.toml)

和`uv run`相关。在 `pyproject.toml` 中配置：

```toml
[project.scripts]
train = "my_package.scripts.train:main"
```

运行：

```bash
uv run train
```

#### 项目高亮路径

[Python 项目布局大揭秘：src 布局与扁平布局深度对比 - 知乎](https://zhuanlan.zhihu.com/p/24184783363)

对于 src-layout 包，即使 editable install 后代码高亮仍无法搜索内部类。在 `pyproject.toml` 中添加：

```toml
[tool.pyright]
extraPaths = [
    "source/my_package"
]
```

#### 动态import高亮

[修复pip安装isaacsim 没有Pylance类型提示\_修复isaacsim依赖-CSDN博客](https://blog.csdn.net/gengmingqi/article/details/149835516)

[Cannot click into isaaclab paths in VS Code (pip installation) - Omniverse / Isaac Sim - NVIDIA Developer Forums](https://forums.developer.nvidia.com/t/cannot-click-into-isaaclab-paths-in-vs-code-pip-installation/326339)

[How to setup linter (in VScode) for PIP installed isaacsim? - Omniverse / Isaac Sim - NVIDIA Developer Forums](https://forums.developer.nvidia.com/t/how-to-setup-linter-in-vscode-for-pip-installed-isaacsim/323481/5)

静态检查工具天生不支持动态import，因此对于像pip安装的isaaclab这样的包本就无能为力。同样添加extraPaths

### Verification Checklist

*   [ ] **uv 可用**

    ```bash
    uv --version
    uv python list
    ```
*   [ ] **缓存路径正确**

    ```bash
    uv cache dir # 与环境/缓存同分区
    ```
*   [ ] **虚拟环境可创建**

    ```bash
    uv venv test-env
    ```
*   [ ] **镜像源已配置**

    ```bash
    echo $UV_DEFAULT_INDEX
    ```
*   [ ] **包安装正常**

    ```bash
    uv pip install requests
    python -c "import requests"
    ```
*   [ ] **setuptools 版本兼容**（如需要 pkg\_resources）

    ```bash
    uv pip show setuptools | grep Version
    ```
*   [ ] **uv tool 可用**

    ```bash
    uv tool install ruff
    ruff --version
    ```

```
```
