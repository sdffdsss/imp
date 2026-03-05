import React from 'react';
import { Radio, Icon, Input, Modal, Tooltip, Button, message, Space, Row, Col, Select, Form } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import PageContainer from '@Components/page-container';
import Edit from './edit';
import Search from './search';
import DelInfo from './delInfo';
import './index.less';
import { _ } from 'oss-web-toolkits';
import { withModel } from 'hox';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';

import request from '@Src/common/api';
import AuthButton from '@Src/components/auth-button';

/**
 * 状态标识管理视图
 */
const superAdmin = '0';
const isUnicom = useEnvironmentModel?.data?.environment?.version === 'unicom';
class StatusManager extends React.PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            title: '状态标识管理',
            value: 1,
            editVisible: false,
            searchVisible: false,
            filterInfo: null,
            delVisible: false,
            delInfo: [],
            delRow: null,
            searchKey: '',
            provinceData: [],
            regionId: undefined,
            professionData: [],
            professionType: [],
            provinceList: [],
            params: {},
            columns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                    width: 50,
                    hideInSearch: true,
                    ellipsis: true,
                },
                {
                    title: '模板名称',
                    key: 'templateName',
                    dataIndex: 'templateName',
                    // ellipsis: true,
                    width: 180,
                    sorter: true,
                    render: (text, row) => {
                        return (
                            <div
                                onClick={this.searchExperiences.bind(this, row)}
                                title={text}
                                style={{
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    ellipsis: true,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: '#1677ff',
                                }}
                            >
                                {text}
                            </div>
                        );
                    },
                },
                {
                    title: '归属省份',
                    dataIndex: 'statusProvinceLabel',
                    key: 'statusProvinceLabel',
                    hideInTable: !isUnicom,
                    hideInSearch: true,
                    ellipsis: true,
                    width: 180,
                    sorter: false,
                },
                {
                    title: '归属专业',
                    dataIndex: 'statusProfessionalLabel',
                    key: 'statusProfessionalLabel',
                    hideInTable: !isUnicom,
                    hideInSearch: true,
                    ellipsis: true,
                    width: 100,
                    sorter: false,
                },
                {
                    title: '描述',
                    dataIndex: 'description',
                    key: 'description',
                    hideInSearch: true,
                    ellipsis: true,
                    width: 180,
                    sorter: false,
                },
                {
                    title: '监控视图引用',
                    dataIndex: 'monitorViewReference',
                    key: 'monitorViewReference',
                    // ellipsis: true,
                    width: 100,
                    render: (text, row) => {
                        return (
                            <Tooltip
                                placement="topLeft"
                                title={row.viewInfoList
                                    .map((viewInfo) => {
                                        return viewInfo.windowName;
                                    })
                                    .join('，')}
                                arrowPointAtCenter
                                overlayStyle={row.viewInfoList.length > 50 ? { maxHeight: '300px', overflow: 'auto' } : ''}
                            >
                                <div className="col-tem-td-div" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {row.viewInfoList.length === 0
                                        ? '-'
                                        : row.viewInfoList
                                              .map((viewInfo) => {
                                                  return viewInfo.windowName;
                                              })
                                              .join('，')}
                                </div>
                            </Tooltip>
                        );
                    },
                },
                {
                    title: '创建人',
                    dataIndex: 'userName',
                    key: 'userName',
                    hideInSearch: true,
                    ellipsis: true,
                    width: 80,
                    sorter: false,
                },
                {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    key: 'createTime',
                    hideInSearch: true,
                    ellipsis: true,
                    width: 160,
                    sorter: true,
                },
                {
                    title: '修改时间',
                    dataIndex: 'modifyTime',
                    key: 'modifyTime',
                    hideInSearch: true,
                    ellipsis: true,
                    width: 160,
                    sorter: true,
                },
                {
                    title: '操作',
                    valueType: 'option',
                    dataIndex: 'id',
                    hideInSearch: true,
                    fixed: 'right',
                    render: (text, row) => [
                        <Space key="operator">
                            {(_.get(row, 'ownerId', '').toString() === _.get(this, 'props.login.userId', '').toString() ||
                                (_.get(this, 'state.userInfo.isAdmin') && _.get(this, 'props.login.userId', '').toString() === superAdmin) ||
                                (_.get(this, 'state.userInfo.isAdmin') &&
                                    _.get(this, 'props.login.userId', '').toString() !== superAdmin &&
                                    row.templateId !== 0)) && (
                                <Tooltip title="编辑">
                                    <AuthButton
                                        key="1"
                                        onClick={this.showEditModal.bind(this, row)}
                                        authKey="alarmStatusIcon:edit"
                                        type="text"
                                        style={{ padding: 0 }}
                                    >
                                        <Icon antdIcon={true} type="EditOutlined" />
                                    </AuthButton>
                                </Tooltip>
                            )}
                            <Tooltip title="查看">
                                <Icon key="3" antdIcon={true} type="SearchOutlined" onClick={this.searchExperiences.bind(this, row)} />
                            </Tooltip>
                            {(_.get(row, 'ownerId', '').toString() === _.get(this, 'props.login.userId', '').toString() ||
                                (_.get(this, 'state.userInfo.isAdmin') && _.get(this, 'props.login.userId', '').toString() === superAdmin) ||
                                (_.get(this, 'state.userInfo.isAdmin') &&
                                    _.get(this, 'props.login.userId', '').toString() !== superAdmin &&
                                    row.templateId !== 0)) &&
                                row.templateId !== 0 && (
                                    <Tooltip Tooltip title="删除">
                                        <AuthButton
                                            key="2"
                                            onClick={this.deleteConfirm.bind(this, row)}
                                            authKey="alarmStatusIcon:delete"
                                            type="text"
                                            addLog={true}
                                            style={{ padding: 0 }}
                                        >
                                            <Icon antdIcon={true} type="DeleteOutlined" />
                                        </AuthButton>
                                    </Tooltip>
                                )}
                        </Space>,
                    ],
                },
            ],
            data: [],
            allData: [],
            authKey: null,
        };
    }

    componentDidMount() {
        const userInFo = JSON.parse(this.props.login.userInfo);
        const { systemInfo } = this.props.login;
        // const zoneInfo = userInFo?.zones;
        const userInfo = {
            // userProvinceId:
            //     zoneInfo && zoneInfo[0]?.zoneLevel && (parseInt(zoneInfo[0].zoneLevel, 10) === 1 ? zoneInfo[0]?.zoneId : zoneInfo[0].zoneLevel_2Id),
            // groupUser: zoneInfo && zoneInfo[0]?.zoneLevel ? parseInt(zoneInfo[0].zoneLevel, 10) === 1 : false,
            // userId: this.props.login.userId,
            // userName: this.props.login.userName,
            // userProvinceName: zoneInfo && zoneInfo[0]?.zoneName,
            // userMobile: userInFo.userMobile
            isAdmin: userInFo.isAdmin,
        };
        let regionId = this.getInitialProvince(systemInfo?.currentZone?.zoneId, this.props.login.userInfo);
        // let regionId = undefined;
        // if (systemInfo?.currentZone?.zoneId) {
        //     regionId = [systemInfo.currentZone.zoneId];
        // }
        this.setState(
            {
                userInfo,
                regionId,
            },
            () => {
                if (isUnicom) {
                    this.getProvinceData();
                    this.getprofession();
                }
            },
        );
    }

    getInitialProvince = (province, userInfo) => {
        const info = userInfo && JSON.parse(userInfo);
        let initialProvince = info.zones[0]?.zoneId;
        if (province) {
            return (initialProvince = province);
        }
        if (info.zones[0]?.zoneLevel === '3') {
            initialProvince = info.zones[0]?.parentZoneId;
        }
        return initialProvince;
    };

    /**
     * 显示新增、修改弹窗
     */
    showEditModal = (row) => {
        // console.log('测试日志，传参row', row);
        const userInFo = JSON.parse(this.props.login.userInfo);
        const zoneInfo = userInFo?.zones;
        this.setState({
            editVisible: true,
            authKey: row ? 'alarmStatusIcon:edit' : 'alarmStatusIcon:add',
            filterInfo: (row && {
                ...row,
                templateName: row.templateName || '',
                description: row.description || '',
                statusProvince: row.statusProvince || '',
            }) || {
                isCreate: true,
                templateName: '',
                description: '',
                statusProvince: zoneInfo && zoneInfo[0]?.zoneLevel === '1' ? '' : zoneInfo && zoneInfo[0]?.zoneLevel_2Id,
            },
        });
    };

    /**
     * 删除确认
     */
    deleteConfirm = (row, params) => {
        const { userId } = this.props.login;
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '此操作将永久删除选中项，是否继续？',
            okText: '确认',
            okType: 'danger',
            prefixCls: 'oss-ui-modal',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelText: '取消',
            width: '350px',
            onOk: () => {
                request('v1/template/status-icon', {
                    type: 'delete',
                    baseUrlType: 'monitorSetUrl',
                    data: { templateIds: String(row.templateId), ownerId: Number(userId) },
                    // 是否需要显示失败消息提醒
                    showErrorMessage: true,
                    handlers: {
                        params,
                    },
                }).then((res) => {
                    if (res.code === 0 && res.data.referenceViews.length === 0) {
                        message.success('删除成功');
                        if (_.get(this, 'myRef.current.reloadAndRest')) {
                            this.myRef.current.reloadAndRest();
                        }
                    } else if (res.code === 0 && res.data.referenceViews.length > 0) {
                        message.warning(
                            `该状态模板被监控视图：【${res.data.referenceViews
                                .map((item) => item.WINDOW_NAME)
                                .join('】【')}】所引用，请检查后再操作！`,
                        );
                    } else {
                        message.error('删除失败');
                    }
                });
            },
        });
    };

    delChange = () => {
        this.setState({
            delVisible: false,
            delInfo: [],
            delRow: null,
        });
    };
    /**
     * 显示查看弹窗
     */
    searchExperiences = (row) => {
        this.setState({
            searchVisible: true,
            statusValue: row.statusValue,
        });
    };

    /**
     * 点击搜索逻辑
     */
    onSearch = () => {
        this.tableResetAndReload();
    };

    /**
     * 点击模板选择按钮逻辑
     */
    onChange = (e) => {
        this.setState({
            value: e.target.value,
            searchKey: '',
            searchProvince: '',
            searchProfessional: '',
        });
        this.tableResetAndReload();
    };

    /**
     * 点击弹窗后返回的通知事件
     */
    onSearchChange = () => {
        this.setState({
            searchVisible: false,
            statusValue: null,
        });
    };
    /**
     * 点击弹窗后返回的通知事件
     */
    onEditChange = (confirm) => {
        if (confirm) {
            this.setState({ editVisible: false }, () => {
                this.tableResetAndReload();
            });
        } else {
            this.setState({ editVisible: false });
        }
    };

    getTableData = (params, sorter) => {
        const {
            login: { userId },
        } = this.props;
        const { searchKey, value, regionId, professionType, professionData } = this.state;
        const { current, pageSize } = params;
        let orderType = '';
        let orderFieldName = '';
        if (!_.isEmpty(sorter)) {
            orderType = Object.values(sorter).toString();
            if (orderType === 'ascend') {
                orderType = 'asc';
            } else {
                orderType = 'desc';
            }
            orderFieldName = Object.keys(sorter).toString();
        }
        let professionList = [];
        if (professionType.length === 0) {
            professionData.map((item) => {
                return professionList.push(item.key);
            });
        } else {
            professionList = professionType;
        }
        const queryParam = {
            current,
            pageSize,
            showType: value,
            userId,
            templateName: searchKey,
            //statusProvince: regionId?.join(','),
            statusProvince: regionId,
            statusProfessional: professionType?.join(','),
            orderFieldName,
        };
        return request('v1/template/status-icon', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (!_.isEmpty(res.data)) {
                this.setState({
                    allData: res.data,
                });
                return {
                    data: res.data.map((item, index) => ({ ...item, index: index + 1 + (current - 1) * pageSize })),
                    success: true,
                    total: res.total,
                };
            }
            return {
                data: [],
                success: true,
                total: 0,
            };
        });
    };

    onInputChange = (e) => {
        this.setState({
            searchKey: e.target.value,
        });
    };

    tableResetAndReload = () => {
        if (_.get(this, 'myRef.current')) {
            this.myRef.current.reset();
            this.myRef.current.reload();
        }
    };

    // 获取归属省份
    getProvinceData = () => {
        const {
            login: { userId },
        } = this.props;
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userId,
            },
        }).then((res) => {
            if (res && Array.isArray(res)) {
                const list = res;
                // list.unshift({ regionId: '', regionName: '全部' });
                this.setState({
                    provinceData: list,
                });
            }
        });
    };
    handleProvinceChange = (e) => {
        // const { regionId } = this.state;
        // if (regionId?.toString() === '' && e.toString() !== '') {
        //     this.setState({
        //         regionId: e.filter((item) => item !== ''),
        //     });
        //     return;
        // }
        // if (e.find((item) => item === '') === '') {
        //     this.setState({
        //         regionId: [''],
        //     });
        //     return;
        // }
        this.setState({
            regionId: e,
        });
    };
    // 获取归属专业
    getprofession = () => {
        const {
            login: { userId },
        } = this.props;
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize: 100,
                dictName: 'professional_type',
                en: false,
                modelId: 2,
                creator: userId,
            },
        }).then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                const list = res.data;
                //list.unshift({ key: '', value: '全部' });
                this.setState({
                    professionData: list,
                });
            }
        });
    };
    handleProfessionType = (e) => {
        const { professionType } = this.state;
        if (professionType.toString() === '' && e.toString() !== '') {
            this.setState({
                professionType: e.filter((item) => item !== ''),
            });
            return;
        }
        if (e.find((item) => item === '') === '') {
            this.setState({
                professionType: [''],
            });
            return;
        }
        this.setState({
            professionType: e,
        });
    };

    /**
     * 点击快速查询栏重置逻辑
     */
    resetClick = () => {
        this.setState(
            {
                searchKey: '',
                // regionId: '',
                professionType: [''],
            },
            () => {
                this.tableResetAndReload();
            },
        );
    };

    /**
     * 点击快速查询栏搜索逻辑
     */
    onSearchClick = () => {
        this.tableResetAndReload();
    };

    render() {
        const {
            columns,
            editVisible,
            searchVisible,
            filterInfo,
            title,
            delVisible,
            delInfo,
            delRow,
            // data,
            // value,
            params,
            provinceData,
            regionId,
            professionType,
            professionData,
            searchKey,
            statusValue,
            authKey,
        } = this.state;
        // console.log('测试日志', columns, data, editVisible, searchVisible, filterInfo);
        const {
            ifTitle = true,
            login: { userId, container, systemInfo },
        } = this.props;
        const headerTitle = (
            <Form name="basic">
                <Row gutter={16} wrap={false}>
                    <Col span={5} style={{ display: 'inline' }}>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Radio.Group onChange={this.onChange} value={this.state.value}>
                                <Radio value={1}>全部模板</Radio>
                                <Radio value={0}>我的模板</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="模板名称" style={{ marginBottom: 0 }}>
                            <Input
                                placeholder="请输入模板名称"
                                value={searchKey}
                                onChange={this.onInputChange}
                                onPressEnter={this.onSearch.bind(this)}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    {isUnicom && (
                        <Col span={5}>
                            <Form.Item label="归属省份" style={{ marginBottom: 0 }}>
                                <Select
                                    onChange={this.handleProvinceChange}
                                    style={{ width: '120px' }}
                                    value={regionId}
                                    //mode="multiple"
                                    //maxTagCount={1}
                                    placeholder="请选择省份"
                                    filterOption={(item, itm) => {
                                        return itm.children?.includes(item);
                                    }}
                                >
                                    {provinceData
                                        .filter((item) =>
                                            systemInfo?.currentZone?.zoneId ? systemInfo?.currentZone?.zoneId === item.regionId : true,
                                        )
                                        .map((item) => (
                                            <Select.Option key={item.regionId} value={item.regionId}>
                                                {item.regionName}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                    {isUnicom && (
                        <Col span={5}>
                            <Form.Item
                                label="归属专业"
                                // name="windowType"
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    onChange={this.handleProfessionType}
                                    style={{ width: '120px' }}
                                    value={professionType}
                                    mode="multiple"
                                    placeholder="全部"
                                    maxTagCount={1}
                                    filterOption={(item, itm) => {
                                        return itm.children?.includes(item);
                                    }}
                                >
                                    {professionData.map((item) => (
                                        <Select.Option key={item.key} value={item.key}>
                                            {item.value}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    )}
                    <Col span={3}>
                        <Form.Item name="ownerType" style={{ marginBottom: 0 }}>
                            <Space>
                                <Button type="default" onClick={this.resetClick.bind(this, null)}>
                                    重置
                                </Button>
                                <Button type="primary" onClick={this.onSearchClick.bind(this, null)} htmlType="submit">
                                    查询
                                </Button>
                                <AuthButton onClick={this.showEditModal.bind(this, null)} authKey="alarmStatusIcon:add">
                                    <Icon antdIcon type="PlusOutlined" />
                                    新建
                                </AuthButton>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );

        return (
            <PageContainer showHeader={false} title={ifTitle ? title : ''}>
                <div className="status-manager-content">
                    <VirtualTable
                        global={window}
                        actionRef={this.myRef}
                        columns={columns}
                        size="small"
                        params={params}
                        request={this.getTableData}
                        rowKey="templateId"
                        dateFormatter="string"
                        search={false}
                        rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                        bordered
                        options={{ reload: true, setting: true, fullScreen: false }}
                        headerTitle={headerTitle}
                        // toolBarRender={() => [
                        //     <Space className="status-manager-select-style">
                        //         <Row style={{ width: '800px' }}>
                        //             <Col span={2} style={{ textAlign: 'center', lineHeight: '28px' }}>
                        //                 模板名称:
                        //             </Col>
                        //             <Col span={4}>
                        //                 <Input
                        //                     allowClear
                        //                     placeholder="请输入模板名称"
                        //                     value={searchKey}
                        //                     onChange={this.onInputChange}
                        //                     onPressEnter={this.onSearch.bind(this)}
                        //                     // onSearch={this.onSearch}
                        //                 />
                        //             </Col>
                        //             <Col span={2} style={{ textAlign: 'center', lineHeight: '28px' }}>
                        //                 归属省份:
                        //             </Col>
                        //             <Col span={4}>
                        //                 <SelectCondition
                        //                     mode="multiple"
                        //                     title="归属省份"
                        //                     id="key"
                        //                     label="value"
                        //                     dictName="province_id"
                        //                     searchName="province_id"
                        //                     onChange={this.onProvinceChange}
                        //                     addOptions={[
                        //                         {
                        //                             value: '',
                        //                             label: '全部',
                        //                         },
                        //                     ]}
                        //                 />
                        //             </Col>
                        //             <Col span={2} style={{ textAlign: 'center', lineHeight: '28px' }}>
                        //                 模板专业:
                        //             </Col>
                        //             <Col span={4}>
                        //                 <SelectCondition
                        //                     mode="multiple"
                        //                     title={'归属专业'}
                        //                     id="key"
                        //                     label="value"
                        //                     dictName={'professional_type'}
                        //                     searchName={'professional_type'}
                        //                     onChange={this.onProfessionalChange}
                        //                     addOptions={[
                        //                         {
                        //                             value: '',
                        //                             label: '全部',
                        //                         },
                        //                     ]}
                        //                 />
                        //             </Col>
                        //             <Col span={6}>
                        //                 <Button onClick={() => this.handleReset()} style={{ marginLeft: 10 }}>
                        //                     重置
                        //                 </Button>
                        //                 <Button type="primary" onClick={() => this.onSearch()} style={{ marginLeft: 10 }}>
                        //                     查询
                        //                 </Button>

                        //             </Col>
                        //         </Row>
                        //     </Space>,
                        // ]}
                    />
                    {delVisible && (
                        <DelInfo
                            delRow={delRow}
                            visible={delVisible}
                            delInfo={delInfo}
                            confirmDelete={this.deleteConfirm}
                            onChange={this.delChange}
                        />
                    )}
                    {editVisible && (
                        <Edit
                            visible={editVisible}
                            filterInfo={filterInfo}
                            ownerId={userId || -1}
                            container={container}
                            systemInfo={systemInfo}
                            onChange={this.onEditChange}
                            authKey={authKey}
                        />
                    )}
                    {searchVisible && <Search visible={searchVisible} statusValue={statusValue} onChange={this.onSearchChange.bind(this)} />}
                </div>
            </PageContainer>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(StatusManager);
