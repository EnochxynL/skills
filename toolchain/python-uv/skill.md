---
name: python-uv
description: Use when managing Python environments with uv as a global environment manager, installing packages via uv pip, configuring the cache/environment filesystem layout (including the ext4-centralized layout that keeps cache, tool environments and project environments hardlinked instead of fully copied), the uv.toml configuration system and its precedence rules, mirror sources, pkg_resources/setuptools compatibility, numpy version downgrades, src-layout extraPaths, and running CLI tools via uv tool install (uvx).
metadata:
  hermes:
    tags:
      - python
      - uv
      - environment-management
      - package-management
      - virtual-environment
      - filesystem
      - hardlink
      - configuration
  related_skills:
    - python-conda
---

# Python(UV) — 手动环境与自动项目管理

## Overview

[An extremely fast Python package and project manager | uv](https://docs.astral.sh/uv/)

uv 是由 Astral 开发的 Python 包安装器与解析器，使用 Rust 编写。其核心思路与 conda 类似：把包集中存放在缓存中，通过硬链接链接到各个项目，实现依赖隔离。与 conda 不同的是，uv 可以安装 conda 没有的 pip 包和 ROCm 包。

uv 以项目为中心（conda 以环境为中心），但完全可以当作全局环境管理器使用，从而同时获得 conda 的 Python 版本管理能力与硬链接去重优势。

## When to Use

* 创建、激活或管理 uv Python 虚拟环境
* 使用 uv 安装包、添加依赖或同步项目依赖清单
* 配置 uv 缓存路径、镜像源（`UV_DEFAULT_INDEX`）或环境变量
* 初始化新的 uv Python 项目（`uv init`）
* 安装全局 CLI 工具（`uv tool install` / `uvx`）
* 配置 src-layout 项目的 extraPaths
* **排查"跨分区导致包被完整复制而非硬链接"的问题**
* **规划缓存的落盘分区**（尤其多分区或双系统环境）

## Common Install

### 安装 uv

[Windows 安装 uv 并指定安装目录 - 图文 - ONEUE](https://www.oneue.com/articles/2430.html)

[Windows: \`uv tool update-shell\` saves but does not apply PATH change · Issue #17331 · astral-sh/uv](https://github.com/astral-sh/uv/issues/17331)

推荐使用官方脚本安装（虽可通过 conda 或 scoop 安装，但不推荐 —— 两者版本常落后，且 `uv self update` 不适用）：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh

# 把 uv tool 的可执行文件目录加入 PATH
uv tool update-shell
```

使用 `uv python list` 查看本机可用的 Python 解释器。

### 认识配置系统

[Configuration files | uv](https://docs.astral.sh/uv/concepts/configuration-files/)

配置可通过环境变量或配置文件提供。为避免污染系统环境变量，建议写入 `profile.ps1` / `.bashrc`，或用户级配置文件 `~/.config/uv/uv.toml`。

uv 的配置分为两层：**project 级**（向上查找发现）与 **user / system 级**（固定目录发现）。

- 优先级链：**命令行 > 环境变量 > project 级 > user 级 > system 级**
- 标量键冲突时高层**覆盖**低层；**数组键冲突时拼接**（project 的排在前面，不会被顶掉）

**project 级**：
- `uv.toml` 优先于同目录的 `pyproject.toml`（后者整个被忽略）
- `--no-config` 可完全禁用持久配置发现
- **向上查找规则**：向上查找在**第一个含 `[tool.uv]` 表的 `pyproject.toml`** 处**停止**。因此项目自身一旦带 `[tool.uv]`，更上层（例如分区根）的 `uv.toml` 就**永远看不到**。

**user / system 级**（独立发现，不参与向上查找，因此不受上述截断影响）：
- user / system 级配置文件不使用 `pyproject.toml` 格式
- 同类多文件时，只取先发现的一个（如 system 级同时存在 `/etc/uv/uv.toml` 与 `$XDG_CONFIG_DIRS/uv/uv.toml`，XDG 优先）
- `uv tool install` 与 `uvx` 不读取 project 级配置，但**会**读取 user 级配置。

**最后，还有环境变量级**

| 平台 | user 级 | system 级 |
|---|---|---|
| Linux / macOS | `~/.config/uv/uv.toml` | `/etc/uv/uv.toml` |
| Windows | `%APPDATA%\uv\uv.toml` | `%PROGRAMDATA%\uv\uv.toml` |

配置没有 include / extends 机制。实测写入 `include = [...]` 或 `extends = "..."` 均报 `unknown field`，且完整合法键清单（约 71 个键）中不存在任何导入类键。

### 配置镜像源

```bash
export UV_DEFAULT_INDEX=https://pypi.tuna.tsinghua.edu.cn/simple/
```

### 配置缓存位置

[uv 配置和简单使用\_uv cache-dir怎么配置-CSDN博客 uv 配置和简单使用\_uv配置缓存路径-CSDN博客](https://blog.csdn.net/cnkeysky/article/details/150272793)

uv 安装包时通过 `--link-mode` （出处：`uv help pip install`）把缓存中的文件"链接"进目标环境，Linux 上默认 `--link-mode clone`（写时复制 reflink）；文件系统不支持 reflink 时降级为 `hardlink`；**当缓存与目标环境跨文件系统时硬链接不可用，最终降级为全量复制`--link-mode copy`**，并输出警告：`warning: Failed to hardlink files; falling back to full copy.`，根因是 Linux VFS 不允许跨文件系统硬链接。

当然也可以通过`--link-mode symlink`跨文件系统符号链接，但官方对 `symlink` 的警告：

> WARNING: The use of symlink link mode is discouraged, as they create tight coupling between the cache and the target environment. For example, clearing the cache (`uv cache clean`) will break all installed packages by way of removing the underlying source files.

硬链接具备引用计数保护（清理缓存不会破坏已安装的环境），符号链接不具备 —— 这是两者在安全性上的本质差异。

#### 推荐方案：`centralized-project-envs` 集中方案

[Project layout | uv — Centralized project environments](https://docs.astral.sh/uv/concepts/projects/layout/#centralized-project-environments)
[Preview features | uv](https://docs.astral.sh/uv/concepts/preview/)
[Storage | uv — Configuration directories](https://docs.astral.sh/uv/reference/storage/)

- 在Windows下我习惯这样一键写入：`'{0}preview-features = ["centralized-project-envs"]' -f '' | Set-Content "$env:APPDATA\uv\uv.toml"`
- 环境变量为`UV_PREVIEW=1`和`UV_PREVIEW_FEATURES=centralized-project-envs`

配置写入效果如下：

```toml
# ~/.config/uv/uv.toml     （Windows: %APPDATA%\uv\uv.toml）
preview-features = ["centralized-project-envs"]
```

**版本要求：uv ≥ 0.11.25**（引入版本，PR [#18214](https://github.com/astral-sh/uv/pull/18214)）。低于该版本报 `Unknown feature flag`。推荐最新版，因 0.11.30 / 0.11.31 含该特性的后续修复（symlink 访问工作区、含路径的 `.venv` 文件）。`--no-cache` 和指定 `UV_PROJECT_ENVIRONMENT` 时该特性无效。

`centralized-project-envs` 把项目环境也纳入缓存目录 —— 「同文件系统」由构造保证，与项目位于哪个分区无关。最终让三类产物全部落在同一个分区（系统盘）

| 产物 | 默认位置（Linux） | 设备 |
|---|---|---|
| 缓存 | `~/.cache/uv` | 系统盘 |
| 工具环境 | `~/.local/share/uv/tools` | 系统盘 |
| 项目环境 | `~/.cache/uv/environments-v2/`（由本特性决定） | **系统盘** |

启用后执行普通 `uv sync`，uv 在项目文件夹内自动创建并维护软链接：

```
<项目>/.venv -> ~/.cache/uv/environments-v2/<项目名>-cp<Python版本>-<哈希>
```

切换系统后第一次 `uv sync` 需重建一次链接，这不会破坏缓存中的环境，因此不需要重新下载。但是`uv cache clean` / `uv cache prune` 会一并删除项目环境，项目 `.venv` 变成死链。

可以用 `find <缓存目录> -samefile <环境中的文件>` 验证硬链接是否生效。

## Optional Configure

## Instance Manage

[配置项目 | uv 中文文档](https://uv.doczh.com/concepts/projects/config/#_9)

[使用环境 | uv 中文文档](https://uv.doczh.com/pip/environments/#_1)

### 创建和激活虚拟环境

[Project layout | uv](https://docs.astral.sh/uv/concepts/projects/layout/) · [Using environments | uv](https://docs.astral.sh/uv/pip/environments/)

```bash
uv venv                     # 在当前目录创建 .venv
uv venv ~/my-project-env    # 指定名称与位置

source ~/.<env-name>/bin/activate   # Linux / macOS
# Windows: .\<env-name>\Scripts\activate
```

### 包的手动安装

[Managing packages | uv](https://docs.astral.sh/uv/pip/packages/)

在 uv 管理的虚拟环境中应使用 `uv pip` 安装包，不要直接使用 `pip install`。

```bash
uv pip install <package-name>             # 安装包（不写入 pyproject.toml）
uv pip install --editable ../my-package   # 以可编辑模式安装
```

### 全局 CLI 工具安装

> 出处：[Tools | uv](https://docs.astral.sh/uv/guides/tools/)

在隔离环境中安装全局 CLI 工具，等同于 pipx 但更快。
环境位置由 `UV_TOOL_DIR` 决定（默认 `~/.local/share/uv/tools`，Windows 为 `%APPDATA%\uv\tools`）；可执行文件为指向该环境的符号链接，放在 `UV_TOOL_BIN_DIR`（默认 `~/.local/bin`）。

```bash
uv tool install <package-name>

# 临时指定源
uv tool install -i https://pypi.tuna.tsinghua.edu.cn/simple/ nodezator
```

注意：`uv tool install` 的环境与缓存必须同文件系统才能硬链接；若两者分处不同分区，会退化为全量复制（`uvx` 不受影响 —— 它的环境建在缓存目录内）。

### 全局 CLI 工具免安装运行

[Tools | uv](https://docs.astral.sh/uv/guides/tools/)
[How to Use uvx to Run Python Tools from Any Git Branch or Commit | BSWEN](https://docs.bswen.com/blog/2026-03-05-uvx-git-branch/#:~:text=The%20key%20syntax%20is%20uvx%20--from%20git%2Bhttps%3A%2F%2Fgithub.com%2Fuser%2Frepo%40ref%20tool-name.,and%20lets%20you%20test%20development%20versions%20in%20seconds.)

`uvx`（等价于 `uv tool run`）在临时隔离环境中直接运行工具，不产生持久安装。
官方说明：*Packages are installed into an ephemeral virtual environment in the uv cache directory.* —— 环境位于缓存目录内，因此与缓存必然同盘。

```bash
uvx <tool-name>
uvx --from git+https://github.com/user/repo@ref <tool-name>   # 从指定 git ref 运行
```

参考实例：[How to Use uvx to Run Python Tools from Any Git Branch or Commit | BSWEN](https://docs.bswen.com/blog/2026-03-05-uvx-git-branch/)

## Project Manage

### 生成项目配置

[Creating projects | uv](https://docs.astral.sh/uv/concepts/projects/init/)

```bash
uv init              # 在当前目录初始化
uv init my-project   # 新建目录并初始化
```

生成 `pyproject.toml` 与 `.python-version`。

### 自动依赖管理

[Managing dependencies | uv](https://docs.astral.sh/uv/concepts/projects/dependencies/) · [Locking and syncing | uv](https://docs.astral.sh/uv/concepts/projects/sync/)

```bash
uv add numpy                        # 添加依赖（更新 pyproject.toml）
uv remove numpy                     # 删除依赖
uv add --editable ../projects/bar   # 添加可编辑包依赖
uv sync                             # 按 pyproject.toml 同步环境
uv sync --reinstall                 # 强制重装（用于把已有的复制品转为硬链接）
```

**Pitfall：`pyproject.toml` 缺少 `dependencies` 段的项目**，`uv sync` 会创建一个空环境（`Resolved in 2ms`、`Checked in 0.01ms`），不报错也不装任何包。此类项目的依赖另在 `requirements.txt` / `setup.py` 中，需改用 `uv pip install` 流程。

### 脚本快捷方式

[Running commands | uv](https://docs.astral.sh/uv/concepts/projects/run/)

在 `pyproject.toml` 中声明入口：

```toml
[project.scripts]
train = "my_package.scripts.train:main"
```

运行：

```bash
uv run train
```

参考实例：[mjlab/pyproject.toml](https://github.com/mujocolab/mjlab/blob/main/pyproject.toml)

### 项目高亮路径（src-layout）

[Python 项目布局大揭秘：src 布局与扁平布局深度对比 - 知乎](https://zhuanlan.zhihu.com/p/24184783363)

> 出处：此为编辑器 / LSP 侧配置，**非 uv 功能**。字段定义见 [Pyright configuration](https://microsoft.github.io/pyright/#/configuration)

对于 src-layout 包，即使 editable install 后代码高亮仍无法搜索内部类。在 `pyproject.toml` 中添加：

```toml
[tool.pyright]
extraPaths = [
    "source/my_package"
]
```

### 动态 import 高亮（静态检查工具的固有局限）

> 出处：同上，非 uv 功能

静态检查工具天生不支持动态 import，对 pip 安装的 isaaclab 这类包无解，同样通过 `extraPaths` 缓解。

参考资料：
* [修复 pip 安装 isaacsim 没有 Pylance 类型提示 - CSDN](https://blog.csdn.net/gengmingqi/article/details/149835516)
* [Cannot click into isaaclab paths in VS Code (pip installation) - NVIDIA Developer Forums](https://forums.developer.nvidia.com/t/cannot-click-into-isaaclab-paths-in-vs-code-pip-installation/326339)
* [How to setup linter (in VScode) for PIP installed isaacsim? - NVIDIA Developer Forums](https://forums.developer.nvidia.com/t/how-to-setup-linter-in-vscode-for-pip-installed-isaacsim/323481/5)

## Verification Checklist

* [ ] **uv 可用**

    ```bash
    uv --version
    uv python list
    ```
* [ ] **三类产物同文件系统**（ext4 集中方案的核心断言）

    ```bash
    echo "cache: $(uv cache dir)"
    echo "tool : $(uv tool dir)"
    stat -c '%d' "$(uv cache dir)" "$(uv tool dir)"   # 两行设备号应相同
    ```

    出处：[Storage | uv — Configuration directories](https://docs.astral.sh/uv/reference/storage/)

* [ ] **硬链接生效（非复制）**

    ```bash
    f=$(find <项目>/.venv -name '*.py' -path '*site-packages*' | head -1)
    find "$(uv cache dir)" -samefile "$f" | wc -l      # >0 即硬链接
    # 或量化真实边际占用
    find <项目>/.venv -type f -links 1 -printf '%s\n' | awk '{s+=$1} END{printf "%.1f MB\n", s/1048576}'
    ```
* [ ] **虚拟环境可创建**

    ```bash
    uv venv test-env
    ```
* [ ] **镜像源已配置**

    ```bash
    echo $UV_DEFAULT_INDEX
    ```
* [ ] **包安装正常**

    ```bash
    uv pip install requests
    python -c "import requests"
    ```
* [ ] **setuptools 版本兼容**（如需 `pkg_resources`）

    ```bash
    uv pip show setuptools | grep Version
    ```
* [ ] **uv tool 可用**

    ```bash
    uv tool install ruff
    ruff --version
    ```
