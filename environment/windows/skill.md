

## Common Install

### PE 镜像制作

#### NT5 时代

[[无忧首发]从0开始, 用WinBuilder一步一步制作自己的带中文支持的英文版PE - PE讨论区 - 无忧启动论坛 - Powered by Discuz!](https://bbs.wuyou.net/forum.php?mod=viewthread&tid=125756)
[以 Ramdisk 方式启动 WinPE 之 FAQ 不完整版（附电子书下载） - PE讨论区 - 无忧启动论坛 - Powered by Discuz!](https://bbs.wuyou.net/forum.php?mod=viewthread&tid=82943)

以我一款“大白菜PE”的`DBC2003.ISO`为例，是**模板继承 + 手工再造的混血**：

- 外圈（目录结构、SETUPLDR、WINNT.XPE 写法）= 老毛桃系 RAMDisk 模板，2010 年定型
- 内层 = 2014→2018 年用无忧手工流水线重做的：PECMD 2012 当启动环境事实标准、USB3 驱动手塞、外置程序用 **7z 包**（老毛桃原版用 OP.WIM，作者换成了自己的方案）、PEINIT.EXE 自研
- 单 PE 直启、无 EasyBoot 菜单——典型的"个人维护盘"，不是商业量产货
- **盘里的指纹**：`\WXPE\SYSTEM32\BARTPE.EXE` 还在——制作者的基底或工具链与 BartPE 体系有血缘。但注意：BartPE 默认产物是**非 RAM 盘**直读光盘版，而且不带 PECMD；RAMDisk + `.IS_` + PECMD 这套是中文圈子（无忧启动）在 BartPE 基础上再加工的产物。

| 工具 | 原理 | 地位 |
|---|---|---|
| **Barts PE Builder (BartPE)** | 读 XP/2003 安装源，靠**插件体系**（每个插件声明"装哪个软件、拷哪些文件、注册表改什么"）自动拼出一个可引导 PE。关键机制：整棵注册表加载进 RAM、不写回介质，所以能从只读光盘跑起来 | 当年个人从零做 PE 的绝对主力，最后版本 3.0.23 |
| **WinBuilder** | 同思路的脚本化后辈，用脚本而非插件控制每个文件 | 无忧启动论坛有"从0开始用 WinBuilder 做中文 PE"的经典教程，2003 时代是 BartPE 的补充 |
| **无忧手工流水线** | 老毛桃的《以 Ramdisk 方式启动 WinPE 之 FAQ》就是说明书：拼精简 I386 → 写 TXTSETUP.SIF/SETUPREG.HI_ → makecab 压成 `.IS_` → 写 WINNT.XPE → 出 ISO | 我们上一轮拆出来的那条链路，本来就是公开文档 |

#### Windows OPK (OEM Preinstallation Kit) 或 WAIK (Windows Automated Installation Kit)

当时最“正宗”的方法，需要用到微软为OEM厂商或系统部署提供的专业工具包。对于Windows XP/2003时代的PE（通常称为**WinPE 1.x**），官方工具是 **Windows OPK** 或早期的 **Windows AIK**。

*   **核心工具**：`mkimg.cmd`。这是一个命令行脚本，用于从Windows XP或2003的安装光盘中提取文件，并打包成PE。
*   **基本流程**：
    1.  安装OPK或WAIK工具包。
    2.  将工具包中的 `WINPE` 文件夹复制到工作目录。
    3.  将Windows XP或2003的安装光盘放入光驱（或加载ISO镜像）。
    4.  在命令行中运行 `mkimg.cmd [光盘盘符] [目标文件夹]`。
    5.  命令执行后，便会在目标文件夹生成一个包含PE文件的ISO镜像。

微软还曾发布过基于特定系统的专用PE版本，如基于 **Windows XP SP2** 的 **WinPE 2004** 和基于 **Windows Server 2003 SP1** 的 **WinPE 2005**。这些是独立的工具包，内部同样使用 `mkimg.cmd` 等工具进行定制。

制作老版本PE时，有几个关键点需要注意：

1.  **系统与工具匹配**：制作工具（OPK/WAIK/BartPE）必须与你打算作为“原料”的操作系统（Windows XP/2003）版本相匹配。
2.  **硬件驱动问题**：老版本PE原生不支持AHCI、USB 3.0等现代硬件标准。在新电脑上启动很可能会找不到硬盘或无法识别USB设备，需要提前将对应驱动整合进PE。
3.  **软件兼容性**：为这些老PE开发的工具和插件（Plugin）大多年代久远，可能难以找到或在新硬件上无法运行。
4.  **中文支持**：使用BartPE时，需要额外下载并配置中文语言插件（如 `chinese_chs.lng`）才能正常显示中文。

#### NT6 时代




### 启动盘镜像封装

所谓"一键制作"几乎都不是从零生成，而是：

- **老九 WinPE 老毛桃修改版"撒手不管版"(070911)**：2007-09-11 发布，核心系统仅 26MB、整包 108.5MB，PECMD + WIM 驱动，系统本体就是 ISO 镜像。这是当年流传最广的**成品 PE 母盘**——你手上这张盘的目录结构（`MINIPE` + `WXPE` + `WINNT.XPE`）就是老毛桃系模板的直接后裔。
- **通用PE工具箱 / 大白菜 / 老毛桃U盘版**：本质 = 预置 PE 镜像 + 引导程序（grub4dos / setupldr / UD三分区）+ 写入器。知乎上"老毛桃U盘制作软件是怎么实现的"问的就是这个，答案就是"镜像早就做好了，工具只负责把引导扇区写进 U盘"。
- **EasyBoot**（和 UltraISO 同门 EZB Systems）：多合一光盘的**引导菜单制造器**——做个菜单界面，选 PE 就链载 setupldr、选 DOS 就链载软盘镜像，当年"N合一维护盘"的标配。






## 无人值守脚本

[Use autounattend.xml files to install Windows 10/11](https://schneegans.de/windows/unattend-generator/usage/#winpedriverfolder)
[Wintech Labs - Unattended Toolkit XP Edition](https://unattended.wintech.pt/)








# 认识系统

## 认识Windows精简版

[Windows 精简大神俄罗斯网友 lopatkin 新网址来了 发布新中文pip版 - Windows - 远景论坛 - 前沿科技与智慧生态的极客社区 -](https://bbs.pcbeta.com/viewthread-1632178-1-1.html)  
[俄大神系统精简版对比-CSDN博客](https://blog.csdn.net/Tifa_Best/article/details/87902280)

[lopatkin俄大神精简中文系统 DREY PIP MICRO BOX LITE区别-CSDN博客](https://blog.csdn.net/chengtan3348/article/details/100785381)

[版本说明-百度贴吧](https://tieba.baidu.com/p/6177207341)

[大神系统各版本的区别-百度贴吧](https://tieba.baidu.com/p/5439809486)

[4月 Win10企业版 1803 64位PIP BOX LIM-百度贴吧](https://tieba.baidu.com/p/5645463307)

[Windows-IOSFiles/Lopatkin.md at master · 2144291529/Windows-IOSFiles](https://github.com/2144291529/Windows-IOSFiles/blob/master/Lopatkin.md)

[哪位大神清楚lopatkin系统DREY、PIP、LITE、MINI、SM、SMS的含义？ - 综合讨论区 - 无忧启动论坛 - Powered by Discuz!](http://wuyou.net/forum.php?mod=viewthread&tid=420839)

[来一起加速：lopatkin最新2016LTSB_LIM+PIP2合一 - 远景论坛 - 前沿科技与智慧生态的极客社区 -](https://bbs.pcbeta.com/viewthread-1775513-1-1.html)

[问下俄大神lopatkin系统里的PIP和LIM有啥区别？-百度贴吧](https://tieba.baidu.com/p/9184925947)

[Win10俄大神精简版与官方精简版与官方原版区别介绍 - 哔哩哔哩](https://www.bilibili.com/opus/407051793158564114)

[俄罗斯大神win7精简版_俄罗斯大神精简版Windows系统镜像合集（内附Onedrive恢复方法）...-CSDN博客](https://blog.csdn.net/weixin_39902870/article/details/110361280)

传奇精简系统，Windows 10能装进12G傲腾盘

## 可选：完整迁移用户目录

[Windows系统更改/迁移用户目录 - Macrored - 博客园](https://www.cnblogs.com/macrored/p/15849185.html)

[改变 Windows 用户文件夹默认路径 C:/Users_修改users默认路径-CSDN博客](https://blog.csdn.net/weixin_51204324/article/details/132555913)

# 包管理器

[Windows 上最好的包管理工具是 Chocolatey 还是 Scoop ？ - 知乎](https://www.zhihu.com/question/369403302?sort=created)

[/转/ Windows命令行软件安装服务比较：Chocolatey、Scoop 与 winget - 知乎](https://zhuanlan.zhihu.com/p/694665774)

重装Windows 10应用商店：[重装Win10应用商店 - 知乎](https://zhuanlan.zhihu.com/p/618916095)，下载 [Reinstall-preinstalledApps.zip](https://link.zhihu.com/?target=http%3A//go.microsoft.com/fwlink/%3FLinkId%3D619547) 文件

1. 生活用`msstore`（包括工具链的启动器）。只要能在微软应用商店安装，就在应用商店安装，便于管理。
2. 生产用`winget/msi/exe`（工具链、VSCode）软件，或无法在应用商店找到的软件，用安装器安装，且用管理员模式以免装进AppData难以查找，winget可以自然发现，因此exe直接安装。
3. 绿色小工具用`scoop`。没有安装包，或使用脚本安装的绿色软件（如Maven），用scoop安装。scoop默认会存放在`C:\Users\enoch`中。

# 环境变量

我就用"D:\Users\enoch\Documents\WindowsPowerShell\profile.ps1”改环境变量，反正只是终端用，也不会污染Windows设置

# 推荐软件

Acrobat+MarkText+MarukoToolbox+VideoCaptioner

[(22 封私信 / 87 条消息) 管理桌面文件Easy File Organizer - 知乎](https://zhuanlan.zhihu.com/p/548906538)

Space Thumbnails已被F3D和Open 3D Model Viewer替代

PowerToys可以预览代码和Markdown

[Folder Size Explorer - Simple Windows Explorer with folder sizes.](https://www.folder-sizes-explorer.com/)  
[Folder Size Explorer - Simple Windows Explorer with folder sizes and more...](https://www.folder-size-explorer.com/index.shtml)  
[FolderSizes Feature Comparison](https://www.foldersizes.com/features)  
[Diskitude - Made by Evan](https://madebyevan.com/diskitude/)  
[SpaceSniffer官网下载 - 智能磁盘空间分析工具中文安装使用教程](https://www.spacesniffer.com.cn/)  
[SpaceSniffer download](https://www.uderzo.it/main_products/space_sniffer/download.html)  
[六大磁盘分析工具对比-CSDN博客](https://blog.csdn.net/qq_27898413/article/details/117248833)  
[WizTree - The Fastest Disk Space Analyzer](https://www.diskanalyzer.com/)  
[Free Disk Space Analyzer Software for Windows - FolderSizes](https://www.foldersizes.com/)

FolderSizes 9是功能最全的

[【教學】將BlueStacks模擬器的檔案複製到電腦，共用文件](https://www.pkstep.com/bluestacks-files-to-computer/)

res-downloader+XDM+qBittorrent

# 下载管理

[同比6款热门下载器，IDM还是最好用的那个吗？ - 知乎](https://zhuanlan.zhihu.com/p/500792340)

[视频号直播自动录制方案，使用RPA+快抖工具实现开播自动检测与录制_视频号直播监控录制-CSDN博客](https://blog.csdn.net/zzl1243976730/article/details/151967129)

[视频号直播录屏全攻略：两种方法轻松搞定 - 哔哩哔哩](https://www.bilibili.com/opus/1071279068282880069)

# 网络问题

## 多网卡Timeout问题

[window11 查看本地端口是否开放_win11查看3306端口是否开放-CSDN博客](https://blog.csdn.net/m0_50641264/article/details/128478466)

`A connection timeout has occurred while trying to connect to '172.27.240.1' on port '4000'. The issue could either be caused by a networking problem, by a firewall or NAT blocking incoming traffic or by a wrong server address. Please verify your configuration and try again.`

NoMachine有一个特性/安全漏洞，你可以发现局域网下其他设备的所有网络适配器的IP。而自动设置的IP所对应的网卡可能与本机网卡根本不在同一个局域网下。

打开目标机器的ipconfig，发现控制机器自动分配的172地址对应的是vEthernet而不是Wi-Fi，于是找到Wi-Fi对应的192地址，把控制机器的172换成192。
