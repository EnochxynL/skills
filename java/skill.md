# Java

## Overview

Maven：Java的包管理工具兼项目管理器，类似于vcpkg、uv、pnpm

Maven Deamon：类比mamba和conda的关系，Maven Deamon是Maven的加速版

## Common Install

### JDK 安装

从 Oracle 直接下载 msi 安装包，安装包会自动配置环境变量。具体来说是会在系统 `PATH` 添加 `C:\Program Files\Common Files\Oracle\Java\javapath`，它会自动路由到当前安装的某个版本 `java` 

### Maven 安装

[全站最全Maven下载安装配置教学（2024更新...全版本）建议收藏...赠送IDEA配置Maven教程-CSDN博客](https://blog.csdn.net/MSDCP/article/details/127680844)

[Maven 环境配置 | 菜鸟教程](https://www.runoob.com/maven/maven-setup.html)

[Maven on Windows – Maven](https://maven.apache.org/guides/getting-started/windows-prerequisites.html#:~:text=To%20do%20this%20conveniently%2C%20%24%20%7Bmaven.home%7D%5B%26bin%26%5D%20must%20be,control%20panel%3B%20the%20details%20vary%20by%20Windows%20version.)

[Installation – Maven](https://maven.apache.org/install.html)

[[MNG-5607] Don't use M2_HOME in mvn shell/command scripts anymore - ASF Jira](https://issues.apache.org/jira/browse/MNG-5607)

[[MNG-5854] Maven Installation instructions not working on Mac - ASF Jira](https://issues.apache.org/jira/browse/MNG-5854)

[java - MAVEN_HOME, MVN_HOME or M2_HOME - Stack Overflow](https://stackoverflow.com/questions/26609922/maven-home-mvn-home-or-m2-home)

[maven - What is the difference between M2_HOME and MAVEN_HOME - Stack Overflow](https://stackoverflow.com/questions/17136324/what-is-the-difference-between-m2-home-and-maven-home)

Maven 没有安装包，只有直接解压的便携式可执行包。将下载好的解压到自己设置的目录中（路径中不要有中文等影响环境的字符）

官方文档推荐：对于 scoop 可以 `scoop install maven`。Maven Daemon 同理，`scoop install mvndaemon` 即可。实际上我安装的是 Maven Daemon。

包管理器会自动完成安装，并将Maven的`bin`目录添加到`PATH`，让系统能找到`mvn`命令。我的 scoop 添加了`C:\Users\enoch\scoop\apps\mvndaemon\current\bin`进入用户 `PATH`。

在 Maven 3.x 版本中，`MAVEN_HOME`或`M2_HOME`环境变量已不再是强制要求：

> As of maven 3.5.0 neither of these environment variables should be specified. Instead, the `path` should be updated to include the `mvn` executable.

### Gradle 安装

scoop 也可以 `scoop install gradle`，并且设置 `GRADLE_USER_HOME`，例如我的电脑上是 `C:\Users\enoch\scoop\apps\gradle\current\.gradle`。可执行文件和其他应用程序一样，统一在 `C:\Users\enoch\scoop\shims`。

## Optional Configure

### Maven Wrapper

[一小时实践入门 Maven Wrapper - 知乎](https://zhuanlan.zhihu.com/p/645287788)

[修改 Maven Wrapper 的默认下载位置 - 知乎](https://zhuanlan.zhihu.com/p/427984150)

Maven Wrapper 相当于 Maven 的虚拟环境。目前没咋使用所以先不写教程。

### Oracle Java VSCode 插件

优点：自带Maven

缺点：目前不知道如何让Oracle插件支持Maven Archetype

### Microsoft Java VSCode 插件

[Maven project creation fails on Windows - cmd.exe ignores PowerShell settings · Issue #1454 · microsoft/vscode-java-pack](https://github.com/microsoft/vscode-java-pack/issues/1454)

[Create Maven Project:Unexpected token 'org.apache.maven.plugins:maven-archetype-plugin:3.1.2:generate' in expression or statement. · Issue #492 · microsoft/vscode-maven](https://github.com/microsoft/vscode-maven/issues/492#issuecomment-626498006)

[Create Maven Project:Unexpected token 'org.apache.maven.plugins:maven-archetype-plugin:3.1.2:generate' in expression or statement. · Issue #492 · microsoft/vscode-maven](https://github.com/microsoft/vscode-maven/issues/492)

[Creating Java Project with Maven Quickstart Archetype: The filename, directory name, or volume label syntax is incorrect. · Issue #623 · microsoft/vscode-maven](https://github.com/microsoft/vscode-maven/issues/623)

优点：Microsoft插件可以支持Maven Archetype，

缺点：需要自备Maven。Bug，构建指令放在cmd执行，但是cmd无法执行，本应在powershell执行。一种方法是构建项目后查看报错窗口，手动复制cmd的命令到powershell去执行

## Global Manage

### Maven 清理软件包

[Find Unused Maven Dependencies | Baeldung](https://www.baeldung.com/maven-unused-dependencies)

## Project Manage

[Maven 构建 Java 项目 | 菜鸟教程](https://www.runoob.com/maven/maven-creating-project.html)

[Maven Getting Started Guide – Maven](https://maven.apache.org/guides/getting-started/)
