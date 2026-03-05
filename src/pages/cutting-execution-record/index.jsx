import React, { useState, useRef, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Button, Modal, message, Space, Tooltip, Icon } from 'oss-ui';
// eslint-disable-next-line import/order
import { getTemporaryRoute, exportTemporaryRoute, getProvinceList, deleteTemporaryRoute } from './api';
import useLoginInfoModel from '@Src/hox';
import moment from 'moment';
import { blobDownLoad } from '@Common/utils/download';
import './index.less';
import { useHistory } from 'react-router-dom';
import AddEditModal from './add-edit-modal';
import { setTimeout } from 'core-js';
import AuthButton from '@Pages/components/auth/auth-button';
import { sendLogFn } from '@Pages/components/auth/utils';
import GlobalMessage from '@Src/common/global-message';

// 组件
const CuttingExecutionRecord = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [editType, setEditType] = useState('edit'); // edit:编辑 view:查看 add:新增
    const { userId, userName, provinceId } = useLoginInfoModel();
    const [provinceData, setProvinceData] = useState([]);
    const [currProvince, setCurrProvince] = useState([]);
    const history = useHistory();
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    let isEdit = searchParams.get('edit') === 'false';

    // 重加载
    const tableRef = useRef();
    const reloadTable = () => {
        setTimeout(() => {
            tableRef.current.reload();
        }, 1000);
    };

    // 获取归属省份
    const getProvinceData = async () => {
        const data = {
            creator: userId,
        };
        const res = await getProvinceList(data);
        if (res && Array.isArray(res)) {
            const list = res;
            setProvinceData(list);
            // TODO 服了，bug是因为用三等匹配不到，懒得改了。
            // eslint-disable-next-line eqeqeq
            setCurrProvince(list.find((item) => item.provinceId == provinceId));
        }
    };

    // 获取列表数据
    const getTemporaryRouteList = async () => {
        const data = {
            provinceId: provinceId,
        };
        const res = await getTemporaryRoute(data);
        return res;
    };
    const watchTabActiveChange = () => {
        GlobalMessage.off('activeChanged', null, null);
        GlobalMessage.on('activeChanged', ({ isActive }) => {
            if (isActive) {
                const { search: newSearch } = window.location;
                const newSearchParams = new URLSearchParams(newSearch);
                const newIsEdit = newSearchParams.get('edit') === 'false';
                isEdit = newIsEdit;
                getProvinceData();
                getTemporaryRouteList();
            }
        });
    };

    useEffect(() => {
        watchTabActiveChange();
        getProvinceData();
        getTemporaryRouteList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceId]);

    // 编辑&&查看
    const showUserEditViewClick = (record, type) => {
        if (type === 'edit') {
            sendLogFn({ authKey: 'workbench-Workbench-Shift-CutExecutionRecord-Edit' });
        }
        setEditType(type);
        setIsModalOpen(true);
        setCurrentItem(record);
    };

    // 删除
    const delCurrentUserClick = (record) => {
        Modal.confirm({
            title: `是否确认删除`,
            onOk: async () => {
                await deleteTemporaryRoute({ id: record.id });
                message.success('删除成功');
                reloadTable();
            },
            onCancel() {},
        });
    };

    const formRef = useRef();
    const defaultColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            hideInSearch: true,
            width: 40,
            render: (text, record, index) => {
                return index + 1;
            },
        },
        {
            title: '省份',
            dataIndex: 'provinceName',
            key: 'provinceName',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '干线名称',
            dataIndex: 'mainLineName',
            key: 'mainLineName',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '割接原因',
            dataIndex: 'workShiftReason',
            key: 'workShiftReason',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '系统名称',
            dataIndex: 'systemName',
            key: 'systemName',
            hideInSearch: true,
            align: 'center',
            width: 120,
        },
        {
            title: '割接段落(A-B)',
            dataIndex: 'evaluationCriterion',
            key: 'evaluationCriterion',
            hideInSearch: true,
            align: 'center',
            width: 120,
        },
        {
            title: 'A端接收光功率(dB)',
            children: [
                {
                    title: '割前',
                    dataIndex: 'aBeforeCutting',
                    key: 'aBeforeCutting',
                    hideInSearch: true,
                    align: 'center',
                    width: 120,
                },
                {
                    title: '割后',
                    dataIndex: 'aAfterCutting',
                    key: 'aAfterCutting',
                    hideInSearch: true,
                    align: 'center',
                    width: 120,
                },
            ],
        },
        {
            title: 'B端接收光功率(dB)',
            children: [
                {
                    title: '割前',
                    dataIndex: 'bBeforeCutting',
                    key: 'bBeforeCutting',
                    hideInSearch: true,
                    align: 'center',
                    width: 120,
                },
                {
                    title: '割后',
                    dataIndex: 'bAfterCutting',
                    key: 'bAfterCutting',
                    hideInSearch: true,
                    align: 'center',
                    width: 120,
                },
            ],
        },
        {
            title: '计划割接时间',
            dataIndex: 'planCutTime',
            key: 'planCutTime',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '割接前网络运行情况',
            dataIndex: 'beforeNetRun',
            key: 'beforeNetRun',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '实际开始时间',
            dataIndex: 'cutTaskStartTime',
            key: 'cutTaskStartTime',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '实际结束时间',
            dataIndex: 'cutTaskEndTime',
            key: 'cutTaskEndTime',
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '割接后网络运行情况',
            dataIndex: 'afterNetRun',
            key: 'afterNetRun',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '割接结果',
            dataIndex: 'cutResult',
            key: 'cutResult',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'actions',
            // ellipsis: true,
            search: false,
            align: 'center',
            width: 120,
            fixed: 'right',
            render: (text, row) => [
                <Tooltip title="编辑">
                    {/* <AuthButton
                        key="edit"
                        onClick={() => showUserEditViewClick(row, 'edit')}
                        authKey="cuttingExecutionRecord:edit"
                        type="text"
                        antdIcon
                    >
                        <Icon key="userEdit" antdIcon type="EditOutlined" />
                    </AuthButton> */}
                    <Button key="edit" disabled={isEdit} onClick={() => showUserEditViewClick(row, 'edit')} type="text" antdIcon>
                        <Icon key="userEdit" antdIcon type="EditOutlined" />
                    </Button>
                </Tooltip>,
                <Tooltip title="查看">
                    <Button key="show" onClick={() => showUserEditViewClick(row, 'view')} type="text" antdIcon>
                        <Icon key="userEdit" antdIcon type="SearchOutlined" />
                    </Button>
                </Tooltip>,
                <Tooltip title="删除">
                    {/* <AuthButton
                        key="delete"
                        onClick={() => delCurrentUserClick(row)}
                        authKey="cuttingExecutionRecord:delete"
                        type="text"
                        antdIcon
                        addLog
                    >
                        <Icon key="userDel" antdIcon type="DeleteOutlined" />
                    </AuthButton> */}
                    <AuthButton
                        key="delete"
                        ignoreAuth
                        authKey="workbench-Workbench-Shift-CutExecutionRecord-Delete"
                        onClick={() => delCurrentUserClick(row)}
                        type="text"
                        antdIcon
                        addLog
                        disabled={isEdit}
                    >
                        <Icon key="userDel" antdIcon type="DeleteOutlined" />
                    </AuthButton>
                </Tooltip>,
            ],
        },
    ];
    // 导出
    const handleExport = () => {
        const params = {
            provinceId,
        };
        exportTemporaryRoute(params).then((res) => {
            if (res) {
                blobDownLoad(res, `割接执行记录${moment().format('YYYYMMDDHHmmss')}.xlsx`);
            }
        });
    };

    // 新增
    const handleAdd = () => {
        setEditType('add');
        setCurrentItem(null);
        setIsModalOpen(true);
    };

    // 返回
    const goBack = () => {
        history.goBack();
    };

    // 取消
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="maintain-job-content">
            <div className="maintaiin-job-header">
                <div className="maintaiin-job-header-title oss-ui-page-header-heading-title" style={{ marginLeft: '20px' }}>
                    割接执行记录
                </div>
                {/* <div style={{ marginRight: '20px' }}>
                    <Space>
                        <Button onClick={goBack}>返回</Button>
                    </Space>
                </div> */}
            </div>
            <VirtualTable
                global={window}
                search={false}
                toolBarRender={() => [
                    <AuthButton
                        disabled={isEdit}
                        type="primary"
                        ignoreAuth
                        authKey="workbench-Workbench-Shift-CutExecutionRecord-Add"
                        onClick={handleAdd}
                    >
                        新增
                    </AuthButton>,
                    <AuthButton onClick={handleExport} ignoreAuth authKey="workbench-Workbench-Shift-CutExecutionRecord-Export">
                        导出
                    </AuthButton>,
                ]}
                columns={defaultColumns}
                request={getTemporaryRouteList}
                actionRef={tableRef}
                formRef={formRef}
                scroll={{ x: 'max-content' }}
            />
            {isModalOpen && (
                <AddEditModal
                    editType={editType}
                    isModalOpen={isModalOpen}
                    currentItem={currentItem}
                    provinceData={provinceData}
                    userId={userId}
                    userName={userName}
                    provinceId={provinceId}
                    currProvince={currProvince}
                    handleCancel={handleCancel}
                    reloadTable={reloadTable}
                />
            )}
        </div>
    );
};

export default CuttingExecutionRecord;
