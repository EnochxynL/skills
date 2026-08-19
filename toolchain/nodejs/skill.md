这个教程用于安装全局 Node.js 或 N|Solid 运行时环境。毕竟，不像 Python，Node.js 不是 Linux 系统自带的。

[NodeSource](https://nodesource.com/products/distributions)
[Installation on Windows | N|Solid Documentation](https://docs.nodesource.com/docs/5.0.0/nsolid/installation_win/)

N|Solid 是一个企业级的 Node.js 运行时，提供了增强的性能、监控和安全功能。


## Common Pitfalls

### 明明没有安装 Node.js，却能执行 `npm` 命令

像 Hermes Agent 等软件会维护自己的 Node.js 运行时环境，并在 PATH 中优先使用它们的 Node.js，而不是系统全局安装的 Node.js。
