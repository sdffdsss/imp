import React, { useState, useEffect } from 'react';
import { List, Card } from 'oss-ui';

const AlarmLight = (props) => {
    const [lightList, setLights] = useState([]);
    const [column, setColumn] = useState(3);
    const [listItemHeight, setItemHeight] = useState(0);
    const [listItemColor, setListItemColor] = useState([]);

    useEffect(() => {
        const lights = getAlarmLightInfo();
        setLights(lights);
        props.onLightChange(lights[0]);
        let count = 0;
        const timer = setInterval(() => {
            const colors = lights.map((s) => {
                if (s.color.indexOf('-') === -1) {
                    return s.color;
                } 
                    if (count % 2 === 1) {
                        return s.color.split('-')[1];
                    } 
                        return 'green';
                    
                
            });
            count++;
            setListItemColor(colors);
        }, 500);
        return () => {
            clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const lightNum = lightList.length;
        const column = lightNum <= 10 ? 2 : 3;
        setColumn(column);
        const itemHeight = `${Math.floor((window.innerHeight - 164) / 5)  }px`;
        setItemHeight(itemHeight);
    }, [lightList]);

    const getAlarmLightInfo = () => {
        const colors = ['twikle-red', 'green', 'twikle-blue', 'blue', 'twikle-orange', 'yellow', 'twikle-yellow', 'orange', 'red'];
        const names = [
            '话务网管',
            '国际+国漫',
            '数据业务',
            '软交换',
            '信令监测',
            '拨测系统',
            '传输网',
            'DRA',
            'CMNET',
            '动环告警',
            'IT网管',
            'IP承载网',
            '集团客户',
            '部省（数据）',
            '物联网HSS',
        ];
        const filterIds = [-1905090473, -1039566307];
        const lights = [];
        for (let i = 0; i < 15; i++) {
            // 告警灯对象:id，名称
            const lightItem = {};
            lightItem.id = i + 1;
            lightItem.name = names[i];
            // 告警灯颜色（约定为具体颜色或者颜色标识，要区分闪烁与不闪烁）
            lightItem.color = colors[i % 9];
            // 关联的过滤器ID，用来调用流水窗
            lightItem.filterIds = filterIds[i % 2];
            lightItem.filterNames = '';
            // 使用的列模板id,没有预设的话使用0号列模板
            lightItem.colunmsModelId = '';
            // 告警灯是否启用
            lightItem.valid = true;
            // 告警灯描述
            lightItem.lightDecribe = '';
            // 创建人
            lightItem.ownerId = '';
            lightItem.userName = '';
            // 创建时间
            lightItem.createTime = '';
            // 告警灯类型标识,用于区分场景显示
            lightItem.lightType = '';
            lights.push(lightItem);
        }
        return lights;
    };

    return (
        <Card title="告警牌" size="small" style={{ height: '100%' }}>
            <List
                grid={{ gutter: column === 3 ? 16 : 48, column }}
                dataSource={lightList}
                renderItem={(item, index) => (
                    <List.Item style={{ marginBottom: 0, height: listItemHeight, display: 'flex' }}>
                        <Card
                            onClick={() => {
                                props.onLightChange(item);
                            }}
                            style={{ width: '100%', height: '100%', backgroundColor: 'none' }}
                            title={
                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '24px',
                                        margin: '0 auto',
                                        backgroundColor: listItemColor[index],
                                    }}
                                />
                            }
                            bordered={false}
                            headStyle={{
                                border: 'none',
                                textAlign: 'center',
                                alignSself: 'center',
                                padding: '0',
                                margin: '0 auto',
                            }}
                            bodyStyle={{ textAlign: 'center', padding: '0' }}
                        >
                            <div>{item.name}</div>
                            <div>{'0/1/1'}</div>
                        </Card>
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default AlarmLight;
