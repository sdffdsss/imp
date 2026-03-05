import React, { useRef, useState, useEffect } from 'react';
import { Modal, Form, message } from 'oss-ui';
import { EditableProTable } from '@ant-design/pro-table';
import SelectCondition from '@Pages/setting/filter/list/comp-select-condition';
import request from '@Common/api';
import { _ } from 'oss-web-toolkits';
import { customAlphabet, nanoid } from 'nanoid';
import './style.less';

const columns = [
    {
        title: '省份',
        dataIndex: 'filterTypeArea',
        valueType: 'select',
        width: '30%',
        renderFormItem: (item, record, form) => {
            return <SelectCondition form={form} title="省份" id="key" label="value" dictName="province_id" searchName="province_id" />;
        },
    },
    {
        title: '类型',
        dataIndex: 'filterTypeName',
        width: '50%',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
    },

    {
        title: '操作',
        valueType: 'option',
        render: () => {
            return null;
        },
    },
];
const TypeManagement = ({ visible, userId }) => {
    const actionRef = useRef();
    const [editableKeys, setEditableRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [form] = Form.useForm();
    const [visibled, setVisibled] = useState(false);
    useEffect(() => {
        if (visible !== 1) {
            setVisibled(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);
    const getTypeData = () => {
        const nanoid = customAlphabet('1234567890', 15);
        request('/alarmmodel/filter/type/v1/filterTypes', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                modelId: 2,
                creator: userId,
            },
        }).then((res) => {
            if (res?.data) {
                const list = res.data.map((item) => {
                    return {
                        ...item,

                        id: nanoid(),
                    };
                });
                setDataSource(list);
                setEditableRowKeys(list.map((item) => item.id));
            }
        });
    };
    useEffect(() => {
        getTypeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const saveChange = () => {
        const list = dataSource.map((item) => _.omit(item, 'id'));
        request('/alarmmodel/filter/type/v1/filterType', {
            type: 'post',
            baseUrlType: 'filterUrl',
            showSuccessMessage: true,
            showErrorMessage: true,
            data: list,
        }).then(() => {
            getTypeData();
            setVisibled(false);
        });
    };
    const delRow = (key, row) => {
        if (row.filterTypeId) {
            request('/alarmmodel/filter/type/v1/filterType', {
                type: 'delete',
                baseUrlType: 'filterUrl',
                showSuccessMessage: true,
                showErrorMessage: true,
                data: {
                    modelId: 2,
                    creator: userId,
                    filterTypeId: row.filterTypeId,
                },
            }).then(() => {
                message.success('删除成功');
                setDataSource(dataSource.filter((item) => item.id !== key));
            });
        } else {
            setDataSource(dataSource.filter((item) => item.id !== key));
        }
    };
    return (
        <Modal title="类型管理" getContainer={false} visible={visibled} onCancel={() => setVisibled(false)} onOk={saveChange}>
            {/* <Button
                type="primary"
                onClick={() => {
                    actionRef.current?.addEditRecord?.({
                        newRecordType: 'dataSource',
                        id: (Math.random() * 1000000).toFixed(0)
                    });
                }}
            >
                新增
            </Button> */}

            <EditableProTable
                className="editable-proTabl-div-type-management"
                rowKey="id"
                actionRef={actionRef}
                size={'small'}
                // 关闭默认的新建按钮
                recordCreatorProps={{
                    position: 'top',
                    newRecordType: 'dataSource',
                    record: () => ({
                        id: nanoid(),
                    }),
                }}
                // recordCreatorProps={false}
                columns={columns}
                value={dataSource}
                onChange={setDataSource}
                search={false}
                editable={{
                    type: 'multiple',
                    form,
                    editableKeys,
                    onChange: (key) => {
                        setEditableRowKeys(key);
                    },
                    onValuesChange: (record, recordList) => {
                        setDataSource(recordList);
                    },
                    actionRender: (row, config, defaultDoms) => {
                        return [defaultDoms.delete];
                    },
                    onDelete: (key, row) => {
                        delRow(key, row);
                    },
                }}
            />
        </Modal>
    );
};
export default TypeManagement;
