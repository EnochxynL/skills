# 运行环境、编译环境：JDK

从Oracle直接下载msi安装包，安装包会自动配置环境变量

# 库管理器：Maven

[全站最全Maven下载安装配置教学（2024更新...全版本）建议收藏...赠送IDEA配置Maven教程-CSDN博客](https://blog.csdn.net/MSDCP/article/details/127680844)

[Maven 环境配置 | 菜鸟教程](https://www.runoob.com/maven/maven-setup.html)

`scoop install maven`

Maven Deamon：类比mamba和conda的关系，Maven Deamon是Maven的加速版

`scoop install mvndaemon`

[一小时实践入门 Maven Wrapper - 知乎](https://zhuanlan.zhihu.com/p/645287788)

[修改 Maven Wrapper 的默认下载位置 - 知乎](https://zhuanlan.zhihu.com/p/427984150)

Maven Wrapper：相当于Maven的虚拟环境

## 清理软件包

[Find Unused Maven Dependencies | Baeldung](https://www.baeldung.com/maven-unused-dependencies)

# VSCode插件

[Maven 构建 Java 项目 | 菜鸟教程](https://www.runoob.com/maven/maven-creating-project.html)

## Oracle插件

优点：自带Maven

缺点：目前不知道如何让Oracle插件支持Maven Archetype

## Microsoft插件

[Maven project creation fails on Windows - cmd.exe ignores PowerShell settings · Issue #1454 · microsoft/vscode-java-pack](https://github.com/microsoft/vscode-java-pack/issues/1454)

[Create Maven Project:Unexpected token 'org.apache.maven.plugins:maven-archetype-plugin:3.1.2:generate' in expression or statement. · Issue #492 · microsoft/vscode-maven](https://github.com/microsoft/vscode-maven/issues/492#issuecomment-626498006)

[Create Maven Project:Unexpected token 'org.apache.maven.plugins:maven-archetype-plugin:3.1.2:generate' in expression or statement. · Issue #492 · microsoft/vscode-maven](https://github.com/microsoft/vscode-maven/issues/492)

[Creating Java Project with Maven Quickstart Archetype: The filename, directory name, or volume label syntax is incorrect. · Issue #623 · microsoft/vscode-maven](https://github.com/microsoft/vscode-maven/issues/623)

优点：Microsoft插件可以支持Maven Archetype，

缺点：需要自备Maven。Bug，构建指令放在cmd执行，但是cmd无法执行，本应在powershell执行。一种方法是构建项目后查看报错窗口，手动复制cmd的命令到powershell去执行