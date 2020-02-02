
## 依赖

- nodejs
- gdal
- topojson `npm install -g topojson`
- http-server

安装 `gdal`
```bash
$ brew install gdal
$ which ogr2ogr
# /usr/local/bin/ogr2ogr
```

安装 `topojson`
```bash
$ npm install -g topojson
$ which geo2topo
# **/node/**/bin/geo2topo
```

安装 `http-server`
```bash
$ npm init
$ npm install http-server
$ http-server . -p 8000
# server runs on http://127.0.0.1:8000
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

## 使用 `gulp` 来跑服务

安装 `node` 模块
```bash
$ npm i
```

运行 `gulp` 服务
```bash
$ gulp serve # 运行运行
$ gulp production # 部署的时候运行
```

## 参考

- [Let’s Make a Map](https://bost.ocks.org/mike/map/)
- [用 d3.js 生成可以互动的中国地图](https://yukun.im/javascript/533)
