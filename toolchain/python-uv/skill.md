---
name: python-uv
description: Use when managing Python environments with uv as a global environment manager, installing packages via uv pip, configuring cache location and mirror sources (including the same-filesystem requirement that keeps cache and environments hardlinked instead of fully copied), handling pkg_resources/setuptools compatibility, numpy version downgrades, src-layout extraPaths, and running CLI tools via uv tool install (uvx).
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
  related_skills:
    - python-conda
---

# Python(UV) — 手动环境与自动项目管理

## Overview

uv 是由 Astral 开发的 Python 包安装器与解析器，使用 Rust 编写。其核心思路与 conda 类似：把包集中存放在缓存中，通过硬链接链接到各个项目，实现依赖隔离。与 conda 不同的是，uv 可以安装 conda 没有的 pip 包和 ROCm 包。

uv 以项目为中心（conda 以环境为中心），但完全可以当作全局环境管理器使用，从而同时获得 conda 的 Python 版本管理能力与硬链接去重优势。项目环境不必位于 `.venv`，也可以在 home 下创建与项目同名的虚拟环境。

## When to Use

* 创建、激活或管理 uv Python 虚拟环境
* 使用 uv 安装包、添加依赖或同步项目依赖清单
* 配置 uv 缓存路径、镜像源（`UV_DEFAULT_INDEX`）或环境变量
* 初始化新的 uv Python 项目（`uv init`）
* 安装全局 CLI 工具（`uv tool install` / `uvx`）
* 配置 src-layout 项目的 extraPaths
* **排查"跨分区导致包被完整复制而非硬链接"的问题**

## Common Install

### 安装 uv

