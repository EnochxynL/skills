---
name: ros2
description: Use when working with ROS 2 — understanding colcon/rclpy/rosdep, installing ROS 2 (Humble/Jazzy) on Ubuntu via apt, creating workspaces and packages, Python venv/Conda integration, ROS 1 & ROS 2 coexistence, and rviz2 troubleshooting.
metadata:
  hermes:
    tags:
      - ros
      - ros2
      - robotics
      - colcon
      - rclpy
      - ubuntu
      - c++
      - python
  related_skills:
    - ros1
    - ubuntu
    - cpp-cmake
    - python-uv
    - podman
---

# ROS 2 — 机器人操作系统第二代

## Overview

ROS 2 是 ROS 的全面重构版本，改进了实时性、安全性和多平台支持。与 ROS 1 的核心区别在于构建系统从 catkin 升级为 colcon（每个包独立构建，避免编译错误跨包传播），Python 客户端库从 rospy 升级为 rclpy。

关键工具链：
- **rosdep**：依赖检测器，读取 `package.xml` 后调用 apt 安装系统依赖
- **colcon**：构建系统，每个包独立构建
- **rospkg**：本地文件系统管家，查询包的路径和 `package.xml` 内容
- **rosdistro**：发行版索引库，描述某发行版包含的官方仓库及其 VCS 地址

## When to Use

* 在 Ubuntu 上添加 ROS 2 源并安装 Humble/Jazzy 时
* 使用 colcon 构建工作空间和包时
* Python 虚拟环境（venv/Conda/uv）与 rclpy 适配时
* 理解 rospkg vs rosdistro vs rclpy 的分工时
* ROS 1 和 ROS 2 在同一系统共存时
* rviz2 启动报 Segmentation fault 时
* 通过 rosbridge + roslibpy 实现 Windows 开发节点、WSL 运行服务端时

## 常规配置

### 添加 ROS 2 源

两种方法任选其一（也可共存），推荐镜像源：

#### 镜像源（清华）：

[ros2 | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirror.tuna.tsinghua.edu.cn/help/ros2/) 

