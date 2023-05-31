import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import F2Canvas from "taro-f2-react";
import { Chart, Interval } from "@antv/f2";
import "./index.scss";

const data = [
  { genre: "Sports", sold: 275 },
  { genre: "Strategy", sold: 115 },
  { genre: "Action", sold: 120 },
  { genre: "Shooter", sold: 350 },
  { genre: "Other", sold: 150 },
];

const data2 = [
  {
    name: "长津湖",
    percent: 0.4,
    a: "1",
  },
  {
    name: "我和我的父辈",
    percent: 0.2,
    a: "1",
  },
  {
    name: "失控玩家",
    percent: 0.18,
    a: "1",
  },
  {
    name: "宝可梦",
    percent: 0.15,
    a: "1",
  },
  {
    name: "峰爆",
    percent: 0.05,
    a: "1",
  },
  {
    name: "其他",
    percent: 0.02,
    a: "1",
  },
];

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View className="index">
      <View style={{ width: "100%", height: "260px" }}>
        <F2Canvas id="f2Canvas1">
          <Chart data={data}>
            <Interval x="genre" y="sold" />
          </Chart>
        </F2Canvas>
      </View>

      <View style={{ width: "100%", height: "260px" }}>
        <F2Canvas id="f2Canvas2">
          <Chart
            data={data2}
            coord={{
              type: "polar",
              transposed: true,
            }}
          >
            <Interval x="a" y="percent" adjust="stack" color="name" />
          </Chart>
          <Chart
            data={data}
            coord={{
              type: "polar",
            }}
          >
            <Interval x="name" y="percent" color="name" />
          </Chart>
        </F2Canvas>
      </View>
    </View>
  );
}
