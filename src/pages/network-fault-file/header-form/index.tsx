import React, { useMemo, useEffect } from 'react';
import { Form, Input, Select, Button, DatePicker } from 'oss-ui';
import AllSelect from '@Components/all-select';
import AllCheckBox from '@Components/all-checkbox';
import useLoginInfoModel from '@Src/hox';
import { getUserConfigApi } from '../api';
import { authData } from '../auth';
import './index.less';

interface HeaderFormProps {
    form: any;
    formOptions: any;
    onValuesChange: any;
    onFinish: any;
    onReset: any;
    onExpandClick: any;
    formExpand: boolean;
}
const HeaderForm = (props: HeaderFormProps) => {
    const {
        form,
        formOptions: { provinceList, cityList, enums },
        onValuesChange,
        onFinish,
        onReset,
        onExpandClick,
        formExpand,
    } = props;

    const { parsedUserInfo, userZoneInfo, userId, currentZone } = useLoginInfoModel();

    const hasAuth = (authKey: string) => {
        const { operationsButton } = parsedUserInfo;
        const findAuth = operationsButton.find((item) => item.key === authKey);
        return !!findAuth;
    };

    const getUserConfig = async () => {
        const params = {
            userId,
            fieldName: 'rootCauseProfession',
        };
        const result = await getUserConfigApi(params);
        if (result.code === 200) {
            return result.data.split(',');
        }
        return [];
    };

    const boolValueEnum = [
        { label: '全部', value: '0' },
        { label: '是', value: '1' },
        { label: '否', value: '2' },
    ];
    const provinceOptions = useMemo(() => {
        return [
            {
                label: '全部',
                value: 'all',
            },
            ...provinceList.map((province) => ({
                label: province.zoneName,
                value: province.zoneId,
            })),
        ];
    }, [provinceList]);

    const rootCauseProfessionOptions = useMemo(() => {
        return [
            ...enums.rootCauseProfession?.map((itemIn) => ({
                label: itemIn.value,
                value: itemIn.key,
            })),
            { label: '其他', value: '-1' },
        ];
    }, [enums]);
    const optionsWithDisabled = useMemo(() => {
        return enums.dataState?.map((item) => ({
            label: item.value,
            value: +item.key,
        }));
    }, [enums]);

    const setInitValues = async () => {
        const isReviewer = hasAuth(authData.reviewFault);
        const isGroupLeader = userZoneInfo.zoneLevel === '1';

        let dataStateList = [0, 1, 2, 3, 4, 5];
        const rootCauseProfession = await getUserConfig();
        if (isReviewer && isGroupLeader) {
            dataStateList = [3, 4, 5];
        }
        if (isReviewer && !isGroupLeader) {
            dataStateList = [1, 2, 3, 4];
        }
        form.setFieldsValue({
            havePublicSentiment: '0',
            isEffectBusiness: '0',
            haveMalfunction: '0',
            hasRestored: '0',
            causedByHidden: '0',
            dataStateList,
            rootCauseProfession,
        });
    };

    const expandAttributes = (type: string = 'block') => {
        return { style: { display: formExpand ? 'none' : type } };
    };
    const asyncReset = async () => {
        return new Promise(() => {
            onReset();
        });
    };

    const onResetClick = async () => {
        form.resetFields();
        await setInitValues();
        await asyncReset();
    };

    const reportProvinceOptions = useMemo(() => {
        const list = provinceList.map((province) => ({
            label: province.zoneName,
            value: province.zoneId,
        }));

        if (currentZone.zoneLevel !== '1') {
            return [{ label: '集团', value: 0 }, ...list];
        }
        return list;
    }, []);

    useEffect(() => {
        setInitValues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="header-form">
            <Form form={form} labelAlign="right" labelCol={{ span: 6 }} onValuesChange={onValuesChange}>
                <div className="header-form-body">
                    <div className="header-form-body-item span-4">
                        <div className="item-custom-label">数据状态：</div>
                        <div className="item-custom-body">
                            <Form.Item name="dataStateList">
                                <AllCheckBox options={optionsWithDisabled} />
                            </Form.Item>
                        </div>
                    </div>
                    <div {...expandAttributes('grid')} className="header-form-body-item span-4">
                        <div className="item-custom-label">根因故障专业：</div>
                        <div className="item-custom-body">
                            <Form.Item name="rootCauseProfession">
                                <AllCheckBox options={rootCauseProfessionOptions} />
                            </Form.Item>
                        </div>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="国家地区" name="area">
                            <Input type="text" placeholder="请输入" />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="省份" name="provinceId">
                            <Select placeholder="默认全部" options={provinceOptions} optionFilterProp="label" allowClear showSearch />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="地市" name="regionId">
                            <AllSelect
                                options={cityList.map((city) => ({
                                    label: city.zoneName,
                                    value: city.zoneId,
                                }))}
                                placeholder="默认全部"
                                allowClear
                                showSearch
                                maxTagCount="responsive"
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="上报省份" name="reportProvince">
                            <AllSelect
                                placeholder="默认全部"
                                options={reportProvinceOptions}
                                maxTagCount="responsive"
                                optionFilterProp="label"
                                allowClear
                                showSearch
                            />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="故障发生时间" name="eventTime">
                            <DatePicker.RangePicker
                                style={{ width: '100%' }}
                                placeholder={['开始时间', '结束时间']}
                                showTime={{ format: 'HH:mm:ss' }}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="上报时间" name="createTime">
                            <DatePicker.RangePicker
                                style={{ width: '100%' }}
                                placeholder={['开始时间', '结束时间']}
                                showTime={{ format: 'HH:mm:ss' }}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="是否存在故障" name="haveMalfunction">
                            <Select placeholder="请选择" options={boolValueEnum} allowClear />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="网络层级" name="networkLayer">
                            <AllSelect
                                options={enums.networkLayer?.map((itemIn) => ({
                                    label: itemIn.value,
                                    value: itemIn.key,
                                }))}
                                optionFilterProp="label"
                                placeholder="默认全部"
                                mode="multiple"
                                maxTagCount="responsive"
                                allowClear
                            />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="故障是否恢复" name="hasRestored">
                            <Select placeholder="请选择" options={boolValueEnum} allowClear />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="是否有重大舆情" name="havePublicSentiment">
                            <Select placeholder="请选择" options={boolValueEnum} allowClear />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="是否影响业务" name="isEffectBusiness">
                            <Select placeholder="请选择" options={boolValueEnum} allowClear />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="故障等级" name="faultLevel">
                            <AllSelect
                                options={enums['faultLevel-net']?.map((itemIn) => ({
                                    label: itemIn.value,
                                    value: itemIn.key,
                                }))}
                                placeholder="默认全部"
                                mode="multiple"
                                maxTagCount="responsive"
                                optionFilterProp="label"
                                allowClear
                            />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="是否隐患导致" name="causedByHidden">
                            <Select placeholder="请选择" options={boolValueEnum} allowClear />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="故障原因类型" name="faultCauseType">
                            <AllSelect
                                options={enums['faultCauseType2']?.map((itemIn) => ({
                                    label: itemIn.value,
                                    value: itemIn.key,
                                }))}
                                placeholder="默认全部"
                                mode="multiple"
                                maxTagCount="responsive"
                                optionFilterProp="label"
                                allowClear
                            />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="数据源" name="dataSourceList">
                            <AllSelect
                                options={enums['dataSource']?.map((itemIn) => ({
                                    label: itemIn.value,
                                    value: itemIn.key,
                                }))}
                                placeholder="默认全部"
                                mode="multiple"
                                maxTagCount="responsive"
                                optionFilterProp="label"
                                allowClear
                            />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="备注" name="note">
                            <Input type="text" placeholder="请输入" allowClear />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="云池类型" name="cloudPoolTypeList">
                            <AllSelect
                                options={enums['cloudPoolType']?.map((itemIn) => ({
                                    label: itemIn.value,
                                    value: +itemIn.key,
                                }))}
                                placeholder="默认全部"
                                mode="multiple"
                                maxTagCount="responsive"
                                optionFilterProp="label"
                                allowClear
                            />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="创建人" name="creator">
                            <Input type="text" placeholder="请输入" allowClear />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="修改人" name="modifier">
                            <Input type="text" placeholder="请输入" allowClear />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="同步唯一标识" name="sheetNo">
                            <Input type="text" placeholder="请输入" allowClear />
                        </Form.Item>
                    </div>
                     <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item label="工单编号" name="associatedSheetNo">
                            <Input type="text" placeholder="请输入工单编号" allowClear />
                        </Form.Item>
                    </div>
                    <div {...expandAttributes()} className="header-form-body-item">
                        <Form.Item>
                            <span />
                        </Form.Item>
                    </div>
                </div>
            </Form>
            <div className="header-form-botton">
                <Button onClick={onResetClick}>重置</Button>
                <Button type="primary" onClick={onFinish}>
                    查询
                </Button>
                {/* <Button onClick={() => console.log(form.getFieldsValue())}>测试</Button> */}
                <div className="header-form-botton-expand" onClick={() => onExpandClick()}>
                    {formExpand ? '展开∨' : '收起∧'}
                </div>
            </div>
        </div>
    );
};
export default HeaderForm;
