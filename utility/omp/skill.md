---
name: omp
description: Use when 安装或配置 omp（Oh My Pi）终端 coding agent——从零安装、环境变量分层、LLM API 与模型角色、DeepSeek Web Search 伪装、MCP/Skill/插件管理。
version: 0.1.0
author: Enoch
license: MIT
metadata:
  hermes:
    tags: [omp, oh-my-pi, coding-agent, install, config]
    related_skills: []
---

# Oh My Pi — 项目 AI Agent 配置与集成

## Overview

omp（Oh My Pi）是 can1357 基于 Mario Zechner 的 pi-mono 深度 fork 的终端 coding agent，定位是"把 IDE 焊死在终端里"：约 8 万行 Rust 核心内建 31 个工具、14 种 LSP 操作、28 种 DAP 调试操作，以及 hash-anchored（ast_edit）结构化编辑，让 agent 拥有 IDE 级的代码感知与调试深度，而不是"读文件 + 撒 print"。

它的核心特质：模型无关（60+ provider，不绑定任何一家）；继承 pi 的扩展系统与包生态（pi 插件经 `pkg.pi` fallback + legacy shim 兼容，非无缝）；保留树状会话（`/tree` 从任意节点继续）；folder-local 记忆（mnemopi + Hindsight，默认关闭、opt-in）——因此天然适合做"专注单个文件夹、默认不串味"的项目管家；工具可裁剪（`--tools` 白名单）；MIT 开源，可 fork 掌控核心。

## When to Use

- 从零安装 omp（Windows / macOS / Linux）
- 配置环境变量分层（.env 链）与 LLM API / 模型角色
- 配置 DeepSeek 伪装 Anthropic Web Search
- 管理 MCP 服务器、Skill、插件
- 排查 omp 的配置/发现优先级问题

## Common Install

### 安装

```
irm https://omp.sh/install.ps1 | iex
```

The installer accepts `--source` (force Bun), `--binary` (force prebuilt), and `--ref <tag|branch|commit>` for pinning. Set `PI_INSTALL_DIR` to override the install directory.

### 环境配置

