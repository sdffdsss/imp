import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Row, Col, Input, Select, Checkbox, Button, Icon, Popover, message } from 'oss-ui';
import ConditionEdit from '@Components/condition-edit';
import { _ } from 'oss-web-toolkits';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { FILTER_EMUN } from '@Src/pages/setting/filter/index';
import moment from 'moment';
import CustomModalFooter from '@Src/components/custom-modal-footer';
import formatReg from '@Common/formatReg';
import { getMteamEnum2Maintenance, getFilterInfo, getSyncJtType, getProfessionalEnum2Maintenance } from './api';
import { defineUserRole } from './utils';
import { moduleId, modelId } from './define';
import { OrderModelExplain } from './order-model-explain';

const defaultFliterInfo = {
    filterName: '',
    filterDesc: '',
    enable: FILTER_EMUN.ENABLE.TRUE,
    isPrivate: FILTER_EMUN.ISPRIVATE.TRUE,
    creator: '',
    filterExpr: { filterConditionList: [], logicalType: null },
    modelId: 2,
    moduleId,
};

const orderEnum = [
    { key: '1', value: '受理' },
    { key: '2', value: '抢单' },
];

const MaintainTeamEdit = (props) => {
    const { rowData: propsRowData, onSave, onCancel, login, hasSpecialAuth, hideReverse } = props;
    const {
        zoneLevelFlags,
        parsedUserInfo: { operationsButton },
    } = login;
    const [filterInfo, setFilterInfo] = useState(defaultFliterInfo);
    const [preFilterInfo, setPreFilterInfo] = useState(defaultFliterInfo);
    // const [orderEnum, setOrderEnum] = useState(orderList);
    const [mteamEnum, setMteamEnum] = useState([]);
    const [rowData, setRowData] = useState(propsRowData);
    const [professionalEnum, setProfessionalEnum] = useState([]);
    // 同步至集团选项
    const [syncData, handleSyncData] = useState([]);
    const formRef = useRef();
    const treeHeight = `${window.innerHeight - 425}px`;

    // const hasSpecialAuth = operationsButton.some((item) => item.key === 'maintainTeam:editAdmin');

    const getData = () => {
        const hasRelatedRule = Boolean(rowData.relatedRuleId);
        const promiseList = [
            getMteamEnum2Maintenance({ provinceId: rowData.provinceId, professionalId: 8 }, login),
            getProfessionalEnum2Maintenance(login),
        ];
        if (hasRelatedRule) {
            promiseList.push(
                getFilterInfo({
                    modelId,
                    moduleId,
                    filterId: rowData.relatedRuleId,
                }),
            );
        }
        Promise.all(promiseList).then((res) => {
            setMteamEnum(res[0]);
            setProfessionalEnum(res[1].data);
            if (hasRelatedRule) {
                const filterInfos = res[2] || defaultFliterInfo;
                setFilterInfo(filterInfos);
                setPreFilterInfo({ ...rowData, ...filterInfos });
            }
        });
    };

    const getSyncData = () => {
        getSyncJtType({ userId: login.userId }).then((res) => {
            if (res) {
                handleSyncData(res);
            }
        });
    };

    useEffect(() => {
        if (rowData) {
            getData();
            setFilterInfo(defaultFliterInfo);
            getSyncData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propsRowData]);

    const onChangeTreeData = (newTreeData, newLogicalType) => {
        setFilterInfo(
            (state) => ({
                ...state,
                filterExpr: { filterConditionList: newTreeData, logicalType: newLogicalType },
            }),
            () => formRef.current.setFieldsValue({ condition: newTreeData }),
        );
    };
    const changeProfessional = (val) => {
        if (val) {
            getMteamEnum2Maintenance({ provinceId: rowData.provinceId, professionalId: val.value }, login).then((res) => {
                setMteamEnum(res);
                formRef.current.setFieldsValue({ mteamDimensions: '' });
            });
            setRowData({
                ...rowData,
                professionalId: val.value,
                professionalName: val.label,
            });
            const newFilterInfo = _.cloneDeep(filterInfo);
            newFilterInfo.filterExpr.filterConditionList.forEach((item) => {
                // eslint-disable-next-line no-param-reassign
                item.conditionExpr.conditionItemList[0].valueList = [{ key: `${val.value}`, value: val.label }];
            });
            setFilterInfo(
                () => ({ ...newFilterInfo }),
                () => formRef.current.setFieldsValue({ condition: newFilterInfo.filterExpr.filterConditionList }),
            );
        }
    };

    const getDistributionModelName = (key) => {
        const model = orderEnum.find((item) => String(item.key) === String(key));
        return model?.value || '';
    };

    const getMteamModelName = (key) => {
        let name = '';
        if (String(key) === '1') {
            name = '值班';
        } else if (String(key) === '2') {
            name = '包机';
        }
        return name;
    };

    const getSyncDataName = (key) => {
        const data = syncData.find((item) => String(item.id) === String(key));
        return data?.txt || '空';
    };

    const getCompareTypeName = (type) => {
        let compareType = '';
        switch (type) {
            case 'eq':
                compareType = '等于';
                break;
            case 'ne':
                compareType = '不等于';
                break;
            case 'gt':
                compareType = '大于';
                break;
            case 'between':
                compareType = '';
                break;
            case 'ge':
                compareType = '大于等于';
                break;
            case 'le':
                compareType = '小于等于';
                break;
            case 'lt':
                compareType = '小于';
                break;
            case 'is_null':
                compareType = '空';
                break;
            case 'not_null':
                compareType = '非空';
                break;
            case 'like':
                compareType = '模糊匹配';
                break;
            case 'in':
                compareType = '精确匹配';
                break;
            case 'mix':
                compareType = '数组匹配';
                break;
            default:
                compareType = '';
                break;
        }
        return compareType;
    };

    const getLogContext = (newData, modelType) => {
        let logStr = '';
        const { filterConditionList } = newData.newFilterInfo?.filterExpr;
        const preFilterConditionList = preFilterInfo.filterExpr?.filterConditionList;
        let conditionStr = '';
        let totalChangeStr = '';
        switch (modelType) {
            case 'edit':
                logStr = `班组名称：${newData?.mteamName || ''}\n`;
                if ((newData?.professionalName || preFilterInfo?.professionalName) && newData?.professionalName !== preFilterInfo?.professionalName) {
                    logStr += `归属专业：${preFilterInfo?.professionalName || '空'}——${newData?.professionalName || '空'}\n`;
                }
                if ((newData?.dimensions || preFilterInfo?.dimensions) && String(newData?.dimensions) !== String(preFilterInfo?.dimensions)) {
                    logStr += `班组维度：${preFilterInfo?.dimensions || '空'}——${newData?.dimensions || '空'}\n`;
                }
                if (
                    (newData?.distributionModel || preFilterInfo?.distributionModel) &&
                    String(newData?.distributionModel) !== preFilterInfo?.distributionModel
                ) {
                    logStr += `派单模式：${getDistributionModelName(preFilterInfo?.distributionModel || '空')}——${
                        getDistributionModelName(newData?.distributionModel) || '空'
                    }\n`;
                }
                if (String(newData?.mteamModel) !== String(preFilterInfo?.mteamModel)) {
                    const newMteamModel = getMteamModelName(newData?.mteamModel);
                    const oldMteamModel = getMteamModelName(preFilterInfo?.mteamModel);
                    if ((newMteamModel || oldMteamModel) && newMteamModel !== oldMteamModel) {
                        logStr += `班组模式：${oldMteamModel || '空'}——${newMteamModel || '空'}\n`;
                    }
                }

                if ((newData?.isSynBloc || preFilterInfo?.isSynBloc) && String(newData?.isSynBloc) !== String(preFilterInfo?.isSynBloc)) {
                    const newSynBloc = String(newData?.isSynBloc) === '1' ? '同步' : '不同步';
                    const oldSynBloc = String(preFilterInfo?.isSynBloc) === '1' ? '同步' : '不同步';
                    if (newSynBloc !== oldSynBloc) {
                        logStr += `同步至集团：${oldSynBloc}——${newSynBloc}\n`;
                    }
                }
                if ((newData?.syncJtType || preFilterInfo?.syncJtType) && String(newData?.syncJtType) !== String(preFilterInfo?.syncJtType)) {
                    const syncJtTypeName1 = getSyncDataName(preFilterInfo?.syncJtType);
                    const syncJtTypeName2 = getSyncDataName(newData?.syncJtType);
                    if ((syncJtTypeName1 || syncJtTypeName2) && syncJtTypeName1 !== syncJtTypeName2) {
                        logStr += `同步集团班组名称：${syncJtTypeName1 || '空'}——${syncJtTypeName2 || '空'}\n`;
                    }
                }
                if ((newData?.jtGroupFlag || preFilterInfo?.jtGroupFlag) && String(newData?.jtGroupFlag) !== String(preFilterInfo?.jtGroupFlag)) {
                    logStr += `集团班组：${String(preFilterInfo?.jtGroupFlag) === '1' ? '是' : '否'}——${
                        String(newData?.jtGroupFlag) === '1' ? '是' : '否'
                    }\n`;
                }
                conditionStr = '条件编辑：\n';
                filterConditionList.forEach((item) => {
                    let baseChangeStr = '';
                    const preConditionExpr = preFilterConditionList?.find((e) => e.conditionId === item.conditionId)?.conditionExpr;
                    const newConditionItemList = [];
                    item.conditionExpr?.conditionItemList?.forEach((c) => {
                        const existConditionItem = newConditionItemList?.find((e) => e.fieldLabel === c.fieldLabel && e.fieldName === c.fieldName);
                        if (!existConditionItem) {
                            newConditionItemList.push({ ...c });
                        } else {
                            if (c.valueList && existConditionItem?.valueList) {
                                existConditionItem.valueList = existConditionItem.valueList?.map((v) => {
                                    return {
                                        compareType: existConditionItem.compareType,
                                        ...v,
                                    };
                                });
                                c.valueList.forEach((v) => {
                                    existConditionItem.valueList.push({
                                        compareType: c.compareType,
                                        ...v,
                                    });
                                });
                            }
                            existConditionItem.isSum = true;
                        }
                    });
                    const preConditionItemList = [];
                    preConditionExpr?.conditionItemList?.forEach((c) => {
                        const existConditionItem = preConditionItemList?.find((e) => e.fieldLabel === c.fieldLabel && e.fieldName === c.fieldName);
                        if (!existConditionItem) {
                            preConditionItemList.push({ ...c });
                        } else {
                            if (c.valueList && existConditionItem?.valueList) {
                                existConditionItem.valueList = existConditionItem.valueList?.map((v) => {
                                    return {
                                        compareType: existConditionItem.compareType,
                                        ...v,
                                    };
                                });
                                c.valueList.forEach((v) => {
                                    existConditionItem.valueList.push({
                                        compareType: c.compareType,
                                        ...v,
                                    });
                                });
                            }
                            existConditionItem.isSum = true;
                        }
                    });
                    newConditionItemList?.forEach((c) => {
                        const valueList = c.valueList?.filter((v) => v.value !== 'NULL');
                        const preConditionItem = preConditionItemList?.find((e) => e.fieldLabel === c.fieldLabel && e.fieldName === c.fieldName);
                        const preValueList = preConditionItem?.valueList?.filter((v) => v.value !== 'NULL') || [];
                        let newVal = '';
                        valueList.forEach((v) => {
                            if (String(v.value) !== 'NULL') {
                                newVal += `${v.value}、`;
                            }
                        });
                        newVal = newVal.slice(0, -1);

                        let oldVal = '';
                        preValueList.forEach((v) => {
                            if (String(v.value) !== 'NULL') {
                                oldVal += `${v.value}、`;
                            }
                        });
                        oldVal = oldVal.slice(0, -1);
                        if (c.isEnum === 2) {
                            let lastOldVal = '';
                            if (oldVal) {
                                lastOldVal = `(${oldVal})`;
                            }
                            let lastVal = '';
                            if (newVal) {
                                lastVal = `(${newVal})`;
                            }
                            if (c.isSum) {
                                let valStr = '';
                                valueList?.forEach((v) => {
                                    const compareTypeName = getCompareTypeName(v.compareType);
                                    valStr += `${compareTypeName} (${v.value}) 或 `;
                                });
                                valStr = valStr.slice(0, -3);
                                if (!preConditionItem) {
                                    baseChangeStr += `&nbsp;&nbsp;新增${c.fieldLabel}：${valStr};\n`;
                                } else {
                                    let oldValStr = '';
                                    preValueList?.forEach((v) => {
                                        const compareTypeNameOld = getCompareTypeName(v.compareType);
                                        oldValStr += `${compareTypeNameOld} (${v.value}) 或 `;
                                    });
                                    oldValStr = oldValStr.slice(0, -3);
                                    if (valStr !== oldValStr) {
                                        baseChangeStr += `&nbsp;&nbsp;编辑${c.fieldLabel}：${oldValStr}——${valStr};\n`;
                                    }
                                }
                            } else if (!preConditionItem) {
                                const compareTypeName = getCompareTypeName(c.compareType);
                                baseChangeStr += `&nbsp;&nbsp;新增${c.fieldLabel}：${compareTypeName} ${
                                    String(c.reverse) === '1' ? '取反' : ''
                                } ${lastVal};\n`;
                            } else if ((valueList?.length > 0 && preValueList?.length > 0) || preConditionItem.compareType !== c.compareType) {
                                const compareTypeName = getCompareTypeName(c.compareType);
                                const compareTypeNameOld = getCompareTypeName(preConditionItem.compareType);
                                if (
                                    compareTypeName !== compareTypeNameOld ||
                                    (oldVal !== newVal && newVal) ||
                                    String(c.reverse) !== String(preConditionItem.reverse)
                                ) {
                                    baseChangeStr += `&nbsp;&nbsp;编辑${c.fieldLabel}：${compareTypeNameOld} ${
                                        String(preConditionItem.reverse) === '1' ? '取反' : ''
                                    } ${lastOldVal}——${compareTypeName} ${String(c.reverse) === '1' ? '取反' : ''} ${lastVal};\n`;
                                }
                            }
                        } else {
                            let changeStr = '';
                            if (String(c.reverse) === '1') {
                                changeStr += ' 取反';
                            }
                            if (c.compareType === 'is_null') {
                                changeStr += ' 空';
                            }
                            if (c.compareType === 'not_null') {
                                changeStr += ' 非空';
                            }
                            if (preConditionItem) {
                                let oldChangeStr = '';
                                if (String(preConditionItem.reverse) === '1') {
                                    oldChangeStr += ' 取反';
                                }
                                if (preConditionItem.compareType === 'is_null') {
                                    oldChangeStr += ' 空';
                                }
                                if (preConditionItem.compareType === 'not_null') {
                                    oldChangeStr += ' 非空';
                                }
                                if (oldVal !== newVal || oldChangeStr !== changeStr) {
                                    baseChangeStr += `&nbsp;&nbsp;编辑${c.fieldLabel}：${oldVal}${oldChangeStr}——${newVal}${changeStr};\n`;
                                }
                            } else {
                                baseChangeStr += `&nbsp;&nbsp;新增${c.fieldLabel}：${newVal}${changeStr};\n`;
                            }
                        }
                    });
                    if (baseChangeStr) {
                        if (preFilterConditionList?.find((e) => String(e.conditionId) === String(item.conditionId))) {
                            totalChangeStr += `&nbsp;修改"${item.conditionLabel}"：\n${baseChangeStr}\n`;
                        } else {
                            totalChangeStr += `&nbsp;新增"${item.conditionLabel}"：\n${baseChangeStr}\n`;
                        }
                    }
                    preConditionExpr?.conditionItemList?.forEach((c) => {
                        const preConditionItem = item?.conditionExpr?.conditionItemList?.find(
                            (e) => e.fieldLabel === c.fieldLabel && e.fieldName === c.fieldName,
                        );
                        if (!preConditionItem) {
                            totalChangeStr += `&nbsp;&nbsp;删除${c.fieldLabel}\n`;
                        }
                    });
                });
                if (totalChangeStr) {
                    logStr += `${conditionStr}${totalChangeStr}`;
                }
                preFilterConditionList.forEach((item) => {
                    let baseChangeStr = '';
                    const preConditionItem = filterConditionList?.find((e) => e.conditionId === item.conditionId);
                    if (!preConditionItem) {
                        baseChangeStr += `&nbsp;删除"${item.conditionLabel}"\n`;
                    }
                    logStr += baseChangeStr;
                });
                break;
            case 'new':
                filterConditionList.forEach((item) => {
                    conditionStr += `&nbsp;新增"${item.conditionLabel}"：\n`;
                    const newConditionItemList = [];
                    item.conditionExpr?.conditionItemList?.forEach((c) => {
                        const existConditionItem = newConditionItemList?.find((e) => e.fieldLabel === c.fieldLabel && e.fieldName === c.fieldName);
                        if (!existConditionItem) {
                            newConditionItemList.push({ ...c });
                        } else {
                            if (c.valueList && existConditionItem?.valueList) {
                                existConditionItem.valueList = existConditionItem.valueList?.map((v) => {
                                    return {
                                        compareType: existConditionItem.compareType,
                                        ...v,
                                    };
                                });
                                c.valueList.forEach((v) => {
                                    existConditionItem.valueList.push({
                                        compareType: c.compareType,
                                        ...v,
                                    });
                                });
                            }
                            existConditionItem.isSum = true;
                        }
                    });
                    newConditionItemList?.forEach((c) => {
                        const valueList = c.valueList?.filter((v) => v.value !== 'NULL');
                        let newVal = '';
                        valueList.forEach((v) => {
                            if (String(v.value) !== 'NULL') {
                                newVal += `${v.value}、`;
                            }
                        });
                        newVal = newVal.slice(0, -1);
                        if (c.isEnum === 2) {
                            if (c.isSum) {
                                let valStr = '';
                                valueList?.forEach((v) => {
                                    const compareTypeName = getCompareTypeName(v.compareType);
                                    valStr += `${compareTypeName} (${v.value}) 或 `;
                                });
                                valStr = valStr.slice(0, -3);
                                conditionStr += `&nbsp;&nbsp;新增${c.fieldLabel}：${valStr};\n`;
                            } else {
                                let lastVal = '';
                                if (newVal) {
                                    lastVal = `(${newVal})`;
                                }
                                const compareTypeName = getCompareTypeName(c.compareType);
                                conditionStr += `&nbsp;&nbsp;新增${c.fieldLabel}：${compareTypeName} ${
                                    String(c.reverse) === '1' ? '取反' : ''
                                } ${lastVal};\n`;
                            }
                        } else {
                            let changeStr = '';
                            if (String(c.reverse) === '1') {
                                changeStr += ' 取反';
                            }
                            if (c.compareType === 'is_null') {
                                changeStr += ' 空';
                            }
                            if (c.compareType === 'not_null') {
                                changeStr += ' 非空';
                            }
                            conditionStr += `&nbsp;&nbsp;新增${c.fieldLabel}：${newVal}${changeStr};\n`;
                        }
                    });
                });
                logStr = `班组名称：${newData?.mteamName || ''}\n归属专业：${newData?.professionalName || ''}\n班组维度：${
                    newData?.dimensions || ''
                }\n派单模式：${getDistributionModelName(newData?.distributionModel)}\n班组模式：${getMteamModelName(
                    newData?.mteamModel,
                )}\n同步至集团：${String(newData?.isSynBloc) === '1' ? '同步' : '不同步'}\n同步集团班组名称：${getSyncDataName(
                    newData?.syncJtType,
                )}\n集团班组：${String(newData?.jtGroupFlag) === '1' ? '是' : '否'}\n条件编辑：\n${conditionStr}`;
                break;
            default:
                break;
        }
        return logStr;
    };

    const onSubmit = (params) => {
        const modelType = rowData.mteamId ? 'edit' : 'new';
        formRef.current.validateFields().then((values) => {
            if (values.distributionModel === '其他') {
                message.warn('请选择正确的派单模式');
                return;
            }
            const newFilterInfo = {
                ...filterInfo,
                provinceId: rowData.provinceId,
                creator: login.userId,
                filterName: filterInfo.filterName || `${values.mteamName}-${moment().format('YYYY-MM-DD HH:mm:ss')}`,
                filterProvince: rowData.provinceId,
                filterProfessional: rowData.professionalId,
            };
            const professional = professionalEnum.find((e) => e.id === (values.professionalId?.value || values.professionalId)) || {};
            if (values.professionalId === 8) {
                professional.id = 8;
                professional.name = '无线网';
            }
            const dataParam = {
                provinceId: rowData.provinceId,
                mteamId: rowData.mteamId ? rowData.mteamId : Date.now(),
                mteamName: values.mteamName,
                mteamModel: values.mteamModel,
                professionalId: values.professionalId?.value || professional.id,
                professionalName: professional?.txt || rowData?.professionalName,
                dimensions: values.mteamDimensions.label,
                alarmFiledsCond: values.mteamDimensions.value,
                relatedRuledId: '', // 未调用接口，没有生成，传空
                userId: login.userId,
                newFilterInfo,
                isSynBloc: values.isSynBloc ? 1 : 0,
                syncJtType: values.syncJtType,
                distributionModel: values.distributionModel.key || values.distributionModel,
                jtGroupFlag: values.jtGroupFlag ? '1' : '0',
            };
            const logStr = getLogContext(dataParam, modelType);
            onSave(dataParam, modelType, params, logStr);
        });
    };

    return (
        <Modal
            title={rowData.title || '新增'}
            visible
            width={800}
            onCancel={onCancel}
            destroyOnClose
            onOk={onSubmit}
            okButtonProps={{
                disabled:
                    rowData.IsSearch || (defineUserRole(props.login?.systemInfo?.currentZone?.zoneId, login.userInfo) === '集团' && !rowData.isAdd),
            }}
            cancelText="取消"
            okText="确认"
            footer={
                rowData.IsSearch ? (
                    <div style={{ textAlign: 'center' }}>
                        <Button onClick={onCancel}>取消</Button>
                    </div>
                ) : (
                    <CustomModalFooter
                        okButtonProps={{ hasSpecialAuth }}
                        authKey={rowData.mteamId ? 'maintainTeam:edit' : 'maintainTeam:add'}
                        onCancel={onCancel}
                        onOk={onSubmit}
                    />
                )
            }
        >
            {Boolean(rowData) && (
                <Form
                    labelAlign="right"
                    labelCol={{ span: 6 }}
                    initialValues={{
                        ...rowData,
                        condition: filterInfo,
                        isSynBloc:
                            defineUserRole(props.login?.systemInfo?.currentZone?.zoneId, login.userInfo) === '集团' || rowData.isSynBloc === '1',
                        syncJtType: Number(rowData.syncJtType) || '',
                        mteamModel: typeof rowData?.mteamModel === 'number' ? rowData?.mteamModel?.toString() : rowData?.mteamModel,
                        distributionModel: rowData?.distributionModel === '0' ? '其他' : rowData?.distributionModel,
                        jtGroupFlag: rowData.mteamId ? rowData.jtGroupFlag === '1' : zoneLevelFlags.isCountryZone,
                        professionalId: !rowData.mteamId ? 8 : rowData?.professionalId, // 新增默认无线网
                    }}
                    ref={formRef}
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="归属专业"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择归属专业',
                                    },
                                ]}
                                name="professionalId"
                            >
                                <Select disabled={Boolean(rowData.mteamId)} labelInValue onChange={(val) => changeProfessional(val)}>
                                    {professionalEnum.map((item) => (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.txt}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                label="班组维度"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择班组维度',
                                    },
                                ]}
                                name="mteamDimensions"
                            >
                                <Select disabled={Boolean(rowData.mteamId)} labelInValue>
                                    {mteamEnum.map((item) => (
                                        <Select.Option value={item.txt_en} key={item.txt_en}>
                                            {item.txt}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="班组名称"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入班组名称',
                                    },
                                    { pattern: formatReg.noSpecialSymbol, message: '班组名称不可存在特殊符号' },
                                ]}
                                name="mteamName"
                            >
                                <Input maxLength={20} disabled={Boolean(rowData.mteamId)} allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                label="派单模式"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择派单模式',
                                    },
                                ]}
                                name="distributionModel"
                            >
                                <Select
                                    disabled={Boolean(rowData.mteamId) && rowData.IsSearch}
                                    labelInValue
                                    showSearch
                                    allowClear
                                    optionFilterProp="children"
                                >
                                    {orderEnum.map((item) => (
                                        <Select.Option value={item.key} key={item.key}>
                                            {item.value}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col style={{ 'padding-left': 2 }}>
                            <Popover content={<OrderModelExplain />}>
                                <Icon antdIcon type="QuestionCircleOutlined" />
                            </Popover>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label="班组模式"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择班组模式',
                                    },
                                ]}
                                name="mteamModel"
                            >
                                <Select disabled={rowData.IsSearch || Boolean(rowData.mteamId)}>
                                    <Select.Option value="1">值班</Select.Option>
                                    <Select.Option value="2">包机</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Row>
                                <Col span={8}>
                                    <Form.Item style={{ marginLeft: '20px' }} name="isSynBloc" valuePropName="checked">
                                        <Checkbox
                                            disabled={
                                                defineUserRole(props.login?.systemInfo?.currentZone?.zoneId, login.userInfo) === '集团' ||
                                                rowData.IsSearch
                                            }
                                        >
                                            同步至集团
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col span={16}>
                                    <Form.Item shouldUpdate noStyle>
                                        {({ getFieldValue }) =>
                                            getFieldValue('isSynBloc') && (
                                                <Form.Item name="syncJtType" shouldUpdate>
                                                    <Select
                                                        disabled={!getFieldValue('isSynBloc') || rowData.IsSearch}
                                                        placeholder="请选择同步至集团级别"
                                                    >
                                                        {syncData.map((item) => (
                                                            <Select.Option value={item.id} key={item.id}>
                                                                {item.txt}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            )
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Form.Item style={{ marginLeft: '6px' }} name="jtGroupFlag" valuePropName="checked">
                                <Checkbox disabled={rowData.IsSearch || String(rowData.provinceId) === '0' || (!!rowData.mteamId && !hasSpecialAuth)}>
                                    集团班组
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                label="条件编辑："
                                style={{ marginBottom: 0 }}
                                labelCol={{ span: 3 }}
                                rules={[
                                    {
                                        required: true,
                                        message: '请编辑条件',
                                    },
                                ]}
                                name="condition"
                            >
                                <ConditionEdit
                                    moduleId={moduleId}
                                    treeHeight={treeHeight}
                                    treeData={filterInfo.filterExpr.filterConditionList}
                                    FILTER_EMUN={FILTER_EMUN}
                                    onChange={onChangeTreeData}
                                    disabled={rowData.IsSearch}
                                    data={rowData}
                                    hasDefaultValue
                                    userInfo={login}
                                    hideReverse={hideReverse}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )}
        </Modal>
    );
};

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(MaintainTeamEdit);
