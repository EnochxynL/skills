

### 更好的文件管理器

|品名|链接|标签原理|产品定位|
|----|----|-------|-------|
|Dolphin|[Index of /ci-builds/system/dolphin/master/windows](https://cdn.kde.org/ci-builds/system/dolphin/master/windows/) [[dolphin] [Bug 417017] New: Unexpected result after we tag a file located in a NTFS partition: "assign tags" submenu of the context menu does not list the created tag and "Tags" section does not appear in places panel](https://mail.kde.org/pipermail/kfm-devel/2020-February/030446.html) [[dolphin] [Bug 497939] New: Dolphin does not display xattrs (extended file attributes) in a Windows environment.](https://mail.kde.org/pipermail/kfm-devel/2024-December/054129.html)|直接存储在文件自身的扩展属性(xattr)的`user.xdg.tags`内，并用baloo作为索引|全能|
|Files|[Files • Docs - Tag files and folders](https://files.community/docs/features/tags) [Files App - 一个漂亮的现代开源文件资源管理器[Windows] - 小众软件](https://www.appinn.com/files-app-for-windows/) [Tag still cause crash after the update, and the same thing happens in the preview version. · Issue #15426 · files-community/Files](https://github.com/files-community/Files/issues/15426)|全局保存在LocalState配置|全能|
|TagSpaces|[Organizing Files and Folders with Tags \| TagSpaces Docs](https://docs.tagspaces.org/tagging/#storing-tags-in-file-names)|以文件名或`.ts`文件夹内的`.json`局部保存|专门|
|TagStudio|[Tags - TagStudio](https://docs.tagstud.io/tags/) [TagStudioDev/TagStudio: A User-Focused Photo & File Management System](https://github.com/TagStudioDev/TagStudio)|以`.TagStudio`文件夹内的SQLite数据库局部保存|专门|
|TMSU|[文件标签神器: TMSU - brt2 - 博客园](https://www.cnblogs.com/brt2/p/13346234.html)|以`.tmsu/db`数据库局部保存|专门|
|TagLyst|[常见问题及回答](https://www.yuque.com/taglyst/tgln-docs/faq)|以文件名或「引用连接」保存标签|专门|
|TagLauncher|[[WIN] TagLauncher - 标签式文件管理工具 - 小羿](https://xiaoyi.vc/taglauncher.html)|小众软件，未知|专门|

```bash
winget install --accept-package-agreements --source msstore --name "WPS Office X64"
winget install --accept-package-agreements --source msstore --name "QQ桌面版"
winget install --accept-package-agreements --source msstore --name "腾讯会议"
winget install --accept-package-agreements --source msstore --name "金山文档"
winget install --accept-package-agreements --source msstore --name "腾讯文档"
winget install --accept-package-agreements --source msstore --name "网易云音乐"
winget install --accept-package-agreements --source msstore --name "夸克网盘"
winget install --accept-package-agreements --source msstore --name "夸克"
winget install --accept-package-agreements --source msstore --name "迅雷12"
winget install --accept-package-agreements --source msstore --name "百度翻译-轻快多语种"
winget install --source msstore --name "百度网盘"
winget install --source msstore --name "微信"
```