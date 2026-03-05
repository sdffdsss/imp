import React, { useState, useEffect } from 'react';
import { Chart, Coord, Tooltip, Geom, Label, Interaction, getTheme } from 'bizcharts';
import DataSet from '@antv/data-set';
import constants from '@Src/common/constants';
import * as turf from '@turf/turf';

const keepMapRatio = (mapData, c) => {
    if (mapData && turf) {
        // 获取数据外接矩形，计算宽高比
        const bbox = turf.bbox(mapData);
        const width = bbox[2] - bbox[0];
        const height = bbox[3] - bbox[1];
        const ratio = height / width;

        const cWidth = c.width;
        const cHeight = c.height;
        const cRatio = cHeight / cWidth;

        let scale = {};

        if (cRatio >= ratio) {
            const halfDisRatio = (cRatio - ratio) / 2 / cRatio;
            scale = {
                x: {
                    range: [0, 1],
                },
                y: {
                    range: [halfDisRatio, 1 - halfDisRatio],
                },
            };
        } else {
            const halfDisRatio = ((1 / cRatio - 1 / ratio) / 2) * cRatio;
            scale = {
                y: {
                    range: [0, 1],
                },
                x: {
                    range: [halfDisRatio, 1 - halfDisRatio],
                },
            };
        }
        const curScaleXRange = c.getScaleByField('x').range;
        const curScaleYRange = c.getScaleByField('y').range;
        if (
            curScaleXRange[0] !== scale.x.range[0] ||
            curScaleXRange[1] !== scale.x.range[1] ||
            curScaleYRange[0] !== scale.y.range[0] ||
            curScaleYRange[1] !== scale.y.range[1]
        ) {
            setTimeout(() => {
                c.scale(scale);
                c.render(true);
            }, 1);
        }
    }
};

const Demo = (props) => {
    const { userInfo, provinceList, regionList, theme } = props;
    const [mapData, setMapData] = useState(undefined);
    let info = {};
    if (userInfo.userInfo) {
        info = JSON.parse(userInfo.userInfo);
    }
    const zones = info.zones[0];
    const zoneId = zones?.zoneLevel === '3' ? zones?.parentZoneId : zones?.zoneId;
    const nationSource = `${constants.STATIC_PATH}/map/source.json`;
    const provinceSource = `${constants.STATIC_PATH}/map/${zoneId}.json`;
    useEffect(() => {
        if (zones.zoneLevel === '1' || zones.zoneLevel === '5') {
            fetch(nationSource)
                .then((res) => res.json())
                .then((d) => {
                    const feas = d.features
                        .filter((feat) => feat.properties.name)
                        .map((v) => {
                            return {
                                ...v,
                                regionId: v.properties?.regionId || '',
                                properties: {
                                    ...v.properties,
                                    size: Math.floor(Math.random() * 300),
                                },
                            };
                        });
                    const res = { ...d, features: feas };
                    setMapData(res);
                });
        } else {
            fetch(provinceSource)
                .then((res) => res.json())
                .then((d) => {
                    const feas = d.features
                        .filter((feat) => feat.properties.name)
                        .map((v) => {
                            return {
                                ...v,
                                properties: {
                                    ...v.properties,
                                    size: Math.floor(Math.random() * 300),
                                },
                            };
                        });
                    const res = { ...d, features: feas };
                    setMapData(res);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let bgView;
    if (mapData) {
        // data set
        const ds = new DataSet();

        // draw the map
        const dv = ds
            .createView('back')
            .source(mapData, {
                type: 'GeoJSON',
                regionId: 'GeoJSON',
            })
            .transform({
                type: 'geo.projection',
                projection: 'geoMercator',
                as: ['x', 'y', 'centroidX', 'centroidY'],
            });

        bgView = new DataSet.View().source(dv.rows);
        // const sizes = bgView.rows.map(r => Number(r.properties.size));

        // const min = Math.min(...sizes);
        // const max = Math.max(...sizes);

        // interval = (max - min) / colors.length;
    }

    const scale = {
        x: { sync: true },
        y: { sync: true },
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {
                <Chart
                    // 清空默认的坐标轴legend组件
                    pure
                    forceFit={true}
                    height={280}
                    scale={scale}
                    // 不支持dataSet数据格式了
                    data={bgView ? bgView.rows : bgView}
                    autoFit
                    placeholder={<div>Loading</div>}
                    padding="auto"
                    // onAfterRender={(e, c) => {
                    //   keepMapRatio(mapData, c, "rerender");
                    // }}
                >
                    <Coord reflect="y" />
                    <Geom
                        type="polygon"
                        position="x*y"
                        style={{
                            stroke: theme === 'light' ? '#FFF' : 'rgb(37,103,153)',
                            lineWidth: 1,
                        }}
                        label={[
                            'name',
                            {
                                style: { fill: theme === 'light' ? '#3E5A7A' : '#fff', fontWeight: '500' },
                                layout: {
                                    type: 'overlap',
                                },
                            }, // GeometryLabelCfg
                        ]}
                        color={
                            zones.zoneLevel === '1' || zones.zoneLevel === '5'
                                ? [
                                      'regionId',
                                      (v) => {
                                          if (provinceList && Array.isArray(provinceList) && provinceList.includes(v))
                                              return theme === 'light' ? '#80BDF8' : '#13547F';
                                          return theme === 'light' ? '#CCE0FC' : '#103D66';
                                      },
                                  ]
                                : [
                                      'name',
                                      (v) => {
                                          if (regionList && Array.isArray(regionList) && regionList.includes(v))
                                              return theme === 'light' ? '#72B5F7' : '#13547F';
                                          return theme === 'light' ? '#C6DCFC' : '#103D66';
                                      },
                                  ]
                        }
                        state={{
                            selected: {
                                style: () => {
                                    const res = getTheme().geometries.polygon.polygon.selected.style;
                                    return null;
                                },
                            },
                        }}
                    >
                        {/* <Label
              content="name"
              textStyle={{
                textAlign: "center", // 文本对齐方向，可取值为： start middle end
                fill: "#000", // 文本的颜色
                fontSize: "12", // 文本大小
                fontWeight: "bold", // 文本粗细
                textBaseline: "top", // 文本基准线，可取 top middle bottom，默认为middle
              }}
              formatter={() => {}} // 回调函数，用于格式化坐标轴上显示的文本信息
              htmlTemplate={() => {}} // 使用 html 自定义 label
            /> */}
                    </Geom>
                    <Interaction type="element-single-selected" />
                </Chart>
            }
        </div>
    );
};
export default Demo;
