import React, { useState, useEffect, useCallback } from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { Col, Form, Select, Button, Icon } from 'oss-ui';
import pinyin from 'js-pinyin';
import useLoginInfoModel from '@Src/hox';
import Enums from '@Common/enum';
import getFilterByType from '@Components/form-item/operator-search/condition/multiSelect/filter';
import getRuleData from '@Components/form-item/operator-search/condition/multiSelect/rule';

const filtersDate = { MY: [], SHARE: [], ALL: [] };
const Index = (props) => {
    const [filterTypeOptions, setFilterTypeOptions] = useState(null);
    // const [filterType, setFilterType] = useState('我的过滤器');
    const [filterOptions, setFilterOptions] = useState([]);
    // const [filter, setFilter] = useState(null);
    const [loading, setLoading] = useState(false);
    const { userId } = useLoginInfoModel();
    const filterTypeChange = (value) => {
        // setFilterType(value);
        setFilterOptions(filtersDate[value]);
        setFilter(null);
    };

    const setFilter = (value = '') => {
        if (value !== 'null') {
            props.settingForm.setFieldsValue({ parentFilterId: value });
            props.setFilterExpand(false);
        }
    };
    const setFilterType = (value = '') => {
        if (value !== 'null') {
            props.settingForm.setFieldsValue({ filterType: value });
            setFilterOptions(filtersDate[value]);
        } else {
            //默认为我的过滤器
            setFilterOptions(filtersDate.MY);
        }
    };
    const getFilterType = (value) => {
        return props.settingForm.getFieldValue('filterType');
    };

    const getFilterId = async (_filterTypeOptions) => {
        const myFilter = getFilterByType(userId, 'MY');
        const shFilter = getFilterByType(userId, 'SHARE');
        const alFilter = getFilterByType(userId, 'ALL');

        const allSettledPromise = Promise.allSettled([myFilter, shFilter, alFilter]);

        const res = await allSettledPromise;
        // .then((res) => {
        let fDate =
            res[0]?.value?.data?.map((data) => ({
                value: data.filterId,
                label: data.filterName
            })) ?? [];
        filtersDate.MY = fDate;
        // setFilterOptions(fDate);
        fDate =
            res[1]?.value?.data?.map((data) => ({
                value: data.filterId,
                label: data.filterName
            })) ?? [];
        filtersDate.SHARE = fDate;
        fDate =
            res[2]?.value?.data?.map((data) => ({
                value: data.filterId,
                label: data.filterName
            })) ?? [];
        filtersDate.ALL = fDate;
        // })
        // .then(

        const resRule = await getRuleData(userId);
        Object.assign(filtersDate, resRule);

        // });
    };
    useEffect(() => {
        if (props.menuOption === 'add') {
            initView().then(() => {
                setFilterOptions(filtersDate.MY);
            });
        }
    }, [initView, props.menuOption]);
    const initView = useCallback(() => {
        if (!filterTypeOptions) {
            const _filterTypeOptions = [
                { value: 'MY', label: '我的过滤器' },
                { value: 'SHARE', label: '共享过滤器' },
                { value: 'ALL', label: '全部过滤器' }
            ];
            const options = _filterTypeOptions.concat(Enums.filterModuleMap.map(({ id, key, name }) => ({ value: id, label: name })));
            setFilterTypeOptions(options);
            return getFilterId(_filterTypeOptions);
        }
        return Promise.resolve('');
    });
    const myEditData = props.editData;
    const initEditView = (myEditData) => {
        if (myEditData && props.menuOption === 'edit') {
            initView().then(() => {
                /**
                 * isMyParentFilter
                 * isPrivate 是否私有  1-私有 2-共享 目前看参数不起作用 我的过滤器和共享过滤器都为2
                 * moduleId 1过滤器|其他值为规则id
                 */
                const { isMyParentFilter, isPrivate, moduleId = '', parentFilterId = '' } = myEditData;
                switch (moduleId) {
                    case 1:
                        setFilterType('ALL');
                        break;
                    default:
                        setFilterType(`${moduleId}`);
                        break;
                }
                // setFilter(parentFilterId);
            });
        }
    };
    useEffect(() => {
        initEditView(myEditData);
    }, [initEditView, myEditData]);

    const filterFilter = (input, option) => {
        const fullpy = option?.label ? pinyin.getFullChars(option?.label) : '';
        const camelpy = option?.label ? pinyin.getCamelChars(option?.label) : '';
        return (
            option?.label?.toUpperCase().includes(input?.toUpperCase()) ||
            fullpy.toUpperCase().includes(input?.toUpperCase()) ||
            camelpy.toUpperCase().includes(input?.toUpperCase())
        );
    };
    const reLoad = () => {
        setLoading(true);
        getFilterId()
            .then((res) => {
                console.log('过滤器刷新成功！');
                const type = getFilterType();
                setFilterOptions(filtersDate[type]);
            })
            .catch(() => {
                console.log('过滤器刷新失败！');
            })
            .finally(() => {
                // setFilter(null);
                setFilter(null);
                setLoading(false);
            });
    };
    const filterChange = () => {
        props.setFilterExpand(false);
    };

    return [
        <Col span={9}>
            <Form.Item label="选择过滤器" labelCol={{ span: 8 }} name="filterType">
                <Select
                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                    onChange={filterTypeChange}
                    options={filterTypeOptions}
                ></Select>
            </Form.Item>
        </Col>,
        <Col span={7}>
            <Form.Item name="parentFilterId">
                <Select
                    getPopupContainer={(triggerNode) => triggerNode.parentElement}
                    allowClear={true}
                    options={filterOptions}
                    onChange={filterChange}
                    showSearch={true}
                    filterOption={filterFilter}
                ></Select>
            </Form.Item>
        </Col>,
        <Col span={1}>
            <Button title="刷新" loading={loading} icon={<Icon antdIcon={true} type={'RedoOutlined'} onClick={reLoad} />}></Button>
        </Col>
    ];
};
export default Index;