[Installation | uv](https://docs.astral.sh/uv/getting-started/installation/)

[Windows 安装 uv 并指定安装目录 - 图文 - ONEUE](https://www.oneue.com/articles/2430.html)

[Windows: \`uv tool update-shell\` saves but does not apply PATH change · Issue #17331 · astral-sh/uv](https://github.com/astral-sh/uv/issues/17331)

```bash
# 虽然可以通过 conda 或 scoop 安装，但是推荐官方脚本
curl -LsSf https://astral.sh/uv/install.sh | sh

# 更新 PATH，以便运行 uv tool 安装的可执行程序
uv tool update-shell
```

使用 `uv python list` 查看本机可用的 Python 解释器。

### 配置镜像源

[Settings | uv — index](https://docs.astral.sh/uv/reference/settings/)

[Configuration files | uv](https://docs.astral.sh/uv/concepts/configuration-files/)

配置可通过环境变量或配置文件提供。为避免污染系统环境变量，建议写入 `profile.ps1` / `.bashrc`，或用户级配置文件 `~/.config/uv/uv.toml`。

```bash
export UV_DEFAULT_INDEX=https://pypi.tuna.tsinghua.edu.cn/simple/
```

优先级（官方原文）：*Settings provided via environment variables take precedence over persistent configuration, and settings provided via the command line take precedence over both.* 即 **命令行 > 环境变量 > 持久配置文件**。

## Optional Configure

### 配置缓存位置

[缓存 | uv 中文文档](https://uv.doczh.com/concepts/cache/)
[设置 | uv 中文文档](https://uv.doczh.com/reference/settings/#cache-dir)
[Storage | uv — Cache directory](https://docs.astral.sh/uv/reference/storage/#cache-directory)

[uv 配置和简单使用\_uv cache-dir怎么配置-CSDN博客 uv 配置和简单使用\_uv配置缓存路径-CSDN博客](https://blog.csdn.net/cnkeysky/article/details/150272793)

> For optimal performance, the cache directory needs to be on the same filesystem as virtual environments.

**规则：uv 不支持跨盘/跨分区链接，缓存与环境必须位于同一文件系统**：uv 安装包时通过 link mode 把缓存中的文件链接进目标环境，而非全量复制。Linux 上默认 link mode 为 `clone`（写时复制 reflink）；文件系统不支持 reflink 时降级为 `hardlink`；**当缓存与目标环境跨文件系统时硬链接不可用，最终降级为全量复制**，并输出警告：

```
warning: Failed to hardlink files; falling back to full copy. This may lead to degraded performance.
         If the cache and target directories are on different filesystems, hardlinking may not be supported.
         If this is intentional, set `export UV_LINK_MODE=copy` or use `--link-mode=copy` to suppress this warning.
```

**根因是 Linux VFS 不允许跨文件系统硬链接**，这不是 uv 的缺陷：`ln` 与 `cp -l` 在跨设备时同样失败（报 `无效的跨设备链接`）。因此所有依赖硬链接去重的工具（uv、pnpm、cargo 等）都受同一约束，无法通过更换工具规避。

`--link-mode` 可选值（出处：`uv help pip install`）：

| 值 | 说明 | 前提 |
|---|---|---|
| `clone` | 写时复制（reflink） | macOS / Linux 默认值；需文件系统支持 reflink |
| `hardlink` | 硬链接 | Windows 默认值；需缓存与目标同文件系统 |
| `symlink` | 符号链接 | 可跨文件系统，但官方明确警告其脆弱性 |
| `copy` | 全量复制 | 无 |

官方对 `symlink` 的警告原文：

> WARNING: The use of symlink link mode is discouraged, as they create tight coupling between the cache and the target environment. For example, clearing the cache (`uv cache clean`) will break all installed packages by way of removing the underlying source files.

硬链接具备引用计数保护（清理缓存不会破坏已安装的环境），符号链接不具备 —— 这是两者在安全性上的本质差异。

#### 方案一：用环境变量指定位置，集中维护环境

[Storage | uv — Cache directory](https://docs.astral.sh/uv/reference/storage/#cache-directory) · [Environment variables | uv](https://docs.astral.sh/uv/reference/environment/) · [Configuration files | uv — 优先级](https://docs.astral.sh/uv/concepts/configuration-files/)

```bash
uv cache dir                            # 查看当前缓存路径
export UV_CACHE_DIR=/path/to/cache      # 缓存位置；默认 ~/.cache/uv（跟随 XDG_CACHE_HOME）
export UV_PROJECT_ENVIRONMENT=/path/to/envs   # 项目环境位置；默认 <项目根>/.venv
```

`UV_PROJECT_ENVIRONMENT` 需要逐项目唯一值：将其设为固定位置可像 conda 一样统一大环境，但所有项目将共用同一环境；若追求逐项目隔离则需逐项目配置，维护成本高。**当目标仅为避免跨文件系统复制时，改 `UV_CACHE_DIR` 是单点操作，改 `UV_PROJECT_ENVIRONMENT` 是逐项目操作。**

[direnv — Setup](https://direnv.net/docs/hook.html)
[direnv — stdlib（`source_up`）](https://direnv.net/man/direnv-stdlib.1.html)

**按目录自动维护环境变量**可用 `direnv`。注意 direnv 只加载**最近的**一个 `.envrc`，父目录的不会被自动累加；需要继承时，在被遮蔽侧写 `source_up_if_exists`。因此可在分区根放置一个 `.envrc` 覆盖该分区下的所有项目。

#### 方案二：在分区根放置 `uv.toml`

> 出处：[Configuration files | uv](https://docs.astral.sh/uv/concepts/configuration-files/)

uv 会**向上查找 `uv.toml`**。所以，对于跨分区链接，在分区根放一个 `uv.toml` 即可。官方原文：

> uv will search for a `pyproject.toml` or `uv.toml` file in the current directory, **or in the nearest parent directory**.

因此在分区根放置一个 `uv.toml`，即可统一该分区下所有项目的配置：

```toml
# /media/enoch/DISK/uv.toml
cache-dir = "/media/enoch/DISK/.uv-cache"
```

效果：该分区下所有项目（含任意子目录）的 `uv cache dir` 均指向该路径；环境位于项目内 `.venv`，与缓存同文件系统，硬链接生效，零复制。

**对照：pnpm 具备同类"自动同盘"行为。** 当默认 store 与项目跨文件系统时，pnpm 自动在项目所在分区根创建 `.pnpm-store`，无需任何配置。uv **没有**这种自动行为（在分区内的项目中执行 `uv cache dir` 仍返回 `~/.cache/uv`），必须显式配置。

> 出处：`pnpm install` 运行时输出：`Content-addressable store is at: <分区根>/.pnpm-store/...`

相关规则（出处同上）：

* `uv.toml` 优先于同目录的 `pyproject.toml`；后者的 `[tool.uv]` 将被忽略
* 三层配置合并顺序：project > user > system；**数组为拼接而非覆盖**
* 不含 `[tool.uv]` 表的 `pyproject.toml` 会被忽略，uv 继续向上查找
* 用户级与系统级配置文件**不能**使用 `pyproject.toml` 格式

**限制：`tool` 命令忽略本地配置文件。** 官方原文：

> For `tool` commands, which operate at the user level, local configuration files will be ignored. Instead, uv will exclusively read from user-level configuration (e.g., `~/.config/uv/uv.toml`) and system-level configuration.

即 `uv tool install` 与 `uvx` 不会读取分区根的 `uv.toml`，需另行在用户级配置或环境变量中指定。

**Pitfall：分区根配置出错会影响该分区下所有 uv 命令。** 写入当前版本不支持的键会直接导致 TOML 解析错误，且波及该分区下每一个项目。添加键后应先执行 `uv cache dir` 验证，避免一次写入多个未验证的键。

#### 方案三：`centralized-project-envs` 预览特性（uv 自动同盘）

[Project layout | uv — Centralized project environments](https://docs.astral.sh/uv/concepts/projects/layout/#centralized-project-environments) · [Preview features | uv](https://docs.astral.sh/uv/concepts/preview/)

官方说明原文：

> With the `centralized-project-envs` preview feature, uv stores the default project environment in its cache. uv attempts to maintain a `.venv` directory link to the cached environment so existing activation and editor workflows can continue to use the usual path. If link creation fails, uv attempts to write the cached environment path to `.venv` instead. If both attempts fail, uv continues using the cached environment directly, but tools relying on `.venv` may not discover it. Switching interpreters selects separate cached environments and can reuse them later.

该特性让 uv 把项目环境存放于缓存目录内，并**自动维护 `.venv` 符号链接**，因此缓存与环境永远位于同一文件系统，无需任何逐项目配置。

配置（写入选定的配置文件即可，无需环境变量）：

```toml
# /media/enoch/DISK/uv.toml
cache-dir = "/media/enoch/DISK/.uv-cache"
preview-features = ["centralized-project-envs"]
```

启用后执行普通 `uv sync`，uv 自动创建并维护链接：

```
.venv -> /media/enoch/DISK/.uv-cache/environments-v2/<项目名>-cp<版本>-<哈希>
```

约束与注意事项：

* **版本要求：uv ≥ 0.11.25**（引入版本，PR [#18214](https://github.com/astral-sh/uv/pull/18214)）。低于该版本执行会报 `Unknown feature flag`。推荐使用最新版，因 0.11.30 / 0.11.31 包含该特性的后续修复（symlink 访问工作区、含路径的 `.venv` 文件）。
* **与 `UV_PROJECT_ENVIRONMENT` 互斥**：官方原文 —— *Explicit project environment paths, including `UV_PROJECT_ENVIRONMENT` and environments selected with `--active`, are not centralized.*
* `--no-cache` 时该特性无效。
* 环境位于缓存中，`uv cache clean` / `uv cache prune` 会将其移除，下次使用时重建。
* 对项目/工作区根目录下的无路径 `uv venv` 调用同样生效。

其他启用方式（出处同上）：

```bash
uv run --preview                                 # 开启全部预览特性
uv run --preview-features centralized-project-envs
UV_PREVIEW=1  /  UV_PREVIEW_FEATURES=centralized-project-envs
preview-features = true                          # 开启全部
--no-preview                                     # 关闭全部
```

注意 `preview-features`（数组）与布尔 `preview` 是不同版本的键。旧版本（如 0.11.6）的 `uv.toml` 只接受布尔 `preview`，不接受数组形式。

#### 方案在双系统下的限制

[Project layout | uv — Centralized project environments](https://docs.astral.sh/uv/concepts/projects/layout/#centralized-project-environments) · [Storage | uv — Cache directory](https://docs.astral.sh/uv/reference/storage/#cache-directory)

该特性与"双系统共享同一缓存"在原理上冲突，建议仅在单系统环境下启用。

**环境目录本身不会碰撞。** 环境目录名形如 `<项目名>-cp<Python版本>-<哈希>`，其哈希包含项目的**绝对路径**（并解析真实路径，经符号链接访问会得到同一目录）。因此 Linux 的 `/media/enoch/DISK/...` 与 Windows 的 `D:\...` 会算出不同哈希，两个平台的虚拟环境在共享缓存中各自独立；额外磁盘占用仅为 venv 骨架，包文件仍从同一 `archive-v0` 硬链接。

**但存在两个跨平台争用点：**

1. **`.venv` 链接器争用。** Linux 下 `.venv` 为符号链接；Windows 下创建符号链接可能失败，此时 uv 按官方说明退化为把环境路径写入 `.venv` 普通文件。同一项目目录被两个系统使用时，两侧会互相覆盖 `.venv`，表现为激活失败或编辑器找不到解释器。
2. **`uv cache clean` / `uv cache prune` 跨平台误删。** 集中化的环境会被缓存清理命令移除；在共享缓存下，另一系统独有的环境在本侧视角中从未被访问，存在被判为未使用而删除的风险。

**根本原因**：该特性把**平台耦合**的虚拟环境放进了**内容寻址**的缓存，抹去了"缓存共享、环境隔离"的边界。对照 pnpm 的设计：其 store 为纯内容寻址（文件名仅含内容哈希），平台相关的 `node_modules` 始终留在项目内，边界清晰。

**双系统场景应改用方案二**（分区根 `uv.toml` 指定 `cache-dir`）：缓存跨平台共享去重，环境留于 `<项目根>/.venv` 实现平台隔离，且因环境与缓存同分区，硬链接依然生效。

> 待验证项：源码构建缓存（`sdists-v9`、`builds-v0`）的键理论上必须包含平台信息（构建产物需在目标平台编译），但未取得实测证据。若该键不含平台，跨系统共享缓存会复用另一平台的编译产物。

#### 方案对比与验证

| 方案 | 零复制 | 逐项目维护 | 缓存位置 | 前提条件 |
|---|---|---|---|---|
| 环境变量 `UV_CACHE_DIR` | ✅ | 无（单值全局） | 可任意指定 | 需配合 direnv 等按目录维护工具 |
| 分区根 `uv.toml` | ✅ | 无（一个文件覆盖全分区） | 分区内 | 接受"一处出错波及全分区"的风险 |
| `centralized-project-envs` | ✅ | 无（uv 自动维护链接） | 分区内 | uv ≥ 0.11.25 |

验证硬链接是否生效

```bash
# 在缓存目录中反查是否有同 inode 的文件；有命中即硬链接生效
find <缓存目录> -samefile <环境中的文件>
```

**不可**使用 `find <缓存目录> -name <文件名>` 进行判断：uv 缓存内的归档按哈希目录组织，pnpm 等工具更是内容寻址命名，按文件名查找会漏判并得出错误结论。

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

```bash
uv tool install <package-name>

# 临时指定源
uv tool install -i https://pypi.tuna.tsinghua.edu.cn/simple/ nodezator
```

### 全局 CLI 工具免安装运行

[Tools | uv](https://docs.astral.sh/uv/guides/tools/)
[How to Use uvx to Run Python Tools from Any Git Branch or Commit | BSWEN](https://docs.bswen.com/blog/2026-03-05-uvx-git-branch/#:~:text=The%20key%20syntax%20is%20uvx%20--from%20git%2Bhttps%3A%2F%2Fgithub.com%2Fuser%2Frepo%40ref%20tool-name.,and%20lets%20you%20test%20development%20versions%20in%20seconds.)

`uvx`（等价于 `uv tool run`）在临时隔离环境中直接运行工具，不产生持久安装。

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
```

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

> 出处：此为编辑器/LSP 侧配置，非 uv 功能。字段定义见 [Pyright configuration](https://microsoft.github.io/pyright/#/configuration)

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
* [ ] **缓存路径正确，且与环境位于同一文件系统**

    ```bash
    uv cache dir                                  # 应与环境位于同一分区
    find <缓存目录> -samefile <环境中的文件>       # 有命中 = 硬链接生效
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
