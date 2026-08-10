## Common Install

### 安装 MiKTeX

[（译）在Windows上使用TeX：TeX Live与MiKTeX的对比 - gisliuliang - 博客园](https://www.cnblogs.com/liuliang1999/p/12656706.html)  
[Windows 下 LaTex 超简单地安装使用（MikTeX + VSCode) - 有氧 - 博客园](https://blog.csdn.net/weixin_45226065/article/details/130429715)  
[VS code + MiKTeX_miktex+vscode-CSDN博客](https://blog.csdn.net/weixin_45226065/article/details/130429715)  
[Ubuntu 20.04 安装Miktex - 知乎](https://zhuanlan.zhihu.com/p/1912911019178702103)

Windows下安装MiKTeX，直接下载官方安装程序即可。

个人习惯于选择"Install MiKTeX for Anyone who uses this computer (all users)"，并用管理员权限控制一切。

安装后在终端应该能找到 texify ，似乎不用配置PATH环境变量

```powershell
PS C:\Users\enoch> texify
Missing file argument.

Sorry, but texify did not succeed.
```

### 配置 latexmk 并安装 Perl

[VSCode 配置 LaTeX 环境（MiKTeX）_miktex vscode-CSDN博客](https://blog.csdn.net/weixin_41984570/article/details/145394873)  
[Windows运行Latex：使用VS Code + MiKTex + Perl_miktex perl-CSDN博客](https://blog.csdn.net/DrGuCoding/article/details/123523407)  
[Perl、StrawberryPerl 和 ActivePerl 的区别 - ByteZoneX社区](https://www.bytezonex.com/archives/F5Ex7KMw.html)
[xelatex 以及 latexmk 命令行编译 - 知乎](https://zhuanlan.zhihu.com/p/256370737)  
[LaTeX技巧912：使用latexmk自动编译LaTeX - LaTeX工作室](https://www.latexstudio.net/archives/10935)

latexmk 就是 LaTeX 界的`make`、`maven`这样的项目管理器，自动调用`xelatex`，`lualatex`和`pdflatex`。已经在 MiKTeX 中集成了 latexmk，但是需要 Perl 运行环境。

如果不安装Perl，会显示

```
latexmk: security risk: running with elevated privileges
Sorry, but latexmk did not succeed for the following reason:
  MiKTeX could not find the script engine 'perl' which is required to execute 'latexmk'.
Remedy:
  Make sure 'perl' is installed on your system.
The log file hopefully contains the information to get MiKTeX going again:
  C:\Users\enoch\AppData\Local\MiKTeX\miktex\log\latexmk.log
For more information, visit: <https://miktex.org/kb/fix-script-engine-not-found>
latexmk: major issue: So far, no MiKTeX administrator has checked for updates.
```

我选择开源的Strawberry Perl。安装完也不用配置PATH环境变量，直接输入`perl --help` 即可找到

[Windows下安装配置StrawberryPerl（运行pl文件）_strawberry perl-CSDN博客](https://blog.csdn.net/zhaitianbao/article/details/145057542)

安装后会自动配置如下环境变量

```
C:\Strawberry\c\bin
C:\Strawberry\perl\site\bin
C:\Strawberry\perl\bin
```

[[feature request] don't pollute PATH with mingw toolchain · Issue #11 · StrawberryPerl/Perl-Dist-Strawberry](https://github.com/StrawberryPerl/Perl-Dist-Strawberry/issues/11)

请把 `C:\Strawberry\c\bin` 从PATH中删除，只要你不安装额外的perl包。我们的perl只用于latexmk所以不需要额外的包。

## Optional Configure

### VSCode 插件适配

[[bug] 内置Perl版本过低，会与LaTeX 需要的版本冲突 · Issue #292 · github0null/eide](https://github.com/github0null/eide/issues/292)

latexmk 的 Perl 会和 VSCode 内会和插件 EIDE 冲突，不过我现在主要使用 PlatformIO IDE，暂时不考虑 EIDE。

## Global Manage

### 包管理器

[- MiKTeX Docs](https://docs.miktex.org/manual/autoinstall.html)  
[Manage your TeX installation with MiKTeX Console](https://miktex.org/howto/miktex-console)

MiKTeX Console 是图形化管理工具，这里主要描述命令行管理工具 `miktex` 的使用。

```
PS C:\Users\enoch> miktex --help
Usage: C:\Program Files\MiKTeX\miktex\bin\x64\miktex.exe [COMMON-OPTION...] TOPIC COMMAND [COMMAND-OPTION...]
Topics:
  filesystem - Commands for watching the file system
  filetypes - Commands for managing Windows file types
  fndb - Commands for managing the file name database
  fontmaps - Commands for managing PDF/PostScript font maps
  formats - Commands for managing TeX formats and METAFONT bases
  languages - Commands for managing LaTeX language definitions
  links - Commands for managing links from scripts and formats to executables
  packages - Commands for managing MiKTeX packages
  repositories - Commands for managing MiKTeX package repositories
```

开启自动安装（on-the-fly）功能，安装缺失的包……

## Project Manage

### recipe & tool

[搭建 LaTeX 舒适写作环境（VSCode） - 知乎](https://zhuanlan.zhihu.com/p/139210056)
[VSCode LaTeX WorkShop 配置 | Fenglielie](https://fenglielie.top/p/c90014f2/)

多次编译，实现自动化构建（类似CMake和Maven）

第一种配置是不使用 latexmk，直接使用xelatex等编译命令，使用recipe配置多次编译。在VSCode插件中为`"latex-workshop.latex.recipes”`

第二种配置是使用latexmk自动调用xelatex，lualatex和pdflatex

### VSCode 插件使用

[IEEE-Template Selector](https://template-selector.ieee.org/secure/templateSelector/downloadTemplate?publicationTypeId=1&titleId=181&articleId=1&fileId=372)

VSCode插件配置和latexmk配置都可以影响编译。因此项目中`.latexmkrc`等配置可能会对插件的编译行为造成影响。但因为插件的选项是通过命令行参数传递的，优先级更高，影响应该不大。

LaTeX Workshop 插件直接安装使用，我找了IEEE TAC的模板打开。啥也不用干！无脑点运行！

会自动弹出窗提示你安装依赖包（不用担心回滚，包管理器会记录包的安装时间）

几个弹窗过后，main.pdf就出来了

## Common Pitfalls

### No Qt platform plugin

[解决miktex更新后无法打开：this application failed to start because no QT......-CSDN博客](https://blog.csdn.net/weixin_52455619/article/details/138384953)

运行 MiKTeX Console 时，报错：

```
miktex‑console
This application failed to start because no Qt platform plugin could be initialized. Reinstalling the application may fix this problem.
Available platform plugins are: windows.
```

1. 通过链接[Index of /systems/win32/miktex/tm/packages](https://ctan.net/systems/win32/miktex/tm/packages/)，下载名为“miktex-qt6-bin-x64.tar.lzma”的包。（使用ctrl+F快速查找）
2. 解压缩程序包后，它是一个文件夹，然后进入此文件夹，直到找到\texmf\miktex\bin\x64中的文件（注意：我用winrar没解压成功，7-zip解压成功了，可能是WinRAR不支持lzma算法）。
3. 找到你的MikTeX安装文件夹，如D:\YourFolder\MikTeX，进入D:\your folder\MikTeX\MikTeX\bin\x64。
4. 现在将步骤2的x64文件夹中的所有文件复制到步骤3的x64文件夹（选择全部替换）。
5. 对我来说，经过所有这些步骤，MikTeX再次可用。
6. 注意：在这些步骤之后，你可能会发现MiKTeX要求你再次更新以删除qt5包。然而更新软件包后，MiKTeX将再次崩溃。所以现在你需要做的也不是重新安装MiKTeX，而是再次完成上面提到的步骤。在这段时间之后，MiKTeX将不再有更新，并且能够正常使用。

### 记得检查更新

记得检查更新，不然可能不给你编译？`latexmk: major issue: So far, no MiKTeX administrator has checked for updates.`
