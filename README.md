# apifox-import-cli

## 简介
使用本工具可以使用脚本命令将swagger导入上传到apifox中

## 安装
#### 全局安装 直接使用 apifox-import 命令
#### 项目安装 需要在命令前加上 npx 示例 npx apifox-import-cli
``` base
npm install -g apifox-import-cli
```

## 使用
### 获取token与项目id

![apiToken](.\doc\17011415754335.png)

![项目id](.\doc\17011415361904.png)

### 在需要上传的文件夹下创建一个 apifox_import.yml配置文件 然后执行命令
``` base
apifox-import
```
### 也可以指定配置文件
``` base
apifox-import ./apifox_import.yml
```

### 配置文件
``` yaml
token: "11" # apifox token
projectID: "11" # 项目的id
urls: #数组
- url: ""
  dir: ""
- url: ""
  dir: ""

```
