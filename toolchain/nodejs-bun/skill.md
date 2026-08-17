---
name: nodejs-bun
description: Use when working with Node.js projects using Bun — installation, runtime upgrade, project initialization, dependency management, and global tool installation.
metadata:
  hermes:
    tags:
      - nodejs
  related_skills: []
---

# Node.js (bun) — 运行时、包管理与项目管理

## Overview

bun 是一个集 JavaScript/TypeScript 运行时、包管理器、打包器与测试运行器于一体的全能工具，由 Zig 编写、JavaScriptCore 引擎驱动，安装为单一无依赖的可执行文件。它既是 Node.js 的替代运行时，也是一个大幅快于 npm/yarn/pnpm 的包管理器（`bun install` 最多快 25x）。

> bun 自身即是运行时，因此没有类似 `pnpm env use` 的 Node.js 版本管理命令；升级 bun 即升级运行时。本 skill 覆盖 bun 的安装、升级、全局工具安装、项目初始化与依赖管理。

## When to Use

* 安装或升级 bun 运行时 / 包管理器时
* 创建新 Node.js 项目时
* 管理项目依赖（安装、更新、移除）时
* 安装全局 Node.js 工具时
* 直接运行 `.js`/`.ts`/`.tsx` 文件或 `package.json` 脚本时

## Common Install

### 安装 bun

macOS / Linux：

```bash
curl -fsSL https://bun.com/install | bash
```

Windows（PowerShell，需 Windows 10 1809+）：

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

安装后验证：

```bash
bun --version   # 1.x.y
bun --revision  # 1.x.y+b7982ac13189（精确提交）
```

若出现 `command not found`，需将安装目录 `~/.bun/bin` 加入 `PATH`：

```bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

### 升级运行时

```bash
bun upgrade           # 升级到最新稳定版
bun upgrade --canary  # 升级到最新 canary 构建
bun upgrade --stable  # 切回稳定版
```

> Homebrew 用户用 `brew upgrade bun`，Scoop 用户用 `scoop update bun`，避免与 `bun upgrade` 冲突。

## Instance Manage

### 安装全局工具

```bash
bun add -g <package-name>      # 等价于 bun install -g <package-name>
bun add --global <package-name>
```

全局安装不会改动当前项目的 `package.json`，用于安装命令行工具（如 `cowsay`）。全局包默认安装到 `~/.bun/install/global`，可执行文件链接到 `~/.bun/bin`。

## Project Manage

### 初始化项目

```bash
bun init          # 交互式选择模板（Blank / React / Library）
bun init -y       # 接受全部默认项
bun init my-app   # 在 my-app 目录下初始化
```

`bun init` 生成 `package.json`、`tsconfig.json`（或 `jsconfig.json`）、入口文件（默认 `index.ts`）、`README.md` 与 `.gitignore`，并在结束时自动运行 `bun install` 安装 `@types/bun`。React 模板：`bun init --react`、`bun init --react=tailwind`。

### 依赖管理

```bash
bun install              # 安装全部依赖（生成/更新 bun.lock）
bun add <pkg>            # 添加依赖到 dependencies
bun add -d <pkg>         # 添加开发依赖（devDependencies，-d/-D）
bun add -E <pkg>         # 精确版本号，不写 ^ 范围
bun remove <pkg>         # 移除依赖（别名 bun rm / bun uninstall）
bun update               # 更新所有依赖到范围允许的最新版（别名 bun up）
bun update <pkg>         # 只更新指定依赖
bun update --latest      # 忽略声明范围，更新到最新版（-L）
```

`bun add <pkg>` 写入 `package.json` 并更新锁文件，行为与 `uv add` 更新 `pyproject.toml` 一致；`bun install`（无参数）只同步已有依赖，更接近 `uv sync`。bun 默认写入 `bun.lock` 文本锁文件（区别于 pnpm 的 `pnpm-lock.yaml`）。

生产 / CI 安装：

```bash
bun install --production      # 不装 devDependencies（隐含 --frozen-lockfile）
bun install --frozen-lockfile # 严格按锁文件安装，不更新锁文件
bun install --dry-run         # 干跑，不实际安装
```

### 运行脚本与文件

```bash
bun run <script>         # 运行 package.json 中定义的脚本
bun run <file.ts>        # 原生运行 TypeScript/JSX，无需配置
bun run                  # 无参数列出可用脚本
```

bun 原生转译 `.ts`/`.tsx`/`.jsx`，可直接运行：

```bash
bun run index.ts
bun index.tsx            # 可省略 run 关键字，行为一致
```

## Common Pitfalls

* **生命周期脚本默认不执行**：出于安全，bun 不会执行已安装依赖的 `postinstall` 等任意生命周期脚本。需要时在 `package.json` 的 `trustedDependencies` 字段中显式列出该包，再重新安装。

    ```json
    {
      "trustedDependencies": ["my-trusted-package"]
    }
    ```

* **`bun --watch` 位置**：bun 自身 flag 要放在 `run` 之前，`bun run dev --watch` 会把 `--watch` 透传给脚本本身。

    ```bash
    bun --watch run dev   # 正确
    ```

* **`--bun` 覆盖 shebang**：本地 CLI（如 `vite`）默认按 shebang 用 `node` 执行，`bun run --bun <cli>` 强制用 bun 运行时执行。

## Verification Checklist

* [ ] **bun 已安装**

    ```bash
    bun --version
    ```
* [ ] **全局工具路径已加入 PATH**

    ```bash
    which bun        # 应指向 ~/.bun/bin/bun
    ```
* [ ] **可安装依赖**

    ```bash
    bun install
    ```
* [ ] **可运行 TypeScript**

    ```bash
    bun run index.ts
    ```
