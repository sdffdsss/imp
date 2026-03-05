import React from 'react';
import { Icon, Modal, message, Input, Radio, Space, Tooltip, Button, Form, Row, Col, Select } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import Edit from './edit';
import CheckSelectTemplate from './check-alarm-column';
import { _ } from 'oss-web-toolkits';
import { getUserDefaultColumns } from '../common/rest';
import request from '@Src/common/api';
import { makeCRC32 } from '@Common/utils';
import dayjs from 'dayjs';
import { useEnvironmentModel } from '@Src/hox';
import './index.less';
import AuthButton from '@Src/components/auth-button';
import { logNew } from '@Common/api/service/log';

const superAdmin = '0';
const isUnicom = useEnvironmentModel?.data?.environment?.version === 'unicom';
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.confirmFormRef = React.createRef();
        this.state = {
            value: 1,
            tableData: [],
            allData: [],
            columnTemplateVisible: false,
            editVisible: false,
            editRow: null,
            defaulteId: '',
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
                    dataIndex: 'templateName',
                    key: 'templateName',
                    initialValue: 'all',
                    ellipsis: true,
                    width: 180,
                    sorter: true,
                    render: (text, row) => {
                        let title = row.isDefault === 1 ? `${row.templateName}【默认模板】` : row.templateName;
                        return (
                            <div
                                onClick={this.columnTemplateShowModal.bind(this, row)}
                                title={title}
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
                                {title}
                            </div>
                        );
                    },
                },
                {
                    title: '归属省份',
                    dataIndex: 'columnProvinceLabel',
                    key: 'columnProvinceLabel',
                    initialValue: 'all',
                    hideInTable: !isUnicom,
                    hideInSearch: true,
                    ellipsis: true,
                    width: 100,
                },
                {
                    title: '归属专业',
                    dataIndex: 'columnProfessionalLabel',
                    key: 'columnProfessionalLabel',
                    initialValue: 'all',
                    hideInTable: !isUnicom,
                    hideInSearch: true,
                    ellipsis: true,
                    width: 100,
                },
                {
                    title: '描述',
                    dataIndex: 'description',
                    key: 'description',
                    initialValue: 'all',
                    hideInSearch: true,
                    ellipsis: true,
                    width: 180,
                },
                {
                    title: '监控视图引用',
                    dataIndex: 'monitorViewReference',
                    key: 'monitorViewReference',
                    initialValue: 'all',
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
                    sorter: true,
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    dataIndex: 'createTime',
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
                    width: 160,
                    sorter: true,
                },
                {
                    title: '操作',
                    valueType: 'option',
                    dataIndex: 'id',
                    hideInSearch: true,
                    fixed: 'right',
                    render: (text, row) => (
                        <Space>
                            {row.templateName.indexOf('【专题模板】') !== -1
                                ? this.props.login.userId === '0' && (
                                      <Tooltip title="编辑">
                                          <AuthButton
                                              key="1"
                                              onClick={() => {
                                                  this.setState({ editVisible: true, editRow: row });
                                              }}
                                              type="text"
                                              style={{ padding: 0 }}
                                              authKey="alarmColumn:edit"
                                          >
                                              <Icon antdIcon type="FormOutlined" />
                                          </AuthButton>
                                      </Tooltip>
                                  )
                                : (_.get(row, 'ownerId', '').toString() === _.get(this, 'props.login.userId', '').toString() ||
                                      (_.get(this, 'state.userInfo.isAdmin') && _.get(this, 'props.login.userId', '').toString() === superAdmin) ||
                                      (_.get(this, 'state.userInfo.isAdmin') &&
                                          _.get(this, 'props.login.userId', '').toString() !== superAdmin &&
                                          row.templateId !== 0)) && (
                                      <Tooltip title="编辑">
                                          <AuthButton
                                              key="1"
                                              onClick={() => {
                                                  this.setState({ editVisible: true, editRow: row });
                                              }}
                                              type="text"
                                              style={{ padding: 0 }}
                                              authKey="alarmColumn:edit"
                                          >
                                              <Icon antdIcon type="FormOutlined" />
                                          </AuthButton>
                                      </Tooltip>
                                  )}
                            {row.templateName.indexOf('【专题模板】') !== -1
                                ? this.props.login.userId === '0' && (
                                      <Tooltip title="删除">
                                          <AuthButton
                                              key="2"
                                              onClick={this.deleteTemplate.bind(this, row)}
                                              type="text"
                                              style={{ padding: 0 }}
                                              authKey="alarmColumn:delete"
                                              addLog={true}
                                          >
                                              <Icon antdIcon={true} type="DeleteOutlined" />
                                          </AuthButton>
                                      </Tooltip>
                                  )
                                : row.templateId !== 0 &&
                                  (_.get(row, 'ownerId', '').toString() === _.get(this, 'props.login.userId', '').toString() ||
                                      (_.get(this, 'state.userInfo.isAdmin') && _.get(this, 'props.login.userId', '').toString() === superAdmin) ||
                                      (_.get(this, 'state.userInfo.isAdmin') && _.get(this, 'props.login.userId', '').toString() !== superAdmin)) && (
                                      <Tooltip title="删除">
                                          <AuthButton
                                              key="2"
                                              onClick={this.deleteTemplate.bind(this, row)}
                                              type="text"
                                              style={{ padding: 0 }}
                                              authKey="alarmColumn:delete"
                                              addLog={true}
                                          >
                                              <Icon antdIcon={true} type="DeleteOutlined" />
                                          </AuthButton>
                                      </Tooltip>
                                  )}
                            <Tooltip title="查看">
                                <Icon antdIcon type="SearchOutlined" onClick={this.columnTemplateShowModal.bind(this, row)} />
                            </Tooltip>
                            {((isUnicom && row.isDefault !== 1) || String(row.templateId) !== String(this.state.defaulteId)) && (
                                <Tooltip title="更新为默认模板">
                                    <AuthButton
                                        key="4"
                                        onClick={this.settingExperiences.bind(this, row)}
                                        type="text"
                                        style={{ padding: 0 }}
                                        authKey="alarmColumn:default"
                                    >
                                        <Icon antdIcon={true} type="SettingOutlined" />
                                    </AuthButton>
                                </Tooltip>
                            )}
                            {isUnicom && this.state.value === 1 && (
                                <Tooltip title="引用">
                                    <AuthButton
                                        key="5"
                                        onClick={this.shareCopyToSelfConfirm.bind(this, row)}
                                        type="text"
                                        style={{ padding: 0 }}
                                        authKey="alarmColumn:shareCopy"
                                    >
                                        <Icon antdIcon={true} type="ShareAltOutlined" />
                                    </AuthButton>
                                </Tooltip>
                            )}
                        </Space>
                    ),
                },
            ],
            searchKey: '',
            params: {},
            provinceData: [],
            regionId: undefined,
            professionData: [],
            professionType: [],
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
        if (!isUnicom) {
            this.getDefaultTemplateId();
        }
    }

    columnTemplateShowModal = async (row) => {
        logNew('列模板查看', '500099');
        this.setState({ columnTemplateVisible: true, editRow: row });
    };

    columnTemplateVisibleChange = (visible) => {
        this.setState({ columnTemplateVisible: visible, editRow: null });
    };

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

    getDefaultTemplateId = async () => {
        const {
            login: { userName },
        } = this.props;
        const defaulteId = await getUserDefaultColumns(userName);
        this.setState({ defaulteId });
    };

    // 获取告警模板列表
    selectAlarmColumnTemplates = async (params, sorter) => {
        const { searchKey, value, regionId, professionType, professionData } = this.state;
        const {
            login: { userId },
        } = this.props;
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
            //columnProvince: regionId?.join(','),
            columnProvince: regionId,
            columnProfessional: professionList?.join(','),
            orderType,
            orderFieldName,
        };

        return request('v1/template/alarm-column', {
            type: 'get',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: false,
            showSuccessMessage: false,
        }).then((res) => {
            if (!_.isEmpty(res)) {
                this.setState({
                    allData: res.data,
                });
                return {
                    data: res.data.map((item, index) => ({
                        ...item,
                        index: index + 1 + (current - 1) * pageSize,
                    })),
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

    deleteTemplate = (row, params) => {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '此操作将永久删除选中项，是否继续？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            width: '350px',
            onOk: () => {
                this.deleteData(row, params);
            },
            onCancel() {},
        });
    };

    deleteData(row, params) {
        const queryParam = {
            templateIds: String(row.templateId),
            ownerId: Number(this.props.login.userId),
        };
        request('v1/template/alarm-column', {
            type: 'delete',
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: false,
            showSuccessMessage: false,
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
                    `该列模板被监控视图：【${res.data.referenceViews.map((item) => item.WINDOW_NAME).join('】【')}】所引用，请检查后再操作！`,
                );
            } else {
                message.error('删除失败');
            }
        });
    }

    settingExperiences = (row) => {
        const { upateToDefault } = this;
        Modal.confirm({
            title: '',
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content: '确认设置为默认模板？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            onOk: () => {
                upateToDefault(row);
            },
            onCancel() {},
        });
    };

    upateToDefault = (row) => {
        const {
            login: { userName },
        } = this.props;
        const { defaulteId } = this.state;
        const queryParam = {
            optionKey: `${userName}.AlarmBandColumntemplate`,
            optionValue: row.templateId,
        };
        const type = (() => {
            if (isUnicom) {
                return 'put';
            }
            return defaulteId ? 'put' : 'post';
        })();
        request('v1/template/search-alarm-column', {
            type,
            baseUrlType: 'monitorSetUrl',
            data: queryParam,
            // 是否需要显示失败消息提醒
            showErrorMessage: false,
            showSuccessMessage: false,
        }).then((res) => {
            if (res && res.code === 0) {
                message.success('更新成功');
                if (!isUnicom) {
                    this.getDefaultTemplateId();
                }
                if (_.get(this, 'myRef.current.reloadAndRest')) {
                    this.myRef.current.reloadAndRest();
                }
            } else {
                message.error('更新失败');
            }
        });
    };

    /**
     * 共享当前视图模板确认
     */
    shareCopyToSelfConfirm = (row) => {
        let content = `是否确认引用${row.templateName}？`;
        let onOk = () => {
            this.shareCopyToSelf(row, _.trim(`${row.templateName}[引用]`));
        };
        if (isUnicom) {
            content = (
                <div>
                    <div style={{ marginBottom: '10px' }}>是否确认引用{row.templateName.replace('【专题模板】', '')}？</div>
                    <Form ref={this.confirmFormRef}>
                        <Form.Item
                            style={{ marginRight: '20px' }}
                            name="sharetemplateName"
                            // initialValue={`${row.templateName.replace('【专题模板】', '')}${dayjs().format('YYYYMMDDHHmm')}`}
                            label="引用名称"
                            rules={[
                                {
                                    required: true,
                                    message: '名称不能为空，请输入',
                                },
                                {
                                    validator: (rule, value, callback) => {
                                        // eslint-disable-next-line no-control-regex
                                        const valueLength = value ? value.replace(/[^\x00-\xff]/g, 'aa').length : 0;
                                        if (valueLength > 64) {
                                            callback('列模板名称不能超过64位（1汉字=2位）');
                                        } else {
                                            callback();
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </div>
            );
            onOk = (close) => {
                this.confirmFormRef.current
                    .validateFields()
                    .then((values) => {
                        this.shareCopyToSelf(row, _.trim(values.sharetemplateName));
                        close();
                    })
                    .catch(() => {});
            };
        }
        Modal.confirm({
            title: '',
            bodyStyle: { overflow: 'hidden' },
            icon: <Icon antdIcon={true} type="ExclamationCircleOutlined" />,
            content,
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk,
            onCancel: (close) => close(),
        });
    };

    /**
     * 共享当前视图模板给自己
     */
    shareCopyToSelf = (row, newName) => {
        const {
            login: { userId },
        } = this.props;
        const createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const templateID = makeCRC32(createTime + row.templateName + userId);
        const data = {
            templateId: templateID,
            templateName: newName, //
            description: row.description,
            ownerId: userId,
            createTime,
            columnProvince: this.state.regionId,
            columnProfessional: row.columnProfessional,
            modifyTime: createTime,
            columnsValue: row.columnsValue,
        };

        request('v1/template/alarm-column', {
            type: 'post',
            baseUrlType: 'monitorSetUrl',
            data,
            showSuccessMessage: false,
            // 是否需要显示失败消息提醒
            showErrorMessage: true,
        }).then((res) => {
            if (res.code !== 0) {
                message.error(res.message);
                return;
            }
            message.success('引用成功');
            if (_.get(this, 'myRef.current.reloadAndRest')) {
                this.myRef.current.reloadAndRest();
            }
        });
    };

    onRadioChange = (e) => {
        const { systemInfo } = this.props.login;
        let regionId = this.getInitialProvince(systemInfo?.currentZone?.zoneId, this.props.login.userInfo);
        this.setState({
            value: e.target.value,
            searchKey: '',
            regionId,
            professionType: [],
        });
        this.tableResetAndReload();
    };

    editVisibleChange = (visible) => {
        this.setState({ editVisible: visible, editRow: null });
    };

    onSearch() {
        this.tableResetAndReload();
    }

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
                //list.unshift({ regionId: '', regionName: '全部' });
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
                // list.unshift({ key: '', value: '全部' });
                this.setState({
                    professionData: list,
                });
            }
        });
    };
    handleProfessionType = (e) => {
        // const { professionType } = this.state;
        // if (professionType.toString() === '' && e.toString() !== '') {
        //     this.setState({
        //         professionType: e.filter((item) => item !== ''),
        //     });
        //     return;
        // }
        // if (e.find((item) => item === '') === '') {
        //     this.setState({
        //         professionType: [''],
        //     });
        //     return;
        // }
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
                professionType: [],
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
        const { columns, params, searchKey, columnTemplateVisible, editVisible, editRow, provinceData, regionId, professionType, professionData } =
            this.state;
        const {
            login: { userId, userName, systemInfo },
        } = this.props;
        const userInFo = JSON.parse(this.props.login.userInfo);

        const refreshData = this.tableResetAndReload;
        const headerTitle = (
            <Form name="basic">
                <Row gutter={16} wrap={false}>
                    <Col span={5} style={{ display: 'inline' }}>
                        <Form.Item style={{ marginBottom: 0 }}>
                            <Radio.Group onChange={this.onRadioChange} value={this.state.value}>
                                <Radio value={1}>全部模板</Radio>
                                <Radio value={0}>我的模板</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="模板名称" style={{ marginBottom: 0 }}>
                            <Input
                                placeholder="请输入视图名称"
                                value={searchKey}
                                onChange={this.onInputChange}
                                onPressEnter={this.onSearch.bind(this)}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    {isUnicom && (
                        <Col span={5}>
                            <Form.Item
                                label="归属省份"
                                // name="windowType"
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    onChange={this.handleProvinceChange}
                                    style={{ width: '120px' }}
                                    value={regionId}
                                    placeholder="请选择省份"
                                    //mode="multiple"
                                    //maxTagCount={1}
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
                                    placeholder="全部"
                                    mode="multiple"
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
                                <AuthButton
                                    onClick={() => {
                                        this.setState({ editVisible: true, editRow: null });
                                    }}
                                    authKey="alarmColumn:add"
                                    style={{ marginLeft: 10 }}
                                >
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
            <>
                <VirtualTable
                    global={window}
                    actionRef={this.myRef}
                    columns={columns}
                    params={params}
                    request={this.selectAlarmColumnTemplates}
                    rowKey="templateId"
                    bordered
                    dateFormatter="string"
                    x={1000}
                    search={false}
                    rowClassName={(record, index) => (index % 2 === 1 ? 'oss-ui-table-tr-bg-single' : 'oss-ui-table-tr-bg-double')}
                    rowSelection={null}
                    headerTitle={headerTitle}
                />
                {editVisible && (
                    <Edit
                        visible={editVisible}
                        onVisibleChange={this.editVisibleChange}
                        editRow={editRow}
                        refreshData={refreshData}
                        userId={userId}
                        userName={userName}
                        container={this.props.login.container}
                        userInFo={userInFo}
                        systemInfo={systemInfo}
                    />
                )}

                {columnTemplateVisible && (
                    <CheckSelectTemplate visible={columnTemplateVisible} row={editRow} onVisibleChange={this.columnTemplateVisibleChange} />
                )}
            </>
        );
    }
}

export default Index;
