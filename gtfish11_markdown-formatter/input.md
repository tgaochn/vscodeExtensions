# 不变

`1啊a`
"1=+啊%a"
regex format sql: <https://github.com/clarkyu2016/sql-beautify/blob/main/node_modules/vkbeautify/index.js>
regex format sql:https://github.com/clarkyu2016/sql-beautify/blob/main/node_modules/vkbeautify/index.js

| header1 | header2 | header3 | header4 |
|---------|---------|---------|---------|
| 1       | 2       | 3       | 4       |

# math

123$1\times2$321
$1\times2$

# 常规

1,000 1.0 1,a           a,a

123[ (123) ]123
a(aa)a ,a

- `,1`不分开, 因为有    `1,000,000`1
`,1`不分开, 因为有    `1,000,000`1

T+he(qui+ck)   a-b  [br-own] fox=x "fox=x"

# 导入的测试用例

主菜单 -> 创意工坊
[Ash-12]: 12.7mm 
Cristine's Rifle
要求: 18 级, 感知 7+, 耐力 6+, 大兵
要求: 力量<9, 耐力 8+ 或敏捷 8+, 大型枪械 50+ 或大型枪械标记
实验室大衣 [科学]/工匠外套 [修理]/班尼的西装 [口才/交易]/中国侦查护甲 [潜行]
牢门里有一把特殊步枪"旺达的突击步枪", 弹容大有瞄具.
**Gun-Fu**, 枪械格斗
`Gun-Fu`, 枪械格斗
2024-05-15.00
2024-08-04 01:12:40
不同比 sampling 策略的 offline [公平比较](业务/model/模型修改/修改sampling与公平比较.md)
dislike. dislike models are deployed on US HP on IS ([traffic](https://butterfly.sandbox.indeed.net/#/proctor/jobsearch/idxbutterflydislikemodeltst)).

## test与模型修改

非 incremental training model 改 incremental training: [desc](业务/model/模型修改/incremental_training.md)
test img: ![](img.jpg)

## code

```js
function OnClick(clickData) {
   // 0.自改函数 - &close tag adv

   if (DOpus.listers.lastactive.tabs.count > 1) {
      clickData.func.command.RunCommand("Go TABCLOSE");
   } else {
      clickData.func.command.RunCommand("Go 此电脑");
   }
}
```