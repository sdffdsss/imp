import React, { PureComponent } from 'react';
import { Modal, Form, Input, Radio, ColumnsSortDrag, message, Row, Col, Checkbox } from 'oss-ui';
import { useEnvironmentModel } from '@Src/hox';
import { Api } from '../api';

// eslint-disable-next-line @typescript-eslint/naming-convention
class index extends PureComponent {
    ColumnsSortDragRef = React.createRef();
    grayManageForm = React.createRef();

    constructor(props) {
        const status = useEnvironmentModel.data.environment?.operatorId;
        const radioOptions = useEnvironmentModel.data.environment?.grayManage?.radioOptions || [];
        super(props);
        this.state = {
            envType: 0,
            garyType: 0,
            // 大区列表
            regionList: [],
            // 省份列表
            provinceList: [],
            // 大区全选状态
            regionIndeterminate: false,
            regionCheckAll: false,
            regionCheckList: [],
            // 省份全选状态
            provinceIndeterminate: false,
            provinceCheckAll: false,
            provinceCheckList: [],
            usersDataSel: [],
            redirectUrl: radioOptions[0]?.text,
            radioOptions,
            userDragColumns: [
                {
                    key: 'loginId',
                    title: '用户名',
                    search: status !== 10086,
                },
                {
                    key: 'userName',
                    title: '姓名',
                    search: true,
                },
                {
                    key: 'roleType',
                    title: '角色分类',
                    render: (text, record) => {
                        let typeName = '-';
                        const roleType = record && record.roleType ? record.roleType : '';
                        switch (roleType) {
                            case '1':
                                typeName = '管理员';
                                break;
                            case '2':
                                typeName = '内置';
                                break;
                            case '3':
                                typeName = '普通用户';
                                break;
                            case '4':
                                typeName = '维护';
                                break;
                            default:
                                typeName = '-';
                                break;
                        }
                        return typeName;
                    },
                },
                {
                    key: 'deptName',
                    title: '部门',
                    render: (text, record) => {
                        return record.extraFields && record.extraFields.deptName ? record.extraFields.deptName : '';
                    },
                },
            ],
        };
    }

    componentDidMount = () => {
        this.initData();
    };

    initData = () => {
        const { garyType } = this.props;
        const { redirectUrl, radioOptions } = this.state;
        this.setState({
            garyType: parseInt(garyType, 10),
        });
        this.queryAllCanaryList();
        this?.grayManageForm?.current?.setFieldsValue({ redirectUrl });
    };

    // 查询所有已经存在省份类型数据
    queryAllCanaryList = () => {
        const { regionList, provinceList } = this.props;
        const data = {
            page_size: 50,
            page_num: 1,
            canaryType: 0,
        };
        let filterRegionList = [...regionList];
        let filterProvinceList = [...provinceList];
        try {
            Api.getCanaryList(data).then((res) => {
                const list = res.canaryInfoList;
                if (list != null && list.length > 0) {
                    list.forEach((item) => {
                        if (item.canaryType === 0) {
                            filterRegionList = filterRegionList.filter((obj) => {
                                return obj.value.toString() !== item.canaryRelationId;
                            });
                            filterProvinceList = filterProvinceList.filter((obj) => {
                                return obj.value.toString() !== item.canaryRelationId;
                            });
                        }
                    });
                }
                this.setState({
                    regionList: filterRegionList,
                    provinceList: filterProvinceList,
                });
            });
        } catch (e) {
            this.setState({
                regionList: filterRegionList,
                provinceList: filterProvinceList,
            });
        }
    };

    /**
     * @description: 点击保存
     * @param n*o
     * @return n*o
     */

