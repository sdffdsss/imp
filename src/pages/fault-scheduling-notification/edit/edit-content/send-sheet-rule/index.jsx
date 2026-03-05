import React, { useState, useEffect, useRef } from 'react';
import { Table, Row, Col, Radio, Input, Icon, Button, Modal, Tooltip, Select } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import { useTableSelection } from '@Src/hooks';
import Detail from '@Pages/auto-sheet-rule/edit';
import { Api } from '../../../api';

const rowKey = 'filterId';
export default function Index({ filterProfessional, mode, value, onChange, provinceId }) {
    const { userId, zoneLevelFlags } = useLoginInfoModel();

    const [curValue, setCurValue] = useState(value || { blocRuleIds: [], provinceRuleIds: [] });
    /* eslint-disable no-nested-ternary */
    const [type, setType] = useState(
        provinceId === 0
            ? 'country'
            : value
            ? value.provinceRuleIds.length > 0 || value.blocRuleIds.length === 0
                ? 'province'
                : 'country'
            : 'province',
    );
    /* eslint-enable no-nested-ternary */
    const pickKey = type === 'country' ? 'blocRuleIds' : 'provinceRuleIds';
    const { selectedRows, onSelect, setSelectedRows } = useTableSelection(rowKey, curValue?.[pickKey].map((item) => ({ [rowKey]: item })) || []);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ruleId, setRuleId] = useState(10);
    const keywordRef = useRef('');
    const tableRef = useRef();
    const handleTableScrollFnRef = useRef();
    const getDispatchRuleDataFnRef = useRef();
    const filterProfessionalCacheRef = useRef(filterProfessional);
    const paginationRef = useRef({
        pageSize: 10,
        current: 1,
        total: 0,
    });

    const [detailModalInfo, setDetailModalInfo] = useState({
        filterId: undefined,
        moduleId: undefined,
        title: '',
        visible: false,
    });

    const columns = [
        {
            dataIndex: 'filterName',
            title: '派单规则名称',
            width: 200,
        },
        {
            dataIndex: 'creator',
            title: '创建人',
            width: 180,
        },
        {
            dataIndex: 'createTime',
            title: '创建时间',
            width: 150,
        },
        {
            dataIndex: 'action',
            title: '操作',
            width: 100,
            render: (text, record) => {
                return (
                    <Button style={{ padding: 0 }} type="text" onClick={() => handleModalView(record)}>
                        <Icon antdIcon type="SearchOutlined" />
                    </Button>
                );
            },
        },
    ];

    function resetPagination() {
        paginationRef.current = {
            pageSize: 10,
            current: 1,
            total: 0,
        };
    }

    function handleModalView(record) {
        setDetailModalInfo({
            visible: true,
            filterId: record.filterId,
            title: record.filterName,
        });
    }

    getDispatchRuleDataFnRef.current = async function getDispatchRuleData() {
        setLoading(true);
        console.log('curValue[pickKey]', pickKey, curValue[pickKey]);
        const { data, total } = await Api.getDispatchRule({
            current: paginationRef.current.current,
            pageSize: paginationRef.current.pageSize,
            modelId: 2,
            moduleId: ruleId,
            filterProvince: type === 'country' ? 0 : provinceId,
            filterProfessional,
            creator: userId,
            // ownFlag: 2,
            filterName: keywordRef.current || undefined,
            filterIds: mode === 'read' ? (paginationRef.current.current === 1 && !keywordRef.current ? curValue[pickKey].toString() : '') : undefined,
        });
        paginationRef.current.total = total;

        let formatData = data || [];

        if (curValue[pickKey].length > 0) {
            const uniqueData = [];

            formatData.forEach((item) => {
                if (
                    !uniqueData.find((record) => record.filterId === item.filterId) &&
                    !dataSource.find((record) => record.filterId === item.filterId)
                ) {
                    uniqueData.push(item);
                }
            });
            formatData = uniqueData;
            const newData = [...dataSource, ...formatData];
            if (paginationRef.current) {
                setSelectedRows(newData.filter((item) => curValue[pickKey].includes(item[rowKey])));
            }
        }
        setDataSource((prev) => [...prev, ...formatData]);
        setLoading(false);
    };

    function onSearch() {
        resetPagination();
        setDataSource([]);
        setSelectedRows([]);
        setTimeout(() => {
            getDispatchRuleDataFnRef.current();
        });
    }

    handleTableScrollFnRef.current = function handleTableScroll(event) {
        const { clientHeight, scrollHeight, scrollTop } = event.target;

        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;

        const { pageSize, total, current } = paginationRef.current;

        const hasNextPageFlag = total > current * pageSize;

        if (isBottom && hasNextPageFlag) {
            paginationRef.current.current += 1;

            getDispatchRuleDataFnRef.current();
        }
    };

    // function onSelectionChange(selectedRowKeys) {
    //     const newValue = { ...curValue, [pickKey]: [...new Set(curValue[pickKey].concat(selectedRowKeys))] };
    //     console.log('newValue', newValue);
    //     setCurValue(newValue);
    //     onChange(newValue);
    // }

    function onSelectCustom(record, selected) {
        const newValue = {
            ...curValue,
            [pickKey]: selected ? [...new Set([...curValue[pickKey], record[rowKey]])] : curValue[pickKey].filter((item) => item !== record[rowKey]),
        };
        setCurValue(newValue);
        onChange(newValue);
    }

    // useEffect(() => {
    //     if (zoneLevelFlags.isCountryZone) {
    //         setType('country');
    //     } else {
    //         setType('province');
    //     }
    // }, [zoneLevelFlags]);

    useEffect(() => {
        const scrollDiv = tableRef.current.querySelector('div.oss-ui-table-body');

        const throttleFn = _.throttle(handleTableScrollFnRef.current, 500);

        scrollDiv?.addEventListener('scroll', throttleFn);

        return () => {
            scrollDiv?.removeEventListener('scroll', throttleFn);
        };
    }, []);

    useEffect(() => {
        if (filterProfessionalCacheRef.current !== filterProfessional) {
            filterProfessionalCacheRef.current = filterProfessional;
            setCurValue({ blocRuleIds: [], provinceRuleIds: [] });
        }
    }, [filterProfessional]);

    useEffect(() => {
        resetPagination();
        setDataSource([]);
        setSelectedRows([]);
        if (filterProfessional !== undefined) {
            setTimeout(() => {
                getDispatchRuleDataFnRef.current();
            });
        }
    }, [filterProfessional, setSelectedRows]);

    return (
        <>
            <Row style={{ marginBottom: '16px' }}>
                <Col span={4} style={{ lineHeight: '28px', textAlign: 'right' }}>
                    派单规则：
                </Col>
                {zoneLevelFlags.isCountryZone ? (
                    <Col span={20}>
                        <Select
                            style={{ display: 'inline-block', width: 200, marginRight: 12 }}
                            options={[
                                { label: '故障派单规则', value: 10 },
                                { label: '督办派单规则', value: 605 },
                            ]}
                            value={ruleId}
                            onChange={(val) => {
                                setRuleId(val);
                            }}
                        />
                        <Input.Search
                            style={{ width: 200, marginRight: '10px' }}
                            placeholder="请输入规则名称"
                            onChange={(e) => {
                                keywordRef.current = e.target.value;
                            }}
                            onSearch={onSearch}
                        />
                        <Icon antdIcon type="RedoOutlined" style={{ transform: 'rotate(-90deg)' }} onClick={onSearch} />
                    </Col>
                ) : (
                    <Col span={20}>
                        <Radio.Group
                            value={type}
                            disabled={provinceId === 0}
                            onChange={(e) => {
                                const scrollDiv = tableRef.current.querySelector('div.oss-ui-table-body');
                                scrollDiv.scrollTop = 0;
                                resetPagination();

                                setType(e.target.value);
                                resetPagination();
                                setDataSource([]);
                                setSelectedRows([]);

                                setTimeout(() => {
                                    getDispatchRuleDataFnRef.current();
                                });
                            }}
                        >
                            <Radio value="country" style={{ lineHeight: '28px' }}>
                                集团规则&nbsp;
                                <Tooltip title="针对集团规则派发到本省的故障进行分级调度通知">
                                    <Icon type="QuestionCircleFilled" antdIcon />
                                </Tooltip>
                            </Radio>
                            <Radio value="province">本省规则</Radio>
                        </Radio.Group>
                        <Input.Search
                            style={{ width: 200, marginRight: '10px' }}
                            placeholder="请输入规则名称"
                            onChange={(e) => {
                                keywordRef.current = e.target.value;
                            }}
                            onSearch={onSearch}
                        />
                        <Icon antdIcon type="RedoOutlined" style={{ transform: 'rotate(-90deg)' }} onClick={onSearch} />
                    </Col>
                )}

                <Col offset={4} span={19} style={{ marginTop: 16 }}>
                    <Table
                        ref={tableRef}
                        rowKey={rowKey}
                        rowSelection={{
                            type: 'checkbox',
                            hideSelectAll: true,
                            selectedRowKeys: selectedRows.map((item) => item[rowKey]),
                            onSelect: (record, selected) => {
                                onSelect(record, selected);
                                onSelectCustom(record, selected);
                            },
                            columnWidth: 80,
                            // onChange: onSelectionChange,
                            getCheckboxProps: () => ({
                                disabled: mode === 'read',
                            }),
                        }}
                        loading={loading}
                        size="small"
                        scroll={{ y: '200px' }}
                        columns={columns}
                        style={{ padding: 0 }}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </Col>
            </Row>
            <Modal
                destroyOnClose
                title={detailModalInfo.title}
                width={1200}
                visible={detailModalInfo.visible}
                onCancel={() => {
                    setDetailModalInfo({
                        visible: false,
                    });
                }}
                footer={
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            type="default"
                            onClick={() => {
                                setDetailModalInfo({
                                    visible: false,
                                });
                            }}
                        >
                            取消
                        </Button>
                    </div>
                }
            >
                <Detail
                    mode="read"
                    match={{
                        params: {
                            type: 'edit',
                            moduleId: '10',
                            id: detailModalInfo.filterId,
                            isCheck: true,
                            openSourcePage: 'fault-scheduling-notification',
                        },
                    }}
                />
            </Modal>
        </>
    );
}
