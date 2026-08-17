---
name: hermes
description: Hermes Agent configuration and integration — Desktop setup, provider configuration, Claude Code/CodeX MCP integration, CC Switch management, and global agent workflow.
metadata:
  hermes:
    tags:
      - hermes
      - agent
      - claude-code
      - codex
      - configuration
---

# Hermes — 全局 AI Agent 配置与集成

## Overview

Hermes 是 Nous Research 出品的全局 AI Agent，负责跨项目的 agent 调度。本人采用 Hermes 全局管家 + Claude Code/CodeX 项目管家的组合方案。本 skill 覆盖 Hermes Desktop 安装、供应商配置、Claude Code 与 CodeX MCP 集成，以及 CC Switch / CC Sessions 等辅助工具的用法。

## When to Use

* 安装、更新 Hermes Desktop 时
* 配置供应商端点或切换 API provider 时
* 集成 Claude Code / CodeX 作为项目级 agent 时
* 管理配置文件、MCP、Skill 时
* 管理对话记录与迁移时

## Common Install

### Hermes Desktop

Hermes Desktop 目前发现有三个版本：

| 版本 | 来源 | 说明 |
|------|------|------|
| 官方 | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent/tree/main/apps/desktop) | 推荐使用 |
| 中文社区 | [Hermes Agent 中文社区桌面版](https://desktop.hermesagent.org.cn/#download) | 功能完善，但官方版已够用 |
| 第三方 | [fathah/hermes-desktop](https://github.com/fathah/hermes-desktop) | 已改名 Hermes One，Ubuntu 24.04 上 AppImage 无法启动，不推荐 |

[Hermes Agent | Nous Research](https://hermes-agent.nousresearch.com/)

官方 Windows exe 安装包本质是下载 `install.ps1` 安装脚本，不是传统安装包。Linux 下可直接用 curl 安装：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes desktop
```

Windows 下建议使用 exe 安装，`hermes desktop` 命令不一定自动创建快捷方式。Hermes Desktop 的可执行文件在 `%LOCALAPPDATA%\hermes\hermes-agent\apps\desktop\release\win-unpacked\Hermes.exe`，或许也可以根据它手动创建快捷方式，因为安装器并不创建卸载入口。

### 环境配置

根据我的观察，Windows 下 Hermes 配置路径是 `%LOCALAPPDATA%\hermes\`，Linux 下是 `~/.hermes/`。

Hermes 使用自己的 uv 环境。有些插件需要 pip 包依赖，需要在特定环境安装。例如要安装 `markdownify` 包：

```sh
# 在 Hermes 安装目录下运行（curl 安装器在 Linux/macOS 上将其放置于
# ~/.hermes/hermes-agent，在 Windows 上为 %LOCALAPPDATA%\hermes\hermes-agent）：
cd ~/.hermes/hermes-agent
uv pip install --python ./venv/bin/python markdownify
```

### LLM API 配置

`hermes model` 通过交互方式选择模型。

使用 `cc-switch` 添加 Custom Endpoint 配置。注意：Hermes 已内置各供应商官方配置，`cc-switch` 在此用于 Custom Endpoint，与 Claude Code 和 CodeX 中用法不同。

### Web 配置

[网页搜索与提取 | Hermes Agent](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/features/web-search)

[网页搜索提供商插件 | Hermes Agent](https://hermes-agent.nousresearch.com/docs/zh-Hans/developer-guide/web-search-provider-plugin)

[给 AI Agent 配搜索，国内能用的搜索 API 实测对比 - iTech - 博客园](https://www.cnblogs.com/itech/p/19918043)

[手把手教你给 Agent 加上联网能力，WebSearch + WebFetch 让 Agent 知道世界发生了什么。 - 技术派 - Java技术社区 | RAG+Agent实战项目教程+AI助手](https://paicoding.com/paismart-web-search)

[Hermes skills之Agent 会联网搜索吗？Web Search 配置和 10 个提供商实测 - 知乎](https://zhuanlan.zhihu.com/p/2052136759211963914)

[讲真，22 个垂直领域的 AnySearch 就是 Agent 搜索的答案！ - 知乎](https://zhuanlan.zhihu.com/p/2046531669839156980)

[OpenWebSearch网络搜索MCP - 腾讯云](https://cloud.tencent.com/developer/mcp/server/11739)

[eze-is/web-access: 给 Claude Code 装上完整联网能力的 skill：三层通道调度 + 浏览器 CDP + 并行分治](https://github.com/eze-is/web-access)

[OpenWebSearch MCP - 腾讯云](https://cloud.tencent.com/developer/mcp/server/11739)

[robbyczgw-cla/hermes-web-search-plus: Give your Hermes agent the web as real sources, never a made-up answer — multi-provider search and extraction with an optional local, key-free Hound option.](https://github.com/robbyczgw-cla/hermes-web-search-plus)

Hermes 不像 Claude Code/CodeX 那样有完善的联网配置，需要指定 Web Search Provider 并设置 API Key，或借助插件及 MCP 扩展来实现联网搜索和网页提取。

- 最常见的应该是注册一个 Exa 账户并申请 API Key，每个月用免费额度。
- SearXNG 官方没有 Windows 部署方案，虽然有人做了 Windows 移植版，但更新不频繁。
- Claude Code/CodeX 本质是用 Response API 调用服务端的联网搜索能力，Hermes 没有开发这方面的功能，我自己写了个 `web-search-provider-plugin` 插件实现，直接借助 Anthropic 格式 DeepSeek API 实现 `web_search`，仿照 Claude Code 的 `WebFetch` 架构实现 `web_extract`
- 还有一些 MCP 和 skill 可以试试看，可能有惊喜呢……

## Optional Configure

### ACP 适配

[快速入门 | Hermes Agent](https://hermes-agent.nousresearch.com/docs/zh-Hans/getting-started/quickstart#%E7%BC%96%E8%BE%91%E5%99%A8%E9%9B%86%E6%88%90acp)
[ACP 宿主集成 | Hermes Agent](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/features/acp)
[ACP Client - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=formulahendry.acp-client)
[Multicoder ACP - One UI for every agent - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=multicoder.multicoder)

在 VSCode 使用 ACP 对接 hermes。ACP 支持已包含在标准 `[all]` 扩展中，也就是 `hermes acp` 可以直接用。（如果安装时未包含 `[all]`，请先运行 `cd ~/.hermes/hermes-agent && uv pip install -e ".[acp]"`。）

在 ACP 中，hermes 有意排除了不适合典型编辑器 UX 的功能，例如消息投递和 cronjob 管理。底层 AIAgent 仍使用 Hermes 的正常持久化/日志路径，但 ACP 的 `list/load/resume/fork` 仅限于当前运行的 ACP 服务器进程。

但是用 ACP 容易出现终端找不到程序、无法复制会话内容等问题。

### Paseo 适配

[Paseo – Run Claude Code, Codex, Copilot, OpenCode from anywhere](https://paseo.sh/)
[Paseo (Unofficial) - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=hinnes.paseo-vscode)

Paseo 是一款支持多种 Agent 的 GUI 前端。它会自动发现 hermes 的可执行文件位置，以及配置文件位置。

## Global Manage

### MCP 管理

[在Windows11上配置MCP服务（Cline, Cherry Studio适用） - 知乎](https://zhuanlan.zhihu.com/p/1890083086923978026)

使用 Hermes Dashboard 可以轻松可视化管理 MCP。

MCP 依托于网络应用（https）、可执行文件或脚本（stdio）运行，所以“安装MCP”本质上是安装应用程序，并在 Agent 的列表登记 MCP 的启动命令

### Skill 管理

[The Agent Skills Directory](https://www.skills.sh/)
[Agent Skills Overview - Agent Skills](https://agentskills.io/home)
[Open Skills - Discover Awesome Agent Skills](https://openskills.cc/)
[内置技能目录 | Hermes Agent](https://hermes-agent.nousresearch.com/docs/zh-Hans/reference/skills-catalog)
[Skills 系统 | Hermes Agent](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/features/skills)

所有 skills 存放在 `~/.hermes/skills/` 中。全新安装时，捆绑的 skills 会从仓库复制过来（Hermes 在执行 `hermes update` 时也会同步内置技能，但同步清单会尊重本地删除和用户编辑）。通过 Hub 安装和 agent 创建的 skills 也存放在此处。agent 可以修改或删除任何 skill。

如果你在 Hermes 之外维护 skills——例如，供多个 AI 工具使用的共享 `~/.agents/skills/` 目录——你可以告诉 Hermes 也扫描这些目录。在 ~/.hermes/config.yaml 的 skills 部分下添加 external_dirs：

```yaml
skills:
  external_dirs:
    - ~/.agents/skills
    - /home/shared/team-skills
    - ${SKILLS_REPO}/skills
```

路径支持 `~` 展开和 `${VAR}` 环境变量替换。

最终，目录结构范例如下：

```
~/.hermes/skills/               # Local (primary, read-write)
├── devops/deploy-k8s/
│   └── SKILL.md
└── mlops/axolotl/
    └── SKILL.md

~/.agents/skills/               # External (shared, mutable if writable)
├── my-custom-workflow/
│   └── SKILL.md
└── team-conventions/
    └── SKILL.md
```

所有四个 skills 都出现在你的 skill 索引中。如果你在本地创建一个名为 `my-custom-workflow` 的新 skill，它会遮蔽外部版本。

从在线注册表、`skills.sh`、直接的知名 skill 端点以及官方可选 skills 中浏览、搜索、安装和管理 skills，使用 `hermes skills` 命令。

当然，也可以用 `npx skills` 这样的第三方工具。它应该会自动发现 hermes 配置文件夹并放入文件。

### 插件管理

[Plugins | Hermes Agent](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/features/plugins#%E6%8F%92%E4%BB%B6%E8%83%BD%E5%81%9A%E4%BB%80%E4%B9%88)
[工具与工具集 | Hermes Agent](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/features/tools)
[工具集参考 | Hermes Agent](https://hermes-agent.nousresearch.com/docs/zh-Hans/reference/toolsets-reference)

在我看来，插件负责那些“Agent 理应具备，或者其他 Agent 已然具备，但 Hermes 缺乏”的功能。如果所有 Agent 都不具备的功能，可以通过 MCP 或 skill 来实现，接口更加通用。

| 来源  | 路径  | 使用场景 |
| --- | --- | --- |
| 内置  | `<repo>/plugins/` | 随 Hermes 附带 — 参见 [Built-in Plugins](https://hermes-agent.nousresearch.com/docs/zh-Hans/user-guide/features/built-in-plugins) |
| 用户  | `~/.hermes/plugins/` | 个人插件 |
| 项目  | `.hermes/plugins/` | 项目专属插件（需要 `HERMES_ENABLE_PROJECT_PLUGINS=true`） |
| pip | `hermes_agent.plugins` entry_points | 分发包 |
| Nix | `services.hermes-agent.extraPlugins` / `extraPythonPackages` | NixOS 声明式安装 — 参见 [Nix Setup](https://hermes-agent.nousresearch.com/docs/zh-Hans/getting-started/nix-setup#plugins) |

名称冲突时，后面的来源会覆盖前面的，因此与内置插件同名的用户插件会替换它。

工具可以来自：内置、MCP、插件。那些“内置工具集”的来源本质就是内置插件，例如 `<repo>\plugins\web\exa`。

### 其他 Agent 管理

[【转载】我花了太多时间整理 Claude Code 工具：这是我找到的所有内容原文链接 好吧，现在是忏悔时间。我从今年 - 掘金](https://juejin.cn/post/7565268465709465640)
[codex claude会话管理，支持删除、修复、备份、统计 - 资源荟萃 - LINUX DO](https://linux.do/t/topic/2009998)

Hermes 可作为全局 agent。它可通过 skill 调用 Claude Code 和 CodeX 作为项目级 agent。推荐通过 VS Code 插件方式安装，而非通过 Hermes 内部安装。

CC Switch 可管理配置文件、供应商、对话记录、MCP、Skill 等。支持打开 Hermes Dashboard，但 MCP 配置对 Hermes 可能无效。
CC Switch 已包含会话管理功能，但 CC Sessions 更专业，支持删除、修复、备份、统计。

### 对话记录管理与迁移

未完待续

### 记忆、人格管理

未完待续

## Verification Checklist

* [ ] **Hermes Desktop 可启动**
* [ ] **供应商端点可连通**
* [ ] **Claude Code / CodeX MCP 集成正常**
* [ ] **CC Switch 可管理配置**