    handleSave = async () => {
        const { garyType, redirectUrl, usersDataSel, regionList, provinceList, regionCheckList, provinceCheckList } = this.state;
        const { userInfo } = this.props;
        let params = {};

        const user = JSON.parse(userInfo);
        if (garyType === 0) {
            const areaSelectList = [...regionCheckList, ...provinceCheckList];

            if (areaSelectList.length <= 0) {
                message.warning('请选择区域！');
                return;
            }
            if (!redirectUrl) {
                message.warning('请填写跳转URL！');
                return;
            }
            const canaryRelation = [];
            areaSelectList.forEach((item) => {
                let tmpObj = regionList.find((obj) => {
                    return obj.value === item;
                });
                if (tmpObj) {
                    canaryRelation.push({ canaryRelationId: tmpObj.value, canaryRelationName: tmpObj.label });
                } else {
                    tmpObj = provinceList.find((obj) => {
                        return obj.value === item;
                    });
                    canaryRelation.push({ canaryRelationId: tmpObj.value, canaryRelationName: tmpObj.label });
                }
            });

            params = {
                createUserId: user.userId,
                canaryType: 0,
                canaryRelation,
                redirectUrl,
            };
            await Api.addNewCanaryData(params);
            this.props.okCallback(params);
        } else {
            if (usersDataSel.length === 0) {
                message.warning('请选择用户！');
                return;
            }
            if (!redirectUrl) {
                message.warning('请填写跳转URL！');
                return;
            }
            const createUserId = [];
            usersDataSel.forEach((item) => {
                createUserId.push({ canaryRelationId: item.userId, canaryRelationName: item.userName });
            });
            params = {
                canaryType: 1,
                createUserId: user.userId,
                redirectUrl,
                canaryRelation: createUserId,
            };
            await Api.addNewCanaryData(params);
            this.props.okCallback(params);
        }
    };

    onGaryTypeChange = (e) => {
        this.setState({
            garyType: e.target.value,
        });
    };

    onJumpTypeChange = (e) => {
        const { radioOptions } = this.state;
        this.setState({
            envType: e.target.value,
            redirectUrl: radioOptions[e.target.value].text,
        });
        this?.grayManageForm?.current?.setFieldsValue({ redirectUrl: radioOptions[e.target.value].text });
    };

    // 获取关联用户
    getUsers = async (params) => {
        const { userInfo } = this.props;
        try {
            const res = await Api.getUsers({
                page_num: params ? params.pageNum : 1,
                page_size: params && params.pageSizeNum ? params.pageSizeNum : 10,
                zone_id: JSON.parse(userInfo).zones[0]?.zoneId,
                user_name: params && params.userName ? params.userName : '',
                zone_level: 1,
                flag: 2,
            });

            // eslint-disable-next-line no-underscore-dangle
            if (res && res._embedded && res._embedded.userResourceList) {
                let dataList = [];
                // eslint-disable-next-line no-underscore-dangle
                dataList = res._embedded.userResourceList.filter((item) => item.userId !== '0');
                const lastUsers = [];
                dataList.forEach((item) => {
                    lastUsers.push({ ...{ id: item.userId, userName: item.userName, loginId: item.loginId }, ...item });
                });
                return {
                    data: lastUsers,
                    total: res.pagination ? res.pagination.total : 0,
                };
            }
            return {
                data: [],
                total: 0,
            };
        } catch (e) {
            return {
                total: 0,
                data: [],
            };
        }
    };

    // 关联用户
    onUserDrgChange = (values) => {
        this.setState(() => {
            return {
                usersDataSel: values,
            };
        });
    };

    onRedirectUrlChange = (e) => {
        this.setState({
            redirectUrl: e.target.value,
        });
    };

    /**
     * 选择大区
     */
    selectAllRegion = (e) => {
        const regionCheckList = [];
        if (e.target.checked) {
            // eslint-disable-next-line array-callback-return
            this.state.regionList.map((item) => {
                regionCheckList.push(item.value);
            });
        }
        this.setState({
            regionCheckAll: e.target.checked,
            regionIndeterminate: false,
            regionCheckList: e.target.checked ? regionCheckList : [],
        });
        this.selectRegionProvinces(regionCheckList);
    };

    onChangeRegion = (list) => {
        const self = this;
        this.setState({
            regionCheckAll: list.length === self.state.regionList.length,
            regionIndeterminate: !!list.length && list.length < self.state.regionList.length,
            regionCheckList: list,
        });
        this.selectRegionProvinces(list);
    };

