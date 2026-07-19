---
name: ros1
description: Use when working with ROS 1 (Robot Operating System) — understanding roscore/rospy/roslaunch/catkin, installing ROS Noetic on Ubuntu/WSL, creating workspaces and packages with catkin_make, Python venv and Conda integration, debugging, and visualization tools.
metadata:
  hermes:
    tags:
      - ros
      - ros1
      - robotics
      - catkin
      - rospy
      - ubuntu
      - c++
      - python
  related_skills:
    - ros2
    - ubuntu
    - cpp-cmake
    - python-uv
    - podman
---

# ROS 1 — 机器人操作系统

## Overview

ROS（Robot Operating System）是机器人领域的软件框架，本质是一套基于进程间通信的分布式应用全家桶。roscore 是主进程，rosparam 是参数服务器（管理大量参数如数据库），roslaunch 是批处理脚本执行器——一次性按预设配置启动多个节点。

ROS 依附于 Ubuntu，包由 apt 管理但有独立的软件源，不会像 pip 一样污染系统包管理。catkin 是构建系统，将 C++ 程序编译后按 ROS 格式打包。rospy 是 Python 客户端库，用于编写 Python 节点。在 Windows 中，可以把含有 ROS 的 WSL 本身视为 ROS 的一个"发行版"。

## When to Use

* 在 Ubuntu / WSL 上安装 ROS Noetic 时
* 理解和配置 roscore / roslaunch / rosparam 时
* 创建 catkin 工作空间和功能包时
* Python 虚拟环境（venv/Conda）与 rospy 适配时
* 排查 catkin_make 或 rosdep 构建错误时
* 使用 PlotJuggler / rviz 等可视化调试时

## 常规配置

### 安装 WSL

[Win11 + WSL-ubuntu20.04 安装 ROS 及可视化](https://blog.csdn.net/qq_45870566/article/details/146103862)

ROS 依附于 Ubuntu。早年有 MSVC 构建 + vcpkg 管理 ROS 包的方案，但现在基本无人维护。推荐将含 ROS 的 WSL 视为 ROS 的发行版，WSL 镜像放在 C 盘即可。已有 WSL 就不建议 Docker——与 Windows 的交互不如 WSL 强。

### 安装 ROS1

[noetic/Installation/Ubuntu - ROS Wiki](https://wiki.ros.org/noetic/Installation/Ubuntu)

[bash - How do I get the DISTRIB_CODENAME? - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/115649/how-do-i-get-the-distrib-codename)

```bash
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.ustc.edu.cn/ros/ubuntu/ $DISTRIB_CODENAME main" > /etc/apt/sources.list.d/ros-latest.list'
curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | sudo apt-key add -
sudo apt update
sudo apt install ros-noetic-desktop-full
```

### Python 适配

[ROS neotic 中使用 conda 环境的方法](https://hs867785578.github.io/my_note/ROS/ROS-neotic%E4%B8%AD%E4%BD%BF%E7%94%A8conda%E7%8E%AF%E5%A2%83%E7%9A%84%E6%96%B9%E6%B3%95/)

对于 Python 虚拟环境（以 uv 为例），需要安装：

```bash
uv pip install rospkg catkin-tools
```

如果报错找不到 `catkin_make`，则 `uv pip install catkin_make`。

## 自动项目管理

### 创建工作空间

一个项目即一个工作空间（教程中常称为 `catkin_ws`）：

```bash
mkdir -p ~/catkin_ws/src
cd ~/catkin_ws/src
catkin_init_workspace
cd ..
```

### 激活工作空间

[配置环境 — ROS 2 Documentation: Humble](https://ros2docs.robook.org/humble/Tutorials/Beginner-CLI-Tools/Configuring-ROS2-Environment.html)

系统环境：`source /opt/ros/$(rosversion -d)/setup.bash`，让系统内置功能包可从终端运行。用 `echo $ROS_PACKAGE_PATH` 检验。

自动激活：`echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc`

用户工作空间：`source ./devel/setup.bash`，让当前工作空间的功能包可从终端运行。

### catkin 项目

```bash
cd ~/catkin_ws/src
catkin_create_pkg learning_communication std_msgs rospy roscpp
```

构建整个工作空间：

```bash
catkin_make
```

rosdep 调用 apt 安装 `package.xml` 中声明的系统依赖：

```bash
rosdep install --from-paths src -y --ignore-src
```

### Python venv 功能包

构建前先激活 Python 虚拟环境。若无法正常使用虚拟环境的 Python 构建，手动指定解释器（以 uv 为例）：

```bash
catkin_make -DPYTHON_EXECUTABLE=./venv/bin/python
```

cmake 在构建时自动设置 shebang。catkin_make 首次运行时生成 `CMakeLists.txt`，届时指定 Python 解释器。

### Conan 功能包

[ROS — conan documentation](https://docs.conan.io/2/integrations/ros.html)

### 调试

[VSCode 下调试 ROS 项目](https://zhuanlan.zhihu.com/p/364972107)

### 可视化工具

[PlotJuggler 绘图工具安装使用](https://blog.csdn.net/qq_39779233/article/details/106478608)

[Dynamic Reconfigure 动态参数调节](https://blog.csdn.net/weixin_43569276/article/details/102928817)

## Verification Checklist

* [ ] **ROS 环境可激活**

    ```bash
    source /opt/ros/noetic/setup.bash
    echo $ROS_PACKAGE_PATH
    ```
* [ ] **roscore 可运行**

    ```bash
    roscore
    ```
* [ ] **catkin 可初始化工作空间**

    ```bash
    cd ~/catkin_ws/src && catkin_init_workspace
    ```
* [ ] **catkin_make 可构建**

    ```bash
    cd ~/catkin_ws && catkin_make
    ```
