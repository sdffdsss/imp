## 散点图层 scatter 
> 注意如何拓展数据结构，而不是直接根据业务字段进行增减、改变数据结构

### 特殊配置
- 图层枚举 ChartEnums.mapLayerTypes.scatter
- 散点类型 scatterType
  - scatter
  - effectScatter
  - verticalScatter
  - horizonScatter 暂不支持

### 数据格式
```json
// 普通散点图
[
    { "name": "北京", "value": 1 },
    { "name": "四川", "value": 2 }
]
// verticalScatter的数据结构
[
    { "name": "北京", "value": [1, 2, 3] },
    { "name": "四川", "value": [4, 5, 6] }
]
```