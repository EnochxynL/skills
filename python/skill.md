---
name: python
description: General Python troubleshooting — pkg_resources/setuptools compatibility, numpy version conflicts, PyTorch CUDA verification, PYTHONPATH resolution, pip package management and cleanup.
metadata:
  hermes:
    tags:
      - python
      - pip
      - troubleshooting
      - package-management
  related_skills:
    - python-uv
    - python-conda
---

# Python — 通用故障排查与包管理

## Overview

Python 生态中 pip 与系统包管理器、虚拟环境之间的交互常常造成困惑。本 skill 覆盖 PYTHONPATH 解析、pip 安装位置、包残留清理，以及常见的 pkg_resources / numpy / PyTorch 兼容性问题。

## When to Use

* 遇到 pkg_resources 缺失、numpy 版本冲突、PyTorch CUDA 检查等问题时
* 需要理解 PYTHONPATH、pip 与系统包管理器的交互关系时
* 需要安全卸载 pip 包并清理残留时

## python 命令会找到哪里

[配置PYTHONPATH环境变量_python path配置-CSDN博客](https://blog.csdn.net/NSJim/article/details/140452758)

[PYTHONPATH环境变量详解从定义到配置使用方法-开发者社区-阿里云](https://developer.aliyun.com/article/1600639)

Python 使用 `PYTHONPATH` 环境变量查找额外模块和包。当 Python 导入模块时，它首先搜索当前目录；如果没有找到，将搜索 PYTHONPATH 中指定的目录。

例如，ROS 就是使用这个环境变量，把自己携带的 site-packages 加入系统的 Python 解释器中：

```bash
echo $PYTHONPATH
/opt/ros/humble/lib/python3.10/site-packages:/opt/ros/humble/local/lib/python3.10/dist-packages
```

## pip 安装的包去了哪里

[How do I find the location of my Python site-packages directory? - Stack Overflow](https://stackoverflow.com/questions/122327/how-do-i-find-the-location-of-my-python-site-packages-directory)

[python - What's the difference between dist-packages and site-packages? - Stack Overflow](https://stackoverflow.com/questions/9387928/whats-the-difference-between-dist-packages-and-site-packages)

运行 `import site; site.getsitepackages()` 可以发现：

| 路径                                        | 说明                   |
| ----------------------------------------- | -------------------- |
| `/usr/lib/python3/dist-packages`          | 系统包管理器（apt）安装的 pip 包 |
| `/usr/local/lib/python3.10/dist-packages` | 系统解释器的 pip 包         |
| `/usr/lib/python3.10/dist-packages`       | 默认不会存在               |

系统包管理器安装的包和 pip 安装的包位于不同目录，互不干扰。

## pip-autoremove

任何情况下都不建议使用 pip 直接移除包，这会导致严重的残留。使用 `pip-autoremove` 连带清理残留包：

```bash
pip install pip-autoremove
pip-autoremove <package-name> -y
```

**已知 Bug：** 在 conda 环境中使用可能遇到 `ModuleNotFoundError`。Windows 下把 `miniforge3\Scripts\pip_autoremove.py` 移动到 `miniforge3\Lib\pip_autoremove.py` 可解决。

## Common Pitfalls

### 1. pkg_resources 缺失

setuptools 82.0.0+ 版本存在断层问题：

```bash
uv pip install "setuptools<82.0.0"
```

### 2. numpy 版本冲突

numpy 2.x 与某些旧包不兼容：

```bash
uv pip install "numpy<2.2"
```

### 3. PyTorch CUDA 检查

```python
import torch
print(torch.__version__)
print(torch.cuda.is_available())
print(torch.version.cuda)
```

## Verification Checklist

* [ ] **PYTHONPATH 正确**

    ```bash
    echo $PYTHONPATH
    ```
* [ ] **pip 安装路径明确**

    ```bash
    python -c "import site; print(site.getsitepackages())"
    ```
* [ ] **pip-autoremove 可用**

    ```bash
    pip-autoremove --help
    ```
* [ ] **setuptools 版本兼容**

    ```bash
    pip show setuptools | grep Version
    ```
* [ ] **numpy 版本兼容**

    ```bash
    python -c "import numpy; print(numpy.__version__)"
    ```
* [ ] **PyTorch CUDA 正常**

    ```bash
    python -c "import torch; print(torch.cuda.is_available())"
    ```
