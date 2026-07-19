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
* 使用 CC Switch 管理配置文件、MCP、Skill 时
* 管理对话记录与迁移时

## 常规配置

### Hermes Desktop

Hermes Desktop 有三个版本：

| 版本 | 来源 | 说明 |
|------|------|------|
| 官方 | [NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent/tree/main/apps/desktop) | 推荐使用 |
| 中文社区 | [Hermes Agent 中文社区桌面版](https://desktop.hermesagent.org.cn/#download) | 功能完善，但官方版已够用 |
| 第三方 | [fathah/hermes-desktop](https://github.com/fathah/hermes-desktop) | 已改名 Hermes One，Ubuntu 24.04 上 AppImage 无法启动，不推荐 |

#### 官方版本

[Hermes Agent | Nous Research](https://hermes-agent.nousresearch.com/)

官方 Windows exe 安装包本质是下载 `install.ps1` 安装脚本，不是传统安装包。Linux 下可直接用 curl 安装：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes desktop
```

Windows 下建议使用 exe 安装，`hermes desktop` 命令不一定自动创建快捷方式。Hermes Desktop 的可执行文件在 `C:\Users\enoch\AppData\Local\hermes\hermes-agent\apps\desktop\release\win-unpacked\Hermes.exe`，或许也可以根据它手动创建快捷方式，因为安装器并不创建卸载入口。

### 配置供应商

使用 `cc-switch` 添加 Custom Endpoint 配置。注意：Hermes 已内置各供应商官方配置，`cc-switch` 在此用于 Custom Endpoint，与 Claude Code 和 CodeX 中用法不同。

## 可选配置

### Claude Code + CodeX

Hermes 作为全局 agent，可调用 Claude Code 和 CodeX 作为项目级 agent。推荐通过 VS Code 插件方式安装，而非通过 Hermes 内部安装。

### CC Switch

[【转载】我花了太多时间整理 Claude Code 工具：这是我找到的所有内容原文链接 好吧，现在是忏悔时间。我从今年 - 掘金](https://juejin.cn/post/7565268465709465640)

CC Switch 可管理配置文件、供应商、对话记录、MCP、Skill 等。支持打开 Hermes Dashboard，但 MCP 配置对 Hermes 可能无效。

## 对话管理

### CC Sessions

[codex claude会话管理，支持删除、修复、备份、统计 - 资源荟萃 - LINUX DO](https://linux.do/t/topic/2009998)

CC Switch 已包含会话管理功能，但 CC Sessions 更专业，支持删除、修复、备份、统计。

## 全局管理

* **Hermes Dashboard** — 管理 Hermes 配置
* **CC Switch** — 管理 Claude Code 和 CodeX 配置

### MCP 管理

使用 Hermes Dashboard 可以轻松可视化管理 MCP。

### 对话记录管理与迁移

未完待续

### 记忆、人格管理

未完待续

### Skill 管理

未完待续

## Verification Checklist

* [ ] **Hermes Desktop 可启动**
* [ ] **供应商端点可连通**
* [ ] **Claude Code / CodeX MCP 集成正常**
* [ ] **CC Switch 可管理配置**
