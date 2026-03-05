import useLoginInfoModel from '@Src/hox';
import { ProTable } from 'oss-ui';
import { produce } from 'immer';
import React, { FC } from 'react';
import { actionsKey, alarmRowKey } from '../constants';
import { updateUserConfigColumnApi } from '../../../services/api';
import TableHeader from '../../components/table-header';
import './style.less';

interface Props {
    record: any;
    columns: Record<string, any>[];
    columnState: any;
    onSelectChange: (selectedRowKey: any[]) => void;
    changeColumns: (columns: Record<string, any>[]) => void;
    circuitConfigs: any[]; // 父表格列设置数据
    columnsConfigList: any[];
    showRowSelection: boolean;
}

const SubList: FC<Props> = (props) => {
    const { record, columnState, columns, circuitConfigs, columnsConfigList, onSelectChange, changeColumns, showRowSelection } = props;

    const rowSelection = {
        columnWidth: 75,
        selectedRowKeys: record.alarmInfo.filter((item) => item.checked).map((item) => item[alarmRowKey]),
        hideSelectAll: true,
        onChange: onSelectChange,
    };

    const handleResize =
        (index) =>
        (e, { size }) => {
            const nextColumns = produce(columns, (draft) => {
                // eslint-disable-next-line no-param-reassign
                draft[index].width = size.width;
            });

            const settingMap = new Map();
            nextColumns.forEach((item) => settingMap.set(item.dataIndex, item.width));
            const newAlarmConfigs = columnsConfigList.map((item: any) => {
                return {
                    ...item,
                    width: settingMap.get(item.code),
                };
            });

            // 更新父表格设置字段同子表格的设置字段（只改变显隐、宽度和是否定位在右侧）
            const newCircuitConfigs = circuitConfigs.map((item) => {
                if (item.code === actionsKey) {
                    const settingConfig = columnsConfigList.filter((item2) => item2.code === actionsKey)[0];
                    const { show, width, fixed } = settingConfig;
                    return {
                        ...item,
                        show,
                        width,
                        fixed,
                    };
                }
                return {
                    ...item,
                };
            });

            changeColumns(nextColumns);
            updateUserConfigColumnApi({ alarmConfigs: newAlarmConfigs, circuitConfigs: newCircuitConfigs, userId: useLoginInfoModel.data.userId });
        };

    const formatColumns = columns.map((item, index) => {
        return {
            ...item,
            onHeaderCell: (column) => ({
                width: column.width || 120,
                onResize: handleResize(index),
                isLastColumn: index === columns.length - 1,
            }),
        };
    });

    return (
        <div className="international-resource-monitor-alarm-list-sub-box">
            <ProTable
                tableClassName="sub-table"
                rowSelection={showRowSelection && rowSelection}
                columns={formatColumns}
                headerTitle={false}
                search={false}
                dataSource={record.alarmInfo}
                tableAlertRender={false}
                pagination={false}
                rowKey={alarmRowKey}
                columnsState={{
                    value: columnState,
                }}
                scroll={{ x: 1600 }}
                options={{
                    density: false,
                    fullScreen: false,
                    reload: false,
                    setting: true,
                }}
                components={TableHeader}
            />
        </div>
    );
};

export default SubList;
