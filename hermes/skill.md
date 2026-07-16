
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

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
hermes desktop
```

### 配置供应商

`cc-switch` 实际上添加的是 Custom Endpoint 配置，由于 Hermes 已经提供了各个供应商的官方配置，所以需要使用 `cc-switch`。这和 Claude Code 以及 CodeX 不一样。

