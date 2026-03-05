import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import { Form, Input, Select, DatePicker, Radio, Row, Col, Icon, Tooltip, Button, message, Modal } from 'oss-ui';
import { formatSubmitData, formatEditData, filterUndefinedValues, smartMapFields } from './../utils';
import { _ } from 'oss-web-toolkits';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import type { IModalContentProps } from './types';
import { getRegionListApi, getSiteList, checkSheetNoApi } from '../api';
import ReviewTable from './review-table';
import SheetSelectModal from '../sheetNo-modal';
import './index.less';

const { Option } = Select;

export default forwardRef((props: IModalContentProps, ref) => {
    const { initialValues, provinceList, mode, enums, renderFooter } = props;

    const [provinceOptions, setProvinceOptions] = useState<any>([]);
    const [cityOptions, setCityOptions] = useState<any>([]);
    const isEdited = useRef(false);

    const { currentZone, userZoneInfo, userId } = useLoginInfoModel();

    const [noFaultDisabled, setNoFaultDisabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const originData = useRef<any>(null);
    const disabled = mode === 'view';
    // 数据源置灰
    const [dataSourceDisabled, setDataSourceDisabled] = useState(false);
    const [form] = Form.useForm();

    const formFields = [
        'haveMalfunction',
        'area',
        'country',
        'associatedSheetNo',
        'provinceId',
        'regionId',
        'networkLayer',
        'hasRestored',
        'eventTime',
        'clearTime',
        'faultDurationMinutes',
        'businessEffectedStartTime',
        'businessRecoveryTime',
        'businessEffectedDurationMinutes',
        'eventDate',
        'faultLevel',
        'isEffectBusiness',
        'rootCauseProfession',
        'havePublicSentiment',
        'causedByHidden',
        'faultCauseType1',
        'faultCauseType2',
        'effectProfession',
        'effectBusinessDetail',
        'faultPhenomenon',
        'faultReason',
        'note',
    ];
    const hiddenFields = ['creator', 'reportProvince', 'id', 'uniqueId', 'dataState', 'modifier'];
    const [siteOptions, setSiteOptions] = useState<any>([]);
    const [searchValue, setSearchValue] = useState('');
    const [sheetSelectVisible, setSheetSelectVisible] = useState(false);
    const [currentSheetNo, setCurrentSheetNo] = useState<string>(''); // 跟踪当前选择的工单编号
    const fomratSubmitValues = (values) => {
        // Ensure creator is always set
        const finalValues = {
            ...values,
            creator: values.creator || userId,
        };
        return {
            ...finalValues,
            area: finalValues.area === 'china' ? '中国' : finalValues.overseasArea,
            overseasArea: undefined,
            eventDate: values.eventDate?.format('YYYY-MM-DD'),
            eventTime:
                values?.haveMalfunction === 0 ? values.eventTime?.format('YYYY-MM-01 00:00:00') : values.eventTime?.format('YYYY-MM-DD HH:mm:ss'),
            clearTime: values.clearTime ? values.clearTime.format('YYYY-MM-DD HH:mm:ss') : null,
            businessEffectedStartTime: values.businessEffectedStartTime?.format('YYYY-MM-DD HH:mm:ss'),
            businessRecoveryTime: values.businessRecoveryTime ? values.businessRecoveryTime.format('YYYY-MM-DD HH:mm:ss') : null,
            provinceId: values.provinceId === '--' ? undefined : values.provinceId,
            regionId: values.regionId === '--' ? undefined : values.regionId,
            // 非集团 - 待确认 ，集团 -待审核
            dataState: values.dataState,
        };
    };
    const computeDuration = (startTime, endTime) => {
        const duration = moment(endTime).diff(moment(startTime), 'minutes', true);
        console.log('时间计算:', duration, Math.round(duration));
        return Math.round(duration);
    };
    // 点击确定时需要调用此方法
    const formSubmit = async () => {
        return new Promise((resolve) => {
            const valuess = form.getFieldsValue();
            // 0：否
            if (!valuess.haveMalfunction) {
                const validateFields = [];
                if (+initialValues.reportProvince === 0) {
                    validateFields.push('rootCauseProfession');
                }
                if (mode === 'review') {
                    validateFields.push('suggestions');
                }
                form.validateFields(validateFields).then(() => {
                    resolve(fomratSubmitValues(valuess));
                });
            } else {
                form.validateFields().then((values) => {
                    resolve(fomratSubmitValues(values));
                });
            }
        });
    };

    // 点击保存时需要调用此方法
    const formSave = async () => {
        // 不校验的表单
        const values = form.getFieldsValue();
        return fomratSubmitValues(values);
    };

    const getRegionList = (provinceId) => {
        return new Promise((resolve) => {
            if (provinceId !== undefined) {
                getRegionListApi({
                    creator: '968617',
                    parentRegionId: provinceId,
                }).then((res) => {
                    setCityOptions(
                        res.map((item) => {
                            return {
                                zoneId: Number(item.regionId),
                                zoneName: item.regionName,
                            };
                        }),
                    );
                    resolve(res);
                });
            } else {
                setCityOptions([]);
                resolve([]);
            }
        });
    };

    const getOutSiteList = (searchVal: string, citys: any, isReset: boolean = true) => {
        const values = form.getFieldsValue();
        const province = provinceOptions.find((item) => item.zoneId === Number(values.provinceId));
        const lastCityOptions = citys || cityOptions;
        const region = lastCityOptions.find(
            (item) => Number(item.zoneId) === Number(values.regionId) || Number(item.regionId) === Number(values.regionId),
        );
        const params = {
            provinceName: province?.zoneName || currentZone?.zoneName,
            regionName: region?.zoneName || region?.regionName,
            siteNameLike: searchVal || undefined,
            current: 0,
            pageSize: 50,
        };
        getSiteList(params).then((res: any) => {
            setSiteOptions(res?.data || []);
            if (isReset) {
                form.setFieldsValue({
                    siteName: undefined,
                });
            }
        });
    };

    useEffect(() => {
        if (mode === 'new') {
            getRegionListApi({
                creator: '968617',
                parentRegionId: currentZone.zoneId,
            }).then((res) => {
                setCityOptions(
                    res.map((item) => {
                        return {
                            zoneId: Number(item.regionId),
                            zoneName: item.regionName,
                        };
                    }),
                );
                setProvinceOptions(provinceList);
                form.setFieldsValue({
                    // regionId: Number(res[0].regionId),
                });
                setLoading(false);
            });
        } else {
            setProvinceOptions(() => {
                if (initialValues.area === 'china') {
                    return provinceList;
                }
                if (initialValues.provinceName) {
                    return [
                        { zoneId: initialValues.provinceId, zoneName: initialValues.provinceName },
                        { zoneId: '--', zoneName: '--' },
                    ];
                }

                return [{ zoneId: '--', zoneName: '--' }];
            });

            if (!initialValues.haveMalfunction) {
                form.setFieldsValue(
                    formFields.slice(1).reduce((acc, cur) => {
                        if (!(cur === 'eventTime' || cur === 'clearTime')) {
                            acc[cur] = undefined;
                        }
                        return acc;
                    }, {}),
                );
                setNoFaultDisabled(true);
            }

            // 数据源置灰条件
            if (initialValues.dataSource === 2) {
                setDataSourceDisabled(true);
            } else {
                setDataSourceDisabled(false);
            }

            if (initialValues.area === 'china') {
                getRegionListApi({
                    creator: '968617',
                    parentRegionId: initialValues.provinceId,
                }).then((res) => {
                    setCityOptions(
                        res.map((item) => {
                            return {
                                zoneId: Number(item.regionId),
                                zoneName: item.regionName,
                            };
                        }),
                    );
                    setLoading(false);
                });
            } else {
                setCityOptions(() => {
                    if (initialValues.regionName) {
                        return [
                            { zoneId: initialValues.regionId, zoneName: initialValues.regionName },
                            { zoneId: '--', zoneName: '--' },
                        ];
                    }
                    return [{ zoneId: '--', zoneName: '--' }];
                });
                setLoading(false);
            }
        }
        if (initialValues.rootCauseProfession === '3') {
            initialValues.faultCauseType1 = initialValues.faultCauseType1 || '2';
            initialValues.effectProfession = initialValues.effectProfession || '无';
            initialValues.effectBusinessDetail = initialValues.effectBusinessDetail || '无';
        }

        // 如果接口返回了professionalTypeName，将其映射到effectProfession字段
        if (initialValues.professionalTypeName) {
            initialValues.effectProfession = initialValues.professionalTypeName;
        }

        form.setFieldsValue(initialValues);

        // 设置当前工单编号（用于显示）
        if (initialValues?.associatedSheetNo) {
            setCurrentSheetNo(initialValues.associatedSheetNo);
        }

        // 自动计算故障历时（当故障发生时间和故障消除时间都有值时）
        setTimeout(() => {
            const values = form.getFieldsValue();
            originData.current = fomratSubmitValues(values);
            
            // 自动计算故障历时（无论何时eventTime和clearTime都有值时）
            if (values.eventTime && values.clearTime) {
                const duration = computeDuration(values.eventTime, values.clearTime);
                form.setFieldsValue({
                    faultDurationMinutes: duration,
                });
            }
            
            // 自动计算业务受影响历时
            if (values.businessEffectedStartTime && values.businessRecoveryTime) {
                const businessDuration = computeDuration(values.businessEffectedStartTime, values.businessRecoveryTime);
                form.setFieldsValue({
                    businessEffectedDurationMinutes: businessDuration,
                });
            }
            
            if (initialValues.siteName) {
                getOutSiteList(initialValues.siteName, undefined, false);
            }
        }, 500);
        // eslint-disable-next-line
    }, [initialValues, mode]);

    useImperativeHandle(ref, () => ({
        getValues: formSubmit,
        getInitValues: () => originData.current,
        getIsEdited: () => isEdited.current,
        // 不校验的表单
        getUnCheckFields: formSave,
    }));

    function onValuesChange(changedValues, allValues) {
        if (_.has(changedValues, 'area')) {
            if (changedValues.area === 'overseas') {
                form.setFieldsValue({
                    provinceId: undefined,
                    regionId: undefined,
                });
            }
            setTimeout(() => {
                getOutSiteList(undefined, undefined);
            }, 500);
        }
        if (_.has(changedValues, 'haveMalfunction')) {
            if (changedValues.haveMalfunction === 0) {
                form.setFieldsValue(
                    formFields.slice(1).reduce((acc, cur) => {
                        if (cur === 'eventTime') {
                            acc[cur] = moment().add(-1, 'month').startOf('month');
                        } else if (cur === 'clearTime') {
                            acc[cur] = moment().add(-1, 'month').endOf('month');
                        } else if (cur === 'faultDurationMinutes') {
                            acc[cur] = computeDuration(moment().add(-1, 'month').startOf('month'), moment().add(-1, 'month').endOf('month'));
                        } else {
                            acc[cur] = undefined;
                        }
                        return acc;
                    }, {}),
                );
                setNoFaultDisabled(true);
            } else if (changedValues.haveMalfunction === 1) {
                form.setFieldsValue({
                    haveMalfunction: 1,
                    area: 'china',
                    regionId: undefined,
                    provinceId: undefined,
                    hasRestored: 1,
                    eventTime: moment(),
                    clearTime: null,
                    faultDurationMinutes: undefined,
                    businessEffectedDurationMinutes: undefined,
                    eventDate: moment(),
                });
                setProvinceOptions(provinceList);

                setNoFaultDisabled(false);
            }
        }
        if (_.has(changedValues, 'area')) {
            if (changedValues.area === 'china') {
                setProvinceOptions(provinceList);
                form.setFieldsValue({
                    provinceId: provinceList[0].zoneId,
                });
                getRegionList(provinceList[0].zoneId).then((res: any) => {
                    form.setFieldsValue({
                        regionId: res.length > 0 ? Number(res[0].regionId) : undefined,
                    });
                });
            } else {
                form.setFieldsValue({
                    provinceId: '--',
                    regionId: '--',
                });
                setProvinceOptions([{ zoneName: '--', zoneId: '--' }]);
                setCityOptions([{ zoneName: '--', zoneId: '--' }]);
            }
        }
        if (_.has(changedValues, 'provinceId')) {
            console.log(changedValues);
            if (changedValues.provinceId !== '--') {
                getRegionList(changedValues.provinceId).then((res: any) => {
                    const region = res.length > 0 ? res[0] : undefined;
                    form.setFieldsValue({
                        regionId: region ? Number(region.regionId) : undefined,
                    });
                    setTimeout(() => {
                        getOutSiteList(searchValue, res);
                    }, 500);
                });
            }
        }

        if (_.has(changedValues, 'eventTime')) {
            if (allValues.eventTime && allValues.clearTime) {
                if (allValues.haveMalfunction === 0) {
                    const eventTime = moment(allValues.eventTime).startOf('month');
                    const endTime = moment(allValues.eventTime).endOf('month');
                    form.setFieldsValue({
                        eventTime,
                        clearTime: endTime,
                        faultDurationMinutes: computeDuration(eventTime, endTime),
                    });
                } else {
                    form.setFieldsValue({
                        faultDurationMinutes: computeDuration(allValues.eventTime, allValues.clearTime),
                    });
                }
            } else {
                form.setFieldsValue({
                    faultDurationMinutes: undefined,
                });
            }
            if (allValues.haveMalfunction !== 0) {
                form.setFieldsValue({
                    eventDate: allValues.eventTime ? moment(allValues.eventTime) : undefined,
                });
            }
        }
        if (_.has(changedValues, 'clearTime')) {
            if (allValues.eventTime && allValues.clearTime) {
                form.setFieldsValue({
                    faultDurationMinutes: computeDuration(allValues.eventTime, allValues.clearTime),
                });
            } else {
                form.setFieldsValue({
                    faultDurationMinutes: undefined,
                });
            }
        }

        if (_.has(changedValues, 'businessEffectedStartTime')) {
            if (allValues.businessEffectedStartTime && allValues.businessRecoveryTime) {
                const min = computeDuration(allValues.businessEffectedStartTime, allValues.businessRecoveryTime);
                form.setFieldsValue({
                    businessEffectedDurationMinutes: min,
                });
            } else {
                form.setFieldsValue({
                    businessEffectedDurationMinutes: undefined,
                });
            }
        }
        if (_.has(changedValues, 'businessRecoveryTime')) {
            if (allValues.businessEffectedStartTime && allValues.businessRecoveryTime) {
                const min = computeDuration(allValues.businessEffectedStartTime, allValues.businessRecoveryTime);

                form.setFieldsValue({
                    businessEffectedDurationMinutes: min,
                });
            } else {
                form.setFieldsValue({
                    businessEffectedDurationMinutes: undefined,
                });
            }
        }
        if (_.has(changedValues, 'isEffectBusiness')) {
            if (changedValues.isEffectBusiness === 0) {
                form.setFieldsValue({
                    businessEffectedStartTime: undefined,
                    businessRecoveryTime: undefined,
                });
            }
        }

        if (_.has(changedValues, 'hasRestored')) {
            if (changedValues.hasRestored === 0 && !allValues.clearTime) {
                form.setFieldsValue({ clearTime: undefined });
            }
            if (changedValues.hasRestored === 0) {
                form.setFieldsValue({ businessRecoveryTime: undefined });
            }
        }
        if (_.has(changedValues, 'pass') || _.has(changedValues, 'suggestions')) {
            return;
        }
        if (_.has(changedValues, 'rootCauseProfession')) {
            if (changedValues.rootCauseProfession === '1') {
                form.setFieldsValue({ siteName: undefined, dhDeviceType: undefined });
                if (siteOptions?.length <= 0) {
                    getOutSiteList('', undefined);
                }
            }
            if (changedValues.rootCauseProfession !== '1') {
                form.setFieldsValue({ siteName: undefined, dhDeviceType: undefined });
            }
            if (changedValues.rootCauseProfession === '3') {
                form.setFieldsValue({ faultCauseType1: '2', effectProfession: '无', effectBusinessDetail: '无' });
            }
        }
        if (_.has(changedValues, 'regionId')) {
            if (changedValues.regionId !== '--' && changedValues.regionId !== 1) {
                getOutSiteList(searchValue, undefined);
            }
        }
        isEdited.current = true;

        renderFooter();
    }

    if (loading) {
        return null;
    }
    const rootCauseProfessionDisabled = () => {
        if (noFaultDisabled && +initialValues.reportProvince !== 0) {
            return true;
        }

        return disabled;
    };

    // 处理搜索
    const handleSearch = _.debounce(async (value) => {
        setSearchValue(value);
        getOutSiteList(value || undefined, undefined);
    }, 1000);

    // 打开工单选择弹窗
    const handleOpenSheetSelect = () => {
        setSheetSelectVisible(true);
    };

    // 工单选择确认
    const handleSheetSelectConfirm = async (selectedSheet: any) => {
        try {
            // 检查是否重新选择了不同的工单编号（在设置新值之前获取）
            const previousSheetNo = form.getFieldValue('associatedSheetNo');
            const isReselect = previousSheetNo && previousSheetNo !== selectedSheet.sheetNo;

            // 立即将工单编号设置到表单中
            form.setFieldsValue({
                associatedSheetNo: selectedSheet.sheetNo,
            });
            setCurrentSheetNo(selectedSheet.sheetNo);

            // 如果重新选择了不同的工单，提示用户
            if (isReselect) {
                const shouldClearData = await new Promise<boolean>((resolve) => {
                    Modal.confirm({
                        title: '提示',
                        content: '已选择新的工单编号，是否清空已填写的备案内容，根据新选工单编号重新填写部分字段？',
                        okText: '是',
                        cancelText: '否',
                        onOk: () => resolve(true),
                        onCancel: () => resolve(false),
                    });
                });

                if (shouldClearData) {
                    // 选择"是"：清空所有表单数据，回填最新工单数据
                    form.resetFields();
                    isEdited.current = false;

                    // 使用智能字段映射函数，让表单自动适应数据
                    const fillData = smartMapFields(selectedSheet);

                    const cleanFillData = filterUndefinedValues(fillData);
                    // 选择故障工单时，默认设置存在故障为"是"
                    cleanFillData.haveMalfunction = 1;

                    // 如果回填数据中有省份ID，先设置省份触发地市级联
                    if (cleanFillData.provinceId) {
                        // 先设置省份值，触发地市数据加载
                        form.setFieldsValue({ provinceId: cleanFillData.provinceId });
                        getRegionList(cleanFillData.provinceId).then((res: any) => {
                            // 地市数据加载完成后，设置完整的回填数据（包括后端的regionId）
                            const finalData = { ...cleanFillData };
                            form.setFieldsValue(finalData);

                            // 如果有regionId，触发站点数据加载
                            if (cleanFillData.regionId) {
                                setTimeout(() => {
                                    getOutSiteList(searchValue, res);
                                }, 100);
                            }
                        });
                    } else {
                        form.setFieldsValue(cleanFillData);
                    }

                    // 更新当前工单编号并关闭弹窗
                    setCurrentSheetNo(selectedSheet.sheetNo);
                    setSheetSelectVisible(false);
                    isEdited.current = true;
                    renderFooter();
                    return; // 结束，不执行后续逻辑
                } else {
                    // 选择"否"：仅回填工单编号到新增弹窗
                    form.setFieldsValue({
                        associatedSheetNo: selectedSheet.sheetNo,
                    });
                    setCurrentSheetNo(selectedSheet.sheetNo);
                    setSheetSelectVisible(false);
                    return; // 直接返回，不执行后续的数据回填逻辑
                }
            }

            // 首次选择工单时的正常逻辑
            // 第一步：校验当前选择的工单编号，是否在【上报省份】下已有对应备案记录
            const checkParams = {
                associatedSheetNo: selectedSheet.sheetNo,
                // 使用用户账号所在省份的ID
                reportProvinceId: userZoneInfo?.zoneId
            };
            const checkResult = await checkSheetNoApi(checkParams);

            if (checkResult.code === 200) {
                const { isExist, isDraft, data: recordData } = checkResult.data;

                if (!isExist) {
                    // 无备案记录时，先清空原有数据，再回填
                    form.resetFields();
                    isEdited.current = false;

                    const fillData = smartMapFields(selectedSheet);

                    const cleanFillData = filterUndefinedValues(fillData);
                    // 选择故障工单时，默认设置存在故障为"是"
                    cleanFillData.haveMalfunction = 1;

                    // 如果回填数据中有省份ID，先设置省份触发地市级联
                    if (cleanFillData.provinceId) {
                        // 先设置省份值，触发地市数据加载
                        getRegionList(cleanFillData.provinceId).then((res: any) => {
                            // 地市数据加载完成后，设置完整的回填数据（包括后端的regionId）
                            const finalData = { ...cleanFillData };
                            form.setFieldsValue(finalData);

                            // 手动触发故障历时计算
                            setTimeout(() => {
                                const values = form.getFieldsValue();
                                if (values.eventTime && values.clearTime) {
                                    form.setFieldsValue({
                                        faultDurationMinutes: computeDuration(values.eventTime, values.clearTime),
                                    });
                                }
                            }, 100);

                            // 如果有regionId，触发站点数据加载
                            if (cleanFillData.regionId) {
                                setTimeout(() => {
                                    getOutSiteList(searchValue, res);
                                }, 100);
                            }
                        });
                    } else {
                        form.setFieldsValue(cleanFillData);
                    }

                    // 更新当前工单编号
                    setCurrentSheetNo(selectedSheet.sheetNo);

                    setSheetSelectVisible(false);
                    isEdited.current = true;
                    renderFooter();
                } else {
                    // 校验结果：有备案记录
                    if (isDraft) {
                        // 二次校验结果：是（草稿状态）
                        // 需要关闭当前新增弹窗，打开编辑页面
                        // 关闭工单选择弹窗
                        setSheetSelectVisible(false);

                        // 更新当前工单编号（用于显示）
                        setCurrentSheetNo(selectedSheet.sheetNo);

                        // 通知父组件需要切换到编辑模式
                        if (props.onSwitchToEdit) {
                            props.onSwitchToEdit(selectedSheet, selectedSheet.sheetNo);
                        } else {
                            // 如果没有提供切换回调，则提示用户
                            message.info('检测到该工单已有草稿记录，请从列表中选择对应记录进行编辑');
                        }

                        return;
                    } else {
                        // 二次校验结果：否（非草稿状态）
                        message.warning('该故障工单已有备案记录，请勿重复发起');
                        return;
                    }
                }
            } else {
                return;
            }
        } catch (error) {
            console.error('校验工单编号出错:', error);
        }
    };

    // 工单选择取消
    const handleSheetSelectCancel = () => {
        setSheetSelectVisible(false);
    };

    return (
        <Form labelAlign="right" form={form} onValuesChange={onValuesChange} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <div className="modal-content-part1" style={{ height: mode === 'new' ? 'auto' : 450 }}>
                <div className="modal-content-title">详情</div>
                <Row gutter={24} style={{ margin: 0 }}>
                    <Col span={12}>
                        <Form.Item label="是否存在故障" name="haveMalfunction" required>
                            {/* 网络故障3.0不可编辑 */}
                            <Select placeholder="请选择" disabled={disabled || dataSourceDisabled || initialValues.dataSource === 3}>
                                <Option value={1}>是</Option>
                                <Option value={0}>否</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Row gutter={24}>
                            <Col span={11}>
                                <Form.Item label="国家地区" required name="area">
                                    <Radio.Group disabled={disabled || noFaultDisabled || dataSourceDisabled}>
                                        <Radio value="china">中国</Radio>
                                        <Radio value="overseas">海外</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={13}>
                                <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.area !== currentValues.area}>
                                    {({ getFieldValue }) => {
                                        return getFieldValue('area') === 'overseas' ? (
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Form.Item
                                                    style={{ width: '80%' }}
                                                    required
                                                    name="overseasArea"
                                                    wrapperCol={{ span: 24 }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请填写海外地区',
                                                        },
                                                    ]}
                                                >
                                                    <Input style={{ width: '100%' }} maxLength={100} disabled={disabled || noFaultDisabled} />
                                                </Form.Item>
                                                <Tooltip title="若为海外故障请填写海外具体地区">
                                                    <Icon type="QuestionCircleOutlined" antdIcon style={{ marginLeft: '10px', marginTop: '8px' }} />
                                                </Tooltip>
                                            </div>
                                        ) : null;
                                    }}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {/* 工单编号字段单独一行 */}
                <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                        const haveMalfunction = getFieldValue('haveMalfunction');
                        const dataSource = initialValues?.dataSource;

                        // 只有当"是否存在故障"选择"是"时才显示工单编号字段
                        if (haveMalfunction !== 1 && haveMalfunction !== "1") {
                            return null;
                        }
                        // 判断当前数据项的上报省份是否为江苏省
                        const isJiangsuProvince = (() => {
                            // 新建模式直接用当前用户信息判断
                            if (mode === 'new') {
                                return currentZone.zoneName === '江苏省' || currentZone.zoneName?.includes('江苏');
                            }
                            // 编辑模式用数据中的省份判断
                            const reportProvinceId = initialValues?.reportProvince;
                            if (!reportProvinceId) return false;

                            const province = provinceOptions?.find((item: any) =>
                                item.zoneId === reportProvinceId || item.value === reportProvinceId
                            );
                            return province?.zoneName === '江苏省' || province?.label === '江苏省';
                        })();

                        // 数据源为"页面录入"(dataSource=1)且上报省份为江苏省时必填
                        const isRequired = isJiangsuProvince && (
                            (mode === 'new') ||
                            (mode === 'edit' && dataSource === 1)
                        );
                        // 编辑/审核页面：使用dataState=3判断是否为网络故障3.0数据源，此时只读
                        // 但页面录入数据(dataSource=1)允许重新选择工单
                        const isReadOnly = (mode === 'edit' || mode === 'review') &&
                            initialValues?.dataState === 3 &&
                            initialValues?.dataSource !== 1;
                        const sheetNo = getFieldValue('associatedSheetNo');
                        return (
                            <Row gutter={24} style={{ margin: 0 }}>
                                <Col span={24}>
                                    <Form.Item
                                        label="工单编号"
                                        name="associatedSheetNo"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 20 }}
                                        rules={[
                                            {
                                                required: isRequired,
                                                message: mode === 'new' ? '请选择工单编号' :
                                                    mode === 'review' ? '请选择工单编号' :
                                                        '请选择工单编号'
                                            }
                                        ]}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Button
                                                type="primary"
                                                onClick={handleOpenSheetSelect}
                                                disabled={disabled || isReadOnly}
                                                style={{ marginRight: 8 }}
                                            >
                                                选择工单
                                            </Button>
                                            {sheetNo && (
                                                <span style={{ color: '#666', marginLeft: 8 }}>
                                                    已选择：{sheetNo}
                                                </span>
                                            )}
                                            <span style={{ color: '#ff4d4f', fontSize: '12px', marginLeft: '10px' }}>
                                                先选择工单编号，下方部分字段将自动填充
                                            </span>

                                        </div>
                                        <Input
                                            type="hidden"
                                            value={sheetNo}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        );
                    }}
                </Form.Item>

                <Row gutter={24} style={{ margin: 0 }}>
                    <Col span={12}>
                        <Form.Item
                            label="省份"
                            required
                            name="provinceId"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择省份',
                                },
                            ]}
                        >
                            <Select
                                options={provinceOptions.map((city) => ({
                                    label: city.zoneName,
                                    value: +city.zoneId,
                                }))}
                                placeholder="请选择"
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                disabled={disabled || noFaultDisabled || dataSourceDisabled}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="地市"
                            required
                            name="regionId"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择地市',
                                },
                            ]}
                        >
                            <Select
                                placeholder="请选择"
                                disabled={disabled || noFaultDisabled}
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={cityOptions.map((city) => ({ label: city.zoneName, value: +city.zoneId }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24} style={{ margin: 0 }}>
                    <Col span={12}>
                        <Form.Item
                            label="故障发生网络层级"
                            required
                            name="networkLayer"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择网络层级',
                                },
                            ]}
                        >
                            <Select placeholder="请选择" allowClear showSearch optionFilterProp="children" disabled={disabled || noFaultDisabled}>
                                {enums.networkLayer?.map((item) => {
                                    return <Option value={item.key}>{item.value}</Option>;
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="故障是否恢复" required name="hasRestored">
                            <Select placeholder="请选择" disabled={disabled || noFaultDisabled || dataSourceDisabled}>
                                <Option value={1}>是</Option>
                                <Option value={0}>否</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24} style={{ margin: 0 }}>
                    <Col span={12}>
                        <Form.Item
                            label="是否影响业务"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择是否影响业务',
                                },
                            ]}
                            name="isEffectBusiness"
                        >
                            <Select placeholder="请选择" disabled={disabled || noFaultDisabled}>
                                <Option value={0}>否</Option>
                                <Option value={1}>是</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="根因故障专业"
                            required
                            name="rootCauseProfession"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择根因故障专业',
                                },
                            ]}
                        >
                            <Select placeholder="请选择" showSearch optionFilterProp="children" allowClear disabled={rootCauseProfessionDisabled()}>
                                {enums.rootCauseProfession?.map((item) => {
                                    return <Option value={item.key}>{item.value}</Option>;
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24} style={{ margin: 0 }}>
                    <Col span={8}>
                        <Form.Item noStyle dependencies={['hasRestored', 'clearTime']}>
                            {({ getFieldValue }) => {
                                const haveMalfunction = getFieldValue('haveMalfunction');
                                return (
                                    <Form.Item
                                        label="故障发生时间"
                                        labelCol={{ span: 12 }}
                                        style={{ position: 'relative', left: '3px' }}
                                        wrapperCol={{ span: 12 }}
                                        required
                                        name="eventTime"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择故障发生时间',
                                            },
                                            {
                                                message: '故障发生时间不能大于故障消除时间',
                                                validator: (rule, value) => {
                                                    if (getFieldValue('clearTime') && value && moment(value).isAfter(getFieldValue('clearTime'))) {
                                                        return Promise.reject(new Error('故障消除时间不能小于故障发生时间'));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            format={haveMalfunction === 0 ? 'YYYY-MM-01 00:00:00' : 'YYYY-MM-DD HH:mm:ss'}
                                            disabled={disabled}
                                            picker={haveMalfunction === 0 ? 'month' : 'date'}
                                            showTime={haveMalfunction === 1}
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item noStyle dependencies={['hasRestored', 'eventTime']}>
                            {({ getFieldValue }) => {
                                const haveMalfunction = getFieldValue('haveMalfunction');
                                return (
                                    <Form.Item
                                        required={getFieldValue('hasRestored') === 1}
                                        label="故障消除时间"
                                        name="clearTime"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                        rules={[
                                            () => ({
                                                required: getFieldValue('hasRestored') === 1,
                                                message: '请填写故障恢复时间',
                                            }),
                                            {
                                                message: '故障消除时间不能小于故障发生时间',
                                                validator: (rule, value) => {
                                                    if (getFieldValue('eventTime') && value && moment(value).isBefore(getFieldValue('eventTime'))) {
                                                        return Promise.reject(new Error('故障消除时间不能小于故障发生时间'));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            format={haveMalfunction === 0 ? 'YYYY-MM-DD 23:59:59' : 'YYYY-MM-DD HH:mm:ss'}
                                            disabled={disabled || noFaultDisabled}
                                            showTime
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item noStyle dependencies={['hasRestored', 'eventTime']}>
                            {({ getFieldValue }) => {
                                return (
                                    <Form.Item
                                        required={getFieldValue('hasRestored') === 1}
                                        label="故障历时(分钟)"
                                        name="faultDurationMinutes"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24} style={{ margin: 0 }}>
                    <Col span={8}>
                        <Form.Item noStyle dependencies={['businessRecoveryTime', 'isEffectBusiness']}>
                            {({ getFieldValue }) => {
                                const hasRule = getFieldValue('isEffectBusiness') === 1;
                                const rule = hasRule
                                    ? [
                                        {
                                            required: true,
                                            message: '请选择业务受影响开始时间',
                                        },
                                        {
                                            message: '业务受影响开始时间不能大于业务恢复时间',

                                            validator: (rule, value) => {
                                                if (value && moment(value).isAfter(getFieldValue('businessRecoveryTime'))) {
                                                    return Promise.reject(new Error('业务受影响开始时间不能大于业务恢复时间'));
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]
                                    : [
                                        {
                                            validator: () => Promise.resolve(),
                                        },
                                    ];

                                return (
                                    <Form.Item
                                        label="业务受影响开始时间"
                                        name="businessEffectedStartTime"
                                        style={{ position: 'relative', left: '3px' }}
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                        rules={rule}
                                    >
                                        <DatePicker format="YYYY-MM-DD HH:mm:ss" disabled={disabled || noFaultDisabled || !hasRule} showTime />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item noStyle dependencies={['hasRestored', 'businessEffectedStartTime', 'isEffectBusiness']}>
                            {({ getFieldValue }) => {
                                const flag1 = getFieldValue('hasRestored') === 1;
                                const flag2 = getFieldValue('isEffectBusiness') === 1;
                                const rule =
                                    flag1 && flag2
                                        ? [
                                            {
                                                required: true,
                                                message: '请填写业务恢复时间',
                                            },
                                            {
                                                message: '业务恢复时间不能小于业务受影响开始时间',
                                                validator: (rule, value) => {
                                                    if (value && moment(value).isBefore(getFieldValue('businessEffectedStartTime'))) {
                                                        return Promise.reject(new Error('业务恢复时间不能小于业务受影响开始时间'));
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]
                                        : [
                                            {
                                                validator: () => Promise.resolve(),
                                            },
                                        ];

                                return (
                                    <Form.Item
                                        label="业务恢复时间"
                                        name="businessRecoveryTime"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                        rules={rule}
                                    >
                                        <DatePicker
                                            format="YYYY-MM-DD HH:mm:ss"
                                            disabled={disabled || noFaultDisabled || !(flag1 && flag2)}
                                            showTime
                                        />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item noStyle dependencies={['hasRestored', 'businessRecoveryTime']}>
                            {({ getFieldValue }) => {
                                return (
                                    <Form.Item
                                        required={getFieldValue('hasRestored') === 1}
                                        label="业务受影响历时(分钟)"
                                        name="businessEffectedDurationMinutes"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24} style={{ margin: 0 }}>
                    <Col span={12}>
                        <Form.Item
                            label="故障发生日期"
                            required
                            name="eventDate"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择故障发生日期',
                                },
                            ]}
                        >
                            <DatePicker format="YYYY-MM-DD" disabled />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="故障等级"
                            required
                            name="faultLevel"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择故障等级',
                                },
                            ]}
                        >
                            <Select placeholder="请选择" optionFilterProp="children" showSearch allowClear disabled={disabled || noFaultDisabled}>
                                {enums['faultLevel-net']?.map((item) => {
                                    return <Option value={item.key}>{item.value}</Option>;
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24} style={{ margin: 0 }}>
                    <Col span={12}>
                        <Form.Item
                            label="是否产生重大舆情投诉"
                            required
                            name="havePublicSentiment"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择是否产生重大舆情投诉',
                                },
                            ]}
                        >
                            <Select placeholder="请选择" allowClear showSearch optionFilterProp="children" disabled={disabled || noFaultDisabled}>
                                <Option value={0}>否</Option>
                                <Option value={1}>是</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="故障是否存在隐患导致"
                            required
                            name="causedByHidden"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择故障是否存在隐患导致',
                                },
                            ]}
                        >
                            <Select placeholder="请选择" allowClear disabled={disabled || noFaultDisabled}>
                                <Option value={0}>否</Option>
                                <Option value={1}>是</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={24} style={{ margin: 0 }}>
                    <Col span={12}>
                        <Form.Item
                            label="故障产生原因类型一"
                            required
                            name="faultCauseType1"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择故障产生原因类型一',
                                },
                            ]}
                        >
                            <Select placeholder="请选择" disabled={disabled || noFaultDisabled} allowClear showSearch optionFilterProp="children">
                                {enums.faultCauseType1?.map((item) => {
                                    return <Option value={item.key}>{item.value}</Option>;
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="故障产生原因类型二" name="faultCauseType2">
                            <Select placeholder="请选择" disabled={disabled || noFaultDisabled} allowClear showSearch optionFilterProp="children">
                                {enums.faultCauseType2?.map((item) => {
                                    return <Option value={item.key}>{item.value}</Option>;
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24} style={{ margin: 0 }}>
                    <Col span={12}>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const rootCauseProfession = getFieldValue('rootCauseProfession');

                                return (
                                    <Form.Item
                                        label="云池类型"
                                        name="cloudPoolType"
                                        rules={[{ required: rootCauseProfession === '7', message: '请选择云池类型' }]}
                                    >
                                        <Select
                                            placeholder="请选择"
                                            disabled={disabled || noFaultDisabled}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {enums.cloudPoolType?.map((item) => {
                                                return <Option value={+item.key}>{item.value}</Option>;
                                            })}
                                        </Select>
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const rootCauseProfession = getFieldValue('rootCauseProfession');
                                return (
                                    <Form.Item
                                        label="局站名称"
                                        name="siteName"
                                        rules={[{ required: rootCauseProfession === '1', message: '请选择局站名称' }]}
                                    >
                                        <Select
                                            placeholder="请选择"
                                            disabled={disabled || noFaultDisabled || rootCauseProfession !== '1'}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                            onSearch={handleSearch}
                                        >
                                            {siteOptions?.map((item) => {
                                                return <Option value={item}>{item}</Option>;
                                            })}
                                        </Select>
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const rootCauseProfession = getFieldValue('rootCauseProfession');

                                return (
                                    <Form.Item
                                        label="动环设备类型"
                                        name="dhDeviceType"
                                        rules={[{ required: rootCauseProfession === '1', message: '请选择动环设备类型' }]}
                                    >
                                        <Select
                                            placeholder="请选择"
                                            disabled={disabled || noFaultDisabled || rootCauseProfession !== '1'}
                                            allowClear
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {enums.dhDeviceType?.map((item) => {
                                                return <Option value={+item.key}>{item.value}</Option>;
                                            })}
                                        </Select>
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="故障影响专业"
                    required
                    style={{ position: 'relative', left: '-5px' }}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    name="effectProfession"
                    rules={[
                        {
                            required: true,
                            message: '请输入故障影响专业',
                        },
                    ]}
                >
                    <Input.TextArea maxLength={1000} disabled={disabled || noFaultDisabled} autoSize={{ minRows: 4 }} />
                </Form.Item>

                <Form.Item
                    label="影响业务具体情况"
                    style={{ position: 'relative', left: '-5px' }}
                    required
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    name="effectBusinessDetail"
                    rules={[
                        {
                            required: true,
                            message: '请输入影响业务具体情况',
                        },
                    ]}
                >
                    <Input.TextArea autoSize={{ minRows: 4 }} maxLength={1000} disabled={disabled || noFaultDisabled} />
                </Form.Item>

                <Form.Item
                    label="故障现象"
                    style={{ position: 'relative', left: '-5px' }}
                    required
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    name="faultPhenomenon"
                    rules={[
                        {
                            required: true,
                            message: '请输入故障现象',
                        },
                    ]}
                >
                    <Input.TextArea
                        autoSize={{ minRows: 4 }}
                        maxLength={1000}
                        disabled={disabled || noFaultDisabled}
                        placeholder="请描述故障的详细情况"
                    />
                </Form.Item>

                <Form.Item
                    label="故障原因"
                    style={{ position: 'relative', left: '-5px' }}
                    required
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    name="faultReason"
                    rules={[
                        {
                            required: true,
                            message: '请输入故障原因',
                        },
                    ]}
                >
                    <Input.TextArea autoSize={{ minRows: 4 }} maxLength={1000} disabled={disabled || noFaultDisabled} />
                </Form.Item>
                <Form.Item label="备注" style={{ position: 'relative', left: '-5px' }} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} name="note">
                    <Input.TextArea
                        placeholder="云资源专业请备注具体资源池名称"
                        autoSize={{ minRows: 4 }}
                        maxLength={1000}
                        disabled={disabled || noFaultDisabled}
                    />
                </Form.Item>
                {hiddenFields.map((el) => {
                    return (
                        <Form.Item hidden name={el} key={el}>
                            <Input />
                        </Form.Item>
                    );
                })}
            </div>
            {mode === 'new' ? null : (
                <>
                    <div className="modal-content-line" />
                    <div className="modal-content-part2">
                        <div className="modal-content-title">审核</div>
                        {mode === 'review' ? (
                            <>
                                <Form.Item
                                    label="审核结果"
                                    required
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                    name="pass"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择审核结果',
                                        },
                                    ]}
                                >
                                    <Radio.Group
                                        disabled={disabled}
                                        options={[
                                            { label: '通过', value: true },
                                            { label: '驳回', value: false },
                                        ]}
                                    />
                                </Form.Item>
                                <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue }) => {
                                        return getFieldValue('pass') ? null : (
                                            <Form.Item
                                                label="反馈建议"
                                                style={{ position: 'relative', left: '-5px' }}
                                                labelCol={{ span: 4 }}
                                                wrapperCol={{ span: 20 }}
                                                rules={[{ required: true, message: '请输入反馈建议' }]}
                                                name="suggestions"
                                            >
                                                <Input.TextArea rows={4} maxLength={200} disabled={disabled} />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            </>
                        ) : null}

                        <div>审核记录:</div>

                        <ReviewTable dataSource={initialValues.approvalRecords || []} />
                    </div>
                </>
            )}

            {/* 工单选择弹窗 */}
            <SheetSelectModal
                visible={sheetSelectVisible}
                onCancel={handleSheetSelectCancel}
                onConfirm={handleSheetSelectConfirm}
                provinceOptions={provinceOptions}
            />
        </Form>
    );
});
