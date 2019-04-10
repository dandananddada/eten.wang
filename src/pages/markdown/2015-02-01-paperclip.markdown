---
layout: post
category: rails-gems
date:   2015-02-01
path:  paperclip-with-rails
title: Paperclip with Rails
summary: Paperclip is intended as an easy file attachment library for Active Record.
---
rails本身文件/图片上传的函数是很方便快捷的，但是很多情况下我们可能需要对上传的图片进行必要的操作，比如对图像resize、限制格式、大小等。
这里介绍一个常用的第三方插件paperclip。

【1】install paperclip

在Gemfile中配置paperclip插件

	gem 'paperclip'

然后执行命令
`$ bundle install`
这样paperclip就安装成功了。

【2】Add column to your table

paperclip会在你需要图片支持的模块所对应的数据库表中添加四个字段，这个时候你需要在命令行中执行命令创建这个migration。
假设我们在user表中添加一个avatar属性用来存用户图像，那么命令如下:
`$ rails g paperclip user avatar`
观察migration文件会有这么一段代码

```ruby
def self.up
  change_table :users do |t|
    t.attachment :avatar
  end
end
```
命令行migrate数据库
`$rake db:migrate`
paperclip会在users表中添加如下四个字段：
		
	avatar_file_name（图片名称）、avatar_content_type（图片类型）、avatar_file_size（图片大小）、avatar_updated_at（图片更新日期）

在app/models/user.rb下添加属性

```ruby
class User < ActiveRecord::Base
	has_attached_file :avatar, 
			styles: { small: "150x150>"},
			url: "/uploads/articles/:id/:style/:basename.:extension",
			path: ":rails_root/public/uploads/articles/:id/:style/:basename.:extension"
	validates_attachment :avatar, content_type: { content_type: ["image/jpg", "image/jpeg", "image/png", "image/gif"] }
end
```
其中has_attached_file用来配置图片缩放尺寸、逻辑存储路径、物理存储路径。validates_attachment用来配置上传图片的类型、大小等，更多配置可以参考github

	https://github.com/thoughtbot/paperclip
	
【3】final work

剩下的就是在views和controller中做一些必要的代码处理了。
在app/views/users/_form.html.erb中做如下修改。
因为涉及文件上传，所以要修改表单属性，设置`enctype="multipart/form-data"。`
{% highlight ruby %}
<%= form_for(@user, html: { multipart: true }) do |f| %>
{% endhighlight %}
添加`<input type="file" />`节点。名称为User中的属性avatar。

```
<%= f.file_field :avatar %>
```
最后在app/controllers/users_controller.rb中设置通过avatar字段的验证

```
 params.require(:user).permit(:username, :age, :avatar)
```
这样paperclip就会自动维护数据中的四个字段，并且在配置的目录存储图片。
当你需要显示图片的时候在app/views/users/show.html.erb中添加如下代码：

```
<%= image_tag @user.photo.url(:small) %>
```
其中:small是你在models中配置的一种图片尺寸，你也可以配置多种，或者直接通过`image_tag @message.photo.url`显示原尺寸的图片。
最后这里说一点，paperclip本身图片的处理功能是借助ImageMagick实现的，所以你需要安装ImageMagick。
Mac下命令：`$ brew install ImageMagick`
Linux下命令：`$ apt-get install ImageMagick`
