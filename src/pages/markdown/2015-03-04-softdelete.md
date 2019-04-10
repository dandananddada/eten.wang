---
layout: post
category: rails-gems
date:   2015-03-04
path:  soft-delete-with-rails
title:  Soft delete with Rails
summary: A Rails plugin to add soft delete which can be used to hide records instead of deleting them, making them recoverable later.
---
有的时候我们在做项目的时候可能会需要软删除功能，也就是回收站机制，对于之前删除的数据可以统一在回收站进行处理恢复。Rails本身没有提供软删除的功能，所以我们需要依赖一个叫做paranoia的gems来实现该功能。

【1】install paranoia

在gemfile中配置paranoia插件

```ruby
#gemfile
gem "paranoia", "~> 2.0"
```

执行命令安装插件
`$ bundle install`

【2】run migration for your desired models

运行如下命令向需要添加软删除功能的数据表添加删除时间字段
`$ rails g migration AddDeleteAtToYourModel deleted_at:datetime:index`
Rails会生成如下migration文件

```ruby
class AddDeletedAtToYourModel < ActiveRecord::Migration
  def change
    add_column :your_table, :deleted_at, :datetime
    add_index :your_table, :deleted_at
  end
end
```
通过如下命令修改数据表
`$ rake db:migrate`

【3】usage

在你需要实现软删除功能的model中添加如下语句：

```ruby
class YourModel < ActiveRecord::Base
  #for usage of softdelete
  acts_as_paranoid
end
```
这样当你再调用rails原生的destroy方法时，并不会直接将该id的记录从数据库中删除，而是设置该记录的删除时间为当前操作，你可以通过指定的方法显示全部删除的数据并恢复，恢复数据时paranoia会讲要恢复记录的删除时间置为空。同样针对删除的数据执行彻底删除方法时paranoia才会将这条数据从数据库移除。
具体使用的函数如下：

```ruby
#all records will be get.
Model.with_deleted

#only deleted records will be get.
Model.only_deleted

#restore specificity record by id.
Model.restore(id)

#restore specificity records by id array.
Model.restore([id1, id2, ...., idN])

#destroy a record from database.
model = Model.find(id)
model.really_destroy!

```