[omp — a coding agent with the IDE wired in](https://omp.sh/docs/env)
[环境变量 | Oh My Pi 中文文档](https://aieguu.github.io/omp-docs-cn/reference/env)

据我实测，默认是按照 `--binary` 方式安装的，是 `%LOCALAPPDATA%\omp\omp.exe` 单文件。

omp 通过分层 `.env` 链解析环境变量。第一个定义某 key 的来源生效：

1. 已有的进程环境。
2. `$PWD/.env` — omp 启动目录中的项目 .env。
3. `~/.omp/agent/.env` — 或 `$PI_CODING_AGENT_DIR/.env` / `$PI_CONFIG_DIR/agent/.env`（如已设置）。
4. `~/.omp/.env` — 遵循 PI_CONFIG_DIR。
5. `~/.env` — 用户 home 目录下的 .env。

### LLM API 配置

[Oh My Pi (omp) 完全指南：终端里功能最全的 AI 编程代理 - 知乎](https://zhuanlan.zhihu.com/p/2060742219141756666)

使用 `omp` 命令进入程序。初次使用会自动进入 `omp setup` 配置向导。也可以使用 `/login` 命令设置 LLM API

omp 有独特的模型角色设计，按任务意图路由不同模型：

|角色|用途|命令行指定|
|---|----|---------|
|default|正常对话/编码|--model|
|smol|廉价子代理 fan-out|--smol|
|slow|深度推理|--slow|
|plan|规划模式|--plan|

实用配置策略：

```
# 默认用 DeepSeek V4 Flash（快、便宜）
# 复杂任务切 GPT-5.6 Sol
# 子代理用 GPT-5.4 Mini
omp --model "DeepSeek-V4-Flash" --slow "gpt-5.6-sol" --smol "gpt-5.4-mini"
```

### Web 配置

[Integrate with Claude Code | DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code/)
[Provider 认证与管理 | Oh My Pi 中文文档](https://aieguu.github.io/omp-docs-cn/guide/providers)

> The DeepSeek API natively supports the Web Search feature in Claude Code. 

配套的 Anthropic 兼容表里，消息字段 `type = "web_search_tool_result"` 和 `type = "server_tool_use"` 都是 Supported——这就是
Anthropic 服务端搜索工具的回包格式。想用 DeepSeek "伪装" Anthropic 的 Web Search 功能，直接在 `.env` 里配置：

```
ANTHROPIC_SEARCH_API_KEY=<你的DeepSeek key>
ANTHROPIC_SEARCH_BASE_URL=https://api.deepseek.com/anthropic
ANTHROPIC_SEARCH_MODEL=deepseek-v4-flash
```

`ANTHROPIC_SEARCH_MODEL` 不写则默认 `claude-haiku-4-5`，会被 DeepSeek 自动映射到 `deepseek-v4-flash`，效果一样。

`/login anthropic` 走的是 OAuth，不是粘贴 API key 的流程，所以直接把 API key 放进 `.env` 里。

## Optional Configure

### ACP 适配

[ACP | Oh My Pi 中文文档](https://aieguu.github.io/omp-docs-cn/guide/acp)
[ACP Client - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=formulahendry.acp-client)

在 VSCode ACP Client 添加一项就行，命令为 `omp`，参数为 `acp`。

但是用 ACP 容易出现终端找不到程序、无法复制会话内容等问题。

### Paseo 适配

[Paseo – Run Claude Code, Codex, Copilot, OpenCode from anywhere](https://paseo.sh/)
[Paseo (Unofficial) - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=hinnes.paseo-vscode)

Paseo 是一款支持多种 Agent 的 GUI 前端。它会自动发现 omp 的可执行文件位置，以及配置文件位置。

### VSCode 适配

[Pendant - Pi Agent for VS Code - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=cdervis.vscode-pi)

这个插件支持自带的 pi、系统安装的 pi、系统安装的 omp。

## Global Manage

### MCP 管理

omp 从以下位置读取 `mcp.json`，按优先级排序：

1. `.omp/mcp.json` — 项目，omp 管理
2. `~/.omp/agent/mcp.json` — 用户，omp 管理
3. 仓库根目录的 `mcp.json` 或 `.mcp.json` — 独立备用
4. `.claude/`、`.cursor/`、`.vscode/`、`.gemini/`、`.windsurf/`、`opencode.json` — 自动发现

项目条目会遮蔽具有相同键的用户条目。通过将服务器的键添加到 `disabledServers` 来禁用服务器而不删除其配置。

### Skill 管理

发现路径如下

```
~/.omp/agent/skills/<name>/SKILL.md     # 全局
.omp/skills/<name>/SKILL.md             # 项目
~/.claude/skills/, .claude/skills/      # 同样被发现
~/.codex/skills/,  .codex/skills/       # 同样被发现
```

发现是非递归的——每个目录一个 Skill，直接位于 `skills/` 下。Skill 目录内的同级文件可以通过 `skill://<name>/path/to/file.md` 从模型中引用。

### 插件管理

[oh-my-pi/docs/extensions.md at main · can1357/oh-my-pi](https://github.com/can1357/oh-my-pi/blob/main/docs/extensions.md)
[oh-my-pi/docs/porting-from-pi-mono.md at main · can1357/oh-my-pi](https://github.com/can1357/oh-my-pi/blob/main/docs/porting-from-pi-mono.md)
[omp — a coding agent with the IDE wired in](https://omp.sh/docs/plugins)
[扩展编写 | Oh My Pi 中文文档](https://aieguu.github.io/omp-docs-cn/guide/extension-authoring)

> A plugin bundles extension surfaces — skills, commands, hooks, custom tools, MCP servers, themes — into one installable unit. Pull from npm, a Git repo, a local path, or a marketplace catalog.

这点和 hermes 的插件定义略有不同。

omp 通过 `pkg.pi` fallback + legacy shim 保住了 pi 扩展的"加载路径"，但少数 API 有改名/替换，需要小改才能跑，不是 drop-in 无缝。

## Common Pitfalls

## Verification Checklist

- [ ] `omp` 能进入交互界面（安装成功）
- [ ] LLM API 已配好（`.env` 或 `/login`），`omp --model <m>` 可切换模型
- [ ] 模型角色路由生效（`--smol`/`--slow`/`--plan`）
- [ ] 所需 env key（如 `ANTHROPIC_SEARCH_*`）在正确层级且唯一
- [ ] MCP 服务器被 omp 发现（`mcp.json` 或自动发现路径）
- [ ] Skill 被 omp 发现（`~/.omp/agent/skills/` 或项目 `.omp/skills/`）
- [ ] 插件能安装并 `/reload-plugins` 生效
