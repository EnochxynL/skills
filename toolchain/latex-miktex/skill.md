---
name: latex-miktex
description: Use when setting up or troubleshooting LaTeX with MiKTeX on Windows — installing MiKTeX, configuring latexmk with Strawberry Perl, integrating VSCode LaTeX Workshop, managing packages via miktex CLI, and resolving common MiKTeX issues.
metadata:
  hermes:
    tags:
      - miktex
      - latex
      - tex
      - windows
      - perl
      - latexmk
      - vscode
---

# LaTeX — MiKTeX 写作环境搭建

## Overview

MiKTeX 是 Windows 上最流行的 LaTeX 发行版之一。与 TeX Live 不同，MiKTeX 支持按需自动安装缺失的包（on-the-fly），无需预先下载完整的宏包集合。latexmk 是 LaTeX 的项目管理器（类似 `make`），自动处理多次编译和交叉引用，MiKTeX 已内置 latexmk 但需要 Perl 运行环境。

核心思路：**MiKTeX + Strawberry Perl + VSCode LaTeX Workshop** 三者配合，实现一键编译 PDF。

## When to Use

* 在 Windows 上安装或配置 MiKTeX 时
* 配置 latexmk 并安装 Strawberry Perl 时
* 配置 VSCode LaTeX Workshop 插件的 recipe 和 tool 时
* 使用 `miktex` 命令行管理包和仓库时
* 解决 MiKTeX Console Qt 平台插件报错时
* 解决 latexmk 找不到 Perl 引擎时
* 解决 VSCode 内其他插件与 Perl 冲突时

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

