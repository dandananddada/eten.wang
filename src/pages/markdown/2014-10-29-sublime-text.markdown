---
path       : "/sublime-text"
date       : 2014-10-29
title      : "Sublime Text"
summary    : Sublime Text is a cross-platform text and source code editor with a Python application programming interface.
---
Sublime Text是一款相对好用的前端开发工具，并且可以无限期的免费试用。
可以在官网下载安装特定系统下的版本：http://www.sublimetext.com/
sublime本身的功能并不是十分强大，但他可以通过package control安装插件来增强功能。

【1】Sublime Text常用快捷键

常用的快捷键有文本格式化，文件切换，文件/函数查找，多行编辑，上下行互换，复制/粘贴，删除当前行，查找，单/多行注释，代码折叠，跳转到开始结束标记。
个人根据编程习惯进行一定的设置。
在Preferences->Key Bindings-User中添加如下语句，进行快捷键自定义。

1.格式化快捷键：

```javascript
{ "keys": ["ctrl+shift+f"], "command": "reindent" }
```

2.删除当前行：

```javascript
{ "keys": ["ctrl+k"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Delete Line.sublime-macro"} }
```

3.文件切换：
 

```javascript
{ "keys": ["ctrl+shift+right"], "command": "next_view" }
{ "keys": ["ctrl+shift+left"], "command": "prev_view" }
```

4.查找替换：
 

```javascript
{ "keys": ["ctrl+f"], "command": "show_panel", "args": {"panel": "replace", "reverse": false} }
```

5.多行编辑：
   

```javascript
{ "keys": ["alt+up"], "command": "select_lines", "args": {"forward": false} }
{ "keys": ["alt+down"], "command": "select_lines", "args": {"forward": true} }
```

6.上下行互换：
   

```javascript
{ "keys": ["alt+up"], "command": "swap_line_up" }
{ "keys": ["alt+down"], "command": "swap_line_down" 
```

7.折叠代码： 
 

```javascript
{ "keys": ["alt+left"], "command": "fold" },
{ "keys": ["alt+right"], "command": "unfold" },
```

8.跳转到开始/结束标记：
  

```javascript
{ "keys": ["ctrl+m"], "command": "move_to", "args": {"to": "brackets"} },
```

9.单/多行注释
  

```javascript
{ "keys": ["ctrl+forward_slash"], "command": "toggle_comment", "args": { "block": false } },
{ "keys": ["ctrl+shift+forward_slash"], "command": "toggle_comment", "args": { "block": true } },
```

10.文件查找

函数查找在输入函数名前加'@'，跳转指定行在行数前加'：'。

```javascript
{ "keys": ["super+p"], "command": "show_overlay", "args": {"overlay": "goto", "show_files": true} },
```



11.最后这里给出Mac下同样快捷键设置：

Mac环境下Key Bindings-User设置如下：

```javascript
[
    { "keys": ["super+d"], "command": "run_macro_file", "args": {"file": "res://Packages/Default/Delete Line.sublime-macro"} },
    { "keys": ["super+f"], "command": "show_panel", "args": {"panel": "replace", "reverse": false} },
    { "keys": ["super+m"], "command": "move_to", "args": {"to": "brackets"} },
    { "keys": ["super+forward_slash"], "command": "toggle_comment", "args": { "block": false } },
    { "keys": ["super+up"], "command": "swap_line_up" },
    { "keys": ["super+down"], "command": "swap_line_down" },
    { "keys": ["super+left"], "command": "move", "args": {"by": "subwords", "forward": false} },
    { "keys": ["super+right"], "command": "move", "args": {"by": "subword_ends", "forward": true} },
    { "keys": ["alt+up"], "command": "select_lines", "args": {"forward": false} },
    { "keys": ["alt+down"], "command": "select_lines", "args": {"forward": true} },
    { "keys": ["alt+left"], "command": "fold" },
    { "keys": ["alt+right"], "command": "unfold" },
    { "keys": ["super+shift+f"], "command": "reindent" },
    { "keys": ["super+shift+right"], "command": "next_view" },
    { "keys": ["super+shift+left"], "command": "prev_view" },
]
```

【2】Sublime Text常用插件

1.Package Control

快捷键`ctrl+~`调出Sublime Text控制台，然后输入以下代码（Sublime Text3）安装Package Control，之后就可以通过Package Control工具安装其他插件了。

```
import urllib.request,os,hashlib; h = '7183a2d3e96f11eeadd761d777e62404' + 'e330c659d4bb41d3bdf022e94cab3cd0'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

Sublime Text2请参照网站[https://sublime.wbond.net/installation]具体代码进行Package Control的安装。
使用Package Control安装其他插件，在Sublime Text命令窗口中输入install package，之后输入需要安装的插件名称回车确定就可以了。


2.Emmet

Emmet是一个快速输入工具，支持Css方式语法完成Html/Css的快速编辑，具体使用方法可以参考官网：[http://docs.emmet.io/]
     
3.BracketHighlighter

BracketHighlighter是一个开始/结束标记提示工具，他可以在行数栏前将一组开始结束标记标记显示出来。
     
4.SideBarEnhancements

SideBarEnhancements是侧栏增强工具，他允许用户在文件列表侧栏完成文件增加，移动删除等功能。
     
5.Terminal

Terminal是一个命令窗口工具，他允许用户在当前编辑文件的目录下调出Terminal。
默认快捷键为ctrl+shift+t

6.Git

Git允许用户在命令窗口下执行Git操作。
     
7.Theme-Flatland

Theme-Flatland是Sublime Text一个主题皮肤，Theme-Flatland安装完成后在Preference->Setting-User中，添加如下代码：

```javascript
{
    "color_scheme": "Packages/Theme - Flatland/Flatland Dark.tmTheme",
    "theme": "Flatland Dark.sublime-theme"
}
```

重启Sublime Text就会应用新的皮肤和代码配色。

8.AutoFileName

AutoFileName可以在用户在输入引用文件路径时给出提示，方便快速输入。

9.Color Highlighter

Color Highlighter可以使颜色码显示为当前颜色码真实眼色

10.Csscomb

Csscomb可以按照一定的格式格式化css代码，默认快捷键为ctrl+shift+c

11.DocBlockr

DocBlockr可以自动生成注释，在函数前输入/**后键入Tab会自动生成函数注释。

12.jQuery

jQuery可以提供jQuery代码提示，方便快速开发。在输入jQuery相关对象/方法后键入Tab就会自动生成相应函数。

13.Sass

Sass可以给Sass文件提供Css代码颜色。

14.Sass Snippets

Sass Snippets可以提供Sass常用语法，方便快速开发。

15.AngularJS

AngularJS可以提高AngularJS代码提示，方便快速开发。

16.其他一些插件如PhpCs,JsFormat,Alignment,Tag就不在此一一介绍，更多插件可以在[https://sublime.wbond.net/]查找安装



[https://sublime.wbond.net/installation]: https://sublime.wbond.net/installation
[http://docs.emmet.io/]: http://docs.emmet.io/
[https://sublime.wbond.net/]: https://sublime.wbond.net/








