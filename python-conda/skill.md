---
name: python-conda
description: Use when managing Python environments with conda/miniforge, creating conda environments, installing conda packages, handling conda-specific issues, and configuring VSCode conda integration.
metadata:
  hermes:
    tags:
      - python
      - conda
      - environment-management
      - package-management
  related_skills:
    - python-uv
    - python
---

# Python Conda — 环境级包管理器

## Overview

Conda 不止是 Python 发行版，更是环境级的包管理器——Python 本身只是它管理的一个包，它还能管理 npm、gcc、maven、vcpkg、cmake 甚至 miktex。Conda 的包管理机制是统一存放缓存（`pkgs_dirs`），虚拟环境中通过硬链接复用缓存中的包，不被任何环境链接的包会在 `conda clean` 时被真正移除。

推荐使用 **Miniforge**（社区维护的轻量版，预装 mamba 和 conda-forge 源），而非臃肿的 Anaconda。

**当然，即使是 Miniforge，也比不过现代化的 uv。**

> `pkgs_dirs` 和 `envs_dirs` 必须在同一挂载卷上才能使用硬链接。

## When to Use

* 安装、配置 conda / Miniforge / Miniconda 时
* 换源、加速包下载时
* 创建、管理、删除 conda 虚拟环境时
* conda 环境下安装 PyTorch 等特定 build 的包时
* VSCode 中 conda 激活弹窗或 PowerShell 兼容性问题时

## 常规配置

### 安装

#### Windows — Miniforge

