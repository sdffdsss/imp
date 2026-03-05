import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Button, Row, Col, Modal, Select, message } from 'oss-ui';
import { searchAllNeIds, getProvinceData, getRegionList } from '../../utils/api';
import SelectCondition from '../../components/edit-select';
import TableTransfer from '../../transfer-table';
import { _ } from 'oss-web-toolkits';
import produce from 'immer';
import CustomModalFooter from '@Components/custom-modal-footer';
import './index.less';

/**
 * 新增/修改界面
 * @param {true/false} editState 编辑状态  true 编辑  false 新建
 * @param {*} editRow  界面初始值
 * @param {*} enumObj 表单枚举数
 */
const AddNeComp = (props) => {
    /*
     * 新增/修改界面
     * editState 编辑状态  true 编辑  false 新建
     * editRow  界面初始值
     * enumObj 表单枚举数
     */
    const { userInfo, columns } = props;
    const [allOptionsList, setAllOptionsList] = useState([]);
    const [selectOptionsList, setSelectOptionsList] = useState([]);
    const [selectedOptionsRows, setSelectedOptionsRows] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [showColumns, setShowColumns] = useState([]);
    const [totalDataSource, setTotalDataSource] = useState([]);
    const [provinceData, setProvinceData] = useState([]);
    const [regionData, setRegionData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 200,
        total: 0,
        showSizeChanger: false,
        showQuickJumper: false,
    });
    const formRef = useRef();
    const getProvince = async () => {
        const data = await getProvinceData(userInfo?.userId);
        if (data && Array.isArray(data) && data.length > 0) {
            let list = data.map((item) => {
                return {
                    label: item.regionName,
                    value: item.regionId,
                };
            });
            setProvinceData(list);
            formRef?.current?.setFieldsValue({
                province: list[0],
            });
            getRegion(list[0]?.value);
        }
    };
    const getRegion = async (value) => {
        let params = {
            creator: userInfo?.userId,
            parentRegionId: value,
        };
        const data = await getRegionList(params);
        if (data && Array.isArray(data) && data.length > 0) {
            let list = data.map((item) => {
                return {
                    label: item.regionName,
                    value: item.regionName,
                };
            });
            setRegionData(list);
            formRef?.current?.setFieldsValue({
                region_id: list[0]?.value,
            });
        }
    };
    const provinceChanage = (value) => {
        getRegion(value?.value);
    };
    useEffect(() => {
        getProvince();
    }, []);

    useEffect(() => {
        const handleData = columns
            .map((item) => {
                return {
                    ...item,
                    hideInTable: !item.keyFlag,
                };
            })
            .filter((column) => !column.hideInTable);
        setShowColumns(handleData);
    }, [columns]);

    const loadData = async (pageObj) => {
        const pageInfo = pageObj || pagination;
        const searchInfo = (formRef?.current?.getFieldsValue && formRef?.current?.getFieldsValue()) || {};
        const searchParamMap = {};
        const searchLikeParamMap = {};
        Object.keys(searchInfo).forEach((field) => {
            if (!searchInfo[field] && searchInfo[field] !== 0) return;
            if (columns.find((item) => item.dbFieldName === field)?.enumFlag) {
                if (field === 'region_id') {
                    searchParamMap[field] = searchInfo[field].toString();
                } else {
                    searchParamMap[field] = searchInfo[field];
                }
            } else {
                if (field === 'province') {
                    searchParamMap[field] = searchInfo[field].label;
                } else {
                    searchLikeParamMap[field] = searchInfo[field];
                }
            }
        });
        if (0 < searchLikeParamMap?.ne_name?.length && searchLikeParamMap?.ne_name?.length < 2) {
            message.warning('请至少输入2个字搜索');
            return;
        }
        if (!searchInfo.vendor_id) {
            message.warning('请输入网元厂家');
            return;
        }
        setTableLoading(true);

        // if (searchLikeParamMap.ne_name) {
        //     searchParamMap.ne_name = searchLikeParamMap.ne_name;
        //     searchLikeParamMap.ne_name = undefined;
        // }
        const data = {
            userId: userInfo?.userId,
            groupNetWorkType: props.groupNetWorkType,
            searchParamMap: { ...searchParamMap },
            pageSize: pageInfo.pageSize,
            current: pageInfo.current,
            groupType: props.groupType,
            searchLikeParamMap: { ...searchLikeParamMap },
            orderType: 0,
        };
        try {
            const res = await searchAllNeIds(data);
            if (res) {
                setTableLoading(false);
                const handleData =
                    res &&
                    Array.isArray(res.data) &&
                    res.data.map((item) => {
                        return {
                            ...item,
                            key: item.neId,
                        };
                    });
                setAllOptionsList(handleData || []);
                setTotalDataSource(_.uniqBy(totalDataSource.concat(handleData), 'neId'));
                if (Array.isArray(handleData) && handleData.length > 0) {
                    setPagination({
                        ...pagination,
                        current: res.current,
                        pageSize: 200,
                        total: res.total,
                    });
                } else {
                    setPagination({
                        ...pageInfo,
                        total: res.total,
                    });
                }
            }
        } catch (e) {}
    };
    /**
     * @description: 重置查询条件
     * @param {*}
     * @return {*}
     */
    const onReset = () => {
        formRef?.current?.resetFields();
    };

    /**
     * @description: 监听翻页事件
     * @param {*}
     * @return {*}
     */
    const onPageChange = (page, pageSize) => {
        loadData({ ...pagination, current: page, pageSize });
    };

    const onTableTransferChange = (selectRowKeys, selectRows) => {
        const handleKeyList = produce(selectOptionsList, (draft) => {
            selectRows.forEach((item) => {
                if (draft.includes(item.neId)) {
                    _.pull(draft, item.neId);
                } else {
                    draft.push(item.neId);
                }
            });
        });

        const handleRowList = produce(selectedOptionsRows, (draft) => {
            selectRows.forEach((item) => {
                if (_.find(draft, { neId: item.neId })) {
                    _.pull(draft, _.find(draft, { neId: item.neId }));
                } else {
                    draft.push(item);
                }
            });
        });

        setSelectOptionsList(handleKeyList);
        setSelectedOptionsRows(handleRowList);
    };

    /**
     * @description: 确定新增弹窗
     * @param {*}
     * @return {*}
     */
    const handleSave = () => {
        props.onAddNeHandler && props.onAddNeHandler(selectedOptionsRows);
        closeModal();
    };
    /**
     * @description: 关闭弹窗
     * @param {*}
     * @return {*}
     */
    const closeModal = () => {
        props.onCloseModal && props.onCloseModal();
    };
    const defineStr = (item) => {
        if (item.dbFieldName === 'region_id' || item.dbFieldName === 'vendor_id') {
            return 'value';
        }
        return 'key';
    };
    return (
        <Modal
            visible={true}
            centered={true}
            destroyOnClose={true}
            width={900}
            title="添加"
            onCancel={closeModal}
            bodyStyle={{
                maxHeight: 'calc(100vh - 156px)',
            }}
            footer={<CustomModalFooter onCancel={closeModal} onOk={handleSave} />}
        >
            <Form
                name="neCondition"
                ref={formRef}
                labelAlign="right"
                style={{
                    marginBottom: '10px',
                }}
            >
                <Row gutter={24}>
                    {columns
                        .filter((column) => column.searchFlag && column.dbFieldName !== 'region_id')
                        .map((item, index) => {
                            return (
                                <Col span={8} key={item.dbFieldName}>
                                    <Form.Item
                                        name={item.dbFieldName}
                                        label={item.labelName}
                                        required={item.labelName === '网元地市' || item.labelName === '网元类型' || item.labelName === '网元厂家'}
                                    >
                                        {item.enumFlag ? (
                                            <SelectCondition
                                                mode=""
                                                label="value"
                                                id={defineStr(item)}
                                                dictName={item.enumFieldName}
                                                dbFieldName={item.dbFieldName}
                                                selectForm={formRef}
                                                showDefaultValue={item.dbFieldName === 'region_id' || item.dbFieldName === 'ne_type'}
                                            />
                                        ) : (
                                            <Input />
                                        )}
                                    </Form.Item>
                                </Col>
                            );
                        })}
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item name={'province'} label={'网元省份'} required>
                            <Select options={provinceData} onChange={provinceChanage} labelInValue />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name={'region_id'} label={'网元地市'} required>
                            <Select options={regionData} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                loadData();
                            }}
                        >
                            查询
                        </Button>
                        <Button style={{ margin: '0 8px' }} onClick={onReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
            <div className="network-transfer-container">
                <TableTransfer
                    leftColumns={showColumns}
                    rightColumns={showColumns}
                    dataSource={allOptionsList}
                    onTransChange={onTableTransferChange}
                    targetKeys={selectOptionsList}
                    totalDataSource={totalDataSource}
                    tablePagination={pagination}
                    onPageChange={onPageChange}
                    tableLoading={tableLoading}
                    scrollY={window.innerHeight - 400}
                    titles={['待选列表', '已选列表']}
                    listStyle={{
                        width: '350px',
                    }}
                />
            </div>
        </Modal>
    );
};

export default AddNeComp;
