import React from 'react';
import { Icon, Modal, message, Select, Button } from 'oss-ui';
import Edit from './edit';
import DictSelect from '@Components/dict-select';
import UploadComp from './upload';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import { VirtualTable } from 'oss-web-common';
import { useEnvironmentModel } from '@Src/hox';
import { getAlarmAdvice, deleteAlarmAdvice, exportAlarmAdvice, getProvinces } from './api';
import getUrlQuery from '@Common/utils/getUrlQuery';
import './index.less';
import AuthButton from '@Src/components/auth-button';
import { _ } from 'oss-web-toolkits';
import { createFileFlow } from '@Common/utils/download';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editRow: null,
            vendorObj: [],
            deviceCompanysObj: [],
            deviceTypesObj: [],
            provincesList: [],
            alarmProvinceId: '',
            alarmProvincesList: [],
            data: [],
            tableLoading: false,
            selectedRowKeys: [],
            provinceId: '',
            editModalVisible: false,
            importVisible: false,
            importFile: {},
            failUrl: '',
            jumpParams: null,
            modalType: null,
        };
    }

    get provinceNames() {
        const provinceNames = this.state.provincesList.map((p) => p.label);
        return provinceNames.join(',');
    }

    get columns() {
        const { provincesList, alarmProvincesList } = this.state;
        const { login } = this.props;
        const { userInfo = '', userId, systemInfo } = login;

        let userInfos = JSON.parse(userInfo);
        return [
            {
                title: '数据省份',
                dataIndex: 'provinceName',
                width: 100,
                filters: true,
                key: 'provinceName',
                ellipsis: true,
                sorter: true,
                renderFormItem: () => (
                    <Select
                        showSearch
                        options={provincesList.filter((item) =>
                            this.props.login.systemInfo?.currentZone?.zoneId
                                ? `${this.props.login.systemInfo?.currentZone?.zoneId}` === `${item.value}`
                                : true,
                        )}
                        optionFilterProp="label"
                    />
                ),
            },
            {
                title: '告警省份',
                dataIndex: 'alarmProvinceName',
                width: 100,
                filters: true,
                key: 'alarmProvinceName',
                ellipsis: true,
                sorter: true,
                renderFormItem: () => (
                    <Select
                        showSearch
                        allowClear
                        mode="multiple"
                        maxTagCount={2}
                        options={alarmProvincesList}
                        optionFilterProp="label"
                        placeholder="全部"
                    />
                ),
            },
            {
                title: '设备厂家',
                dataIndex: 'vendorName',
                filters: true,
                key: 'vendorName',
                ellipsis: true,
                sorter: true,
                width: 100,
                renderFormItem: () => <DictSelect dictName="vendor_id" id="key" label="value" allowClear placeholder="全部" />,
            },
            {
                title: '专业',
                dataIndex: 'netWorkTopName',
                key: 'netWorkTopName',
                filters: true,
                width: 100,
                sorter: true,
                ellipsis: true,
                renderFormItem: () => <DictSelect dictName="professional_type" id="key" label="value" allowClear placeholder="全部" />,
            },
            {
                title: '设备类型',
                dataIndex: 'objectClassName',
                key: 'objectClassName',
                filters: true,
                ellipsis: true,
                sorter: true,
                width: 100,
                renderFormItem: () => <DictSelect dictName="eqp_object_class" id="key" label="value" allowClear placeholder="全部" />,
            },
            {
                title: '告警标题',
                key: 'alarmTitle',
                dataIndex: 'alarmTitle',
                ellipsis: true,
                sorter: true,
            },
            {
                title: '告警处理建议',
                dataIndex: 'alarmAdvice',
                key: 'alarmAdvice',
                hideInSearch: true,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '创建人',
                dataIndex: 'createUserName',
                key: 'createUserName',
                hideInSearch: true,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                hideInSearch: true,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '修改人',
                dataIndex: 'updateUserName',
                key: 'updateUserName',
                hideInSearch: true,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '修改时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                hideInSearch: true,
                ellipsis: true,
                sorter: true,
            },
            {
                title: '操作',
                valueType: 'option',
                dataIndex: 'id',
                hideInSearch: true,
                fixed: 'right',
                width: 80,
                render: (text, row) => [
                    (userId === row.createUserId || userInfos.isAdmin) && (
                        <Button key="show" onClick={() => this.showEditModal(row, 'view')} type="text" antdIcon style={{ padding: 0 }}>
                            <Icon key="userEdit" antdIcon type="SearchOutlined" />
                        </Button>
                    ),
                    (userId === row.createUserId || userInfos.isAdmin) && (
                        <AuthButton
                            key="edit"
                            onClick={this.showEditModal.bind(this, row, 'edit')}
                            type="text"
                            style={{ padding: 0 }}
                            authKey="experiencesManage:edit"
                        >
                            <Icon antdIcon key="edit" type="FormOutlined" />
                        </AuthButton>
                    ),
                    (userId === row.createUserId || userInfos.isAdmin) && (
                        <AuthButton
                            key="delete"
                            addLog={true}
                            onClick={this.deleteExperiences.bind(this, row)}
                            type="text"
                            style={{ padding: 0 }}
                            authKey="experiencesManage:delete"
                        >
                            <Icon antdIcon key="delete" type="DeleteOutlined" />
                        </AuthButton>
                    ),
                ],
            },
        ];
    }

    formRef = React.createRef();
    actionRef = React.createRef();

    componentDidMount() {
        this.initData();
    }

    /**
     * @description: 获取告警经验库列表数据
     * @param params
     * @return n*o
     */

    getTableData = async (params, sorter) => {
        const formValues = this.formRef.current.getFieldsValue();
        const { netWorkTopName = '', objectClassName = '', vendorName = '', alarmTitle = '', provinceName = '', alarmProvinceName = '' } = formValues;
        if (!provinceName) {
            return {
                success: true,
                total: 0,
                data: [],
            };
        }

        const { pageSize, current } = params;
        let data = {
            provinceId: provinceName,
            alarmProvinceId: Array.isArray(alarmProvinceName) ? alarmProvinceName.join(',') : alarmProvinceName,
            vendorId: vendorName,
            netWorkTop: netWorkTopName,
            objectClass: objectClassName,
            alarmTitle,
            pageSize,
            pageNum: current,
        };
        let orderType = '';
        let orderFieldName = '';
        if (!_.isEmpty(sorter)) {
            orderType = Object.values(sorter)?.toString();
            if (orderType === 'ascend') {
                orderType = 'asc';
            } else {
                orderType = 'desc';
            }
            orderFieldName = this.sorterFieldMate(Object.keys(sorter)?.toString());
            data = { ...data, orderFieldName, orderType };
        }
        try {
            const result = await getAlarmAdvice(data);
            return {
                success: true,
                total: result?.page?.totalElements || 0,
                data: result?.resourceList || [],
            };
        } catch (e) {
            return {
                success: true,
                total: 0,
                data: [],
            };
        }
    };

    /**
     * @description: 排序字段匹配
     */

    sorterFieldMate = (value) => {
        let orderFieldName = '';
        if (value === 'provinceName') {
            orderFieldName = 'province_id';
        }
        if (value === 'alarmProvinceName') {
            orderFieldName = 'alarm_province_id';
        }
        if (value === 'vendorName') {
            orderFieldName = 'vendor_id';
        }
        if (value === 'netWorkTopName') {
            orderFieldName = 'net_work_top';
        }
        if (value === 'objectClassName') {
            orderFieldName = 'object_class';
        }
        if (value === 'alarmTitle') {
            orderFieldName = 'alarm_title';
        }
        if (value === 'alarmAdvice') {
            orderFieldName = 'alarm_advice';
        }
        return orderFieldName;
    };

    /**
     * @description: 页面初始化获取数据
     * @param n*o
     * @return n*o
     */

    initData = async () => {
        const { systemInfo, mgmtZones } = this.props.login;
        // 获取url参数
        const query = getUrlQuery();

        const { alarmTitle, netWorkTop, objectClass, vendorId, provinceId, alarmAdvice, id } = query;
        let provincesList = [];
        try {
            const data = {
                creator: this.props.login.userId,
            };
            const result = await getProvinces(data);
            if (Array.isArray(result)) {
                provincesList = result.map((item) => ({
                    label: item.regionName,
                    value: item.regionId,
                }));
            }
            const currentZone = systemInfo?.currentZone;
            let alarmProvincesList = [];
            let alarmProvinceId;
            let handleProvinceId = provinceId;
            if (!provinceId && provincesList.length > 0) {
                handleProvinceId = provincesList[0]?.value;
            }
            if (currentZone?.zoneId) {
                handleProvinceId = currentZone.zoneId;
            }
            if (currentZone?.zoneLevel === '1') {
                // 集团
                alarmProvincesList = mgmtZones?.map((item) => ({ value: item.zoneId, label: item.zoneName }));
            } else if (currentZone?.zoneLevel === '5') {
                // 大区
                alarmProvincesList = mgmtZones
                    ?.filter((item) => item.parentZoneId === currentZone?.zoneId || item.zoneId === currentZone?.zoneId)
                    .map((item) => ({ value: item.zoneId, label: item.zoneName }));
            } else {
                // 省份
                alarmProvincesList = provincesList;
                alarmProvinceId = handleProvinceId;
            }
            // this.formRef.current?.setFieldsValue({ alarmProvinceName: handleProvinceId });
            this.formRef.current?.setFieldsValue({ provinceName: handleProvinceId });
            this.setState(
                {
                    provincesList,
                    provinceId: handleProvinceId,
                    alarmProvincesList,
                    alarmProvinceId,
                },
                () => {
                    let decodeAlarmTitle = 'undefined';
                    if (alarmTitle) {
                        decodeAlarmTitle = decodeURI(alarmTitle);
                    }
                    let decodeAlarmAdvice = 'undefined';
                    if (alarmAdvice) {
                        decodeAlarmAdvice = decodeURI(alarmAdvice);
                    }
                    if (alarmTitle || netWorkTop || objectClass || vendorId || provinceId || alarmAdvice || id) {
                        this.setState({
                            editModalVisible: true,
                            jumpParams: {
                                alarmTitle: decodeAlarmTitle === 'undefined' ? null : decodeAlarmTitle,
                                netWorkTop: netWorkTop === 'undefined' ? null : netWorkTop,
                                objectClass: objectClass === 'undefined' ? null : objectClass,
                                // url拼接得provinceId为告警省份
                                alarmProvinceId: provinceId === 'undefined' ? null : provinceId,
                                provinceId: handleProvinceId,
                                vendorId: vendorId === 'undefined' ? null : vendorId,
                                alarmAdvice: decodeAlarmAdvice === 'undefined' ? null : decodeAlarmAdvice.replace(/_-_/g, '\n'),
                                id: id === 'undefined' || id === '' ? null : id,
                            },
                        });
                    }
                },
            );
            this.actionRef.current.reload();
            // eslint-disable-next-line no-empty
        } catch (e) {}
    };

    /**
     * @description: 打开编辑弹窗
     * @param
     * @return
     */

    showEditModal = (editRow, type) => {
        const provinceId = this.formRef.current?.getFieldValue('provinceName');
        if (!provinceId) {
            message.error('请选择省份');
            return;
        }
        this.setState({
            editModalVisible: true,
            modalType: type,
            editRow,
            provinceId,
        });
    };

    /**
     * @description: 关闭编辑弹窗
     * @param
     * @return
     */

    handleCancel = () => {
        this.setState({
            editModalVisible: false,
            modalType: null,
            editRow: null,
            jumpParams: null,
        });
    };

    /**
     * @description: 删除
     * @param
     * @return
     */

    deleteExperiences = (row, params) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '此操作将永久删除选中项，是否继续？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            width: '350px',
            onOk: async () => {
                const res = await deleteAlarmAdvice(row.id, params);
                if (res.code === 200) {
                    message.success('删除成功');
                } else {
                    message.error('删除失败');
                }
                this.actionRef.current.reload();
            },
        });
    };

    /**
     * @description: 导出
     * @param
     * @return
     */

    onExport = async () => {
        const { selectedRowKeys } = this.state;
        if (Array.isArray(selectedRowKeys) && selectedRowKeys.length === 0) {
            message.warning('请选择导出项');
            return;
        }
        const data = {
            id: selectedRowKeys.join(','),
        };
        const res = await exportAlarmAdvice(data);
        if (res.code === 200) {
            message.success('导出成功');
            this.download(res?.data?.fileUrl);
        } else {
            message.error('导出失败');
        }
        this.setState({ selectedRowKeys: [] });
    };

    /**
     * @description: 打开上传弹窗
     * @param n*o
     * @return n*o
     */

    showImportModal = () => {
        this.setState({
            importVisible: true,
        });
    };

    /**
     * @description: 关闭上传弹窗
     * @param n*o
     * @return n*o
     */

    closeImportModal = () => {
        this.setState({
            importVisible: false,
        });
    };

    /**
     * @description: 上传成功回调
     * @param n*o
     * @return n*o
     */

    onImportSuccess = () => {
        this.actionRef.current.reload();
    };

    /**
     * @description: 添加、编辑成功回调
     * @param n*o
     * @return n*o
     */

    okCallback = () => {
        this.actionRef.current.reload();
        this.setState({
            editModalVisible: false,
            jumpParams: null,
            editRow: null,
        });
    };

    /**
     * @description: 重置表单查询项
     * @param n*o
     * @return n*o
     */

    resetTable = () => {
        // const { systemInfo } = this.props.login;
        // const { provincesList } = this.state;

        this.formRef.current.setFieldsValue({
            alarmProvinceName: [],
            vendorName: null,
            netWorkTopName: null,
            objectClassName: null,
            alarmTitle: null,
            // provinceName: provinceId
        });
        this.actionRef.current.reload();
    };

    /**
     * @description: 下载链接
     * @param n*o
     * @return n*o
     */

    download = (url) => {
        createFileFlow(url, useEnvironmentModel.data.environment.experienceUrl.direct + url);
    };

    render() {
        const {
            editRow,
            importVisible,
            selectedRowKeys,
            provincesList,
            provinceId,
            editModalVisible,
            jumpParams,
            alarmProvinceId,
            alarmProvincesList,
            modalType,
        } = this.state;
        const xWidth = this.columns.reduce((total, item) => {
            if (item.width) {
                return total + item.width;
            }
            return total;
        }, 0);
        return (
            <div className="experiences-wrapper">
                <VirtualTable
                    x={xWidth}
                    global={window}
                    columns={this.columns}
                    actionRef={this.actionRef}
                    formRef={this.formRef}
                    request={this.getTableData}
                    rowSelection={{
                        fixed: true,
                        type: 'checkbox',
                        selectedRowKeys,
                        onChange: (rowKeys) => this.setState({ selectedRowKeys: rowKeys }),
                    }}
                    rowKey="id"
                    bordered
                    dateFormatter="string"
                    search={{
                        span: { xs: 24, sm: 6, md: 6, lg: 6, xl: 4, xxl: 4 },
                        optionRender: (searchConfig, formProps, dom) => [
                            <Button key="reset" onClick={this.resetTable}>
                                重置
                            </Button>,
                            ...dom.slice(1, 2),
                        ],
                    }}
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    options={{ reload: true, setting: true, fullScreen: false }}
                    toolBarRender={() => [
                        <AuthButton onClick={this.showEditModal.bind(this, null, 'add')} key="add" authKey="experiencesManage:add">
                            <Icon antdIcon type="PlusOutlined" />
                            新建
                        </AuthButton>,
                        <AuthButton onClick={this.showImportModal} key="import" authKey="experiencesManage:batchImport">
                            <Icon antdIcon type="ImportOutlined" />
                            批量导入
                        </AuthButton>,
                        <AuthButton authKey="experiencesManage:batchExport" onClick={this.onExport} key="export">
                            <Icon antdIcon type="ExportOutlined" />
                            批量导出
                        </AuthButton>,
                    ]}
                />
                {editModalVisible && (
                    <Edit
                        editRow={editRow}
                        provinceId={provinceId}
                        jumpParams={jumpParams}
                        login={this.props.login}
                        provincesList={provincesList}
                        alarmProvincesList={alarmProvincesList}
                        alarmProvinceId={alarmProvinceId}
                        handleCancel={this.handleCancel}
                        okCallback={this.okCallback}
                        modalType={modalType}
                        editModalVisible={editModalVisible}
                    />
                )}
                {importVisible && (
                    <UploadComp
                        onColseUploadModal={this.closeImportModal}
                        provincesList={provincesList}
                        onImportSuccess={this.onImportSuccess}
                        onDownload={this.download}
                    />
                )}
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(Index);
