---
layout: post
category: rails-gems
date:   2015-02-10
path:  devise-with-rails
title: Devise with Rails
summary: Devise is a flexible authentication solution for Rails based on Warden.
---
一些简单的登陆注册功能可以通过普通的controller实现，相应的权限管理可以通过Session机制定义一个current_user并设置为helper来实现。当然为了更高效的开发，这里采用devise插件做权限管理。

【1】install devise

在Gemfile中配置devise插件

	gem 'devise'
然后执行命令
`$ bundle install`
这样devise就安装完成了，安装完成后需要通过如下命令进行初始化。
`$ rails g devise:install`
然后去各个环境的配置文件中配置邮件服务器，以下以development环境为例，在config/enviroments下的development.rb文件中添加如下语句：

```html
config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
```
【2】migrate table

devise安装完成后就可以自动user类了，当然这里你用来存储用户的实体也可以取其他名字，这里通常情况下就用user进行说明了。
 `$ rails g devise user`
这个是时候devise会自动创建一些文件，其中有一个migration文件，你可以根据实际情况选取你需要的自动进行migrate。
`$ rake db:migrate`
这样devise就会给你创建一个users表，同时你也可以使用插件提供的路由、控制器、试图使用常用的注册、登录、注销、密码找回等功能了。单多数情况我们都会在源有的基础上进行一些调整，这个时候就要用到devise的其他命令来完善路由配置、拓展方法、重写界面了。

【3】configuring controller

对于某些controller你可能需要定制化，这里举个简单的例子，比如你的登录页面不需要继承layout，这个时候你就要再controller中配置layout false，在所难免你需要修改users_controller。这个时候就可以通过devise的命令指定要拓展的controller在其基础上进行拓展。

`$ rails g devise:controllers users -c=sessions`

这里我们拓展了登录模块的controller其中登录模块在devise中命名为sessions，以上命令就是将users下的sessions类拷贝到项目的app/controllers目录下，你会发现在app/controllers目录下生成一个uses目录，其中有一个sessions_controller.rb文件，这个文件中的new方法就是登录方法。我希望这个模块下不必要继承layout就做如下修改。
```
class Users::SessionsController < Devise::SessionsController
  layout false
  #new action for login...
  #destroy action for logout...
end
```

【4】configuring views

同样我需要重写login和logout的页面，这样的话我需要devise把sessions下的new.html.erb和destroy.html.erb拷贝到我的app/views目录下，执行如下命令
`$ rails g devise:views -v sessions`
和controller类似，命令会将sessions模块的试图拷贝到app/views/devise目录下。
当然你也可以指定模块名称创建试图：
`$ rails g devise:views users  -v sessions`
这样sessions就会拷贝到app/views/users目录下，接下来你就可以重写需要定制的试图了。
 
【5】configuring routes

devise默认会在你的routes文件中生成如下路由

```ruby
devise_for :users
```

你可以通过`$ rake routes`查看其对应的路由都有哪些，这里以登录注销为例自动生成的路由为users/sgin_in和users/sgin_out。
如果你想重命名路由，同时你又修改了路由对应的action，这个时候你就需要配置routes下的devise_for路由了。

```
devise_for :users, controllers: { sessions: "users/sessions" }, path: "", path_names: { sign_in: 'login', sign_out: 'logout', registration: 'register' }
```

如上配置users路由sessions模块对应的controller是users/sessions_controller.rb文件，同时重命名登录路由sign_in为login，sign_out为logout，并且我这里path设置为空，也就是说最初的user/sign_in路由最终重命名为login。

【6】adjust your controller

这里针对一些路由需要权限配置，未登录用户是无法访问的，你可以在需要权限控制的controller中添加如下语句：

```ruby
before_action :authenticate_user!
```
这里我新建一个auth_controller用于做权限控制，所有需要登录权限的模块默认继承ApplicationController修改为AuthController，并将devise自动填充到ApplicationController中的代码集成到AuthController中，最后AuthController代码如下：

```ruby
class AuthController < ApplicationController
 	protect_from_forgery with: :exception
 	before_action :authenticate_user!
end
```

