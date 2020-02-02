## 运行项目
```bash
$ npm i
$ npm run serve
```

## 依赖

- nodejs
- gdal(optional)
- topojson `npm install -g topojson`(optional)

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

## 参考

- [Let’s Make a Map](https://bost.ocks.org/mike/map/)
- [用 d3.js 生成可以互动的中国地图](https://yukun.im/javascript/533)
