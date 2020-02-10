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

## 地图生成

**1. 下载地图**

[Nature earth](http://www.naturalearthdata.com/downloads/10m-cultural-vectors/) 下载 1:10m 的地图

- 国家：[Download countries](http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_countries.zip) (5.11 MB) version 3.1.0
- 省：[Download states and provinces](http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces.zip) (13.97 MB) version 3.0.0

下载后解压缩可以看到多种数据格式，我们需要 .shp 文件。

也就是这两个文件：
- ne_10m_admin_0_countries.shp【8.8M】
- ne_10m_admin_1_states_provinces.shp【21.6M】


**2. 转换坐标文件**

下载的文件包含全球所有国家和地区，我们现在只需要世界地图和中国的省份地图数据。

国家代号参考： [Countries or areas / geographical regions](https://unstats.un.org/unsd/methodology/m49/)

现在需要用到 `Geospatial Data Abstraction Library – GDAL` 的 `ogr2ogr` 工具把 `.shp` 文件转换为 `GeoJSON`。

```bash
$ brew install gdal
```

安装后运行：

`ne_10m_admin_0_countries.shp` 国家文件

```bash
# ogr2ogr -f GeoJSON -where "SU_A3 ＝ 'CHN' OR SU_A3='TWN'" countries.json ne_10m_admin_0_countries.shp
# ogr2ogr -f GeoJSON -where "SU_A3='TWN'" twn_geo.json ne_10m_admin_0_countries.shp
$ ogr2ogr -f GeoJSON countries_geo.json ne_10m_admin_0_countries.shp
```

香港和澳门
```bash
$ ogr2ogr -f GeoJSON -where "ADM0_A3 IN ('HKG','MAC')" zh-hkg-mac_geo.json ne_10m_admin_0_countries.shp
```

`ne_10m_admin_1_states_provinces.shp` 省文件

```bash
$ ogr2ogr -f GeoJSON -where "gu_a3 = 'CHN'" states_geo.json ne_10m_admin_1_states_provinces.shp
```

**3. 压缩坐标文件**

但是有个问题，经过上面转换后，文件尺寸有

- countries_geo.json [25MB]
- states_geo.json [2.6MB]
- zh-hkg-mac_geo.json

使用 [mapshaper.org](http://www.mapshaper.org/) 进行地图的精度调整，最终导出 `GeoJSON` 文件。

`countries.json`, `states.json`, `zh-hkg-mac.json`

使用 `topojson` 进一步去除不必要的信息

安装：
```bash
$ npm install -g topojson
```

处理：
```bash
$ geo2topo --id-property SU_A3 -p name=NAME -p name -o countries_topo.json countries.json
$ geo2topo --id-property SU_A3 -p name=NAME -p name -o zh-hkg-mac_topo.json zh-hkg-mac.json
$ geo2topo --id-property adm1_cod_1 -p name -o states_topo.json states.json
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

预览地址： https://github.sayidhe.com/map-output/

## 参考

- [Let’s Make a Map](https://bost.ocks.org/mike/map/)
- [用 d3.js 生成可以互动的中国地图](https://yukun.im/javascript/533)
- [Making a Map in D3.js v.5](http://datawanderings.com/2018/10/28/making-a-map-in-d3-js-v-5/)
- [D3js中文文档 D3中文](https://github.com/xswei/d3js_doc)
