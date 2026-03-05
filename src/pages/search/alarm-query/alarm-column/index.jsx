import React, { useEffect, useState } from 'react';
import request from '@Common/api';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import { _ } from 'oss-web-toolkits';
import { Select, Divider, Button, Icon } from 'oss-ui';
// import constants from '@Common/services/constants';
import { setColumnsInfo, getAllAlarmColumns } from '../common/translate';
import './index.less';

const { Option } = Select;
const defaultOption = { columnsValue: null, templateId: -1, templateName: '默认模板' };
export { defaultOption };
let allAlarmColumns = [];
const AlarmColumnSelect = (props) => {
    // const handleChange = () => {};
    const [columnOption, setColumnOption] = useState([]);
    const [columnValue, setColumnValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const {
        login: { userName, userId, platFlag },
        alarmColumnChange,
        templateChange,
    } = props;

    const onChange = async (value) => {
        const params = {
            userId,
            config: {
                key: value,
            },
            type: 1,
        };
        if (value) {
            const res = await request('v1/alarmViewRecord/saveOrUpdateViewConfig', {
                type: 'post',
                baseUrlType: 'alarmModelUrl',
                data: params,
                // 是否需要显示失败消息提醒
                showErrorMessage: false,
                showSuccessMessage: false,
            });
            console.log(res);
        }
        // 保存选中的列模板

        const alarmColumn = columnOption.filter((column) => {
            return column.templateId === value;
        });
        if (alarmColumn.length === 0) {
            return;
        }
        const { columnsValue, templateId } = alarmColumn[0];
        if (columnsValue) {
            //  leftData,
            let columns = [];
            // 告警查询默认模板
            if (templateId === defaultOption.templateId && allAlarmColumns.length > 0) {
                columns = setColumnsInfo(columnsValue, allAlarmColumns, 'query');
            } else {
                columns = setColumnsInfo(columnsValue, allAlarmColumns);
            }
            if (alarmColumnChange) {
                alarmColumnChange(columns);
            }
            if (templateChange) {
                templateChange(templateId);
            }
            // 流水窗默认模板
            setColumnValue(templateId);
        }
    };
    const init = async () => {
        const params = {
            userId,
            type: 1,
        };
        const res = await request('v1/alarmViewRecord/getViewConfig', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: params,
            // 是否需要显示失败消息提醒
            showErrorMessage: false,
            showSuccessMessage: false,
        });
        if (res.data.key) {
            onChange(res.data.key);
            return;
        }
        onChange(columnValue);
    };
    useEffect(() => {
        if (columnOption.length > 0) {
            init();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.activeKey, props.getAlarmColumn, columnOption, platFlag]);
    const getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };
    const initFetchData = async () => {
        const { login } = props;
        let _columnOption = [];
        // let searchTemplateIsNull = true;
        try {
            const res = await request('v1/template/search-alarm-column', {
                type: 'get',
                baseUrlType: 'monitorSetUrl',
                data: { optionKey: `${userName}.QueryAlarmBandOption` },
                // 是否需要显示失败消息提醒
                showErrorMessage: false,
                showSuccessMessage: false,
            });
            if (res.data && _.get(res, 'data.optionValue')) {
                defaultOption.columnsValue = _.get(res, 'data.optionValue');
                _columnOption = [defaultOption];
                // searchTemplateIsNull = false;
            } else {
                console.log('没有取到告警查询模板');
                defaultOption.columnsValue = null;
            }
        } catch (error) {
            console.log('没有取到告警查询模板');
            defaultOption.columnsValue = null;
        }
        const showType = 1;
        try {
            const res1 = await request('v1/template/alarm-column', {
                type: 'get',
                baseUrlType: 'monitorSetUrl',
                // data: { optionKey: userName + '.QueryAlarmBandOption' },
                // 是否需要显示失败消息提醒
                showErrorMessage: false,
                showSuccessMessage: false,
                data: {
                    showType,
                    userId,
                    pageSize: 100000,
                    current: 1,
                    columnProvince: getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo),
                },
            });
            if (res1 && res1.code === 0 && res1.data && res1.data.constructor === Array) {
                _columnOption = [].concat(_columnOption, res1.data);
            } else {
                console.log('没有取到告警流水窗模板');
            }
            setColumnOption(_columnOption);
        } catch (error) {
            console.log('没有取到告警流水窗模板');
        }

        allAlarmColumns = await getAllAlarmColumns();
        let _columnOptionCurr = _columnOption[0];
        if (props.columnTemplateId != null) {
            _columnOptionCurr = _columnOption.find((col) => col.templateId === props.columnTemplateId) ?? _columnOptionCurr;
        }
        const { columnsValue, templateId } = _columnOptionCurr;
        if (columnsValue) {
            //  leftData,
            let columns = [];
            // 告警查询默认模板
            if (templateId === defaultOption.templateId && allAlarmColumns.length > 0) {
                columns = setColumnsInfo(columnsValue, allAlarmColumns, 'query');
            } else {
                columns = setColumnsInfo(columnsValue, allAlarmColumns);
            }
            alarmColumnChange && alarmColumnChange(columns);
            // 流水窗默认模板
            setColumnValue(templateId);
            if (templateChange) {
                templateChange(templateId);
            }
        }
    };
    useEffect(() => {
        if (loading) {
            initFetchData()
                .then(() => {
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    const loadHandle = () => {
        setLoading(true);
    };
    const { width = '100%' } = props;
    return (
        <section className="alarm-query-alarm-column" style={{ width }}>
            {props.label && <div style={{ width: 60 }}>{props.label}</div>}
            <Select
                getPopupContainer={props.getPopupContainer}
                size="small"
                value={columnValue}
                onChange={onChange}
                showSearch={true}
                optionFilterProp="children"
            >
                {columnOption.map((item, index) => {
                    const { templateId, templateName } = item;
                    return (
                        <Option key={index} value={templateId}>
                            {templateName}
                        </Option>
                    );
                })}
            </Select>
            {props.loading && [
                <Divider type="vertical" />,
                <Button title="刷新" loading={loading} icon={<Icon antdIcon={true} type={'RedoOutlined'} onClick={loadHandle} />} />,
            ]}
        </section>
    );
};
// export default AlarmColumnSelect;
export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(AlarmColumnSelect);