    /**
     * 根据选择阿大区 ，默认勾选对应的省份信息
     * @param list
     */
    selectRegionProvinces = (list) => {
        // 根据选择的大区选中对应的省份
        const provinceCheckList = [];
        list.forEach((regionId) => {
            this.state.provinceList.forEach((provinceItem) => {
                if (regionId === provinceItem.parentId) {
                    provinceCheckList.push(provinceItem.value);
                }
            });
        });
        this.onChangeProvince(provinceCheckList);
    };

    /**
     * 选择省份
     */
    selectAllProvince = (e) => {
        const provinceCheckList = [];
        if (e.target.checked) {
            // eslint-disable-next-line array-callback-return
            this.state.provinceList.map((item) => {
                provinceCheckList.push(item.value);
            });
        }
        this.setState({
            provinceCheckAll: e.target.checked,
            provinceIndeterminate: false,
            provinceCheckList: e.target.checked ? provinceCheckList : [],
        });
    };

    onChangeProvince = (list) => {
        const self = this;
        this.setState({
            provinceCheckAll: list.length === self.state.provinceList.length,
            provinceIndeterminate: !!list.length && list.length < self.state.provinceList.length,
            provinceCheckList: list,
        });
    };

    render() {
        const { handleCancel } = this.props;
        const {
            garyType,
            usersDataSel,
            userDragColumns,
            redirectUrl,
            radioOptions,
            envType,
            regionCheckAll,
            regionIndeterminate,
            regionCheckList,
            provinceCheckAll,
            provinceCheckList,
            provinceIndeterminate,
            regionList,
            provinceList,
        } = this.state;
        return (
            <Modal width={800} title="新建" visible centered onOk={this.handleSave} onCancel={handleCancel}>
                <Form labelAlign="right" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} ref={this.grayManageForm}>
                    {garyType === 0 && (
                        <Form.Item label="省份区域" name="reginName" rules={[{ required: true, message: '请选择区域' }]}>
                            <Row className="gray-top-select-row">
                                <Col span={24}>
                                    <Form.Item name="regionItem" label="大区">
                                        <Checkbox
                                            value="allRegion"
                                            key="allRegion"
                                            indeterminate={regionIndeterminate}
                                            checked={regionCheckAll}
                                            onChange={this.selectAllRegion}
                                        >
                                            全部
                                        </Checkbox>
                                        <Checkbox.Group options={regionList} value={regionCheckList} onChange={this.onChangeRegion} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="gray-top-select-row">
                                <Col span={24}>
                                    <Form.Item name="provinceItem" label="省份">
                                        <Checkbox
                                            value="allProvince"
                                            key="allProvince"
                                            indeterminate={provinceIndeterminate}
                                            checked={provinceCheckAll}
                                            onChange={this.selectAllProvince}
                                        >
                                            全部
                                        </Checkbox>
                                        <Checkbox.Group options={provinceList} value={provinceCheckList} onChange={this.onChangeProvince} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form.Item>
                    )}
                    {garyType === 1 && (
                        <Form.Item label="用户选择">
                            <ColumnsSortDrag
                                ref={this.ColumnsSortDragRef}
                                columns={userDragColumns}
                                allOptionsLabel="所有用户"
                                selectOptionsLabel="已选用户"
                                request={this.getUsers}
                                searchParams={{
                                    searchField: 'userName',
                                    paging: true,
                                    pageSize: 10,
                                }}
                                selectOptionsList={usersDataSel}
                                actionProps={{ showLeftSearch: true, showRightSearch: true }}
                                onChange={this.onUserDrgChange}
                                style={{ height: 300, width: 650, margin: '10px 0px 10px 10px' }}
                                disabled={false}
                            />
                        </Form.Item>
                    )}
                    <Form.Item label="跳转环境" key="redirectUrlRadioItem" name="redirectUrlRadioItem">
                        <Radio.Group options={radioOptions} defaultValue={envType} value={envType} onChange={this.onJumpTypeChange} />
                    </Form.Item>
                    <Form.Item label="跳转URL" name="redirectUrl" rules={[{ required: true, message: '请填写跳转URL' }]}>
                        <Input placeholder="请输入URL" value={redirectUrl} onChange={this.onRedirectUrlChange} />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default index;