[IEEE-Template Selector](https://template-selector.ieee.org/secure/templateSelector/downloadTemplate?publicationTypeId=1&titleId=181&articleId=1&fileId=372)

latexmk 的 Perl 会和 VSCode 内会和插件 EIDE 冲突，不过我现在主要使用 PlatformIO IDE，暂时不考虑 EIDE。

LaTeX Workshop 插件直接安装使用，我找了IEEE TAC的模板打开。

### html 转换器

[lwarp](https://miktex.org/packages/lwarp)

[强烈推荐：`make4ht`—打造更优的\TeX到XML转换体验-CSDN博客](https://blog.csdn.net/gitblog_00068/article/details/139793093)

[LaTeX Lwarp package](https://ctan.math.washington.edu/tex-archive/macros/latex/contrib/lwarp/lwarp.pdf)

[lwarp 包 latex 到 html 中文文档 - LaTeX 工作室](https://www.latexstudio.net/index/details/index/mid/4588.html)

[LaTeX → HTML (tex4ht/make4ht/lwarp/LaTeXML) — LaTeX 参考](https://tex64.com/zh/learn/conversion/latex-to-html#which-to-choose)

[Pandoc vs LaTeXML for LaTeX conversion - TeX - LaTeX Stack Exchange](https://tex.stackexchange.com/questions/698081/pandoc-vs-latexml-for-latex-conversion)

[将LaTeX文档发布到Hugo博客的方法背景 在数学理论和其他技术领域，文章通常采用 LaTeX 格式编写，并最终渲染为 - 掘金](https://juejin.cn/post/7393533304505794611)

| 特性 | **make4ht** | **lwarp** | **LaTeXML** | **Pandoc** |
| :--- | :--- | :--- | :--- | :--- |
| **核心方法** | `tex4ht` 的现代化构建前端 | **运行真正的LaTeX**引擎，直接生成HTML标签 | 将LaTeX解析为**语义XML**，再转换为HTML | 通用文档转换器，将LaTeX读入其内部表示再输出 |
| **数学公式** | 可转为MathML | SVG图片 或 MathJax | **最稳健的MathML支持** | 可生成MathML |
| **宏包兼容性** | 良好，依赖`.4ht`支持文件 | **极高**，支持**500多个**宏包和类 | 良好，依赖“bindings” | **有限**，无法处理复杂LaTeX |
| **HTML质量** | 良好，可能偶有小问题 | **高保真**，与LaTeX输出最接近 | **语义化强**，结构清晰 | 一般，对复杂文档可能失真 |
| **速度** | 快 | 较慢 | 较快 | **非常快** |
| **学习/安装成本** | 低（TeX Live自带） | 低（TeX Live自带） | **高**（Perl依赖多） | 低（独立软件） |
| **适用场景** | **快速生成**可用的HTML | **高保真**、使用**大量宏包**的复杂文档 | **数学密集型**、追求**语义化**和**可访问性**（如arXiv路线） | **多格式转换**，或源文档**相对简单** |

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

建议安装 ctex 以支持中文。cjk 比较老了……

开启自动安装（on-the-fly）功能，安装缺失的包……

## Project Manage

### VSCode 插件使用

一般是啥也不用干，无脑点运行，会自动弹出窗提示你安装依赖包（不用担心回滚，包管理器会记录包的安装时间）。几个弹窗过后，main.pdf 就出来了。如果需要自定义的编译选项和流程，请往下看。

#### recipe & tool

[搭建 LaTeX 舒适写作环境（VSCode） - 知乎](https://zhuanlan.zhihu.com/p/139210056)

不用 latexmk，配置 tool 直接使用 `xelatex` 等编译命令，使用 recipe 配置多次编译。在VSCode插件中为 `"latex-workshop.latex.recipes”`。举例：

```json
{
  "latex-workshop.latex.tools": [
    {
      "name": "xelatex",
      "command": "xelatex",
      "args": [
        "-synctex=1",
        "-interaction=nonstopmode",
        "-file-line-error",
        "%DOC%"
      ]
    },
    {
      "name": "bibtex",
      "command": "bibtex",
      "args": ["%DOCFILE%"]
    }
  ],
  "latex-workshop.latex.recipes": [
    {
      "name": "xelatex",
      "tools": ["xelatex"]
    },
    {
      "name": "xelatex -> bibtex -> xelatex*2",
      "tools": ["xelatex", "bibtex", "xelatex", "xelatex"]
    }
  ]
}
```

这是一个很典型的流程，具体作用如下：
1. 生成 `.aux`（收集引文、交叉引用信息）
2. 生成 `.bbl`（根据 `.aux` 处理参考文献，生成引文列表）
3. 读入 `.bbl`，写入引文编号/作者年份
4. 解析交叉引用（`\ref`、`\label`、图号表号），使编号稳定

VSCode 插件，默认没有 `latex-workshop.latex.recipe.default` 配置，因此会使用默认值 `"first"`。
`latex-workshop.latex.recipes` 内置配置第一个是 `latexmk`。且如果项目没有 `latex-workshop.latex.tools` 会用扩展内置的默认工具，这就定义了 `latexmk` 的参数。

#### latexmkrc

[VSCode LaTeX WorkShop 配置 | Fenglielie](https://fenglielie.top/p/c90014f2/)

使用 latexmk 自动调用 `xelatex`, `lualatex`, `pdflatex`

在 VSCode 插件要特别注意，因为默认配方是 "latexmk"（带 -pdf），命令行参数覆盖 rc 文件。所以你必须：

1. 放一个 `.latexmkrc`。
2. 把配方切到 "latexmk (latexmkrc)"（或设 `latex-workshop.latex.recipe.default` 指向它。它实际使用的是 "latexmk_rconly" 这个 tool）。

#### GitHub Action

[GitHub Action for LaTeX · Actions · GitHub Marketplace](https://github.com/marketplace/actions/github-action-for-latex)

### 中文支持

[中文宏包CJK、xeCJK、luatexja、ctex的区别和联系以及UTF-8编码的定义和在编译中的重要性_cjk和xecjk-CSDN博客](https://blog.csdn.net/weixin_45008608/article/details/115837858)

下面对支持中文的宏包作出介绍：

- `CJK`宏包对中文字体的支持比较麻烦，已经不再推荐使用。
- `xeCJK`以及`luatexja`宏包在`CJK`基础上封装了对汉字排版细节的处理功能。
- `ctex`宏包和文档类进一步封装了`CJK`、`xeCJK`、`luatexja`等宏包，使得用户在排版中文时不再考虑排版引擎等细节。

[LaTex支持中文的三种方式_latex可以写中文吗-CSDN博客](https://blog.csdn.net/z_feng12489/article/details/90449495)

[LaTex支持中文的三种方式（首推第一种） - 楚千羽 - 博客园](https://www.cnblogs.com/chuqianyu/p/14620014.html)

[Latex overleaf 英文模板如何支持中文_overleaf支持中文-CSDN博客](https://blog.csdn.net/qazwsxrx/article/details/111604175)

1. 对于 XeLaTeX，原生的支持 Unicode，并默认其输入文件为 utf-8 编码，可以在不进行额外配置的情况下直接使用操作系统中安装的字体。直接使用 `ctex` 宏包可以解决大多数问题。
  
    ```latex
    \usepackage{ctex}
    ```

2. 对于 pdfLaTeX，原生不支持 Unicode，要在导言区指定编码和字体。

    ```latex
    \usepackage[UTF8]{ctex}
    \usepackage[UTF8,fontset=windows]{ctex} % 这里指定了其他的字体，规避字体缺失报错
    ```

3. 有时候 `ctex` 一些部分怎么都无法实现中文显示（如`\maketitle`），这时候不妨想想 `CJKutf8` 宏包。

    ```latex
    \usepackage{CJKutf8}
    \begin{CJK}{UTF8}{gbsn}
    \title{论文标题} 
    \date{} % 不显示日期
    \end{CJK}
    % 下面继续使用CTEX
    ```

[.tex文件中不支持中文内容+CTeX fontset `fandol‘ is unavailable... - 代码先锋网](https://www.codeleading.com/article/91135563043/)

[OverLeaf：CTeX fontset 'fandol' is unavailable in current - Paul—Huang - 博客园](https://www.cnblogs.com/Paul-Huang/articles/15787118.html)

[polyglossia - critical package ctex error:ctex fontset"fandol" is unavailable in current - TeX - LaTeX Stack Exchange](https://tex.stackexchange.com/questions/545681/critical-package-ctex-errorctex-fontsetfandol-is-unavailable-in-current/545698#545698)  

[【已解决】latex中文编译 - 技术交流与探讨 / 应用程序与桌面环境 - Arch Linux 中文论坛](https://forum.archlinuxcn.org/t/topic/12153)  

[LaTeX 中文字体配置基础指南 - 知乎](https://zhuanlan.zhihu.com/p/538459335)  

[fonts - How to install correctly simhei.ttf and simsun.ttc for pdflatex on TEX Live 2013 - TeX - LaTeX Stack Exchange](https://tex.stackexchange.com/questions/168732/how-to-install-correctly-simhei-ttf-and-simsun-ttc-for-pdflatex-on-tex-live-2013)  

[【LaTex编译遇到问题】!pdfTeX error: pdflatex (file simhei.ttf): cannot open TrueType font file for reading-CSDN博客](https://blog.csdn.net/Ryan0828/article/details/125559922)

编译时可能会碰到缺字体的报错，这时候指定其他字体，或者把缺失的字体拷贝就行

```latex
% 宏包选项
\usepackage[fontset=founder]{ctex} 
```

或

```latex
% 文档类选项
\documentclass[fontset=founder]{ctex}
```

### markdown 支持

[使用markdown宏包为LaTeX编辑文本，把markdown语句转化为LaTeX语句（vscode）_markdown转latex-CSDN博客](https://blog.csdn.net/Log_not_log/article/details/127566952)

[以 Markdown 撰写文稿，以 LaTeX 排版 | 始终](https://liam.page/2020/03/30/writing-manuscript-in-Markdown-and-typesetting-with-LaTeX/)

[使用LaTeX排版Markdown文件 | BNU-FZH](https://fongzhenhua.github.io/2025/01/06/%E4%BD%BF%E7%94%A8LaTeX%E6%8E%92%E7%89%88Markdown%E6%96%87%E4%BB%B6/)

一种很大胆的做法，正文内容用 markdown 语法写，外层再包装上 LaTeX 宏来排版。

## Common Pitfalls

### Undefined control sequence

[latex报错：Undefined control sequence.解决办法-CSDN博客](https://blog.csdn.net/qlkaicx/article/details/136402882)

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

## Verification Checklist

* [ ] **MiKTeX 已安装，texify 可用**

    ```powershell
    texify
    # 应显示 "Missing file argument." 而非 "command not found"
    ```

* [ ] **Strawberry Perl 已安装**

    ```powershell
    perl --help
    ```

* [ ] **latexmk 可运行**

    ```powershell
    latexmk --version
    ```

* [ ] **VSCode LaTeX Workshop 可编译出 PDF**

    打开任意 `.tex` 文件，运行 LaTeX Workshop 编译，确认 `pdf` 正常生成。
