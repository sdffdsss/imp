import React, { PureComponent } from 'react';
import { Modal, Form, Input, Checkbox, Space, Tabs, message, Icon, Empty, Row, Col } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { withModel } from 'hox';
import request from '@Src/common/api';
import CustomModalFooter from '@Components/custom-modal-footer';
import RightFragment from './right-fragment';
import formatReg from '@Common/formatReg';
import usesEelectModel from './hox/hox.js';

import './index.less';

const eUnionSharedIdFieldName = 'is_share';
class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 'normal',
            visible: props.visible,
            name: '',
            key: String(props.index),
            isNegative: false,
            normalList: [],
            advancedList: [],
            // 当前选中的左侧条件
            currentSelectedCondition: null,
            // 当前右侧显示的条件值列表 以所属的左侧条件id为key,value为{valueString:,valueStringList: ,}
            rightValues: [],
        };
        this.getConditionList = _.debounce(this.getConditionList, 500);
    }

    componentDidMount() {
        const { conditionInfo, FILTER_EMUN } = this.props;
        this.getConditionList();

        if (conditionInfo) {
            this.setState({
                name: conditionInfo.conditionLabel,
                isNegative: conditionInfo.reverse === FILTER_EMUN.REVERSE.TRUE,
                rightValues: conditionInfo.conditionExpr.conditionItemList,
            });
        }
    }

    remove(arr, fn) {
        let i = arr.length;
        while (i--) {
            if (fn(arr[i])) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }

    getConditionList = (searchKey) => {
        const { moduleId, topFieldNames } = this.props;
        const data = {
            modelId: 2,
            ruleTypeId: moduleId,
            clientRequestInfo: JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            }),
            topFieldNames,
        };
        if (searchKey) {
            data.conditionName = searchKey;
        }
        request('alarmmodel/filter/v1/filter/conditions', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data,
        }).then((res) => {
            if (res && Array.isArray(res.data) && res.data.length > 0) {
                const normalList = res.data.filter((item) => Number(item.valueSize) > 0);
                const advancedList = res.data.filter((item) => Number(item.valueSize) === 0);
                let advancedLists = advancedList;
                // if (moduleId === 63) {
                //     advancedLists = this.remove(
                //         advancedList,
                //         (itm) => itm.dataType === 'time' || itm.dataType === 'integer' || itm.dataType === 'date',
                //     );
                // }
                // 默认选中普通条件的第一个
                this.setState(
                    {
                        normalList,
                        advancedList: advancedLists,
                    },
                    () => {
                        const { hasDefaultValue } = this.props;
                        if (hasDefaultValue) {
                            this.handleDefaultData();
                        }
                    },
                );
            } else {
                this.setState({
                    normalList: [],
                    advancedList: [],
                });
            }
        });
    };

    process(arr) {
        // 缓存用于记录
        const cache = [];
        for (const t of Object.keys(arr)) {
            // 检查缓存中是否已经存在
            if (cache.find((c) => c.fieldName === t.fieldName)) {
                // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
                cache.push(t);
            }
            // 不存在就说明以前没遇到过，把它记录下来
            else {
                continue;
            }
        }

        // 记录结果就是过滤后的结果
        return cache;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.visible !== this.props.visible) {
            this.setState({ visible: this.props.visible });
        }
    }

    onNameChange = (e) => {
        this.setState({ name: e.target.value });
    };

    onNegativeChange = (e) => {
        this.setState({ isNegative: e.target.checked });
    };

    handleCancle = () => {
        this.setState({ visible: false });
        this.props.onVisibleChange(false);
    };

    // 编辑条件确认
    handleOk = () => {
        const { onConfirm, conditionData, moduleId, FILTER_EMUN } = this.props;
        const { rightValues, name, isNegative } = this.state;
        // console.log(moduleId, '校验位置');

        let isOk = true;
        // 标题校验
        if (!name) {
            message.warning('标题不能为空，请重新修改再提交');
            isOk = false;
            return;
        }
        const noEmpety = formatReg.noEmpety.test(name);
        if (!noEmpety) {
            message.warning('标题不能包含空格，请重新修改再提交');
            isOk = false;
            return;
        }
        // eslint-disable-next-line no-control-regex
        const regNameLength = name.replace(/[^\x00-\xff]/g, 'aa').length;
        if (regNameLength > 64) {
            message.warning('标题总长度不能超过64位（1汉字=2位），请重新修改再提交');
            isOk = false;
            return;
        }
        if (
            // 标题判重
            conditionData
                .filter((s, index) => index !== Number(this.state.key))
                .map((s) => _.trim(s.conditionLabel))
                .indexOf(name) > -1
        ) {
            message.warning(`条件名称【${name}】已存在，请重新修改再提交`);
            isOk = false;
            return;
        }

        if (rightValues.length === 0) {
            message.warning('请选择条件组后再提交');
            isOk = false;
            return;
        }

        // if((moduleId === 4 || moduleId === 10 || moduleId === 14) && !(rightValues.find(item=>item.fieldName === "alarm_title") || rightValues.find(item=>item.fieldName === "title_text"))){
        //     return message.warn('请完善告警标题或告警标题ID')
        // }

        const roles = [
            {
                key: 'org_type',
                value: '告警类别',
            },
            {
                key: 'network_type_top',
                value: '一级网络类型',
            },
            {
                key: 'province_id',
                value: '省份名称',
            },
            {
                key: 'professional_type',
                value: '专业',
            },
        ];

        roles.forEach((item) => {
            // if (moduleId === 604 && item.key === 'province_id') {
            //     return;
            // }
            if (!rightValues.find((itm) => itm.fieldName === item.key)) {
                message.warning(`条件【${item.value}】必填`);
                isOk = false;
            }
        });

        if (moduleId === 604) {
            if (!rightValues.find((itm) => itm.fieldName === 'pivot_station_name')) {
                message.warning(`高铁线路名称必选`);
                isOk = false;
            }
        }

        rightValues.forEach((item) => {
            if (
                item.valueList.length === 0 &&
                item.compareType !== FILTER_EMUN.COMPARETYPE.ISNULL &&
                item.compareType !== FILTER_EMUN.COMPARETYPE.NOTNULL
            ) {
                message.warning(`条件【${item.fieldLabel}】的值为空，请填充后再提交`);
                isOk = false;
            }
        });

        if (isOk) {
            this.setState({ visible: false });
            this.props.onVisibleChange(false);
            onConfirm(name, isNegative, rightValues);
        }
    };

    onTabChange = (activeKey) => {
        this.setState({ activeKey, currentSelectedCondition: null });
    };

    // 左侧选中/不选中条件
    onLeftCheckedChange = (e) => {
        // debugger;
        const { rightValues, activeKey } = this.state;
        const { FILTER_EMUN, moduleId } = this.props;

        const rightCheckedResult = _.cloneDeep(rightValues);
        if (e.target.checked) {
            const valueList = [];
            const targetVal = e.target.value;
            this.props.selectInfo.setLeftCheckedData(targetVal);
            let compareType = 'eq';
            //专业网管ID特殊处理
            if (targetVal.fieldName === 'nms_alarm_id') {
                compareType = 'in';
            } else {
                /** 高级条件中，字符类型默认展示like组 */
                compareType =
                    // eslint-disable-next-line no-nested-ternary
                    Number(targetVal.valueSize) > 0
                        ? 'in'
                        : targetVal.enableSelectGroup === 1
                        ? 'groupSelect'
                        : targetVal.dataType === 'string' && moduleId === 63
                        ? 'in'
                        : targetVal.dataType === 'string'
                        ? 'like'
                        : targetVal.dataType === 'time'
                        ? 'between'
                        : targetVal.dataType === 'date'
                        ? 'between'
                        : 'eq';
            }

            rightCheckedResult.push({
                fieldLabel: targetVal.fieldLabel,
                fieldName: targetVal.fieldName,
                dataType: targetVal.dataType,
                itemDesc: `${targetVal.valueSize}`,
                reverse: FILTER_EMUN.REVERSE.FALSE,
                isEnum: activeKey === 'advanced' ? 2 : 1,
                compareType,
                valueList,
            });
            this.setState({
                rightValues: rightCheckedResult,
                currentSelectedCondition: targetVal,
            });
        } else {
            _.remove(rightCheckedResult, (item) => item.fieldName === e.target.value.fieldName);
            this.setState({
                rightValues: rightCheckedResult,
                currentSelectedCondition: null,
            });
        }
    };

    handleDefaultData = () => {
        const { activeKey, normalList, advancedList, rightValues } = this.state;
        const showConditionList = activeKey === 'normal' ? normalList : advancedList;
        const { FILTER_EMUN, data, login } = this.props;
        const cityObj = {};
        const info = JSON.parse(login);
        const isCity = info.zones[0]?.zoneLevel === '3';
        if (isCity) {
            cityObj.key = info.zones[0].zoneId;
            cityObj.value = info.zones[0].zoneName;
        }
        const rightCheckedResult = _.cloneDeep(rightValues);
        const handleData = (item, type) => {
            let list = {};
            switch (type) {
                case 'professional_type':
                    list = { key: data?.professionalId?.toString(), value: data?.professionalName };
                    break;
                case 'province_id':
                    list = { key: data?.provinceId, value: data?.provinceName };
                    break;
                case 'region_id':
                    list = cityObj;
                    break;
                default:
                    list = '';
                    break;
            }
            const compareType =
                // eslint-disable-next-line no-nested-ternary
                Number(item.valueSize) > 0
                    ? 'in'
                    : item.enableSelectGroup === 1
                    ? 'groupSelect'
                    : item.dataType === 'string'
                    ? 'like'
                    : item.dataType === 'time'
                    ? 'between'
                    : 'eq';
            // todo: 待确定是否注释
            // if (rightValues.length) return;
            const existField = rightCheckedResult?.find((r) => r.fieldName === item.fieldName);
            // 去重，避免重复添加
            if (existField) {
                return;
            }
            // 大区和集团用户选择省份特殊处理
            const flag = item.fieldName === 'province_id' && (info.zones[0]?.zoneLevel === '1' || info.zones[0]?.zoneLevel === '5');
            let defaultValArr = [];
            if (flag) {
                defaultValArr = [];
            } else if (list?.key) {
                defaultValArr = [list];
            }
            rightCheckedResult.push({
                fieldLabel: item.fieldLabel,
                fieldName: item.fieldName,
                dataType: item.dataType,
                itemDesc: item.valueSize,
                reverse: FILTER_EMUN.REVERSE.FALSE,
                compareType,
                valueList: defaultValArr,
            });
        };
        showConditionList.forEach((item) => {
            if (
                item.fieldName === 'professional_type' ||
                item.fieldName === 'province_id' ||
                item.fieldName === 'org_type' ||
                item.fieldName === 'network_type_top'
            ) {
                handleData(item, item.fieldName);
            }
            if (item.fieldName === 'region_id' && isCity) {
                handleData(item, item.fieldName);
            }
        });
        this.setState({
            rightValues: rightCheckedResult,
        });
    };

    // 左侧点击标题
    onLeftSelectedChange = (data) => {
        // debugger;
        this.setState({
            currentSelectedCondition: data,
        });
    };

    onSearchCond = (event) => {
        this.getConditionList(event.target.value);
    };

    onConditionDataChange = (conditionData) => {
        this.setState({ rightValues: conditionData });
    };

    // 是否是禁选字段
    isDisabledField(field) {
        const { disabledFields } = this.props;
        return disabledFields && Array.isArray(disabledFields) && disabledFields.includes(field);
    }

    render() {
        const { visible, activeKey, normalList, advancedList, currentSelectedCondition, rightValues, isNegative, name } = this.state;
        const { FILTER_EMUN, hasDefaultValue, login, moduleId, hideReverse } = this.props;
        let isCity = {};
        if (login) {
            const info = JSON.parse(login);
            isCity = info.zones[0]?.zoneLevel === '3';
        }

        const showConditionList = activeKey === 'normal' ? normalList : advancedList;
        return (
            <Modal
                zIndex={1001}
                visible={visible}
                title="条件编辑"
                centered
                className="condition-modal-wrapper"
                width={970}
                onCancel={this.handleCancle}
                maskClosable={false}
                // getContainer={this.props.container}
                footer={<CustomModalFooter onCancel={this.handleCancle} onOk={this.handleOk} />}
            >
                <Form>
                    <Form.Item label="条件名称">
                        <Space>
                            <Input onChange={this.onNameChange} value={name} style={{ width: 220 }} allowClear />
                            {!hideReverse && moduleId !== 63 && (
                                <Checkbox onChange={this.onNegativeChange} checked={isNegative}>
                                    取反
                                </Checkbox>
                            )}
                        </Space>
                    </Form.Item>
                </Form>
                <Tabs activeKey={activeKey} onChange={this.onTabChange}>
                    <Tabs.TabPane tab="普通" key="normal" />
                    <Tabs.TabPane tab="高级" key="advanced" />
                </Tabs>
                <Space className="condition-wrapper" size={16} />
                <Row gutter={16}>
                    <Col span={10}>
                        <div>
                            <Input suffix={<Icon antdIcon type="SearchOutlined" />} onChange={this.onSearchCond} allowClear />
                            <div className="condition-list" style={{ height: `${window.innerHeight - 350}px`, overflow: 'auto' }}>
                                {_.sortBy(showConditionList, (s) => _.findIndex(rightValues, { fieldName: s.fieldName }) === -1).map(
                                    (item, index) => {
                                        const checked = _.findIndex(rightValues, { fieldName: item.fieldName }) !== -1;

                                        const isChosen =
                                            hasDefaultValue &&
                                            (item.fieldName === 'professional_type' ||
                                                item.fieldName === 'province_id' ||
                                                item.fieldName === 'org_type' ||
                                                item.fieldName === 'network_type_top' ||
                                                (item.fieldName === 'region_id' && isCity));
                                        return (
                                            <div key={item.fieldName + index} className="condition-item">
                                                <Checkbox
                                                    checked={checked || isChosen}
                                                    value={item}
                                                    onChange={this.onLeftCheckedChange}
                                                    disabled={
                                                        item.fieldName === 'province_id' ||
                                                        (item.fieldName === eUnionSharedIdFieldName && (moduleId === 4 || moduleId === 14))
                                                            ? true
                                                            : this.isDisabledField(item.fieldName) || isChosen
                                                    }
                                                />
                                                <span
                                                    className={`name${checked ? ' active' : ''}`}
                                                    onClick={this.onLeftSelectedChange.bind(this, item)}
                                                >
                                                    {item.fieldLabel}
                                                </span>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col span={14}>
                        <div className="right-value-wrapper">
                            {currentSelectedCondition && (
                                <RightFragment
                                    currentSelectedCondition={currentSelectedCondition}
                                    onConditionDataChange={(conditionData) => this.onConditionDataChange(conditionData)}
                                    rightValues={rightValues}
                                    FILTER_EMUN={FILTER_EMUN}
                                    hasDefaultValue={hasDefaultValue}
                                    moduleId={moduleId}
                                />
                            )}
                            {Object.keys(rightValues).length === 0 && <span />}
                            {/* <Empty className="filter-empty" /> */}
                        </div>
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default withModel([usesEelectModel], (shareInfo) => ({
    selectInfo: shareInfo[0],
}))(Index);
