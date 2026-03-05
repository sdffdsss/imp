import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Modal, Input, Icon, Radio, Space, Col, Row, Button, Upload, message, Tabs, List } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { blobDownLoad } from '@Common/utils/download';
import CustomModalFooter from '@Src/components/custom-modal-footer';
import produce from 'immer';
import moment from 'moment';
import GroupSchedule from '../../../../../components/edit-schedule';
import WorkRecordModal from '../work-record-modal';
import {
    exportTemporaryRoute,
    exportImportFile,
    saveWorkingPlan,
    getFindWorkingPlan,
    getDefaultWorkingPlan,
    getLastNewRule,
    updateRule,
    downloadWorkRecordTempFileApi,
    downloadWorkRecordFileApi,
} from '../api';
import { transformWorkRecordConfigRetrieve, defineScheduleData, transformTableDataToSaveData } from './utils';
import { planTypes } from './constants';
import { CustomizedWorkingPlan } from './component/customized-working-plan';

const GroupScheduleContent = forwardRef(GroupSchedule);
const ProductionPlanModal = (props) => {
    const { handleCancel, rowInfo, refreshTableData, loginInfo } = props;
    const { provinceId, groupId, workingPlainFlag, workShiftInfo } = rowInfo;

    const { zoneLevelFlags } = loginInfo;
    const [workingPlanType, setWorkingPlanType] = useState();
    const [workingPlanTypeSetting, setWorkingPlanTypeSetting] = useState({
        1: {
            tableDataSource: [],
            saveData: null,
        },
        2: {
            tableDataSource: [],
            saveData: null,
        },
        3: [],
        4: {
            sceneId: 3,
            sceneName: '集团核心网',
            workShiftList: [],
        },
    });

    const [importFile, setImportFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeWorkShift, setActiveWorkShift] = useState(1);
    const [editScheduleVisible, setEditScheduleVisible] = useState(false);

    const [scheduleTimeRange, setScheduleTimeRange] = useState();

    const workShiftInfoRef = useRef(workShiftInfo);
    const workRecordContentRef = useRef({});
    const prevActiveWorkShiftRef = useRef(1);
    const scheduleRef = useRef(null);
    const editingRowsRef = useRef([]);
    const showPlanTypesRef = useRef(zoneLevelFlags.isCountryZone ? planTypes : planTypes.slice(0, -1));

    const handleOk = () => {
        let resDataFillWorkRecord = null;

        if ([1, 2].includes(workingPlanType)) {
            if (workingPlanTypeSetting[workingPlanType].tableDataSource?.length === 0) {
                message.warn('维护作业计划列表不能为空');
                return;
            }
            const { tableDataSource: tableDataSourceTemp, saveData: saveDataTemp } = workingPlanTypeSetting[workingPlanType];

            resDataFillWorkRecord = transformTableDataToSaveData(tableDataSourceTemp, saveDataTemp);
        } else if (workingPlanType === 3) {
            const hasError = workingPlanTypeSetting[3].length === 0 || workingPlanTypeSetting[3].every((item) => item.tableDataSource.length === 0);
            if (hasError) {
                message.warn('至少设置1个班次的维护作业计划');
                return;
            }

            resDataFillWorkRecord = workingPlanTypeSetting[3]
                .filter((item) => item.tableDataSource.length > 0 && item.saveData)
                .map((item) => {
                    const { tableDataSource: tableDataSourceTemp, saveData: saveDataTemp } = item;
                    const itemIn = transformTableDataToSaveData(tableDataSourceTemp, saveDataTemp);

                    return {
                        workShiftId: item.workShiftId,
                        ...itemIn,
                    };
                });
        } else if (workingPlanType === 4) {
            resDataFillWorkRecord = {
                sceneId: workingPlanTypeSetting[4].sceneId,
                sceneName: workingPlanTypeSetting[4].sceneName,
                workShiftList: null,
            };
        }

        const sendData = {
            provinceId,
            groupId,
            workingPlanType,
        };
        if ([1, 2].includes(workingPlanType)) {
            Object.assign(sendData, {
                workShiftList: [
                    {
                        ...resDataFillWorkRecord,
                        workShiftId: -1,
                    },
                ],
            });
        } else if ([3].includes(workingPlanType)) {
            Object.assign(sendData, {
                workShiftList: resDataFillWorkRecord,
            });
        } else if ([4].includes(workingPlanType)) {
            Object.assign(sendData, resDataFillWorkRecord);
        }
        saveWorkingPlan(sendData).then((res) => {
            if (res.code === 200) {
                message.success('保存成功');
                refreshTableData();
            }
        });
    };

    const mergeRows = (rows, key, rowName, colName) => {
        if (rows.length === 0) {
            return [];
        }
        rows[0][rowName] = 1;
        let idx = 0;
        return rows.slice(1).reduce(
            (mergedRows, item, index) => {
                if (item[key] === mergedRows[idx][key]) {
                    mergedRows[idx][rowName]++;
                    item[colName] = 0;
                } else {
                    item[rowName] = 1;
                    idx = index + 1;
                }
                return [...mergedRows, item];
            },
            [rows[0]],
        );
    };

    const formatTableData = (data) => {
        let tableData = [];
        if (data) {
            data.mainProjects.forEach((j) => {
                if (j.subProjects && j.subProjects.length) {
                    j.subProjects.forEach((k) => {
                        const workRecordConfigs = transformWorkRecordConfigRetrieve(k.planExecTimesAndWorkRecord);

                        if (k.planExecTimes && k.planExecTimes.length) {
                            k.planExecTimes.forEach((l) => {
                                tableData.push({
                                    planExecTime: l,
                                    subProject: k.subProject,
                                    mainProject: j.mainProject,
                                    workShiftTime: k.workShiftTime,
                                    notes: k.notes,
                                    evaluationCriterion: k.evaluationCriterion,
                                    workRecordConfig: workRecordConfigs.find((item) => item[0] === l) || [l, [[]]],
                                });
                            });
                        }
                    });
                }
            });
            tableData = mergeRows(tableData, 'mainProject', 'rowSpanO', 'colSpanO');
            tableData = mergeRows(tableData, 'subProject', 'rowSpanW', 'colSpanW');
        }
        return tableData;
    };

    const initDefaultWorkingPlan = async () => {
        const res = await getDefaultWorkingPlan();

        if (res.data.mainProjects.length > 0) {
            setWorkingPlanTypeSetting((prev) => {
                const saveData = res.data;
                return {
                    ...prev,
                    1: {
                        tableDataSource: formatTableData(saveData),
                        saveData,
                    },
                };
            });
            setWorkingPlanType(1);
        }
    };

    const initOtherWorkingPlan = async () => {
        const data = {
            groupId,
        };
        const res = await getFindWorkingPlan(data);
        const workingPlanTypeTemp = res?.data?.workingPlanType;

        let settingData = null;
        if ([1, 2].includes(workingPlanTypeTemp)) {
            const saveData = res.data.workShiftList[0];

            settingData = {
                tableDataSource: formatTableData(saveData),
                saveData,
            };
        } else if (workingPlanTypeTemp === 3) {
            settingData = workShiftInfoRef.current?.rules?.map((item) => {
                const workShiftInfoTemp = res.data.workShiftList.find((itemIn) => itemIn.workShiftId === item.workShiftId);

                if (workShiftInfoTemp) {
                    return {
                        ...item,
                        tableDataSource: formatTableData(workShiftInfoTemp),
                        saveData: workShiftInfoTemp,
                    };
                }

                return {
                    ...item,
                    tableDataSource: [],
                    saveData: null,
                };
            });

            setActiveWorkShift(workShiftInfoRef.current?.rules?.[0].workShiftId);
        } else {
            settingData = res.data;
        }
        setWorkingPlanTypeSetting((prev) => {
            if (workingPlanTypeTemp === 4) {
                return {
                    ...prev,
                    [workingPlanTypeTemp]: {
                        ...settingData,
                        sceneId: settingData.sceneId < 3 ? 3 : settingData.sceneId,
                    },
                };
            }

            return {
                ...prev,
                [workingPlanTypeTemp]: settingData,
            };
        });
        setWorkingPlanType(workingPlanTypeTemp);
    };

    const initWorkingPlanTypeSettingForWorkShift = (rules) => {
        setWorkingPlanTypeSetting((prev) => {
            return {
                ...prev,
                3: rules.map((item) => {
                    return {
                        ...item,
                        tableDataSource: [],
                        saveData: null,
                    };
                }),
            };
        });
    };

    const getSchduleData = (e) => {
        const { advanceTime, delayTime } = e;
        if (advanceTime + delayTime >= scheduleTimeRange) {
            message.warn('提前时间+延后时间不能大于等于班次中最小的时间跨度');
            return;
        }
        if (defineScheduleData(e) === 'success') {
            const { date } = e;
            const rules = date.map((item) => {
                return {
                    workShiftName: item.name,
                    beginTime: moment(item.startTime).format('HH:mm:ss'),
                    endTime: moment(item.endTime).format('HH:mm:ss'),
                    timeType: item.type,
                };
            });
            const data = {
                groupId: rowInfo.groupId,
                rules,
                advanceTime,
                delayTime,
            };
            updateRule(data).then((res) => {
                if (res.code === 200) {
                    getLastNewRule({ groupId: rowInfo.groupId }).then((res1) => {
                        workShiftInfoRef.current = res1;
                        initWorkingPlanTypeSettingForWorkShift(res1.rules);
                        setActiveWorkShift(res1.rules[0].workShiftId);
                        setEditScheduleVisible(false);
                    });
                } else {
                    message.warn(res.message);
                }
            });
        } else {
            message.warn(defineScheduleData(e));
        }
    };

    useEffect(() => {
        if (workingPlainFlag === 0) {
            initDefaultWorkingPlan();
        } else if (workingPlainFlag === 1) {
            initOtherWorkingPlan();
        }
    }, []);

    const changeFile = (file) => {
        setImportFile(file);
        return false;
    };

    const ImportFile = () => {
        const formData = new FormData();

        formData.append('file', importFile);
        exportImportFile(formData).then((res) => {
            if (res?.data) {
                const saveData = { ...res.data };

                if (workingPlanType === 2) {
                    setWorkingPlanTypeSetting((prev) => {
                        return {
                            ...prev,
                            2: {
                                tableDataSource: formatTableData(saveData),
                                saveData,
                            },
                        };
                    });
                } else if (workingPlanType === 3) {
                    setWorkingPlanTypeSetting((prev) => {
                        const index = prev[3].findIndex((item) => item.workShiftId === activeWorkShift);
                        return {
                            ...prev,
                            3: produce(prev[3], (draft) => {
                                draft.splice(index, 1, {
                                    ...draft[index],
                                    tableDataSource: formatTableData(saveData),
                                    saveData,
                                });
                            }),
                        };
                    });
                }
                message.success('导入成功');
            } else {
                message.success(res?.message);
            }
        });
    };

    const handleExport = () => {
        exportTemporaryRoute().then((res) => {
            if (res) {
                blobDownLoad(res, `维护作业计划导入模板${moment().format('YYYYMMDDHHmmss')}.xlsx`);
            }
        });
    };

    const groupColumns = [
        {
            title: '主项目',
            dataIndex: 'mainProject',
            key: 'mainProject',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
            render: (text) => text,
            onCell: (_) => ({
                rowSpan: _.rowSpanO,
                colSpan: _.colSpanO,
            }),
        },
        {
            title: '分项目',
            dataIndex: 'subProject',
            key: 'subProject',
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
            render: (text) => text,
            onCell: (_) => {
                return {
                    rowSpan: _.rowSpanW,
                    colSpan: _.colSpanW,
                };
            },
        },
        {
            title: '班次时间',
            dataIndex: 'workShiftTime',
            key: 'workShiftTime',
            hideInSearch: true,
            width: 80,
            align: 'center',
            render: (text) => {
                return <div dangerouslySetInnerHTML={{ __html: text }} />;
            },
            onCell: (_) => ({
                rowSpan: _.rowSpanW,
                colSpan: _.colSpanW,
            }),
        },
        {
            title: '具体内容',
            dataIndex: 'notes',
            key: 'notes',
            hideInSearch: true,
            align: 'center',
            width: 120,
            render: (text) => {
                return <div dangerouslySetInnerHTML={{ __html: text }} />;
            },
            onCell: (_) => ({
                rowSpan: _.rowSpanW,
                colSpan: _.colSpanW,
            }),
        },
        {
            title: '评价标准',
            dataIndex: 'evaluationCriterion',
            key: 'evaluationCriterion',
            hideInSearch: true,
            align: 'center',
            width: 120,
            render: (text) => {
                return <div dangerouslySetInnerHTML={{ __html: text }} />;
            },
            onCell: (_) => ({
                rowSpan: _.rowSpanW,
                colSpan: _.colSpanW,
            }),
        },
        {
            title: '计划执行时间',
            dataIndex: 'planExecTime',
            key: 'planExecTime',
            hideInSearch: true,
            align: 'center',
            width: 80,
            ellipsis: true,
        },
        {
            title: '巡检记录模版',
            hideInTable: workingPlanType === 1 || workingPlanType === 4,
            dataIndex: 'workRecordConfig',
            key: 'workRecordConfig',
            hideInSearch: true,
            align: 'center',
            width: 150,
            render: (content) => {
                return (
                    <List
                        dataSource={content[1]}
                        renderItem={(itemRow) => {
                            return (
                                <List.Item style={{ padding: '4px', textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                    {itemRow.length === 1 && itemRow[0].type === 'input' && itemRow[0].subtype === 'presets'
                                        ? itemRow[0].value[0] || '-'
                                        : '-'}
                                </List.Item>
                            );
                        }}
                    />
                );
            },
        },
        {
            title: '操作',
            hideInTable: workingPlanType === 1 || workingPlanType === 4,
            dataIndex: 'action',
            key: 'action',
            hideInSearch: true,
            align: 'center',
            width: 100,
            render: (text, row) => {
                return (
                    <div
                        style={{
                            height: '100%',
                            fontWeight: 500,
                            color: '#10a7f0',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            if (workingPlanType === 2) {
                                editingRowsRef.current = workingPlanTypeSetting[2].tableDataSource.filter(
                                    (item) => row?.mainProject === item.mainProject && row?.subProject === item.subProject,
                                );
                            } else if (workingPlanType === 3) {
                                const activeTableSource = workingPlanTypeSetting[3].find((item) => item.workShiftId === activeWorkShift);
                                editingRowsRef.current = activeTableSource.tableDataSource.filter(
                                    (item) => row?.mainProject === item.mainProject && row?.subProject === item.subProject,
                                );
                            }
                            setModalVisible(true);
                        }}
                    >
                        <Icon antdIcon type="PlusOutlined" />
                        <p>添加自定义巡检记录模版</p>
                    </div>
                );
            },
            onCell: (_) => {
                return {
                    rowSpan: _.rowSpanW,
                    colSpan: _.colSpanW,
                };
            },
        },
    ];

    const onWorkRecordSave = () => {
        try {
            const data = workRecordContentRef.current.getValues();

            if (workingPlanType === 2) {
                setWorkingPlanTypeSetting((prev) => {
                    const newTableDataSource = prev[2].tableDataSource.map((item) => {
                        const newItem = { ...item };
                        if (
                            newItem.mainProject === editingRowsRef.current[0].mainProject &&
                            newItem.subProject === editingRowsRef.current[0].subProject
                        ) {
                            newItem.workRecordConfig = data.find((item1) => item1[0] === newItem.planExecTime);
                        }
                        return newItem;
                    });
                    // const newSaveData = transformTableDataToSaveData(newTableDataSource, prev[2].saveData);

                    return {
                        ...prev,
                        2: {
                            ...prev[2],
                            tableDataSource: newTableDataSource,
                            // saveData: newSaveData,
                        },
                    };
                });
            } else if (workingPlanType === 3) {
                setWorkingPlanTypeSetting((prev) => {
                    const index = prev[3].findIndex((item) => item.workShiftId === activeWorkShift);
                    const newTableDataSource = prev[3][index].tableDataSource.map((item) => {
                        const newItem = { ...item };
                        if (
                            newItem.mainProject === editingRowsRef.current[0].mainProject &&
                            newItem.subProject === editingRowsRef.current[0].subProject
                        ) {
                            newItem.workRecordConfig = data.find((item1) => item1[0] === newItem.planExecTime);
                        }
                        return newItem;
                    });
                    // const newSaveData = transformTableDataToSaveData(newTableDataSource, prev[3][index].saveData);
                    return {
                        ...prev,
                        3: produce(prev[3], (draft) => {
                            draft.splice(index, 1, {
                                ...draft[index],
                                tableDataSource: newTableDataSource,
                                // saveData: newSaveData,
                            });
                        }),
                    };
                });
            }

            setModalVisible(false);
        } catch (error) {
            console.log(error);
        }
    };

    function handleSwitchPlanType(event) {
        const newType = event.target.value;
        prevActiveWorkShiftRef.current = workingPlanType;
        setWorkingPlanType(newType);
        setImportFile(null);

        if (newType === 1 && (!workingPlanTypeSetting[1].saveData || workingPlanTypeSetting[1].tableDataSource.length === 0)) {
            initDefaultWorkingPlan();
        } else if (newType === 3) {
            if (workShiftInfoRef.current?.rules?.length > 0) {
                if (workingPlanTypeSetting[3].length === 0) {
                    initWorkingPlanTypeSettingForWorkShift(rowInfo.workShiftInfo.rules);
                }
                setActiveWorkShift(rowInfo.workShiftInfo.rules[0].workShiftId);
            } else {
                setEditScheduleVisible(true);
            }
        }
    }

    function handleScheduleCancel() {
        setWorkingPlanType(prevActiveWorkShiftRef.current);
        setEditScheduleVisible(false);
    }

    function formatFileName(str) {
        return str?.split('/')?.slice(-1)?.[0] || '';
    }

    function downloadWorkRecordFile(data) {
        if (data?.fileName) {
            downloadWorkRecordTempFileApi(data?.fileName).then((res) => {
                blobDownLoad(res, formatFileName(formatFileName(data)));
            });
        } else {
            downloadWorkRecordFileApi({
                filePath: data.saveFilePath,
            }).then((res) => {
                blobDownLoad(res, data.saveFileName);
            });
        }
    }

    return (
        <>
            <Modal
                title="维护作业计划"
                visible
                width={1400}
                bodyStyle={{ padding: '0', height: '630px' }}
                destroyOnClose
                maskClosable={false}
                onCancel={handleCancel}
                footer={false}
            >
                <Row style={{ padding: '10px 30px' }}>
                    <Col span={1}>类型：</Col>
                    <Col span={22}>
                        <Radio.Group value={workingPlanType} onChange={handleSwitchPlanType}>
                            {showPlanTypesRef.current.map((item) => {
                                return <Radio value={item.value}>{item.label}</Radio>;
                            })}
                        </Radio.Group>
                    </Col>
                </Row>
                <div style={{ marginBottom: workingPlanType === 3 ? '5px' : '15px', boxShadow: '0 4px 2px 0px #bbb', height: '1px' }} />
                <div style={{ height: '520px', overflow: 'hidden' }}>
                    {workingPlanType === 1 && (
                        <Row style={{ paddingTop: '10px' }}>
                            {/* <div style={{ color: 'blue', padding: '0 0 0 30px', marginBottom: '10px' }}> 预览:</div> */}
                            <Col span={24} style={{ padding: '0 20px', height: 400 }}>
                                <VirtualTable
                                    rowKey="key"
                                    global={window}
                                    columns={groupColumns}
                                    dataSource={workingPlanTypeSetting[1].tableDataSource}
                                    search={false}
                                    onReset={false}
                                    bordered
                                    options={false}
                                    tableAlertRender={false}
                                    pagination={false}
                                    renderEmpty={<div>没有满足条件的数据</div>}
                                />
                            </Col>
                        </Row>
                    )}
                    {workingPlanType === 2 && (
                        <Row>
                            <Col span={24} style={{ padding: '0 30px' }}>
                                <Row>
                                    <Col span={1} style={{ lineHeight: '28px' }}>
                                        导入：
                                    </Col>
                                    <Col span={10}>
                                        <Space>
                                            <Input value={importFile?.name} disabled />
                                            <Upload showUploadList={false} beforeUpload={(file) => changeFile(file, 2)} accept=".xls, .xlsx">
                                                <Button>选择文件</Button>
                                            </Upload>
                                            <Button disabled={!importFile} onClick={() => ImportFile(2)}>
                                                导入
                                            </Button>
                                            <Button type="link" block onClick={handleExport}>
                                                下载模板
                                            </Button>
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24} style={{ padding: '0 30px', margin: '10px 0' }}>
                                <Row style={{ color: 'blue' }}>
                                    <Col span={1}>预览：</Col>
                                    <Col span={18}>
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                downloadWorkRecordFile(workingPlanTypeSetting[2]?.saveData);
                                            }}
                                        >
                                            <span style={{ textDecoration: 'underline' }}>
                                                {workingPlanTypeSetting[2]?.saveData?.fileName
                                                    ? formatFileName(workingPlanTypeSetting[2]?.saveData?.fileName)
                                                    : workingPlanTypeSetting[2]?.saveData?.saveFileName}
                                            </span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24} style={{ padding: '0 20px', height: 450 }}>
                                <VirtualTable
                                    rowKey="key"
                                    global={window}
                                    columns={groupColumns}
                                    dataSource={workingPlanTypeSetting[2].tableDataSource}
                                    search={false}
                                    onReset={false}
                                    bordered
                                    options={false}
                                    tableAlertRender={false}
                                    pagination={false}
                                    renderEmpty={<div>没有满足条件的数据</div>}
                                />
                            </Col>
                        </Row>
                    )}
                    {workingPlanType === 3 && (
                        <Row>
                            <Col span={24} style={{ padding: '0 30px' }}>
                                {workingPlanTypeSetting[3].length > 0 && (
                                    <Tabs
                                        activeKey={`${activeWorkShift}`}
                                        onChange={(activeKey) => {
                                            setImportFile(null);
                                            setActiveWorkShift(Number(activeKey));
                                        }}
                                    >
                                        {workingPlanTypeSetting[3].map((item, index) => {
                                            return (
                                                <Tabs.TabPane
                                                    tab={`${item.workShiftName}(${item.beginTime}-${item.endTime})`}
                                                    key={`${item.workShiftId}`}
                                                >
                                                    <Col span={24} style={{ margin: '10px 0' }}>
                                                        <Row>
                                                            <Col span={1} style={{ lineHeight: '28px' }}>
                                                                导入：
                                                            </Col>
                                                            <Col span={10}>
                                                                <Space>
                                                                    <Input value={importFile?.name} disabled />
                                                                    <Upload
                                                                        showUploadList={false}
                                                                        beforeUpload={(file) => changeFile(file, 3, index)}
                                                                        accept=".xls, .xlsx"
                                                                    >
                                                                        <Button>选择文件</Button>
                                                                    </Upload>
                                                                    <Button disabled={!importFile} onClick={() => ImportFile(3, index)}>
                                                                        导入
                                                                    </Button>
                                                                    <Button type="link" block onClick={handleExport}>
                                                                        下载模板
                                                                    </Button>
                                                                </Space>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={24} style={{ marginBottom: '10px' }}>
                                                        <Row>
                                                            <Col span={1} style={{ color: 'blue' }}>
                                                                预览：
                                                            </Col>
                                                            <Col span={18}>
                                                                <Button
                                                                    type="link"
                                                                    onClick={() => {
                                                                        downloadWorkRecordFile(workingPlanTypeSetting[3][index]?.saveData);
                                                                    }}
                                                                >
                                                                    <span style={{ textDecoration: 'underline' }}>
                                                                        {workingPlanTypeSetting[3][index]?.saveData?.fileName
                                                                            ? formatFileName(workingPlanTypeSetting[3][index]?.saveData?.fileName)
                                                                            : workingPlanTypeSetting[3][index]?.saveData?.saveFileName}
                                                                    </span>
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col span={24} style={{ height: 400 }}>
                                                        <VirtualTable
                                                            rowKey="key"
                                                            global={window}
                                                            columns={groupColumns}
                                                            dataSource={item.tableDataSource}
                                                            search={false}
                                                            onReset={false}
                                                            bordered
                                                            options={false}
                                                            tableAlertRender={false}
                                                            pagination={false}
                                                            renderEmpty={<div>没有满足条件的数据</div>}
                                                        />
                                                    </Col>
                                                </Tabs.TabPane>
                                            );
                                        })}
                                    </Tabs>
                                )}
                            </Col>
                        </Row>
                    )}

                    {workingPlanType === 4 && (
                        <Row>
                            <Col span={24} style={{ padding: '0 30px' }}>
                                <CustomizedWorkingPlan
                                    defaultTabActiveKey={workingPlanTypeSetting[4].sceneId}
                                    onTabChange={(activeKey, { item }) => {
                                        setWorkingPlanTypeSetting((prev) => {
                                            return {
                                                ...prev,
                                                4: {
                                                    ...item,
                                                    workShiftList: null,
                                                },
                                            };
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                    )}
                </div>
                <div style={{ margin: '10px 0 15px', display: 'flex', justifyContent: 'center' }}>
                    <Space>
                        <Button onClick={handleCancel}>取消</Button>
                        <Button type="primary" onClick={handleOk}>
                            确定
                        </Button>
                    </Space>
                </div>
            </Modal>
            <Modal
                width={1400}
                bodyStyle={{ height: '600px' }}
                title="新建巡检记录模版"
                footer={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            onClick={() => {
                                Modal.confirm({
                                    title: '页面内容未保存是否离开?',
                                    okText: '是',
                                    cancelText: '否',
                                    onOk: () => {
                                        setModalVisible(false);
                                    },
                                    onCancel: () => {},
                                });
                            }}
                        >
                            取消
                        </Button>
                        <Button type="primary" onClick={onWorkRecordSave}>
                            确定
                        </Button>
                    </div>
                }
                destroyOnClose
                visible={modalVisible}
                maskClosable={false}
                onCancel={() => {
                    setModalVisible(false);
                }}
            >
                <WorkRecordModal rows={editingRowsRef.current} ref={workRecordContentRef} />
            </Modal>
            <Modal
                destroyOnClose
                width={800}
                title="修改班次"
                visible={editScheduleVisible}
                onCancel={handleScheduleCancel}
                footer={
                    <CustomModalFooter
                        authKey="monitorDateList:editschedule"
                        onCancel={handleScheduleCancel}
                        onOk={() => scheduleRef.current.getData()}
                    />
                }
                maskClosable={false}
            >
                <GroupScheduleContent
                    ref={scheduleRef}
                    scheduleProps={loginInfo}
                    handleSchduleData={getSchduleData}
                    getTimeRange={setScheduleTimeRange}
                    rowData={rowInfo.workShiftInfo.rules}
                    scheduleRange={rowInfo.workShiftInfo}
                    skipType="noHeader"
                />
            </Modal>
        </>
    );
};

export default ProductionPlanModal;
