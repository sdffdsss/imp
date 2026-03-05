import React, { useState, useEffect } from 'react';
import { Collapse, Descriptions } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import request from '@Src/common/api';

const Component = (props) => {
    const { showDetail } = props;
    const groupMap = [
        '位置信息',
        '设备属性',
        '定位对象',
        '告警分类',
        '告警属性',
        '告警处理',
        '告警派单',
        '告警操作',
        '基础字段',
        '网管信息',
        '集客信息',
        '其他信息'
    ];

    const [groupedFieldList, setGroupedFieldList] = useState([]);
    const [showAlarmDetail, setShowAlarmDetail] = useState([]);

    const getColumnsDict = () => {
        return request('v1/alarm/columns', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            showSuccessMessage: false,
            showErrorMessage: false
        })
            .then((res) => {
                if (res.data) {
                    return res.data;
                }
                return [];
            })
            .catch(() => {
                return [];
            });
    };

    const getFieldsList = async () => {
        const fields = await getColumnsDict();
        const groupedField = [];
        if (fields && fields.length) {
            const showField = fields.filter((s) => s.displayFlag);
            // 分组
            _.forEach(showField, (item) => {
                const groupId = item.fieldGroup;
                // 寻找相同组
                if (!groupedField[groupId]) {
                    // 未找到相同组，创建新组
                    groupedField[groupId] = [item];
                } else {
                    // 找到相同组,push进去，并排序
                    groupedField[groupId].push(item);
                    groupedField[groupId] = _.sortBy(groupedField[groupId], (s) => Number(s.displayOrder));
                }
            });
            setGroupedFieldList(groupedField);
        }
    };

    useEffect(() => {
        getFieldsList();
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setShowAlarmDetail(showDetail || []);
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showDetail]);

    const { Panel } = Collapse;

    return (
        <Collapse defaultActiveKey={['1']} accordion={true} className="site-collapse-custom-collapse">
            {groupedFieldList.map((groupItem, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Panel showArrow={false} header={groupMap[index]} key={`${index}`}>
                    <div
                        style={{
                            padding: 0,
                            overflowY: 'auto'
                        }}
                    >
                        <Descriptions bordered size="small" key={`${groupItem.fieldGroup}`}>
                            {groupItem.map((field) => {
                                const showField =
                                    _.find(showAlarmDetail, (item) => item.field === field.storeFieldName) || showAlarmDetail[field.storeFieldName];
                                return (
                                    <Descriptions.Item label={field.displayName} span={3} key={field.storeFieldName} labelStyle={{ width: '50%' }}>
                                        {showField && (showField.lable || showField?.value)}
                                    </Descriptions.Item>
                                );
                            })}
                        </Descriptions>
                    </div>
                </Panel>
            ))}
        </Collapse>
    );
};

export default Component;