[为什么conda装包那么难用？？？ - 知乎](https://www.zhihu.com/question/522359067) 

[终端中运行 conda install 命令后一直显示“Solving environment: \ ”conda一直在solving environment-CSDN博客](https://blog.csdn.net/Funing7/article/details/144369496)  

[性能 — conda 25.1.1 文档 - Conda 包管理器](https://docs.conda.org.cn/projects/conda/en/stable/user-guide/concepts/conda-performance.html)  

[Miniforge: conda, mamba and conda-forge — Fluiddyn Howto book](https://fluidhowto.readthedocs.io/en/latest/python/conda-forge.html)  

[Anaconda vs. Miniconda vs. Miniforge - 知乎](https://zhuanlan.zhihu.com/p/699452515) 

[conda太慢怎么办，使用mamba代替龟速conda - 知乎](https://zhuanlan.zhihu.com/p/660582882)  

[Miniforge —— 轻量化的 conda 解决方案-CSDN博客](https://blog.csdn.net/qq_45141261/article/details/145508280)  

[企业可商用的conda：「Miniforge」+「conda-forge」 - 教程 - yjbjingcha - 博客园](https://www.cnblogs.com/yjbjingcha/p/19049222)

直接下载 [Miniforge](https://github.com/conda-forge/miniforge) 安装包。Miniforge 预装 mamba（Conda 的 C++ 重写），无需手动安装。

#### Ubuntu — Miniconda

[RPM and Debian Repositories for Miniconda — conda 25.5.2.dev69 documentation](https://docs.conda.io/projects/conda/en/latest/user-guide/install/rpm-debian.html)  

[Anaconda | RPM and Debian Repositories for Miniconda](https://www.anaconda.com/blog/rpm-and-debian-repositories-for-miniconda)

Miniforge 没有预构建的 deb 包，使用 Miniconda 的 apt 源：

```bash
curl https://repo.anaconda.com/pkgs/misc/gpgkeys/anaconda.asc | gpg --dearmor > conda.gpg
sudo install -o root -g root -m 644 conda.gpg /usr/share/keyrings/conda-archive-keyring.gpg

gpg --keyring /usr/share/keyrings/conda-archive-keyring.gpg --no-default-keyring \
    --fingerprint 34161F5BF5EB1D4BFBBB8F0A8AEB4F8B29D82806

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/conda-archive-keyring.gpg] https://repo.anaconda.com/pkgs/misc/debrepo/conda stable main" \
    | sudo tee /etc/apt/sources.list.d/conda.list

sudo apt update
sudo apt install conda
conda install mamba
```

### 换源

[miniconda更换清华源踩坑 - 简书](https://www.jianshu.com/p/e18f52ffd7b4)  

[conda config — conda 25.7.0 documentation](https://docs.conda.io/projects/conda/en/stable/commands/config.html)  

[conda Collecting package metadata (repodata.json)卡住或 failed问题_collecting package metadata (repodata.json):-CSDN博客](https://blog.csdn.net/qq_40345954/article/details/114392892)  

[conda Collecting package metadata (repodata.json)卡住或 failed问题 - SBOOK灵感之窗](https://www.cdhsbook.cn/Python/30.html)  

[conda 中如何移除默认源 - 小鲨鱼2018 - 博客园](https://www.cnblogs.com/liujiaxin2018/p/16712912.html)  

[conda删除默认的镜像源-CSDN博客](https://blog.csdn.net/qq_30131489/article/details/104921488)

[conda创建虚拟环境太慢，Collecting package metadata (current_repodata.json): failed_conda collecting package特别慢-CSDN博客](https://blog.csdn.net/ogebgvictor/article/details/137478112)

`conda config --show channels` 查看当前源。配置文件位置用 `conda info` 查看（`populated config files`）。

两处配置文件都要改（如有），**不能有官方源残留**，否则会在 `Collecting package metadata (repodata.json)` 阶段卡住：

```yaml
channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
```

使用代理软件时，将清华源的 `https` 换成 `http`，或将代理设为全局模式。

### 初次使用

如果不配置后续的 conda init，则每次都要输入 `source /opt/conda/etc/profile.d/conda.sh` 或者 `C:\ProgramData\anaconda3\shell\condabin\conda-hook.ps1` 才能使用 conda 命令。


[Activate Environments in Terminal Using Environment Variables · microsoft/vscode-python Wiki](https://github.com/microsoft/vscode-python/wiki/Activate-Environments-in-Terminal-Using-Environment-Variables)  

[解决vscode终端不显示conda环境变量名称问题【详细步骤！实测可行！！】vscode不显示conda虚拟环境-CSDN博客](https://blog.csdn.net/xiaoh_7/article/details/139465137)  

[conda虚拟环境名称无法在vscode中的powershell显示的问题 - 知乎](https://zhuanlan.zhihu.com/p/599981717)

这样选择 Interpreter 后，VSCode 也会告诉我已经进入了环境，但是不显示环境名。

### Windows Powershell 适配

[解决windows11在vscode中powershell终端无法调用anaconda/miniconda的base虚拟环境 - 知乎](https://zhuanlan.zhihu.com/p/639866697)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

`get-executionpolicy` 可供检验。

### conda init — 环境隔离

[conda的初始化问题 - 知乎](https://zhuanlan.zhihu.com/p/7545138567)

[conda init — conda 25.1.1 文档 - Conda 文档](https://docs.conda.org.cn/projects/conda/en/stable/commands/init.html)  

[一打开终端就默认进入conda的base环境，取消方法_conda开机进入base环境-CSDN博客](https://blog.csdn.net/weixin_43698781/article/details/124154268)  

[Anaconda太霸道了！（conda deactivate退出虚拟环境）miniconda-CSDN博客](https://blog.csdn.net/Dontla/article/details/144143364)  

[安装conda后取消命令行前出现的base，取消每次启动自动激活conda的基础环境, 使用ubuntu 自带的Python环境 - clemente - 博客园](https://www.cnblogs.com/clemente/p/11231539.html)

```bash
conda init                 # 启用终端自动激活，隔离系统 Python 和用户 Python
conda init --reverse bash  # 撤销
```

可以指定特定的 shell，例如 `conda init bash` 或者 `conda init zsh`

`python -c "import sys; print(sys.executable)"` 可验证 Python 路径。

### VSCode 适配

[在WIN10 PowerShell中使用并激活Anaconda虚拟环境 - 知乎](https://zhuanlan.zhihu.com/p/149656019)  

[powershell下利用Anaconda创建并激活python虚拟环境_powershell 进anaconda-CSDN博客](https://blog.csdn.net/qq_45538469/article/details/104936929)  

[解决Win10 PowerShell无法激活Anaconda环境的问题 - Dereen - 博客园](https://www.cnblogs.com/dereen/p/ps_conda_env.html)  

[BCSharp/PSCondaEnvs: Implementation of Conda's activate/deactivate functions in Powershell.](https://github.com/BCSharp/PSCondaEnvs)  

[Liquidmantis/PSCondaEnvs: Drop in replacement scripts that replicate Conda's activate/deactivate commands in Powershell.](https://github.com/Liquidmantis/PSCondaEnvs)  
  
[Pscondaenvs | Anaconda.org](https://anaconda.org/pscondaenvs/pscondaenvs)

**问题**：PowerShell 终端中 conda 环境激活时弹出 cmd 黑色窗口。根源是 VSCode 执行了 `C:\ProgramData\miniforge3\Scripts\activate`（bash 脚本），而非 PowerShell 的 `conda-hook.ps1`。

[CMD window show up during conda env activation on Windows · Issue](https://github.com/microsoft/vscode-python/issues/20836) 

[A bash script （AnaConda/Scripts/activate）cause a pop-up cmd window in Windows11. · Issue](https://github.com/conda/conda/issues/15106)

[vscode opens the terminal to automatically execute the environment activation command, and opens the cmd window · Issue](https://github.com/microsoft/vscode/issues/259970) 

**解决**：在 `D:\Documents\WindowsPowerShell\profile.ps1` 中设置别名：

```powershell
Set-Alias 'C:/ProgramData/miniforge3/Scripts/activate' 'C:/ProgramData/miniforge3/shell/condabin/conda-hook.ps1'
```

不要在 VSCode `settings.json` 的 `terminal.integrated.profiles.windows` 中通过 `args` 设置，会导致 tasks.json 无法正常运行（Powershell 无法接收多个 `-Command` 参数）。

## 可选配置

查看所有配置用 `conda config --show`

### 取消 base 环境自动激活

[一打开终端就默认进入conda的base环境，取消方法_conda开机进入base环境-CSDN博客](https://blog.csdn.net/weixin_43698781/article/details/124154268)

conda init 后，一旦打开终端，base环境就被激活。实际上每次只要输入 `conda deactivate base` 就可以回到系统默认的Python。可以在conda的设置里面取消这个

```bash
conda config --set auto_activate_base false
```

等效方法：在用户路径下（一般为 `C:\users\username`，linux的话就是 `/home/username` 路径）有一个名为 `.condarc` 的文件，是conda的配置信息。参考官方文档关于 `.condarc` 配置文件的说明，在里面添加一句：`auto_activate_base: false` 即可。实际上，方法一也是修改的 `.condarc`文件，可以在使用方法一的同时观察此文件内容的变化。

### 修改环境保存路径

[最新版最详细Anaconda新手安装+配置+环境创建教程-CSDN博客](https://blog.csdn.net/qq_44000789/article/details/142214660)

在 `.condarc` 中配置：

```yaml
envs_dirs:
  - F:\conda\envs
pkgs_dirs:
  - F:\conda\pkgs
```

用 `conda info` 验证。

### conda 下安装 PyTorch

[Pytorch 放弃conda后如何安装使用_conda packages are no longer available. please use-CSDN博客](https://blog.csdn.net/gabi75888/article/details/145677978)

[conda安装包的时候如何指定特定build的版本_conda下载指定版本的包-CSDN博客](https://blog.csdn.net/mr_hore/article/details/138902535)

`pytorch-gpu` 包，并没有用上。`pytorch-cuda` 也没有用。

直接 `conda install pytorch` 即可，会自动找到 `conda-forge::pytorch`（CUDA 版本）。

若需指定 CUDA 版本，先搜索 build 再安装：

```bash
conda search torchvision
# torchvision  0.24.1  cuda129_py312_hc459427_1  conda-forge

mamba install torchvision=0.24.1=cuda129_py312_hcac1699_0
```

### 设置自动清理缓存

```bash
conda config --set auto_remove_cached True
```

### 显示通道地址

```bash
conda config --set show_channel_urls yes
```

### 修改环境变量

[AddToPath parameter doesn't work on installer Anaconda3-2022.05-Windows-x86_64 · Issue #12995 · ContinuumIO/anaconda-issues](https://github.com/ContinuumIO/anaconda-issues/issues/12995)

conda init 的下位替代，由于直接修改环境变量并不优雅，不建议使用。关键的 PATH 如下（以安装到 D 盘的为例）

```
D:\anaconda3
D:\anaconda3\Scripts
D:\anaconda3\Library\bin
D:\anaconda3\Library\mingw-w64\bin
```

## 手动环境管理

[Anaconda conda常用命令：从入门到精通_conda list-CSDN博客](https://blog.csdn.net/chenxy_bwave/article/details/119996001)  

[使用conda安装requirement.txt指定的依赖包_conda requirements txt安装-CSDN博客](https://blog.csdn.net/Mao_Jonah/article/details/89502380)

[python - How to uninstall all unused packages in a conda virtual environment? - Stack Overflow](https://stackoverflow.com/questions/36308531/how-to-uninstall-all-unused-packages-in-a-conda-virtual-environment)

| 操作 | 命令 |
|------|------|
| 创建环境（同时装包） | `conda create -n env_name python=3.12` / `conda create -n env_name python=3.12 numpy` |
| 激活环境 | `conda activate env_name` |
| 退出环境 | `conda deactivate` |
| 列出已安装包 | `conda list` |
| 搜索包 | `conda search pkg_name` |
| 检查是否已安装 | `conda list pkg_name` |
| 安装包 | `conda install pkg_name` |
| 更新包 | `conda update pkg_name` |
| 指定源安装 | `conda install pkg_name -c source_url` |
| 卸载包 | `conda remove package_name` |
| 删除某环境的包 | `conda remove --name env_name package_name` |
| 删除整个环境 | `conda remove --name env_name --all` |
| 环境重命名 | `conda rename -n old_name new_name` |
| 缓存清除（无用的包） | `conda clean -p` |
| 缓存清除（tar 打包） | `conda clean -t` |
| 缓存清除（全部） | `conda clean --all` |

### 历史回滚

```bash
conda list --revisions          # 查看安装历史记录
conda install --revision N      # 回滚到指定版本
```

## 自动项目管理

### 环境导入导出

```bash
conda env export --name myenv > myenv.yml    # 导出
conda env create -f myenv.yml                # 还原
```

## Common Pitfalls

### VSCode 中 conda 激活弹黑窗口

[自定义 shell 环境 - PowerShell | Microsoft Learn](https://learn.microsoft.com/zh-cn/powershell/scripting/learn/shell/creating-profiles?view=powershell-7.5)

见上方「VSCode 适配」。本质是 PowerShell 中误执行了 bash 脚本 `activate`，用别名劫持到 `conda-hook.ps1`。

> 如果在 VSCode 的 settings.json 中设置，会导致我的任何 tasks.json 的配置无法使用，因为Powershell无法接收两个-Command参数。

```json
// 错误示范。请在 profile.ps1 中设置别名，而不是在 settings.json 中设置 args。
    "terminal.integrated.profiles.windows": {
        "PowerShell": {
            "source": "PowerShell",
            "icon": "terminal-powershell",
            "args": ["-NoExit", "-Command", "Set-Alias 'C:/ProgramData/miniforge3/Scripts/activate' 'C:/ProgramData/miniforge3/shell/condabin/conda-hook.ps1'"]
        }
    }
```

### conda install 无响应 / Collecting package metadata 卡住

[Collecting package metadata 卡住或 failed 问题](https://blog.csdn.net/qq_40345954/article/details/114392892)

检查换源是否彻底 —— `conda config --show channels` 确保无官方源残留。使用代理时切换为 `http`。

## Verification Checklist

* [ ] **conda 可运行**

    ```bash
    conda --version
    ```
* [ ] **mamba 可用**

    ```bash
    mamba --version
    ```
* [ ] **可创建、激活、退出环境**

    ```bash
    conda create -n test python=3.12 -y
    conda activate test
    conda deactivate
    conda remove --name test --all -y
    ```
* [ ] **源配置正确**

    ```bash
    conda config --show channels
    ```
* [ ] **VSCode 终端激活环境不弹黑窗口**
