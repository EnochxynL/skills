---
name: nodejs-pnpm
description: Use when working with Node.js projects using pnpm — installation, Node.js version management, project initialization, dependency management, and global tool installation.
metadata:
  hermes:
    tags:
      - nodejs
  related_skills: []
---

# Node.js / pnpm — 包管理与项目管理

## Overview

pnpm 是 Node.js 的高效包管理器，很像 Python 的 uv，Rust 构建、硬链接机制、支持 Node.js 版本管理、干净卸载。本 skill 覆盖 pnpm 的安装、Node.js 版本管理、全局工具安装、项目初始化与依赖管理。

> 对比：bun 是超越 pnpm 和 uv 的包管理器，拥有更灵活的链接机制，集 uv、pytest、pyinstaller 等功能于一身。

## When to Use

* 安装或配置 pnpm / Node.js 环境时
* 创建新 Node.js 项目时
* 管理项目依赖（安装、更新、移除）时
* 安装全局 Node.js 工具时
* 切换 Node.js 版本时

## Common Install

### 安装 pnpm

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
source /home/enoch/.bashrc
```

### 指定全局 nodejs 版本

```bash
pnpm env use --global lts
```

## Instance Manage

### 安装全局工具

[安装 - OpenClaw](https://docs.openclaw.ai/zh-CN/install#npm%E3%80%81pnpm-%E6%88%96-bun)

```bash
pnpm install -g <package-name>
```

在这里，`pnpm install <pkg>` 是兼容 npm 习惯的遗留语法，实际效果和 `pnpm add <pkg>` 完全一样。

## Project Manage

### 初始化项目

```bash
pnpm init
```

### 依赖管理

```bash
pnpm install              # 安装全部依赖
pnpm add <pkg>            # 添加依赖（等价于 pnpm install <pkg>）
pnpm add -D <pkg>         # 添加开发依赖
pnpm remove <pkg>         # 移除依赖
pnpm update               # 更新所有依赖
```

`pnpm add <pkg>` 安装包并写入 `package.json`，行为和 `uv add` 更新 `pyproject.toml` 一样。`pnpm install`（无参数）则只同步已有依赖，更接近 `uv sync`。

`pnpm install <pkg>` 也能加包，但这是兼容 npm 习惯的遗留语法，实际效果和 `pnpm add <pkg>` 完全一样。一个 `install` 承担了"全量同步"和"加新包"两种截然不同的职责，所以 pnpm 把后者拆成了语义更清晰的 `add`。日常只用 `pnpm add` 即可。

### 运行脚本

```bash
pnpm run <script>         # 运行 package.json 中定义的脚本
```

## Common Pitfalls

[No package.json (or package.yaml, or package.json5) was found in "/Users/yutengjing/Library/pnpm/global/5" · Issue #4645 · pnpm/pnpm](https://github.com/pnpm/pnpm/issues/4645)

已修复

## Verification Checklist

* [ ] **pnpm 已安装**

    ```bash
    pnpm --version
    ```
* [ ] **Node.js 可用**

    ```bash
    node --version
    ```
* [ ] **全局工具路径已加入 PATH**

    ```bash
    pnpm bin -g
    ```
* [ ] **可安装依赖**

    ```bash
    pnpm install
    ```