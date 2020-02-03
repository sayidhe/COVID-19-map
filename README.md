## 运行项目
```bash
$ npm i
$ npm run serve
```

## 依赖

- nodejs
- gdal (optional 处理 geo data 用)
- topojson `npm install -g topojson` (optional 处理 geo data 用)

安装 `gdal` (optional)
```bash
$ brew install gdal
$ which ogr2ogr
# /usr/local/bin/ogr2ogr
```

安装 `topojson`(optional)
```bash
$ npm install -g topojson
$ which geo2topo
# **/node/**/bin/geo2topo
```

## 生成数据模版

```bash
$ npm run g:template
```

## 生成数据

- 重命名 `data.csv.example` 为 `data.csv`
- 编辑 `data.csv` 为期望数据
- 用下面命令生成数据至 `assets/json/data.json`

```bash
# 生成数据(更新时间为当前机器时间)
$ npm run g:data

# 生成数据(更新时间为指定字符串)
$ npm run g:data 2020年2月2日21時57分
```

## 编辑内容数据

在 `assets/json/content.json` 文件中编辑即可

当前该文件包括以下配置数据：
- 今日要点

## 使用 `gulp` 来跑服务

运行 `gulp` 服务
```bash
$ gulp serve # 运行运行
$ gulp production # 部署的时候运行
```

## 部署

- [travis](https://travis-ci.org/)

所需脚本:

- `.travis.yml`         # travis 配置文件
- `scripts/build.sh`    # build 文件
- `scripts/deploy.sh`   # deploy 文件

注意 deploy 脚本中 `git push --force --quiet "https://${git_user}:${git_password}@${git_target}" master:gh-pages > /dev/null 2>&1` , 需在 ci 中配置

- `git_user`            # gitHub 用户名 （注意不是email账号）
- `git_password`        # gitHub 密码
- `git_target`          # 目标 repo URL (需删除 https:// )
- `master:gh-pages`     # 推送至 gh-pages 分支

部署到服务器，只需执行定时脚本 (`crontab -e`) 拉取 target repo 的对应分支即可。示例代码如下：

```bash
*/1 * * * * /bin/sh -c 'cd /var/www/map-output && git fetch --all && git reset --hard origin/gh-pages'
```

整体部署流程如下：

- gitHub 端： `map repo 放置原编码 -> CI 侦测某个 branch -> (有 push 动作) -> 编译该 branch -> 推送 dist 文件夹至新的 repo (map-output) `
- 服务器端： `git clone map-output repo -> 编写 crontab -> 1 分钟 git fetch 一次`


## 参考

- [Let’s Make a Map](https://bost.ocks.org/mike/map/)
- [用 d3.js 生成可以互动的中国地图](https://yukun.im/javascript/533)