[ROS2 - USTC Mirror Help](https://mirrors.ustc.edu.cn/help/ros2.html)

```bash
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] https://mirrors.tuna.tsinghua.edu.cn/ros2/ubuntu jammy main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

#### 官方源（deb 包方式）：

[Ubuntu (deb packages) — ROS 2 Documentation: Humble](https://docs.ros.org/en/humble/Installation/Ubuntu-Install-Debs.html)

```bash
export ROS_APT_SOURCE_VERSION=$(curl -s https://api.github.com/repos/ros-infrastructure/ros-apt-source/releases/latest | grep -F "tag_name" | awk -F'"' '{print $4}')
curl -L -o /tmp/ros2-apt-source.deb "https://github.com/ros-infrastructure/ros-apt-source/releases/download/${ROS_APT_SOURCE_VERSION}/ros2-apt-source_${ROS_APT_SOURCE_VERSION}.$(. /etc/os-release && echo ${UBUNTU_CODENAME:-${VERSION_CODENAME}})_all.deb"
sudo dpkg -i /tmp/ros2-apt-source.deb
```

### 安装 ROS 2

```bash
sudo apt update
sudo apt install ros-humble-desktop-full
```

## 可选配置

### 安装 colcon

[使用colcon构建包 — ROS 2 documentation 文档](http://dev.ros2.fishros.com/doc/Tutorials/Colcon-Tutorial.html#install-colcon)

```bash
sudo apt install python3-colcon-common-extensions
```

### ROS 1 & ROS 2 共存

[Ubuntu20.04 同时安装 ROS1 和 ROS2 共存](https://blog.csdn.net/zardforever123/article/details/130510145)

ROS 1 和 ROS 2 可以安装在同一系统上，通过 `source /opt/ros/<distro>/setup.bash` 切换。不要在同一个终端同时 source 两个环境。

许多第三方包只以源码形式发布，直接 clone 到工作空间的 `src/` 下作为功能包一起构建即可。

## 自动项目管理

### 创建工作空间

[ROS 2 工作空间与包](https://blog.csdn.net/weixin_52694742/article/details/156242960)

```bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws
colcon build
```

### 激活工作空间

```bash
source /opt/ros/humble/setup.bash
source ~/ros2_ws/install/local_setup.bash
```

### ros2 pkg 项目

[Creating a ROS2 Python Package](https://github.com/ansonJJ/ros2-tutorial/blob/main/Tutorials/Section%203%20-%20Your%20first%20ROS2%20Program/3.2%20-%20Creating%20a%20ROS2%20Python%20Package.md)

```bash
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_cmake my_first_pkg
colcon build
```

### rosdep 依赖安装

[rosdep 是什么？怎么用 | 鱼香ROS](https://fishros.org.cn/forum/topic/2124/rosdep%E6%98%AF%E4%BB%80%E4%B9%88-%E6%80%8E%E4%B9%88%E7%94%A8)

```bash
cd ~/ros2_ws
rosdep install --from-paths src -y --ignore-src
colcon build
```

### Python 虚拟环境适配

[使用 Conda 虚拟环境管理和运行 ROS 2 Python](https://zhuanlan.zhihu.com/p/14281813754)

[How to use Python virtual environments with ROS 2?](https://robotics.stackexchange.com/questions/98214/how-to-use-python-virtual-environments-with-ros2)

在自己的虚拟环境（以 uv 为例）中安装 rospkg：

```bash
uv pip install rospkg
```

构建命令改为在虚拟环境中运行 colcon：

```bash
python -m colcon build
```

相应地，rosdep 也应在虚拟环境中运行：

```bash
python -m rosdep install --from-paths src -y --ignore-src
```

#### 关于 rclpy

`ros2 run` 执行的是 `install/<package>/lib/<package>/<entry>` 脚本，其 shebang 由 colcon 自动设置（默认 `#!/usr/bin/python`）。要使用自己的 Python 库，要么在 `PYTHONPATH` 中添加路径，要么引导 ROS 2 使用自己的解释器——前者不够优雅，建议用虚拟环境方案。

**`PYTHONPATH` 中添加路径:** ROS 2 通过 `PYTHONPATH` 环境变量将自己携带的 site-packages 注入系统 Python 解释器（`/opt/ros/humble/lib/python3.10/site-packages` 和 `/opt/ros/humble/local/lib/python3.10/dist-packages`），因此 `import rclpy` 无需 pip 安装——它是 ROS 2 的一部分。

**虚拟环境种的 `PYTHONPATH`:** 同时激活了工作空间和虚拟环境的话，只要 `PYTHONPATH` 环境变量仍然存在（指向 `/opt/ros/humble/lib/python3.10/site-packages` 等），`rclpy` 等 ROS 2 内置包无需重新安装。

**建议虚拟环境的 Python 版本与系统一致，以最大程度兼容 ROS 2 的 pip 包。**

#### 关于 rospkg 和 rosdistro

安装ROS2后，查看 `/usr/lib/python3/dist-packages` 还会发现两个包，`rospkg` 和 `rosdistro`（依赖于 `rospkg`）
- `rospkg` 的任务是管理你当前 ROS 工作空间下已经下载、编译好的包。如果你需要在Python代码中，像使用命令行工具rospack find或roscd一样，查找某个包的路径、解析其package.xml或stack.xml文件，那就要 rospkg 了。
- `rosdistro` 的任务是**解析和维护 `rosdistro` 索引文件**（如 `https://raw.githubusercontent.com/ros/rosdistro/master/rosdep/base.yaml`）。它关注的是整个ROS发行版（如 `Noetic`、`Foxy`）的定义，不关心某个包在不在你的电脑上。

### Windows 开发 + WSL 运行

由于 rclpy 是 ROS 2 的一部分（不是 pip 包），如果想在 Windows 上开发节点、WSL 运行服务端，应使用 [roslibpy](https://github.com/gramaziokohler/roslibpy) 通过 rosbridge 通信，而非试图在 Windows 上安装 rclpy。

## Common Pitfalls

### rviz2 Segmentation fault

[WSL2 下 rviz 启动不了](https://blog.csdn.net/sinat_52032317/article/details/128191645)

[rviz2 launch failed: Segmentation fault](https://github.com/ros2/ros2/issues/696)

```bash
LIBGL_ALWAYS_SOFTWARE=1 rviz2
```

## Verification Checklist

* [ ] **ROS 2 源已配置**

    ```bash
    cat /etc/apt/sources.list.d/ros2.list
    ```
* [ ] **ROS 2 环境可激活**

    ```bash
    source /opt/ros/humble/setup.bash
    echo $ROS_DISTRO
    ```
* [ ] **colcon 可用**

    ```bash
    colcon --version
    ```
* [ ] **可创建和构建包**

    ```bash
    cd ~/ros2_ws && colcon build
    ```
