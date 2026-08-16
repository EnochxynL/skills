
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
Anthropic 服务端搜索工具的回包格式。想用 DeepSeek “伪装” Anthropic 的 Web Search 功能，直接在 `.env` 里配置：

```
ANTHROPIC_SEARCH_API_KEY=<你的DeepSeek key>
ANTHROPIC_SEARCH_BASE_URL=https://api.deepseek.com/anthropic
ANTHROPIC_SEARCH_MODEL=deepseek-v4-flash
```

`ANTHROPIC_SEARCH_MODEL` 不写则默认 `claude-haiku-4-5`，会被 DeepSeek 自动映射到 `deepseek-v4-flash`，效果一样。

`/login anthropic` 走的是 OAuth，不是粘贴 API key 的流程，所以直接把 API key 放进 `.env` 里。

## Optional Configure

## Global Manage

### 工具管理

### 插件管理

### MCP 管理

### Skill 管理
