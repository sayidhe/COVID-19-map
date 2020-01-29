
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

## 参考

- [Let’s Make a Map](https://bost.ocks.org/mike/map/)
- [用 d3.js 生成可以互动的中国地图](https://yukun.im/javascript/533)