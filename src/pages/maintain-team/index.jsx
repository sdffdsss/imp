import React, { useEffect, useState, useRef } from 'react';
import constants from '@Src/common/constants';
import { Select, Tooltip, Icon, Space, Button, Modal, message, Input } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { withModel } from 'hox';
import KeepAlive from 'react-activation';
import useLoginInfoModel from '@Src/hox';
import { VirtualTable } from 'oss-web-common';
import { useColumnsState } from '@Src/hooks';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import AuthButton from '@Src/components/auth-button';
import { logNew } from '@Common/api/service/log';
import { maintainTeamColumns, moduleId, modelId } from './define';
import {
    getMaintainTeamList,
    // getProfessionalEnum2Maintenance,
    getProfessionalEnum3Maintenance,
    getProvinceEnum2Maintenance,
    saveMaintainTeam,
    updateMaintainTeam,
    deleteMaintainTeam,
} from './api';
import MaintainEdit from './edit';
import { getInitialProvince } from './utils';
import { ReactComponent as svg1 } from './icon/schedule.svg';
import { ReactComponent as svg2 } from './icon/add.svg';
import ArrowDown from './img/arrow_down.png';
import ShowModeContent from './show-mode';

import usePageInfo from './hox';
import './style.less';

const MaintainTeam = (props) => {
    const { login } = props;
    const {
        parsedUserInfo: { operationsButton, zones },
    } = login;
    const hasSpecialAuth = operationsButton.some((item) => item.key === 'maintainTeam:editAdmin');
    const [submitParams, setSubmitParams] = useState(null);
    const [editRowData, setEditRowData] = useState(null);
    const [enumsList, setEnumsList] = useState(null);
    const actionRef = useRef();
    const formRef = useRef();
    const [showMode, setShowMode] = useState(true);
    const columnsState = useColumnsState({ configType: 10 });

    const frameInfo = useLoginInfoModel();
    const handleSearch = (row) => {
        setEditRowData({
            ...row,
            IsSearch: true,
            mteamDimensions: {
                label: row.dimensions,
                value: row.alarmsFieldsCond,
            },
            title: '查看',
        });
        sendLogFn({
            authKey: 'maintainTeam:view',
        });
    };
    const [currentColums, setCurrentColums] = useState(maintainTeamColumns(handleSearch));

    const judgeAuthFunc = (item) => {
        if (hasSpecialAuth) return false;
        if (login.userZoneInfo?.zoneLevel === '1') {
            // 集团用户
            if (frameInfo?.systemInfo?.currentZone?.zoneLevel === '2') {
                // 右上角切换省份
                if (item.isSynBloc === '1') {
                    return false;
                }
                return item.jtGroupFlag === '0';
            }
            if (item.provinceId === 0) {
                return true;
            }
            return item.jtGroupFlag === '1';
        }
        if (login.userZoneInfo?.zoneLevel === '5') {
            // 大区用户
            if (frameInfo?.systemInfo?.currentZone?.zoneLevel !== '5') {
                if (zones[1]?.zoneId !== frameInfo?.systemInfo?.currentZone?.zoneId) {
                    return false;
                }
                if (item.jtGroupFlag === '0') {
                    return true;
                }
                return hasSpecialAuth;
            }
            if (item.jtGroupFlag === '0') {
                return true;
            }
            return hasSpecialAuth;
        }
        if (item.jtGroupFlag === '0') {
            return true;
        }
        return hasSpecialAuth;
    };

    const createFilterCondition = (professionalEnum, provinceEnum, frameInfos) => {
        return [
            {
                title: '归属省份',
                dataIndex: 'provinceId',
                hideInTable: true,
                ellipsis: true,
                hideInSearch: false,
                initialValue:
                    frameInfo.systemInfo?.currentZone?.zoneLevel !== '1'
                        ? Number(getInitialProvince(frameInfo?.systemInfo?.currentZone?.zoneId, frameInfos.userInfo))
                        : [],
                renderFormItem: (item, { type, ...rest }) => {
                    let provinceList = provinceEnum;
                    if (frameInfo.systemInfo?.currentZone?.zoneLevel !== '1') {
                        provinceList = provinceEnum.filter(
                            (items) => items.id === Number(getInitialProvince(frameInfo?.systemInfo?.currentZone?.zoneId, frameInfos.userInfo)),
                        );
                    }
                    return (
                        <Select
                            {...rest}
                            placeholder={frameInfo.systemInfo?.currentZone?.zoneLevel !== '1' ? '请选择省份' : '默认全部'}
                            align="left"
                            allowClear
                            mode={frameInfo.systemInfo?.currentZone?.zoneLevel !== '1' ? '' : 'multiple'}
                            maxTagCount={1}
                        >
                            {provinceList.map((items) => {
                                return (
                                    <Select.Option key={items.id} value={items.id}>
                                        {items.txt}
                                    </Select.Option>
                                );
                                // }
                            })}
                        </Select>
                    );
                    // }
                    // return (
                    //     <Select {...rest} placeholder={`请选择省份`} align="left">
                    //         {provinceEnum.map((item) => (
                    //             <Select.Option key={item.id} value={item.id}>
                    //                 {item.txt}
                    //             </Select.Option>
                    //         ))}
                    //     </Select>
                    // );
                },
            },
            {
                title: '归属专业',
                dataIndex: 'professionalType',
                hideInTable: true,
                hideInSearch: false,
                ellipsis: true,
                initialValue: -1,
                // initialValue: professionalEnum.length ? professionalEnum[0].id : '',
                renderFormItem: (item, { type, ...rest }) => {
                    return (
                        <Select {...rest} placeholder={`请选择专业`} align="left">
                            {professionalEnum.map((items) => (
                                <Select.Option key={items.id} value={items.id}>
                                    {items.txt}
                                </Select.Option>
                            ))}
                        </Select>
                    );
                },
            },
            {
                title: '班组模式',
                dataIndex: 'mteamModel',
                hideInTable: true,
                ellipsis: true,
                hideInSearch: false,
                initialValue: -1,
                renderFormItem: (item, { type, ...rest }) => {
                    return (
                        <Select {...rest} placeholder={`请选择班组模式`} align="left">
                            <Select.Option value={-1}>全部</Select.Option>
                            <Select.Option value={1}>值班</Select.Option>
                            <Select.Option value={2}>包机</Select.Option>
                        </Select>
                    );
                },
            },
            {
                title: '班组名称',
                dataIndex: 'mteamName',
                hideInTable: true,
                ellipsis: true,
                hideInSearch: false,
                renderFormItem: () => {
                    return <Input placeholder="请输入班组名称" />;
                },
            },
        ];
    };

    const handleEdit = (row) => {
        sendLogFn({ authKey: 'maintainTeam:edit' });
        setEditRowData({
            isAdd: true,
            ...row,
            mteamDimensions: {
                label: row.dimensions,
                value: row.alarmsFieldsCond,
            },
            title: '编辑',
        });
    };

    // todo-不调用过滤器服务，传值给高勇的服务
    const deleteItem = (row, params) => {
        Modal.confirm({
            title: '提示',
            content: '如果删除班组信息，将会导致班组信息对应的规则也被删除，确认执行操作吗？',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            okText: '确认',
            okButtonProps: { prefixCls: 'oss-ui-btn' },
            cancelButtonProps: { prefixCls: 'oss-ui-btn' },
            okType: 'danger',
            cancelText: '取消',
            prefixCls: 'oss-ui-modal',
            onOk: () => {
                // onDeleteFilterInfo({
                // filterId: row.relatedRuleId, //过滤器ID
                // moduleId: moduleId,
                // modelId: modelId,
                // }).then((res) => {
                // if (res.success)
                deleteMaintainTeam(
                    {
                        provinceId: row.provinceId,
                        mteamId: row.mteamId,
                        mteamModel: row.mteamModel,
                        filterId: row.relatedRuleId, // 过滤器ID
                        moduleId,
                        modelId,
                        modifier: props.login.userId,
                    },
                    frameInfo,
                    params,
                ).then(() => {
                    sendLogFn({ authKey: 'maintainTeam:deleteTrue', logContext: `删除班组：${row?.mteamName}` });
                    actionRef.current.reload();
                });
            },
            onCancel: () => {
                sendLogFn({ authKey: 'maintainTeam:deleteCancel' });
            },
        });
    };

    // const handleSearch = (row) => {
    //     setEditRowData({
    //         ...row,
    //         IsSearch: true,
    //         mteamDimensions: {
    //             label: row.dimensions,
    //             value: row.alarmsFieldsCond,
    //         },
    //         title: '查看',
    //     });
    // };

    // const defineRows = (row) => {
    //     if (getInitialProvince(frameInfo?.systemInfo?.currentZone?.zoneId, frameInfo.userInfo) === row.provinceId) {
    //         return true;
    //     }
    //     return false;
    // };
    const judgeAuth = (row) => {
        let zoneLevel = ''; // 用户级别
        let zoneId2 = ''; // 用户级别
        let currentZoneLevel = ''; // 右上角切换级别
        let currentZoneId = ''; // 右上角切换级别
        if (frameInfo.userInfo) {
            const userInfo = JSON.parse(frameInfo.userInfo);
            zoneLevel = userInfo?.zones[0]?.zoneLevel;
            zoneId2 = userInfo?.zones[1]?.zoneId;
            currentZoneLevel = frameInfo?.systemInfo?.currentZone?.zoneLevel;
            currentZoneId = frameInfo?.systemInfo?.currentZone?.zoneId;
        }
        let ifDisabled = false;
        console.log(zoneLevel, zoneId2, currentZoneLevel, currentZoneId, '==judge', row);
        if (zoneLevel === '1') {
            // 集团用户
            if (hasSpecialAuth) {
                ifDisabled = row.jtGroupFlag === '1';
            } else {
                if (currentZoneLevel === '2' || currentZoneLevel === '5') {
                    ifDisabled = false;
                } else {
                    ifDisabled = row.jtGroupFlag === '1' && row.provinceName === '集团';
                }
            }
        } else if (zoneLevel === '5' && zoneId2 !== currentZoneId) {
            // 大区用户
            if (hasSpecialAuth) {
                ifDisabled = currentZoneLevel === '5';
            } else {
                if (currentZoneLevel === '5') {
                    ifDisabled = row.jtGroupFlag === '0';
                } else {
                    ifDisabled = false;
                }
            }
        } else {
            // 省份地市用户
            if (hasSpecialAuth) {
                ifDisabled = true;
            } else {
                ifDisabled = row.jtGroupFlag === '0';
            }
        }
        return !ifDisabled;
    };

    const handleJump = (row) => {
        props.pageInfo.setLoadType('init');
        console.log(!judgeAuth(row), '===auth');
        props.history.push({
            pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/maintenance/${Number(row.mteamModel)}`,
            state: {
                mteamInfo: row,
                hasSpecialAuth: row.mteamModel === 3 && row.type === '3' ? true : !judgeAuth(row),
            },
        });
    };

    const getMaintainEnums = (bool) => {
        let professionalEnum = [];
        let provinceEnum = [];
        let filterCondition = createFilterCondition(professionalEnum, provinceEnum, frameInfo);
        const handleColum = {
            title: '操作',
            dataIndex: 'rowKey',
            width: 120,
            hideInSearch: true,
            align: 'center',
            fixed: 'right',
            render: (text, row) => {
                let isAdmin = false;
                if (frameInfo.userInfo) {
                    const userInfo = JSON.parse(frameInfo.userInfo);
                    isAdmin = userInfo && userInfo.isAdmin;
                }
                if (isAdmin || frameInfo.userId === row.userId) {
                    return (
                        <Space size="middle">
                            {/* <Tooltip title="排班" key="schedule" trigger={['hover', 'click']}> */}
                            <Button
                                onClick={() => {
                                    logNew('运维调度班组排班', '500248');
                                    sendLogFn({ authKey: 'maintainTeam:schedule' });
                                    handleJump(row);
                                }}
                                type="text"
                                style={{ padding: 0 }}
                            >
                                <Icon title="排班" style={{ color: '#3CA9E1' }} component={svg1} />
                            </Button>
                            {/* </Tooltip> */}
                            <Tooltip addLog={true} title="编辑" key="edit" trigger={['hover', 'click']}>
                                <AuthButton
                                    addLog={true}
                                    onClick={() => {
                                        handleEdit(row);
                                    }}
                                    type="text"
                                    style={{ padding: 0 }}
                                    authKey="maintainTeam:edit"
                                    disabled={judgeAuth(row)}
                                    // disabled={zoneLevel === '1' && row.jtGroupFlag === '0' && row.provinceId !== 0}
                                    hasSpecialAuth={judgeAuthFunc(row)}
                                >
                                    <Icon antdIcon type="FormOutlined" />
                                </AuthButton>
                            </Tooltip>
                            <Tooltip title="删除" key="delete">
                                <AuthButton
                                    addLog={true}
                                    onClick={(params) => {
                                        sendLogFn({ authKey: 'maintainTeam:delete' });
                                        deleteItem(row, params);
                                    }}
                                    type="text"
                                    style={{ padding: 0 }}
                                    authKey="maintainTeam:delete"
                                    disabled={judgeAuth(row)}
                                    // disabled={zoneLevel === '1' && row.jtGroupFlag === '0' && row.provinceId !== 0}
                                    hasSpecialAuth={judgeAuthFunc(row)}
                                >
                                    <Icon key="2" title="删除" antdIcon type="DeleteOutlined" />
                                </AuthButton>
                            </Tooltip>
                            <Tooltip title="查看" key="search" trigger={['hover', 'click']}>
                                <Icon
                                    antdIcon
                                    type="SearchOutlined"
                                    onClick={() => {
                                        handleSearch(row);
                                    }}
                                />
                            </Tooltip>
                        </Space>
                    );
                }
                return (
                    <Space size="middle">
                        <Button
                            onClick={() => {
                                sendLogFn({ authKey: 'maintainTeam:schedule' });
                                handleJump(row);
                            }}
                            type="text"
                            style={{ padding: 0 }}
                        >
                            <Icon title="排班" style={{ color: '#3CA9E1' }} component={svg1} />
                        </Button>
                        <Tooltip title="查看" key="search" trigger={['hover', 'click']}>
                            <Icon
                                antdIcon
                                type="SearchOutlined"
                                onClick={() => {
                                    handleSearch(row);
                                }}
                            />
                        </Tooltip>
                    </Space>
                );
            },
        };
        setEnumsList({ professionalEnum, provinceEnum });
        if (!bool) {
            setCurrentColums((state) => [...state, handleColum]);
        } else {
            setCurrentColums((state) => [...state]);
        }
        // setSubmitParams({
        //     professionalType: professionalEnum.length ? professionalEnum[0].id : '',
        //     provinceId: getInitialProvince(provinceEnum)
        // });

        Promise.all([getProfessionalEnum3Maintenance(frameInfo), getProvinceEnum2Maintenance(frameInfo)]).then((res) => {
            professionalEnum = res[0].data;
            provinceEnum = [];
            if (typeof res[1] === 'object') {
                provinceEnum = res[1];
            }
            filterCondition = createFilterCondition(professionalEnum, provinceEnum, frameInfo);
            // handleColum = {
            //     title: '操作',
            //     dataIndex: 'rowKey',
            //     width: 40,
            //     hideInSearch: true,
            //     align: 'center',
            //     fixed: 'right',
            //     render: (text, row, index) => {
            //         let isAdmin = false;
            //         if (frameInfo.userInfo) {
            //             const userInfo = JSON.parse(frameInfo.userInfo);
            //             isAdmin = userInfo && userInfo.isAdmin;
            //         }
            //         if (isAdmin || frameInfo.userName === row.creator) {
            //             return (
            //                 <Space size="middle">
            //                     <Tooltip title="编辑" key="edit">
            //                         <Icon antdIcon type="FormOutlined" onClick={handleEdit.bind(this, row)} />
            //                     </Tooltip>
            //                     <Tooltip title="删除" key="delete">
            //                         <Icon key="2" title="删除" antdIcon onClick={deleteItem.bind(this, row, index)} type="DeleteOutlined" />
            //                     </Tooltip>
            //                 </Space>
            //             );
            //         } else {
            //             return '-';
            //         }
            //     },
            // };
            setEnumsList({ professionalEnum, provinceEnum });
            // setCurrentColums((state) => [...state, handleColum, ...filterCondition]);
            if (!bool) {
                setCurrentColums((state) => [...state, ...filterCondition]);
            } else {
                setCurrentColums((state) => [...state.filter((e) => !e.hideInTable), ...filterCondition]);
            }
            setSubmitParams({
                professionalType: professionalEnum[0]?.id,
                provinceId:
                    frameInfo?.systemInfo?.currentZone?.zoneLevel !== '1'
                        ? getInitialProvince(frameInfo?.systemInfo?.currentZone?.zoneId, frameInfo.userInfo)
                        : [],
                mteamModel: -1,
            });

            actionRef.current?.reload();
        });
    };

    useEffect(() => {
        getMaintainEnums();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const beforeSearchSubmit = (params) => {
    //     setSubmitParams((state) => ({ ...state, ...params }));
    //     return params;
    // };

    const handleCreate = () => {
        sendLogFn({ authKey: 'maintainTeam:add' });
        if (_.isEmpty(enumsList.professionalEnum)) {
            message.error('该用户无数据权限');
            return;
        }
        const userInfos = JSON.parse(frameInfo.userInfo);
        const professionId = formRef.current?.getFieldValue('professionalType') || submitParams.professionalType;
        const submitProfessional =
            _.filter(enumsList.professionalEnum, { id: Number(professionId) }).length > 0
                ? _.filter(enumsList.professionalEnum, { id: Number(professionId) })[0]
                : {};
        const submitProvince =
            _.filter(enumsList.provinceEnum, { id: Number(submitParams.provinceId) }).length > 0
                ? _.filter(enumsList.provinceEnum, { id: Number(submitParams.provinceId) })[0]
                : {};
        setEditRowData({
            isAdd: true,
            provinceId: submitParams.provinceId,
            provinceName: submitProvince.txt,
            professionalId: 8, // 新增默认无线网
            professionalName: '无线网',
            isSynBloc: userInfos?.zones[0]?.zoneLevel === '1' ? '1' : '0',
            title: '新增',
        });
    };

    const onCancelHandler = () => {
        const modelType = editRowData?.mteamId ? 'edit' : 'new';
        setEditRowData(null);
        if (editRowData?.isAdd && modelType === 'new') {
            sendLogFn({ authKey: 'maintainTeam:cancel' });
        } else if (editRowData?.isAdd && modelType === 'edit') {
            sendLogFn({ authKey: 'maintainTeam:editCancel' });
        }
    };

    const onSaveHandler = (newData, modelType, params, logContext) => {
        switch (modelType) {
            case 'edit':
                if (modelType === 'edit') {
                    let filterInfo = newData.newFilterInfo;
                    if (filterInfo.filterExpr.filterConditionList.length === 0) {
                        message.error('保存失败，请填写条件!');
                    } else {
                        filterInfo.modifier = frameInfo.userId;
                        filterInfo.filterProperties = [
                            {
                                key: 'nonForwardProcess',
                                value: '0',
                                propGroup: '',
                                valueDesc: '',
                                valueType: '',
                            },
                            {
                                key: 'related',
                                value: '0',
                                propGroup: '',
                                valueDesc: '',
                                valueType: '',
                            },
                            {
                                key: 'send_system',
                                value: '1',
                                propGroup: '',
                                valueDesc: '',
                                valueType: '',
                            },
                            {
                                key: 'restrain_projectalarm',
                                value: '1',
                                propGroup: '',
                                valueDesc: '',
                                valueType: '',
                            },
                            {
                                key: 'delayseconds',
                                value: '0',
                                propGroup: '',
                                valueDesc: '',
                                valueType: '',
                            },
                        ];
                        // 修改时不传creator
                        filterInfo = _.omit(filterInfo, ['creator']);
                        newData.newFilterInfo = filterInfo;
                        updateMaintainTeam(newData, frameInfo, params).then((res) => {
                            if (res.code === '0') {
                                message.success('更新班组成功');
                                if (logContext) {
                                    sendLogFn({ authKey: 'maintainTeam:editTrue', logContext });
                                }
                                setEditRowData(null);
                                actionRef.current.reload();
                            } else {
                                message.error(res.message);
                            }
                        });
                    }
                }
                break;
            case 'new':
                const filterInfo = newData.newFilterInfo;
                if (filterInfo.filterExpr.filterConditionList.length == 0) {
                    message.error('保存失败，请填写条件!');
                } else {
                    filterInfo.filterProperties = [
                        {
                            key: 'nonForwardProcess',
                            value: '0',
                            propGroup: '',
                            valueDesc: '',
                            valueType: '',
                        },
                        {
                            key: 'related',
                            value: '0',
                            propGroup: '',
                            valueDesc: '',
                            valueType: '',
                        },
                        {
                            key: 'send_system',
                            value: '1',
                            propGroup: '',
                            valueDesc: '',
                            valueType: '',
                        },
                        {
                            key: 'restrain_projectalarm',
                            value: '1',
                            propGroup: '',
                            valueDesc: '',
                            valueType: '',
                        },
                        {
                            key: 'delayseconds',
                            value: '0',
                            propGroup: '',
                            valueDesc: '',
                            valueType: '',
                        },
                    ];
                    // 修改时不传creator
                    newData.newFilterInfo = filterInfo;
                    newData.distributionModelName = undefined;
                    saveMaintainTeam(newData, frameInfo, params).then((res) => {
                        if (res.code === '1') {
                            message.error('班组名称已存在!');
                        } else {
                            message.success('新建班组成功');
                            if (logContext) {
                                sendLogFn({ authKey: 'maintainTeam:addTrue', logContext });
                            }
                            setEditRowData(null);
                            getMaintainEnums(true);
                        }
                    });
                }
                break;
            default:
                break;
        }
    };

    const xWidth = currentColums.reduce((total, item) => {
        return total + item.width;
    }, 0);

    return (
        <div className="maintain-team-mode-wrapper oss-imp-alarm-protable-search">
            {showMode && <ShowModeContent frameInfo={frameInfo} />}
            <div className="maintain-team-protable-wrapper" style={{ height: showMode ? 'calc(100% - 450px)' : '100%' }}>
                {submitParams && (
                    <VirtualTable
                        rowKey="rowKey"
                        global={window}
                        formRef={formRef}
                        columns={currentColums}
                        columnsState={columnsState}
                        request={(params, sorter, filter) => {
                            const currentParams = params.professionalType
                                ? params
                                : {
                                      ...params,
                                      ...submitParams,
                                  };
                            // if (!submitParams.provinceId) {
                            //     return {
                            //         success: true,
                            //         total: 0,
                            //         data: []
                            //     };
                            // }
                            if (frameInfo.systemInfo?.currentZone?.zoneLevel === '1' && currentParams.provinceId) {
                                currentParams.provinceIds =
                                    typeof currentParams?.provinceId === 'object' ? currentParams.provinceId : [currentParams.provinceId];
                                currentParams.provinceId = undefined;
                            }

                            if (frameInfo.systemInfo?.currentZone?.zoneLevel === '1' && currentParams.provinceIds?.length === 0) {
                                currentParams.provinceIds = enumsList.provinceEnum.map((item) => item.id);
                                currentParams.provinceId = undefined;
                            }
                            return getMaintainTeamList(currentParams, sorter, filter, frameInfo);
                        }}
                        size="small"
                        search={
                            showMode
                                ? false
                                : {
                                      optionRender: ({ searchText }, { form }) => {
                                          return [
                                              <Button
                                                  key="searchText"
                                                  type="primary"
                                                  onClick={() => {
                                                      form?.submit();
                                                  }}
                                              >
                                                  {searchText}
                                              </Button>,
                                          ];
                                      },
                                      // className: 'virtualTable-form-setting',
                                      span: { xs: 24, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 },
                                  }
                        }
                        x={xWidth}
                        toolBarRender={() => [
                            <Icon
                                component={svg2}
                                classname="add-svg"
                                onClick={() => {
                                    // const { user1 = '968615', user2 = '908496' } = useEnvironmentModel.data.environment;
                                    // if (props.login.userId === user1 || props.login.userId === user2) {
                                    //     const { actions, messageTypes } = shareActions;
                                    //     actions?.postMessage?.(messageTypes.switchUser, {
                                    //         successorId: props.login.userId === user1 ? user2 : user1,
                                    //     });
                                    //     return;
                                    // }
                                    sendLogFn({ authKey: 'maintainTeam:reception' });
                                    const submitProvince =
                                        _.filter(enumsList.provinceEnum, {
                                            id: Number(getInitialProvince(frameInfo?.systemInfo?.currentZone?.zoneId, frameInfo.userInfo)),
                                        }).length > 0
                                            ? _.filter(enumsList.provinceEnum, {
                                                  id: Number(getInitialProvince(frameInfo?.systemInfo?.currentZone?.zoneId, frameInfo.userInfo)),
                                              })[0]
                                            : {};
                                    handleJump({
                                        mteamModel: 3,
                                        type: '3',
                                        provinceId: getInitialProvince(frameInfo?.systemInfo?.currentZone?.zoneId, frameInfo.userInfo),
                                        provinceName: submitProvince.txt,
                                    });
                                }}
                            />,
                            <AuthButton addLog={true} authKey="maintainTeam:add" key="1" onClick={handleCreate}>
                                <Icon antdIcon type="PlusOutlined" />
                                新建
                            </AuthButton>,
                            <img
                                src={ArrowDown}
                                onClick={() => {
                                    sendLogFn({
                                        authKey: showMode ? 'maintainTeam:retract' : 'maintainTeam:expand',
                                    });
                                    setShowMode((prev) => !prev);
                                }}
                                style={{
                                    width: 14,
                                    height: 8,
                                    cursor: 'pointer',
                                    transition: 'transform 0.4s',
                                    transform: !showMode ? 'translateY(-2px)' : 'translateY(-2px) rotate(180deg)',
                                }}
                                alt=""
                            />,
                        ]}
                        // beforeSearchSubmit={beforeSearchSubmit}
                        actionRef={actionRef}
                    />
                )}
            </div>
            {editRowData && (
                <MaintainEdit
                    rowData={editRowData}
                    onSave={onSaveHandler}
                    onCancel={onCancelHandler}
                    hasSpecialAuth={judgeAuthFunc(editRowData) || editRowData.isAdd}
                    hideReverse
                />
            )}
        </div>
    );
};

const Index = (prop) => (
    <KeepAlive>
        <MaintainTeam {...prop} />
    </KeepAlive>
);

export default withModel([useLoginInfoModel, usePageInfo], (shareInfo) => ({
    login: shareInfo[0],
    pageInfo: shareInfo[1],
}))(Index);
