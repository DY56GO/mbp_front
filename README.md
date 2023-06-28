# mbp_front
### 项目简介

mbp是一个管理系统的基础项目模板，其主要作用是提供管理系统的基础功能，使开发者不必再次开发重复的功能，可以更快的进入核心业务的开发。

![image](https://github.com/DY56GO/MarkdownImg/blob/master/MBP/MBP-1.png "BMP-1")



### 基础功能

首页：目前为空白页面，开发者可根据业务需求修改。

用户中心：提供用户修改自身信息的功能。

​	我的信息：修改用户自身基本信息。

​	修改密码：修改用户自身密码。

系统管理：管理员对系统的操作功能。

​	用户管理：管理系统的所有用户，其中包括：新增、修改、删除、启用用户，用户权限角色分配。

​	角色管理：管理系统的所有权限角色，其中包括：新增、修改、删除、启用角色，角色菜单、角色接口的权限分配（可选）。

​	菜单管理：管理系统的所有菜单，其中包括：新增、修改、删除、隐藏菜单。

​	接口管理（可选）：管理系统的所有接口，自动获取后台接口信息，可控制接口的开启（系统设置的白名单不受控制）。



### 技术栈

- [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)（后台前端解决方案）

  ​	axios 0.18.1

  ​	core-js 3.6.5

  ​	element-ui 2.13.2

  ​	js-cookie 2.2.0

  ​	normalize.css 7.0.0

  ​	nprogress 0.2.0

  ​	path-to-regexp 2.4.0

  ​	vue 2.6.10

  ​	vue-router 3.0.6

  ​	vuex 3.1.0



### 本地调试

1.下载源码到本地 。

2.安装依赖，在项目文件下执行安装命令。

3.修改与后台接口路径，打开文件 .env.development ，修改 VUE_APP_BASE_API 为本地后台地址（例：http://localhost:7529）。

4.运行启动命令。

​	相关命名：

```cmd
# 克隆项目
git clone 【未开源这里没有提供地址】 

# 进入项目目录
cd MBP_FRONT

# 安装依赖
npm install

# 本地调试
npm run dev
```



### 打包部署

待续
