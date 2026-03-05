import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Space, Radio } from 'oss-ui';
import request from '@Common/api';
// import ColumnsSortDrag from '@Components/columns-sort-drag';
import { ColumnsSortDrag } from 'oss-ui';
import {
    // getSearchFormDiy,
    getAllOptions,
    getDefaultOptions,
    addSearchFormDiy,
    delSearchFormDiy,
    updateSearchFormDiy
} from '../../common/adaper/adapter_searchForm';

const Index = (props) => {
    const [searchType, onSearchTypeChange] = useState(0);
    const [allOptions, setAllOptions] = useState([]);
    const [selectOptions, setSelectOptions] = useState([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const conditionRef = useRef(null);
    const OptionsFilter = ['event_time', 'alarm_origin'];
    const initView = () => {
        const allSettledPromise = Promise.allSettled([getAllOptions(), getDefaultOptions()]);
        return allSettledPromise.then((res) => {
            let [{ value: _allOptions }, { value: _defaultOptions }] = res;
            _allOptions = _allOptions.filter((opt) => !OptionsFilter.includes(opt.field));
            _defaultOptions = _defaultOptions.filter((opt) => !OptionsFilter.includes(opt.field));
            conditionRef.current.custom = { ...conditionRef.current.custom, _allOptions, _defaultOptions };
        });
    };
    useEffect(() => {
        if (props.menuOption === 'add') {
            initView().then(() => {
                searchTypeChange(searchType);
            });
        } else if (props.menuOption === 'edit') {
            onSearchTypeChange(1);
        }
    }, []);

    const searchTypeChange = useCallback((searchType) => {
        // if (props.menuOption === 'add' || props.menuOption === 'edit') {
        const _defaultOptions = conditionRef.current?.custom?._defaultOptions ?? [];
        const _allOptions = conditionRef.current?.custom?._allOptions ?? [];
        const _pSelectConditions = conditionRef.current?.custom?._pSelectConditions ?? [];
        let selectCond = _defaultOptions;
        switch (searchType) {
            case 0:
            default:
                selectChangeNotice(selectCond, _allOptions);
                setAllOptions(_defaultOptions);
                break;
            case 1:
                selectCond = props.menuOption === 'edit' && _pSelectConditions ? _pSelectConditions : _defaultOptions;
                selectChangeNotice(selectCond, _allOptions);
                setAllOptions(_allOptions);
                break;
        }
        // props.onSelectChange(selectCond);
    });
    const selectChangeNotice = (selectCond, allOptions) => {
        setSelectOptions(selectCond);
        // 放到父组件添加，方便控制顺序
        // const hasEventTime = selectCond.find((item) => item.field === 'event_time');
        // const eventTimeCond = allOptions.find((item) => item.field === 'event_time');
        // if (!hasEventTime && eventTimeCond) {
        //     props.onSelectChange([eventTimeCond, ...selectCond]);
        // } else {
        props.onSelectChange(selectCond);
        // }
    };
    useEffect(() => {
        let _pSelectConditions = conditionRef.current?.custom?._pSelectConditions ?? null;
        if (props.selectConditions && !_pSelectConditions) {
            initView().then(() => {
                _pSelectConditions = conditionRef.current?.custom?._pSelectConditions ?? null;
                if (!_pSelectConditions) {
                    const _allOptions = conditionRef.current?.custom?._allOptions ?? [];
                    let propsConditions = props.selectConditions.filter((opt) => !OptionsFilter.includes(opt.field));
                    _pSelectConditions = propsConditions.map(
                        (pselect) =>
                            _allOptions.find((all) => pselect.field === all.field) ?? {
                                key: new Date().getTime(),
                                title: '未知选项',
                                // allOptionsHide: true,
                                width: 150
                            }
                    );
                    conditionRef.current.custom = { ...conditionRef.current.custom, _pSelectConditions };
                }
                searchTypeChange(searchType);
            });
        } else {
            searchTypeChange(searchType);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchType, props.selectConditions]);
    const onChange = (options) => {
        // setSelectOptions(options);
        const _allOptions = conditionRef.current?.custom?._allOptions ?? [];
        selectChangeNotice(options, _allOptions);
    };
    return (
        <section ref={conditionRef} className="alarm-columns-sort-drag-condition">
            <Space direction="vertical">
                <Radio.Group
                    onChange={({ target: { value } }) => {
                        onSearchTypeChange(value);
                    }}
                    value={searchType}
                >
                    <Radio value={0}>默认查询字段</Radio>
                    <Radio value={1}>自定义查询字段</Radio>
                </Radio.Group>
                <ColumnsSortDrag
                    className="alarm-columns-sort-drag-form-2"
                    allOptionsList={allOptions}
                    selectOptionsList={selectOptions}
                    onChange={onChange}
                    allOptionsLabel="所有查询字段"
                    selectOptionsLabel="已选查询字段"
                    columns={[
                        {
                            key: 'name',
                            title: '名称',
                            // allOptionsHide: true,
                            width: 150
                            // editFlag: true,
                        },
                        {
                            key: 'field',
                            title: '字段',
                            width: 150
                            // selectOptionsHide: true,
                        }
                    ]}
                />
            </Space>
        </section>
    );
};
export default Index;
