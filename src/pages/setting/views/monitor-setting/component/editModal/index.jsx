import React, { useEffect, useState, useRef } from 'react';
import { Button, Space, Form, Input, Row, Col, ColumnsSortDrag, Select, Tooltip, message, Icon, InputNumber } from 'oss-ui';
import CommonSelect from '../other/commonSelect';
import { getRegionList, getGroupList, addMonitorCenter, editMonitorCenter, batchSaveGroupList } from '../../api';
import moment from 'moment';
import { makeCRC32 } from '@Common/utils';
import useLoginInfoModel from '@Src/hox';
import { _ } from 'oss-web-toolkits';
import { getInitialProvince } from '../../utils';
import AuthButton from '@Src/components/auth-button';
import EditModel from '../maintenance-edit';
import _cloneDeep from 'lodash/cloneDeep';
import Title from '@Src/pages/components/title';
import GroupInfoModal from './group-info';
import GroupDescList from './group-desc-list';
import './index.less';

const INFO_TYPE = {
    default: 0,
    update: 1,
    cache: 2,
};

const Index = (props) => {
    const tableRef = useRef();
    const saveSuccessRef = useRef(true);

    const { type, onCancel, data, rowData, onOk, groupFilterProvince } = props;
    const login = useLoginInfoModel();
    const [form] = Form.useForm();
    const [selectGroups, handleSelectGroups] = useState([]);
    const [regionList, getRegionData] = useState([]);
    // 省份地市id
    const [provinceId, handleProvinceId] = useState('');
    const [regionId, handleRegionId] = useState('');
    // 展示用数据源
    const [viewData, handleViewData] = useState([]);
    const [editVisible, setEditVisible] = useState(false);
    // const [choseModal, setChoseModal] = useState(false);
    const [editModleName, setEditModleName] = useState('');

    const [checkTree, setCheckTree] = useState({
        shiftForemanName: [],
        cantonalLeaderIds: [],
        headId: [],
    });
    const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
    const [groupInfoType, setGroupInfoType] = useState(0);
    // 缓存新建的班组
    const [cacheGroupList, setCacheGroupList] = useState([]);
    const [createBtnDisable, setCreateBtnDisable] = useState(!Boolean(rowData?.centerName));
    const [selectUserList, setSelectUserList] = useState([]);
    // 更新的班组
    const [updateGroupList, setUpdateGroupList] = useState([]);

    const formValues = form.getFieldsValue();
    const handleSave = async (handlers) => {
        saveSuccessRef.current = false;
        await form.validateFields();
        const centerId = rowData.centerId || makeCRC32(new Date().getTime() + login.userId);
        const values = form.getFieldsValue();
        const updateIds = updateGroupList.map((upItem) => upItem?._data?.groupId);
        const valueDescIds = values?.groupDesc?.map((item) => item?.groupId) || [];
        const associatedGroupIds = [...new Set([...(valueDescIds || []), ...updateIds])].filter((item) => Boolean(item));
        const provinceName = data.find((item) => item.regionId === values.provinceId)?.regionName;
        if (values.dutyPhone) {
            const reg = /^1[3456789]\d{9}$/;
            if (!reg.test(values.dutyPhone)) {
                message.warn('请输入正确手机号');
                return;
            }
        }

        const params = {
            centerId,
            userId: login.userId,
            creatorId: login.userId,
            creatorName: login.userName,
            provinceId: values.provinceId,
            provinceName,
            centerName: values.centerName,
            associatedGroupIds: associatedGroupIds || [],
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            modifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            desc: values.desc || null,
            shiftForemanIds: checkTree?.shiftForemanName?.join(),
            cantonalLeaderIds: checkTree?.cantonalLeaderIds?.join(),
            headId: checkTree?.headId?.join(),
            dutyPhone: values.dutyPhone,
        };
        if (type === 'add') {
            delete params.centerId;
            const addRes = await addMonitorCenter(params, handlers);

            if (addRes && onOk && addRes.code !== -1) {
                if (cacheGroupList.length) {
                    const parm = cacheGroupList.map((item) => ({
                        ...item?._data,
                        centerId: addRes?.data,
                    }));
                    const resBatch = await batchSaveGroupList(parm);
                    saveSuccessRef.current = true;
                    if (resBatch.code !== 200) {
                        message.warn(resBatch.message);
                        return;
                    }
                }
                onOk();
            } else {
                message.warn(addRes.message);
            }
        } else if (type === 'edit') {
            const editRes = await editMonitorCenter(params, handlers);
            if (editRes && onOk && editRes.code !== -1) {
                if (cacheGroupList.length || updateGroupList.length) {
                    const parm = [
                        ...cacheGroupList.map((item) => ({
                            ...item?._data,
                            centerId: rowData.centerId,
                        })),
                        ...updateGroupList.map((item) => ({
                            ...item?._data,
                        })),
                    ];
                    const resBatch = await batchSaveGroupList(parm);
                    saveSuccessRef.current = true;
                    if (resBatch.code !== 200) {
                        message.warn(resBatch.message);
                        return;
                    }
                }
                onOk();
            } else {
                message.warn(editRes.message);
            }
        }
    };
    const groupColumns = [
        {
            title: '归属省份',
            key: 'provinceName',
            dataIndex: 'provinceName',
        },
        {
            title: '归属地市',
            key: 'regionName',
            dataIndex: 'regionName',
        },
        {
            title: '监控班组名称',
            width: '150px',
            key: 'groupName',
            dataIndex: 'groupName',
        },
    ];
    const handleRegionList = async (e) => {
        handleProvinceId(e);
        getRegionData([]);
        const params = {
            parentRegionId: e,
            creator: login.userId,
        };
        const res = await getRegionList(params);
        if (Array.isArray(res.filter((item) => item.regionName === '省本部')) && res.filter((item) => item.regionName === '省本部')[0]) {
            res.unshift(
                ...res.splice(
                    res.findIndex((i) => i.regionName === '省本部'),
                    1,
                ),
            );
        }
        handleRegionId(res[0]?.regionId);
        getRegionData(res);
    };
    const handleRegionChange = (e) => {
        handleRegionId(e);
    };
    const loadAllGroups = async (values) => {
        const params = {
            pageNum: values.pageNum,
            pageSize: 20,
            provinceId,
            regionId,
        };
        if (provinceId === '' || regionId === '') {
            return {
                success: false,
                total: 0,
                data: [],
            };
        }
        const res = await getGroupList(params);
        if (res && res.rows && Array.isArray(res.rows)) {
            return Promise.resolve({
                success: true,
                total: res.total,
                data: res.rows.map((item) => {
                    return {
                        ...item,
                        id: item.groupId,
                    };
                }),
            });
        }
    };
    const onSelectedChange = (rows) => {
        handleSelectGroups(rows);
    };
    useEffect(() => {
        tableRef.current?.onSearch();
        // loadAllGroups({pageNum:1})
    }, [regionId]);
    useEffect(() => {
        if (type === 'edit' || type === 'view') {
            console.log(rowData);
            form.setFieldsValue({
                centerName: rowData.centerName,
                provinceId: rowData.provinceId?.toString(),
                desc: rowData.desc,
                dutyPhone: rowData.dutyPhone,
                shiftForemanName: rowData?.shiftForemanInfos?.map((item) => item.userName).join(),
                cantonalLeaderIds: rowData?.cantonalLeaderInfos?.map((item) => item.userName).join(),
                headId: rowData?.headInfos?.map((item) => item.userName).join(),
                groupDesc: rowData?.groupInfos.map((info) => ({
                    title: info?.groupName,
                    labelGroup: info?.member?.split(','),
                    groupLeader: info?.monitor || '-',
                    groupId: info?.groupId,
                    type: INFO_TYPE.default,
                })),
            });
            handleProvinceId(rowData.provinceId?.toString());
            handleRegionList(rowData.provinceId?.toString());
            // setCheckTree(
            //     rowData?.shiftForemanInfos?.map((item) => item.userId)
            //     );

            setCheckTree({
                shiftForemanName: rowData?.shiftForemanInfos?.map((item) => item.userId),
                cantonalLeaderIds: rowData?.cantonalLeaderInfos?.map((item) => item.userId),
                headId: rowData?.headInfos?.map((item) => item.userId),
            });
            if (rowData.groupInfos && Array.isArray(rowData.groupInfos)) {
                handleViewData(rowData.groupInfos);
                handleSelectGroups(
                    rowData.groupInfos.map((item) => {
                        return {
                            ...item,
                            id: item.groupId,
                        };
                    }),
                );
            }
        } else if (type === 'add') {
            form.setFieldsValue({
                provinceId: getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo),
            });
            handleRegionList(getInitialProvince(login.systemInfo?.currentZone?.zoneId, login.userInfo));
        }
    }, [rowData]);
    // 还原默认值
    const handleResetModal = () => {
        form.setFieldsValue({
            centerName: rowData.centerName,
            provinceId: rowData.provinceId?.toString(),
            desc: rowData.desc,
        });
        handleSelectGroups(
            rowData.groupInfos.map((item) => {
                return {
                    ...item,
                    id: item.groupId,
                };
            }),
        );
        tableRef.current?.onSearch();
    };
    const treeModalChange = (flag, userList, name) => {
        if (flag) {
            form.setFieldsValue({
                [name]: userList?.map((item) => item?.title).join(),
            });
            setCheckTree({
                ...checkTree,
                [name]: _cloneDeep(userList.map((item) => item?.otherInfo?.userIdNum)),
            });
            setEditVisible(false);
        } else {
            setEditVisible(flag);
        }
    };

    // function calcIsExceedMax() {
    //     const list = [
    //         ...(formValues.groupDesc || []),
    //         ...updateGroupList?.map((updateitem) => ({
    //             title: updateitem?._data?.groupName,
    //             labelGroup: updateitem?._data?.groupUserBeanList
    //                 .filter((groupItem) => groupItem?.isLeader === 0)
    //                 .map((groupItem) => groupItem?.userName),
    //             groupLeader: updateitem?._data?.groupUserBeanList?.find((groupItem) => groupItem?.isLeader)?.userName,
    //             type: INFO_TYPE.update,
    //             groupId: updateitem?._data?.groupId,
    //         })),
    //         ...cacheGroupList?.map((cacheitem) => ({
    //             title: cacheitem?._data?.groupName,
    //             labelGroup: cacheitem?._data?.groupUserBeanList
    //                 .filter((groupItem) => groupItem?.isLeader === 0)
    //                 .map((groupItem) => groupItem?.userName),
    //             groupLeader: cacheitem?._data?.groupUserBeanList?.find((groupItem) => groupItem?.isLeader)?.userName,
    //             type: INFO_TYPE.cache,
    //         })),
    //     ];

    //     const noRepeatList = _.uniqBy(list, 'title');

    //     return noRepeatList.length >= 8;
    // }
    return (
        <div className="monitor-modal">
            <div className="content">
                <Form
                    className="sabe-unicom-monitor-form"
                    form={form}
                    labelAlign="right"
                    onValuesChange={(changedValues) => {
                        if (changedValues.hasOwnProperty('centerName')) {
                            if (changedValues?.centerName?.trim().length) {
                                setCreateBtnDisable(false);
                            } else {
                                setCreateBtnDisable(true);
                            }
                        }
                    }}
                >
                    <Title title={'基本信息'} leftIcon={<span className="dot"></span>} />
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="监控中心名称"
                                name="centerName"
                                labelCol={{ span: 6 }}
                                rules={[
                                    {
                                        required: true,
                                        message: '监控中心名称不能为空',
                                    },
                                    {
                                        max: 20,
                                        message: '监控中心名称最大长度20',
                                    },
                                ]}
                            >
                                <Input disabled={type === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="归属省份"
                                name="provinceId"
                                labelCol={{ span: 6 }}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <CommonSelect form={form} data={data} disabled={type === 'view'} userInfo={login.userInfo} login={login} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="7*24值班电话" name="dutyPhone" labelCol={{ span: 6 }}>
                                <InputNumber maxLength={11} min={1} disabled={type === 'view'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="描述" name="desc" labelCol={{ span: 6 }}>
                                <Input
                                    maxLength={200}
                                    disabled={type === 'view'}
                                    autoSize={{
                                        minRows: 5,
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Title title={'角色信息'} leftIcon={<span className="dot"></span>} />
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="监控中心负责人"
                                name="headId"
                                labelCol={{ span: 6 }}
                                rules={[
                                    {
                                        required: true,
                                        message: '输入不能为空',
                                    },
                                ]}
                            >
                                <Input
                                    disabled={type === 'view'}
                                    onClick={() => {
                                        setEditModleName('headId');
                                        setCheckTree(_cloneDeep(checkTree));
                                        setEditVisible(true);
                                    }}
                                    title={type === 'view' ? rowData?.headInfos?.map((item) => item.userName).join() : ''}
                                    suffix={
                                        !(type === 'view') && (
                                            <div
                                                onClick={() => {
                                                    setEditModleName('headId');
                                                    setCheckTree(_cloneDeep(checkTree));
                                                    setEditVisible(true);
                                                }}
                                            >
                                                <Icon antdIcon style={{ color: '#1890ff' }} type="UserAddOutlined"></Icon>
                                            </div>
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="分管领导"
                                name="cantonalLeaderIds"
                                labelCol={{ span: 6 }}
                                rules={[
                                    {
                                        required: true,
                                        message: '输入不能为空',
                                    },
                                ]}
                            >
                                <Input
                                    disabled={type === 'view'}
                                    onClick={() => {
                                        setEditModleName('cantonalLeaderIds');
                                        setCheckTree(_cloneDeep(checkTree));
                                        setEditVisible(true);
                                    }}
                                    title={type === 'view' ? rowData?.cantonalLeaderInfos?.map((item) => item.userName).join() : ''}
                                    suffix={
                                        !(type === 'view') && (
                                            <div
                                                onClick={() => {
                                                    setEditModleName('cantonalLeaderIds');
                                                    setCheckTree(_cloneDeep(checkTree));
                                                    setEditVisible(true);
                                                }}
                                            >
                                                <Icon antdIcon style={{ color: '#1890ff' }} type="UserAddOutlined"></Icon>
                                            </div>
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="监控值班长"
                                labelCol={{ span: 3 }}
                                name="shiftForemanName"
                                rules={[
                                    {
                                        required: true,
                                        message: '输入不能为空',
                                    },
                                ]}
                            >
                                <Input
                                    disabled={type === 'view'}
                                    onClick={() => {
                                        setEditModleName('shiftForemanName');
                                        setCheckTree(_cloneDeep(checkTree));
                                        setEditVisible(true);
                                    }}
                                    title={type === 'view' ? rowData?.shiftForemanInfos?.map((item) => item.userName).join() : ''}
                                    suffix={
                                        !(type === 'view') && (
                                            <div
                                                onClick={() => {
                                                    setEditModleName('shiftForemanName');
                                                    setCheckTree(_cloneDeep(checkTree));
                                                    setEditVisible(true);
                                                }}
                                            >
                                                <Icon antdIcon style={{ color: '#1890ff' }} type="UserAddOutlined"></Icon>
                                            </div>
                                        )
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title
                        title={'监控班组'}
                        // style={{ paddingRight: 30 }}
                        leftIcon={<span className="dot"></span>}
                        rightBtnGroup={
                            type === 'view'
                                ? null
                                : [
                                      <Tooltip
                                          title={
                                              createBtnDisable
                                                  ? '请输入监控中心名称后新建'
                                                  : cacheGroupList.length >= 8
                                                  ? '单次新增班组最多不超过8个'
                                                  : ''
                                          }
                                      >
                                          <Button
                                              disabled={type === 'view' || createBtnDisable || cacheGroupList.length >= 8}
                                              type="primary"
                                              ghost
                                              icon={<Icon antdIcon type="PlusOutlined"></Icon>}
                                              onClick={() => {
                                                  setShowGroupInfoModal(true);
                                                  setGroupInfoType(0);
                                              }}
                                          >
                                              新建
                                          </Button>
                                      </Tooltip>,
                                  ]
                        }
                    />

                    <Row>
                        <Col span={24}>
                            <Form.Item name="groupDesc">
                                <GroupDescList
                                    provinceList={data}
                                    type={type}
                                    cacheGroupList={cacheGroupList}
                                    setCacheGroupList={setCacheGroupList}
                                    updateGroupList={updateGroupList}
                                    setUpdateGroupList={setUpdateGroupList}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                {editModleName && (
                    <EditModel
                        visible={editVisible}
                        zoneId={login.systemInfo?.currentZone?.zoneId}
                        onChange={treeModalChange}
                        // cellData={cellData}
                        // onChange={this.editChange}
                        checkTree={checkTree[editModleName]}
                        editModleName={editModleName}
                        selectUserList={selectUserList}
                    />
                )}
            </div>
            <div className="monitor-modal-footer">
                <Space>
                    {/* {type !== "view" && (
            <Button
              disabled={type !== "edit"}
              onClick={() => {
                handleResetModal();
              }}
            >
              还原默认值
            </Button>
          )} */}
                    {type !== 'view' && (
                        <AuthButton
                            addLog={true}
                            authKey={type === 'add' ? 'monitorSetting:add' : 'monitorSetting:edit'}
                            type="primary"
                            onClick={(params) => {
                                if (saveSuccessRef.current) {
                                    handleSave(params);
                                }
                            }}
                        >
                            保存
                        </AuthButton>
                    )}
                    <Button
                        onClick={() => {
                            if (onCancel) {
                                onCancel();
                            }
                        }}
                    >
                        取消
                    </Button>
                </Space>
            </div>
            {showGroupInfoModal && (
                <GroupInfoModal
                    className="monitor-setting-edit-group-info-modal"
                    modalEnumType={groupInfoType}
                    onSaveGroupSuccess={(callbackData, type) => {
                        if (type === INFO_TYPE.update) {
                            updateGroupList.push(callbackData);
                            setUpdateGroupList(updateGroupList);
                        } else {
                            cacheGroupList.push(callbackData);
                            setCacheGroupList(cacheGroupList);
                        }
                    }}
                    onModalCancel={() => {
                        setGroupInfoType(0);
                        setShowGroupInfoModal(false);
                    }}
                    provinceList={data}
                    groupFilterProvince={groupFilterProvince}
                    centerList={[]}
                    initValue={
                        groupInfoType === 0
                            ? {
                                  center: formValues?.centerName,
                                  province: formValues?.provinceId,
                              }
                            : {
                                  center: formValues?.centerName,
                                  province: formValues?.provinceId,
                              }
                    }
                    cacheGroupList={cacheGroupList}
                />
            )}
        </div>
    );
};

export default Index;
