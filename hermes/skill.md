
## 常规配置

### Hermes Desktop

- 第三方版本 https://github.com/fathah/hermes-desktop
- 中文社区版本 https://github.com/Eynzof/Hermes-CN-Desktop
- 官方版本在 https://github.com/NousResearch/hermes-agent/tree/main/apps/desktop

#### 第三方版本

[fathah/hermes-desktop: Desktop Companion for Hermes Agent](https://github.com/fathah/hermes-desktop)

现已改名叫 Hermes One 但不建议使用。在 Ubuntu 24.04 上无法启动 AppImage 版本。

#### 中文社区版本

[Hermes Agent 中文社区桌面版 — 装上就能用的 AI Agent 桌面端](https://desktop.hermesagent.org.cn/#download)

看着很好看很方便，不过官方版本已经够用了

#### 官方版本

[Hermes Agent | Nous Research](https://hermes-agent.nousresearch.com/)

官方 Windows exe 安装包本质上也是下载 `install.ps1` 安装脚本，不是传统的安装包。

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes desktop
```

我不知道 Windows 下 `hermes desktop` 命令会不会帮你创建快捷方式，所以建议在 Windows 下使用 exe 安装。

### 配置供应商

`cc-switch` 实际上添加的是 Custom Endpoint 配置，由于 Hermes 已经提供了各个供应商的官方配置，所以需要使用 `cc-switch`。这和 Claude Code 以及 CodeX 不一样。

## 可选配置

### Claude Code + CodeX

Hermes 作为全局 Agent，可以有 Claude Code 和 CodeX 作为项目级 Agent 供给 Hermes 调用。我选择直接用 VS Code 的插件安装方式。

### CC Switch

[【转载】我花了太多时间整理 Claude Code 工具：这是我找到的所有内容原文链接 好吧，现在是忏悔时间。我从今年 - 掘金](https://juejin.cn/post/7565268465709465640)

CC Switch 可以方便地管理配置文件、供应商、对话记录、MCP、Skill等

