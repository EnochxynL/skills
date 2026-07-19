---
name: podman
description: Use when working with Podman/Docker containers — installation, registry mirrors, image pulling, container lifecycle, terminal attach/exec, Dev Container setup, and X11 GUI forwarding.
metadata:
  hermes:
    tags:
      - podman
      - docker
      - container
      - devcontainer
      - ros
      - x11
  related_skills:
    - ubuntu
---

# Podman — 容器环境管理

## Overview

Podman 是 Docker 的无 daemon 替代品，命令兼容，更轻量安全。本 skill 覆盖 Podman/Docker 的安装换源、镜像与容器管理、终端交互、VS Code Dev Container 配置，以及容器内 GUI 的 X11 转发。

## When to Use

* 安装或配置 Podman/Docker 及镜像源时
* 拉取镜像、创建、运行、管理容器时
* 通过终端 attach/exec 进入容器调试时
* 配置 VS Code Dev Container 连接容器开发时
* 容器内 GUI 程序（ROS/Gazebo 等）需要 X11 转发时
* 清理容器/镜像缓存时

## Common Install

### 安装 Podman

```bash
sudo apt install podman
```

### Podman 换源

[如何让 Podman 使用国内镜像源，这是我见过最牛的方法配置 Podman 使用国内镜像源，可以通过修改其配置文件或使 - 掘金](https://juejin.cn/post/7563543935873925130)

[2026国内Podman镜像源最全指南 - 知乎](https://zhuanlan.zhihu.com/p/2025807666845361799)

[podman no longer searches dockerhub: Error: short-name ... did not resolve to an alias and no unqualified-search registries are defined - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/701784/podman-no-longer-searches-dockerhub-error-short-name-did-not-resolve-to-an)

Podman 默认不搜索 Docker Hub，几乎必须手动配置。在 `/etc/containers/registries.conf.d/` 下新建文件（如 `mirrors.conf`）：

```ini
unqualified-search-registries = ["docker.io"]

# 添加镜像，例如：
[[registry]]
prefix = "docker.io"
location = "your-mirror-url"
```

## Optional Configure

### Docker 安装（备选）

[管理 Docker 兼容性 | Podman Desktop](https://desktop.podman.org.cn/docs/migrating-from-docker/managing-docker-compatibility)

[比 WSL2 更香的是 Docker for windows - CSDN](https://blog.csdn.net/ydcdm0011/article/details/122673208)

[在WSL2的Ubuntu中安装和使用Docker/Podman - 博客园](https://www.cnblogs.com/zjutzz/p/18240320)

[Docker + ROS2 开发环境搭建指南 | 小强的博客](https://wsxq2.55555.io/blog/2025/07/29/docker-ros2-%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA%E6%8C%87%E5%8D%97/)

### Docker 换源

[ghcr.io 中国可用镜像列表 | Docker 镜像资源](https://docker.aityp.com/s/ghcr.io)

[gebangfeng/docker-mirror: 整理各大容器镜像源](https://github.com/gebangfeng/docker-mirror)

[Docker换源加速详细教程（2025.3最新） - 知乎](https://zhuanlan.zhihu.com/p/32004414428)

[红帽 Quay | Red Hat](https://www.redhat.com/zh-cn/technologies/cloud-computing/quay)

[前言的前言 · LinuxServer | 中文](https://linuxserver.watercalmx.com/before-intro.html)

[Images | LinuxServer.io](https://www.linuxserver.io/our-images)

在 `/etc/docker/daemon.json` 中修改 `registry-mirrors`：

```json
{
  "registry-mirrors": ["https://your-mirror-url"]
}
```

### 缓存清理

[Docker下载到一半失败了的镜像文件在哪里删除？ - 知乎](https://www.zhihu.com/question/624711565)

[Docker深度清理：一键清除下载缓存 - 云原生实践](https://www.oryoy.com/news/docker-shen-du-qing-li-yi-jian-qing-chu-xia-zai-huan-cun-shi-fang-bao-gui-kong-jian-ti-sheng-yun-xin.html)

[清理Docker废弃镜像与缓存 - CSDN](https://blog.csdn.net/qq_38924779/article/details/135035765)

```bash
podman system prune -a    # 清理所有未使用的镜像、容器、网络
docker system prune -a    # Docker 等价命令
```

### 常用 ROS 镜像

[docker.io/fishros2/ros:noetic-desktop-full - 镜像下载](https://docker.aityp.com/image/docker.io/fishros2/ros:noetic-desktop-full)

[fishros2/ros - Docker Hub](https://hub.docker.com/r/fishros2/ros)

[osrf/ros - Docker Hub](https://hub.docker.com/r/osrf/ros)

[osrf/docker_images - GitHub](https://github.com/osrf/docker_images)

[ros - Official Image | Docker Hub](https://hub.docker.com/_/ros/)

## Instance Manage

镜像的文件系统不可变，容器在镜像之上叠加可写层。容器不是虚拟机，而是运行环境（类似 AppImage）——**容器需要前台进程才能保持运行**，主进程结束则容器停止。可以当成一个**服务**来理解。

### 获取镜像

[Docker创建镜像的三种方法：Build、Commit与Pull - 云原生实践](https://www.oryoy.com/news/docker-chuang-jian-jing-xiang-de-san-zhong-fang-fa-ji-qi-you-que-dian-dui-bi-build-commit-yu-pull.html)

[WSL 上的 Docker 容器入门 | Microsoft Learn](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-containers)

[Ubuntu通过Docker安装任意版本ROS & 一键启动教程 - CSDN](https://blog.csdn.net/littlewells/article/details/142616408)

- Build：自己编写 Dockerfile，镜像完全可控
- Commit：对现有容器做快照，把变更保存为新镜像
- Pull：直接拉取现成镜像，对镜像源有要求

三种方式最终都在 `podman images` 中可见。

### 创建与运行

[docker run 命令 | 菜鸟教程](https://www.runoob.com/docker/docker-run-command.html)

[Docker命令详解（run篇） - 博客园](https://www.cnblogs.com/yfalcon/p/9044246.html)

[Docker运行ROS环境 - 知乎](https://zhuanlan.zhihu.com/p/561308215)

[podman基础用法和签名 - CSDN](https://blog.csdn.net/nuanchunhujian/article/details/126363091)

创建容器时必须指定自启动命令，**一旦创建不可更改**。后续每次 `start` 都按首次命令执行。

| 模式 | 命令 | 说明 |
|---|---|---|
| 交互模式（临时调试） | `podman run -it <image>` | 进入伪终端，等待指令 |
| 后台模式（无头服务） | `podman run -d <image> <cmd>` | 后台运行并返回容器 ID |
| 后台交互式 | `podman run -dit <image>` | 后台运行，保持终端挂起 |
| 只创建不运行 | `podman create <image>` | 后续用 start 启动 |

**推荐交互模式**，创建后按 `Ctrl+P` `Ctrl+Q` 断开当前终端。

常用参数：
- `-d`：后台运行
- `-i`：保持标准输入打开
- `-t`：分配伪终端
- `--name`：指定容器名称
- `-p`：端口映射 `host_port:container_port`
- `-v`：挂载卷 `host_dir:container_dir`
- `--rm`：容器停止后自动删除
- `-e, --env`：设置环境变量
- `--network`：指定网络模式
- `--restart`：重启策略（no / on-failure / always / unless-stopped）

### 终端操作

[docker start/stop/restart 命令 | 菜鸟教程](https://www.runoob.com/docker/docker-start-stop-restart-command.html)

[Docker之运行容器并通过终端进入容器命令 - CSDN](https://blog.csdn.net/qq_32403063/article/details/99485833)

容器的交互逻辑与 tmux 类似——创建后分配 ID 和名称，可随时断连重连。

```bash
podman ps --all               # 列出所有容器
podman rm <container>         # 删除容器
podman rename <id> <name>     # 按 ID 改名，如 podman rename 5d0f4c99ebd4 ros

podman attach <name>          # 重新连接已有终端（连主进程 stdio）
podman exec -it <name> bash   # 在新终端中运行命令（不影响主进程）
```

> 容器内文件是临时的，不建议储存有用数据。需要保留变更时先 `podman commit` 成新镜像。

### X11 图形化转发

容器内 GUI（如 RViz、Gazebo）需要 `DISPLAY` 环境变量指向宿主机 X11 服务。

#### Linux 宿主机

[针对ros机器人开发同学的docker入门教程 - 哔哩哔哩](https://www.bilibili.com/opus/830115082659692564)

```bash
podman run --net=host --env="DISPLAY" <image>
```

还需执行 `xhost +` 开放权限。

#### Windows 宿主机

[一小时实践入门Gazebo - 知乎](https://zhuanlan.zhihu.com/p/661306705)

[VScode配置X11转发！让你彻底摆脱显示屏！！！ - SkyXZ - 博客园](https://www.cnblogs.com/SkyXZ/p/18687026)

[在Docker for Windows中运行GUI程序 - 博客园](https://www.cnblogs.com/larva-zhh/p/10531824.html)

[VScode远程连接Docker容器实现X11转发 - 博客园](https://www.cnblogs.com/azureology/p/14125794.html)

[Windows平台下使用vscode + docker + ROS - 知乎](https://zhuanlan.zhihu.com/p/25899845643)

[解决 qt.qpa.xcb: could not connect to display 问题 - 知乎](https://zhuanlan.zhihu.com/p/604159681)

[解决qt.qpa.xcb: could not connect to display问题-CSDN博客](https://blog.csdn.net/every_step/article/details/120640384)

```bash
podman run -e DISPLAY=host.docker.internal:0 <image>
```

1. 安装并启动 **XLaunch**（VcXsrv），勾选 **Disable access control**
2. 进入容器后手动设置：`export DISPLAY=host.docker.internal:0.0`

常见错误 `qt.qpa.xcb: could not connect to display`——确认 XLaunch 已启动且 Disable access control 已勾选，必要时重启。

> Podman 下 `host.containers.internal` 可能指向 WSL 内部 IP（如 `10.255.255.254`）而非宿主机，导致 `Connection refused`。改用 `host.docker.internal` 或通过 `ipconfig` 获取真实宿主机 IP。

> 尝试搞清楚容器自己的域名：在 Docker Desktop 运行 ROS 注意到 `ROS_MASTER_URI=http://docker-desktop:11311/` ，看来 `docker-desktop` 是容器自己的域名

## Project Manage（Dev Container）

在 VS Code 中通过 Dev Container 连接容器，享受完整 IDE 体验而非纯终端。

[Create a Dev Container](https://code.visualstudio.com/docs/devcontainers/create-dev-container)

[创建开发容器 - VSCode 编辑器](https://vscode.js.cn/docs/devcontainers/create-dev-container)

### 连接已有容器

[VS Code 连接访问本地主机上的Docker容器 - 博客园](https://www.cnblogs.com/booturbo/p/16323439.html)

确保容器已在运行，VS Code 命令面板 → **Remote-Containers: Attach to Running Container...** 即可连接。

### 根据文件夹创建新容器

[Dev Container metadata reference](https://containers.dev/implementors/json_reference/)

在项目根目录创建 `.devcontainer/devcontainer.json`：

```json
{
  "image": "osrf/ros:noetic-desktop-full"
}
```

打开该文件夹时 VS Code 会提示在容器中重新打开，自动构建并进入。

### GUI in Dev Container

[Run and Access GUI inside VS Code DevContainers](https://readmedium.com/run-and-access-gui-inside-vs-code-devcontainers-b572643d0d2a)

[devcontainer, how to make X display work - Stack Overflow](https://stackoverflow.com/questions/60733288/devcontainer-how-to-make-x-display-work-mount-graphics-inside-docker-in-visual)

[bascodes/devcontainer-features: desktop-xserver](https://github.com/bascodes/devcontainer-features/tree/main/src/desktop-xserver)

关键是在 `devcontainer.json` 中设置 `DISPLAY`：

```json
{
  "image": "osrf/ros:noetic-desktop-full",
  "containerEnv": {
    "DISPLAY": "unix:0"
  }
}
```

Windows 下用 `remoteEnv`：

```json
{
  "remoteEnv": {
    "DISPLAY": "host.docker.internal:0.0"
  }
}
```

| 属性 | 作用 |
|---|---|
| `containerEnv` | 设置**容器全局**环境变量 |
| `remoteEnv` | 仅设置终端等**子进程**的环境变量，不影响整个容器 |

## Verification Checklist

* [ ] **Podman 可用**

    ```bash
    podman --version
    ```
* [ ] **镜像源已配置**

    ```bash
    cat /etc/containers/registries.conf.d/*.conf
    ```
* [ ] **可拉取镜像**

    ```bash
    podman pull docker.io/library/hello-world
    ```
* [ ] **容器可创建运行**

    ```bash
    podman run --rm docker.io/library/hello-world
    ```
* [ ] **终端操作正常**

    ```bash
    podman run -dit --name test docker.io/library/alpine
    podman exec test echo ok
    podman rm -f test
    ```
