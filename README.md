# taro-f2-react

> 在 Taro React 中使用 @antv/f2 。

# Demo
<img src="https://github.com/domisolo/taro-f2-react/blob/main/docs/screenshot.png" alt="Demo" width="30%" />

# Install

```bash
#via pnpm
$ pnpm add taro-f2-react @antv/f2@4.0.51

# via npm
$ npm i taro-f2-react

# via yarn
$ yarn add taro-f2-react
```

# Usage

不需要额外配置 usingComponents 小程序原生组件，通过 import 引入 taro-f2-react 组件即可。
<br>详细使用文档参考 [@antv/f2](https://f2.antv.vision/zh/docs/tutorial/getting-started)
<br>接下来就可以愉快的在 Taro 中使用 F2 了

```javascript
import React from "react";
import { View } from "@tarojs/components";
import F2Canvas from "taro-f2-react";
import { Chart, Interval } from "@antv/f2";

const data = [
  { genre: "Sports", sold: 275 },
  { genre: "Strategy", sold: 115 },
  { genre: "Action", sold: 120 },
  { genre: "Shooter", sold: 350 },
  { genre: "Other", sold: 150 },
];

function Index() {
  return (
    <View style={{ width: "100%", height: "260px" }}>
      <F2Canvas>
        <Chart data={data}>
          <Interval x="genre" y="sold" />
        </Chart>
      </F2Canvas>
    </View>
  );
}
```

## 多图表

有时候需要在同一个页面展示多个图表，这个时候就可以通过指定 F2Canvas 不同的 id 来实现
| 属性 | 类型 | 默认值 | 是否必填 |
| ------- | ------- | ------- | ------- |
| id | string | f2Canvas | 否 |

```javascript
<F2Canvas id="myCanvas1">
  <Chart data={data}>
    <Interval x="genre" y="sold" />
  </Chart>
</F2Canvas>

...

<F2Canvas id="myCanvas2">
  <Chart data={data}>
    <Interval x="genre" y="sold" />
  </Chart>
</F2Canvas>
```

# 异常处理

## TypeError: Cannot destructure property 'node' of 'res[0]' as it is null.
Taro 在 >= 3.6.0 版本中 Dev 模式下新增了 split chunks，导致加载第三方 UI 组件时，无法正确的挂载组件，可以通过修改以下配置关闭此特性，问题即可解决。
```
{
  ...
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false,
    },
  },
  ...
}
```

# 关于 @antv/f2 5.x
* 由于开发者反馈 @antv/f2 5.x 版本的问题较多，最新版本修改为支持 4.x 版本
* 如果想体验 @antv/f2 5.x 版本，可以安装 taro-f2-react 1.2.0 版本

# Support

Taro >= 3.x
<br> @antv/f2@4.x

## LICENSE [MIT](LICENSE)

Copyright © 2022 Daniel Zhao.
