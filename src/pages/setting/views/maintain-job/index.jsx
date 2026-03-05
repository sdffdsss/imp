import React, { useState, useRef, useEffect, useContext } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Button, message, Form, Input, List, Modal, Table, Icon, Upload, Tooltip } from 'oss-ui';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import { useColumnsState } from '@Src/hooks';
import { blobDownLoad } from '@Common/utils/download';
import { _ } from 'oss-web-toolkits';
import { nanoid } from 'nanoid';
import produce from 'immer';
import './index.less';
import { sendLogFn } from '@Pages/components/auth/utils';
import CustomModalFooter from '@Src/components/custom-modal-footer';
import {
    getTemporaryRoute,
    saveInfoRoute,
    exportTemporaryRoute,
    findScheduleByWorkShiftId,
    uploudWorkingPlanFile,
    dowloadWorkingPlanFile,
    deleteWorkingPlanFile,
} from './api';
import { getGroupInfo } from '../group-manage/api';
import { formatWorkRecordConfig, formatWorkRecordConfigSave, genInputPresetsRow } from './utils';
import WorkRecordTime from './work-record-time';
import TimeSelect from './component/time-select';
import { CustomizedWorkingPlan } from './component/customized-working-plan';

// 可编辑
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    selectUsersFn,
    groupInfo,
    addOneRowFn,
    deleteOneRowFn,
    ...restProps
}) => {
    const {
        userName,
        parsedUserInfo: { operationsButton },
    } = useLoginInfoModel();

    const hasAddNewAuth = operationsButton.some((item) => item.key === 'homeMaintainJob:addNewRecord');

    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const WorkRecordChangeFnRef = useRef(null);
    const realExecTimeChangeFnRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        if (!editable) {
            return;
        }
        setEditing(!editing);
        if (dataIndex) {
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });

            if (dataIndex === 'executorArray') {
                selectUsersFn(record);
            }
        }
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            // 如果是编辑的是评价，则直接写入 当前评价人
            if (values.evaluate) {
                values.evaluatorName = userName;
            }
            toggleEdit();
            handleSave(dataIndex, {
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    WorkRecordChangeFnRef.current = _.debounce((newValue) => {
        handleSave(dataIndex, {
            ...record,
            workRecordArray: newValue,
        });
    }, 400);

    realExecTimeChangeFnRef.current = _.debounce((newValue) => {
        handleSave(dataIndex, {
            ...record,
            realExecTime: newValue,
        });
    }, 400);

    function beforeUpload(file) {
        if (record.isTempId) {
            message.warn('新增的记录需保存后才可上传附件!');
            return;
        }
        const isCorrectFormat =
            file.type === 'image/bmp' ||
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'application/vnd.ms-excel' ||
            file.type === 'application/msword' ||
            file.type === 'application/pdf' ||
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
            file.type === 'application/vnd.ms-powerpoint';
        if (!isCorrectFormat) {
            message.error('请上传正确格式文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('文件大小不能超过10M!');
        }
        return isCorrectFormat && isLt2M;
    }

    function handleUpload({ file }) {
        const formData = new FormData();
        formData.append('files', file);
        formData.append('groupId', groupInfo.groupId);
        formData.append('workShiftId', groupInfo.workShiftId);
        formData.append('dateTime', groupInfo.dateTime);
        formData.append('id', record.id);

        uploudWorkingPlanFile(formData).then((res) => {
            if (res.resultCode === '200' && res.resultObj) {
                message.success('上传附件成功');

                handleSave(dataIndex, {
                    ...record,
                    files: [
                        ...record.files,
                        {
                            filePath: res.resultObj.filePath,
                            fileName: res.resultObj.fileName,
                            fileId: res.resultObj.fileId,
                        },
                    ],
                });
            }
        });
    }

    function deleteFile({ fileId, filePath }) {
        Modal.confirm({
            title: '提示',
            icon: <Icon antdIcon type="ExclamationCircleOutlined" />,
            content: '是否确认删除该附件？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                deleteWorkingPlanFile({ fileId, filePath }).then((res) => {
                    if (res.resultCode === '200') {
                        message.success('删除附件成功');
                        handleSave(dataIndex, {
                            ...record,
                            files: record.files.filter((item) => item.fileId !== fileId),
                        });
                    }
                });
            },
            onCancel() {},
        });
    }

    function downloadFile({ filePath, fileName }) {
        dowloadWorkingPlanFile({ filePath }).then((res) => {
            // blob文件流下载
            const blob = new Blob([res]);
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL || window.moxURL;
            // 创建下载链接
            const downloadHref = url.createObjectURL(blob);
            // 创建a标签并为其添加属性
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadHref;
            downloadLink.download = fileName;
            // 触发点击事件执行下载
            downloadLink.click();
        });
    }

    let childNode = children;
    if (editable) {
        if (dataIndex === 'executorArray') {
            childNode = (
                <div
                    className="editable-cell-value-wrap"
                    onClick={toggleEdit}
                    style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
                >
                    {record[dataIndex]?.length > 0
                        ? record[dataIndex].map((item, index) => {
                              return (
                                  <>
                                      {index % 2 === 0 && index > 0 && <div style={{ width: '100%' }} />}
                                      <div
                                          className="executors-item"
                                          style={{
                                              color: '#1890ff',
                                              fontSize: '12px',
                                              padding: '0 4px',
                                              lineHeight: '20px',
                                              margin: '0 2px 2px',
                                              backgroundColor: 'rgba(140,185,237,0.15)',
                                          }}
                                          key={item.mainId}
                                      >
                                          {item.mainName}
                                      </div>
                                  </>
                              );
                          })
                        : '-'}
                </div>
            );
        } else if (dataIndex === 'realExecTime') {
            childNode = (
                <div className="editable-cell-value-wrap">
                    <TimeSelect value={record[dataIndex]} record={record} onChange={realExecTimeChangeFnRef.current} />
                </div>
            );
        } else if (dataIndex === 'files') {
            childNode = (
                <div className="maintain-job-files">
                    {record[dataIndex]?.length > 0
                        ? record[dataIndex].map((item) => {
                              return (
                                  <>
                                      <div
                                          className="executors-item"
                                          style={{
                                              color: '#333333',
                                              fontSize: '12px',
                                              padding: '0 4px',
                                              lineHeight: '20px',
                                              margin: '0 0 5px 0',
                                              backgroundColor: '#ecf4fc',
                                          }}
                                          key={item.fileId}
                                      >
                                          <Tooltip title={item.fileName}>
                                              <span onClick={() => downloadFile(item)} style={{ cursor: 'pointer' }}>
                                                  {item.fileName.length > 10 ? `${item.fileName.slice(0, 10)}...` : item.fileName}
                                              </span>
                                          </Tooltip>
                                          <Icon
                                              style={{ marginLeft: '10px', color: '#1890ff' }}
                                              antdIcon
                                              type="CloseCircleOutlined"
                                              onClick={() => deleteFile(item)}
                                          />
                                      </div>
                                  </>
                              );
                          })
                        : '-'}
                </div>
            );
        } else if (dataIndex === 'actions') {
            childNode = (
                <Tooltip
                    title="上传附件：附件支持上传文件(word/excel/ppt/pdf/wps)和图片(BMP/JPEG/PNG);每个附件不超过10M;最多上传6个附件"
                    placement="topRight"
                >
                    <Upload
                        beforeUpload={beforeUpload}
                        accept=".ppt, .doc, .docx, .pdf, .xls, .xlsx, .pptx, .jpg, .jpeg, .png, .bmp"
                        customRequest={(file) => handleUpload(file)}
                        showUploadList={false}
                    >
                        <Button disabled={record.files?.length === 6} type="text" icon={<Icon antdIcon type="UploadOutlined" />} />
                    </Upload>
                </Tooltip>
            );
        } else {
            if (editing) {
                if (dataIndex === 'workRecordArray') {
                    childNode = (
                        <Form.Item
                            style={{
                                margin: 0,
                            }}
                            name={dataIndex}
                        >
                            <WorkRecordTime
                                hasAddNewAuth={hasAddNewAuth}
                                record={record}
                                onChange={WorkRecordChangeFnRef.current}
                                onAddRecord={addOneRowFn}
                                onDeleteRecord={deleteOneRowFn}
                            />
                        </Form.Item>
                    );
                } else {
                    childNode = (
                        <div className="editable-cell-value-wrap">
                            <Form.Item
                                style={{
                                    margin: 0,
                                }}
                                name={dataIndex}
                            >
                                <Input maxLength={300} ref={inputRef} onPressEnter={save} onBlur={save} />
                            </Form.Item>
                        </div>
                    );
                }
            } else {
                if (dataIndex === 'workRecordArray') {
                    childNode = (
                        <div className="editable-cell-value-wrap" onClick={toggleEdit}>
                            <List
                                dataSource={record[dataIndex]}
                                renderItem={(item, index) => {
                                    return (
                                        <List.Item
                                            style={{ padding: record[dataIndex].length > 1 ? '8px 30px 8px 0' : '0 30px 0 0', position: 'relative' }}
                                        >
                                            <div style={{ width: '100%', textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                                {item.reduce((accuIn, itemIn) => {
                                                    return `${accuIn}${itemIn.result}`;
                                                }, '') || '-'}
                                            </div>
                                            {hasAddNewAuth && !record.canDelete && index === record[dataIndex].length - 1 && (
                                                <Button
                                                    type="text"
                                                    style={{
                                                        position: 'absolute',
                                                        right: '-8px',
                                                        top: record[dataIndex].length > 1 ? '4px' : '-4px',
                                                    }}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        addOneRowFn();
                                                    }}
                                                    icon={<Icon antdIcon type="PlusOutlined" style={{ color: '#10a7f0', cursor: 'pointer' }} />}
                                                />
                                            )}
                                            {hasAddNewAuth && record.canDelete && (
                                                <Button
                                                    type="text"
                                                    style={{
                                                        position: 'absolute',
                                                        right: '-8px',
                                                        top: record[dataIndex].length > 1 ? '4px' : '-4px',
                                                    }}
                                                    onClick={deleteOneRowFn}
                                                    icon={<Icon antdIcon type="MinusOutlined" style={{ color: '#10a7f0', cursor: 'pointer' }} />}
                                                />
                                            )}
                                        </List.Item>
                                    );
                                }}
                            />
                        </div>
                    );
                } else {
                    childNode = (
                        <div className="editable-cell-value-wrap" onClick={toggleEdit}>
                            {children}
                        </div>
                    );
                }
            }
        }
    } else if (dataIndex === 'workRecordArray') {
        if (record[dataIndex]?.length > 0) {
            childNode = (
                <List
                    dataSource={record[dataIndex]}
                    renderItem={(item) => {
                        return (
                            <List.Item>
                                <div style={{ width: '100%', textAlign: 'left', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                    {item.reduce((accuIn, itemIn) => {
                                        return `${accuIn}${itemIn.result}`;
                                    }, '') || '-'}
                                </div>
                            </List.Item>
                        );
                    }}
                />
            );
        } else {
            childNode = '-';
        }
    } else if (dataIndex === 'executorArray') {
        childNode = (
            <div className="executors" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {record[dataIndex]?.length > 0
                    ? record[dataIndex].map((item, index) => {
                          return (
                              <>
                                  {index % 2 === 0 && index > 0 && <div style={{ width: '100%' }} />}
                                  <div
                                      className="executors-item"
                                      style={{
                                          color: '#1890ff',
                                          fontSize: '12px',
                                          padding: '0 4px',
                                          lineHeight: '20px',
                                          margin: '0 2px 2px',
                                          backgroundColor: 'rgba(140,185,237,0.15)',
                                      }}
                                      key={item.mainId}
                                  >
                                      {item.mainName}
                                  </div>
                              </>
                          );
                      })
                    : '-'}
            </div>
        );
    } else if (dataIndex === 'files') {
        childNode = (
            <div className="maintain-job-files">
                {record[dataIndex].length > 0
                    ? record[dataIndex].map((item) => {
                          return (
                              <>
                                  <div
                                      className="executors-item"
                                      style={{
                                          color: '#333333',
                                          fontSize: '12px',
                                          padding: '0 4px',
                                          lineHeight: '20px',
                                          margin: '0 0 5px 0',
                                          backgroundColor: '#ecf4fc',
                                      }}
                                      key={item}
                                  >
                                      <Tooltip title={item.fileName}>
                                          <span style={{ cursor: 'pointer' }} onClick={() => downloadFile(item)}>
                                              {item.fileName}
                                          </span>
                                      </Tooltip>
                                  </div>
                              </>
                          );
                      })
                    : '-'}
            </div>
        );
    } else if (dataIndex === 'actions') {
        childNode = (
            <Tooltip
                title="上传附件：附件支持上传文件(word/excel/ppt/pdf/wps)和图片(BMP/JPEG/PNG);每个附件不超过10M;最多上传6个附件"
                placement="topRight"
            >
                <Upload
                    accept=".ppt, .doc, .docx, .pdf, .xls, .xlsx, .pptx, .jpg, .jpeg, .png, .bmp"
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                >
                    <Button disabled type="text" icon={<Icon antdIcon type="UploadOutlined" />} />
                </Upload>
            </Tooltip>
        );
    }

    return (
        <td
            {...restProps}
            style={
                dataIndex === 'workRecordArray'
                    ? editable
                        ? editing
                            ? { ...restProps.style, padding: '0 8px' }
                            : { ...restProps.style }
                        : { ...restProps.style, padding: '0 8px' }
                    : { ...restProps.style }
            }
        >
            {childNode}
        </td>
    );
};

const useRowSpanMainProjectFields = ['mainProject'];
const useRowSpanSubProjectFields = ['subProject', 'workShiftTime', 'notes', 'evaluationCriterion', 'evaluate', 'evaluatorName'];
const useRowSpanPlanTimeFields = ['executorArray', 'planExecTime', 'remarks'];
// 组件
const RecordTemporaryRoute = () => {
    const { search } = window.location;
    const { userId } = useLoginInfoModel();
    const searchParams = new URLSearchParams(search);
    let groupId = searchParams.get('groupId');
    let edit = searchParams.get('edit') === 'true';
    let provinceId = searchParams.get('provinceId');
    let workingPlanId = searchParams.get('workingPlanId');
    let workShiftId = searchParams.get('workShiftId');
    let dateTime = searchParams.get('dateTime');
    const columnsState = useColumnsState({ configType: 9 });

    const [tableListData, setTableListData] = useState([]);
    const [showGroupUsers, setShowGroupUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [workingPlanType, setWorkingPlanType] = useState();
    const [customWorkingPlanCompKey, setCustomWorkingPlanCompKey] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const workShiftUsersRef = useRef([]);
    const groupUsersRef = useRef([]);
    const isEditingExecutorRowRef = useRef(null);
    const customWorkingPlanCompRef = useRef(null);

    useEffect(() => {
        const workShiftInfoPromise = findScheduleByWorkShiftId({ groupId, workShiftId });
        const groupInfoPromise = getGroupInfo({
            groupId,
        });
        Promise.all([workShiftInfoPromise, groupInfoPromise]).then((res) => {
            const [res1, res2] = res;

            workShiftUsersRef.current = res1.rows.map((item) => _.omit(item, 'orderId')) || [];
            groupUsersRef.current = res2.groupUserBeanList.map((item) => ({
                mainId: item.userId,
                mainName: item.userName,
                mainTel: item.mobilePhone,
            }));
            setShowGroupUsers(res2.groupUserBeanList.map((item) => ({ mainId: item.userId, mainName: item.userName, mainTel: item.mobilePhone })));

            getTemporaryRouteList();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formRef = useRef();
    // 可编辑
    const handleSave = (rowIndex, fieldName, newValue) => {
        setTableListData(
            produce(tableListData, (draft) => {
                draft.splice(rowIndex, 1, newValue);

                if (fieldName === 'workRecordArray') {
                    const firstSamePlanTimeIndex = draft.findIndex(
                        (item) =>
                            item.mainProject === draft[rowIndex].mainProject &&
                            item.subProject === draft[rowIndex].subProject &&
                            item.planExecTime === draft[rowIndex].planExecTime,
                    );
                    draft.splice(firstSamePlanTimeIndex, 1, {
                        ...draft[firstSamePlanTimeIndex],
                        executorArray: draft[firstSamePlanTimeIndex].executorArray || [groupUsersRef.current.find((item) => item.mainId === userId)],
                    });
                }
            }),
        );
    };
    function selectUsersFn(row) {
        isEditingExecutorRowRef.current = _.cloneDeep(row);
        setSelectedRows(isEditingExecutorRowRef.current?.executorArray || []);
        setModalVisible(true);
    }
    function addOneRowFn(rowIndex) {
        setTableListData(
            produce(tableListData, (draft) => {
                const firstSameMainProjectIndex = draft.findIndex((item) => item.mainProject === draft[rowIndex].mainProject);
                // eslint-disable-next-line
                draft[firstSameMainProjectIndex].rowSpanMainProject = draft[firstSameMainProjectIndex].rowSpanMainProject + 1;
                const firstSameSubProjectIndex = draft.findIndex(
                    (item) => item.mainProject === draft[rowIndex].mainProject && item.subProject === draft[rowIndex].subProject,
                );
                // eslint-disable-next-line
                draft[firstSameSubProjectIndex].rowSpanSubProject = draft[firstSameSubProjectIndex].rowSpanSubProject + 1;

                const firstSamePlanTimeIndex = draft.findIndex(
                    (item) =>
                        item.mainProject === draft[rowIndex].mainProject &&
                        item.subProject === draft[rowIndex].subProject &&
                        item.planExecTime === draft[rowIndex].planExecTime,
                );

                const amePlanTimeIndexDatas = draft.filter(
                    (item) =>
                        item.mainProject === draft[rowIndex].mainProject &&
                        item.subProject === draft[rowIndex].subProject &&
                        item.planExecTime === draft[rowIndex].planExecTime,
                );
                // eslint-disable-next-line
                draft[firstSamePlanTimeIndex].rowSpanPlanTime = draft[firstSamePlanTimeIndex].rowSpanPlanTime + 1;

                draft.splice(rowIndex + amePlanTimeIndexDatas.length, 0, {
                    ...draft[rowIndex],
                    id: nanoid(),
                    isTempId: true,
                    workRecordArray: [genInputPresetsRow()],
                    rowSpanMainProject: 0,
                    rowSpanSubProject: 0,
                    rowSpanPlanTime: 0,
                    canDelete: true,
                    files: [],
                });
            }),
        );
    }
    function deleteOneRowFn(rowIndex) {
        setTableListData(
            produce(tableListData, (draft) => {
                const firstSameMainProjectIndex = draft.findIndex((item) => item.mainProject === draft[rowIndex].mainProject);
                // eslint-disable-next-line
                draft[firstSameMainProjectIndex].rowSpanMainProject = draft[firstSameMainProjectIndex].rowSpanMainProject - 1;
                const firstSameSubProjectIndex = draft.findIndex(
                    (item) => item.mainProject === draft[rowIndex].mainProject && item.subProject === draft[rowIndex].subProject,
                );
                // eslint-disable-next-line
                draft[firstSameSubProjectIndex].rowSpanSubProject = draft[firstSameSubProjectIndex].rowSpanSubProject - 1;

                const firstSamePlanTimeIndex = draft.findIndex(
                    (item) =>
                        item.mainProject === draft[rowIndex].mainProject &&
                        item.subProject === draft[rowIndex].subProject &&
                        item.planExecTime === draft[rowIndex].planExecTime,
                );
                // eslint-disable-next-line
                draft[firstSamePlanTimeIndex].rowSpanPlanTime = draft[firstSamePlanTimeIndex].rowSpanPlanTime - 1;

                draft.splice(rowIndex, 1);
            }),
        );
    }

    const defaultColumns = [
        {
            title: '主项目',
            dataIndex: 'mainProject',
            key: 'mainProject',
            hideInSearch: true,
            align: 'center',
            // ellipsis: true,
            width: 80,
        },
        {
            title: '分项目',
            dataIndex: 'subProject',
            key: 'subProject',
            hideInSearch: true,
            align: 'center',
            // ellipsis: true,
            width: 80,
        },
        {
            title: '班次时间',
            dataIndex: 'workShiftTime',
            key: 'workShiftTime',
            hideInSearch: true,
            width: 120,
            align: 'center',
            render: (text) => {
                return <div dangerouslySetInnerHTML={{ __html: text }} />;
            },
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
        },
        {
            title: '执行人',
            dataIndex: 'executorArray',
            key: 'executorArray',
            hideInSearch: true,
            align: 'center',
            width: 220,
            // ellipsis: true,
            editable: edit,
        },
        {
            title: '计划执行时间',
            dataIndex: 'planExecTime',
            key: 'planExecTime',
            hideInSearch: true,
            align: 'center',
            width: 150,
            // ellipsis: true,
        },
        {
            title: '巡检记录',
            dataIndex: 'workRecordArray',
            key: 'workRecordArray',
            hideInSearch: true,
            width: 440,
            // ellipsis: true,
            editable: edit,
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            hideInSearch: true,
            align: 'center',
            width: 120,
            // ellipsis: true,
            editable: edit,
        },
        {
            title: '附件',
            dataIndex: 'files',
            key: 'files',
            hideInSearch: true,
            align: 'center',
            width: 180,
            // ellipsis: true,
            editable: edit,
        },
        {
            title: '操作',
            dataIndex: 'actions',
            key: 'actions',
            hideInSearch: true,
            align: 'center',
            width: 100,
            // ellipsis: true,
            editable: edit,
        },
        {
            title: '实际执行时间',
            dataIndex: 'realExecTime',
            key: 'realExecTime',
            hideInSearch: true,
            align: 'center',
            width: 150,
            // ellipsis: true,
            editable: edit,
        },
        {
            title: '评价',
            dataIndex: 'evaluate',
            key: 'evaluate',
            hideInSearch: true,
            align: 'center',
            width: 120,
            maxLength: 200,
            // ellipsis: true,
            editable: edit,
        },
        {
            title: '评价人',
            dataIndex: 'evaluatorName',
            key: 'evaluatorName',
            hideInSearch: true,
            align: 'center',
            width: 80,
            maxLength: 200,
            // ellipsis: true,
            editable: edit,
        },
    ];
    const columns = defaultColumns.map((col) => {
        return {
            ...col,
            onCell: (record, rowIndex) => {
                return {
                    record,
                    editable: col.hasOwnProperty('editable') ? edit : false,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: (fieldName, newValue) => handleSave(rowIndex, fieldName, newValue),
                    selectUsersFn,
                    addOneRowFn: () => addOneRowFn(rowIndex),
                    deleteOneRowFn: () => deleteOneRowFn(rowIndex),
                    groupInfo: {
                        groupId,
                        workShiftId,
                        dateTime,
                    },
                    /* eslint-disable */
                    rowSpan: useRowSpanMainProjectFields.includes(col.dataIndex)
                        ? record.rowSpanMainProject
                        : useRowSpanSubProjectFields.includes(col.dataIndex)
                        ? record.rowSpanSubProject
                        : useRowSpanPlanTimeFields.includes(col.dataIndex)
                        ? record.rowSpanPlanTime
                        : 1,
                    /* eslint-enable */
                };
            },
        };
    });

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    // 导出
    const handleExport = () => {
        sendLogFn({ authKey: 'workbench-Workbench-MaintenanceOperationPlan-Export' });
        const params = {
            groupId: groupId,
            dateTime,
            workShiftId,
        };
        exportTemporaryRoute(params).then((res) => {
            if (res) {
                blobDownLoad(res, `维护作业计划详情${moment().format('YYYYMMDDHHmmss')}.xlsx`);
            }
        });
    };

    // 储存编辑的内容
    const saveTableInfo = () => {
        sendLogFn({ authKey: 'workbench-Workbench-MaintenanceOperationPlan-Save' });
        if (workingPlanType === 4) {
            const { projects, header } = customWorkingPlanCompRef.current.getValues();
            const sendData = {
                provinceId,
                groupId,
                workingPlanId,
                workShiftId,
                dateTime,
                projects,
                workingPlanType,
                header,
            };

            saveInfoRoute(sendData).then(() => {
                setCustomWorkingPlanCompKey((prev) => prev + 1);
            });
        } else {
            const copyData = JSON.parse(JSON.stringify(tableListData));

            const mainProjects = Object.entries(_.groupBy(copyData, 'mainProject')).map(([mainProjectName, itemGroup]) => {
                const itemMain = {
                    mainProject: mainProjectName,
                    subProjects: [],
                };

                itemMain.subProjects = Object.entries(_.groupBy(itemGroup, 'subProject')).map(([, itemInGroup]) => {
                    const subLevelFields = ['subProject', 'evaluationCriterion', 'notes', 'workShiftTime'];

                    const itemSub = {
                        ..._.pick(itemInGroup[0], subLevelFields),
                        details: [],
                    };

                    itemSub.details = itemInGroup.map((item) => {
                        return {
                            ..._.omit(item, [
                                'mainProject',
                                ...subLevelFields,
                                ...['rowSpanMainProject', 'rowSpanSubProject', 'rowSpanPlanTime', 'canDelete', 'isTempId'],
                            ]),
                            id: item.isTempId ? null : item.id,
                            workRecordArray: item.workRecordArray ? formatWorkRecordConfigSave(item.workRecordArray) : [],
                        };
                    });
                    return itemSub;
                });

                return itemMain;
            });

            const sendData = {
                provinceId,
                groupId,
                workingPlanId,
                workShiftId,
                dateTime,
                mainProjects,
                workingPlanType,
            };

            saveInfoRoute(sendData).then(() => {
                getTemporaryRouteList();
            });
        }
    };
    // 获取路由列表数据
    const getTemporaryRouteList = async () => {
        const data = {
            groupId,
            dateTime,
            workShiftId,
        };
        const res = await getTemporaryRoute(data);

        if (res?.code === 200 && res?.data) {
            setWorkingPlanType(res.data.workingPlanType);
            if (res.data.workingPlanType !== 4) {
                const tableData = [];
                // let index = -1;
                res.data.mainProjects.forEach((j) => {
                    if (j.subProjects && j.subProjects.length) {
                        j.subProjects.forEach((k, kIndex) => {
                            if (k.details && k.details.length) {
                                k.details.forEach((l, lIndex) => {
                                    // index += 1;
                                    const workRecordArray = l.workRecordArray?.map((item) => {
                                        if (_.isEmpty(item)) {
                                            return [
                                                {
                                                    type: 'input',
                                                    identifier: 'input_presets',
                                                    value: [''],
                                                    result: '',
                                                },
                                            ];
                                        }
                                        return item;
                                    }) || [
                                        [
                                            {
                                                type: 'input',
                                                identifier: 'input_presets',
                                                value: [''],
                                                result: '',
                                            },
                                        ],
                                    ];

                                    const sameTimeItems = k.details.filter((item) => item.planExecTime === l.planExecTime);
                                    const hasSameTimeFlag = sameTimeItems.length > 1;

                                    const sameIndex = sameTimeItems.findIndex((item) => item.id === l.id);

                                    const canDelete = hasSameTimeFlag && sameIndex > 0;

                                    tableData.push({
                                        evaluate: l.evaluate,
                                        evaluatorName: l.evaluatorName,
                                        id: l.id,
                                        timeoutFlag: l.timeoutFlag,
                                        workRecord: l.workRecord,
                                        remarks: l.remarks,
                                        realExecTime: l.realExecTime,
                                        executor: l.executor,
                                        files: l.files || [],
                                        executorArray: l.executorArray
                                            ? l.executorArray.map((item) => {
                                                  const user = groupUsersRef.current.find((itemIn) => itemIn.mainId === item.mainId);
                                                  return {
                                                      ...user,
                                                  };
                                              })
                                            : null,
                                        planExecTime: l.planExecTime,
                                        subProject: k.subProject,
                                        mainProject: j.mainProject,
                                        workShiftTime: k.workShiftTime,
                                        notes: k.notes,
                                        evaluationCriterion: k.evaluationCriterion,
                                        workRecordArray: formatWorkRecordConfig(workRecordArray),
                                        rowSpanMainProject:
                                            kIndex === 0 && lIndex === 0
                                                ? j.subProjects.reduce((accu, item) => {
                                                      return accu + item.details.length;
                                                  }, 0)
                                                : 0,
                                        rowSpanSubProject: lIndex === 0 ? k.details.length : 0,
                                        // eslint-disable-next-line no-nested-ternary
                                        rowSpanPlanTime: !hasSameTimeFlag ? 1 : canDelete ? 0 : sameTimeItems.length,
                                        canDelete,
                                    });
                                });
                            }
                        });
                    }
                });

                setTableListData(tableData);
            }
        } else {
            setWorkingPlanType(1);
        }
    };

    function handlePressEnter(event) {
        if (!event.target.value) {
            setShowGroupUsers(groupUsersRef.current);
        } else {
            setShowGroupUsers(
                groupUsersRef.current.filter((item) => {
                    return item.mainTel?.includes(event.target.value) || item.mainName?.includes(event.target.value);
                }),
            );
        }
    }

    function handleOk() {
        const newData = [...tableListData];
        const index = newData.findIndex((item) => isEditingExecutorRowRef.current.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            executorArray: selectedRows.map((itemIn) => ({
                mainName: itemIn.mainName,
                mainId: itemIn.mainId,
                mainTel: itemIn.mainTel,
            })),
        });
        setShowGroupUsers(groupUsersRef.current);
        setTableListData(newData);
        setModalVisible(false);
    }

    if (_.isEmpty(columnsState.value)) {
        return null;
    }

    return (
        <div className="maintain-job-content">
            <div className="maintaiin-job-header">
                <div className="maintaiin-job-header-title" style={{ marginLeft: '20px' }}>
                    维护作业计划
                </div>
            </div>
            {[1, 2, 3].includes(workingPlanType) && (
                <VirtualTable
                    options={{ reload: false }}
                    components={components}
                    global={window}
                    search={false}
                    toolBarRender={() => [<Button onClick={handleExport}>导出</Button>]}
                    columns={columns}
                    pagination={false}
                    dataSource={tableListData}
                    formRef={formRef}
                    scroll={{ x: 'max-content' }}
                    rowClassName={() => 'editable-row'}
                    columnsState={columnsState}
                    rowKey="id"
                />
            )}
            {workingPlanType === 4 && (
                <div style={{ height: 'calc(100% - 200px)', padding: '10px 20px', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                    <CustomizedWorkingPlan
                        onExport={handleExport}
                        onSave={saveTableInfo}
                        ref={customWorkingPlanCompRef}
                        key={customWorkingPlanCompKey}
                        editable={edit}
                        groupInfo={{
                            groupId,
                            workShiftId,
                            dateTime,
                            workingPlanId,
                            provinceId,
                            groupUsers: groupUsersRef.current,
                        }}
                    />
                </div>
            )}
            <div className="button-box">
                {workingPlanType !== 4 && (
                    <div className="in-button-box" style={{ display: edit ? 'block' : 'none' }}>
                        <Button disabled={!edit} type="primary" onClick={saveTableInfo}>
                            保存
                        </Button>
                    </div>
                )}
            </div>
            <Modal
                visible={modalVisible}
                title="选择执行人"
                width={300}
                bodyStyle={{ height: 380, padding: '5px 10px' }}
                onCancel={() => {
                    setShowGroupUsers(groupUsersRef.current);
                    isEditingExecutorRowRef.current = null;
                    setModalVisible(false);
                }}
                destroyOnClose
                maskClosable={false}
                footer={
                    <CustomModalFooter
                        onCancel={() => {
                            setShowGroupUsers(groupUsersRef.current);
                            isEditingExecutorRowRef.current = null;
                            setModalVisible(false);
                        }}
                        onOk={handleOk}
                    />
                }
            >
                <div style={{ border: '1px solid #d9d9d9', padding: '10px', height: '100%' }}>
                    <Input
                        prefix={<Icon type="SearchOutlined" antdIcon />}
                        style={{ width: '100%', marginBottom: '10px' }}
                        placeholder="请输入搜索内容"
                        allowClear
                        onPressEnter={handlePressEnter}
                    />
                    <Table
                        size="small"
                        dataSource={showGroupUsers}
                        pagination={false}
                        rowKey="mainId"
                        style={{ padding: '0' }}
                        scroll={{ y: 290 }}
                        columns={[
                            {
                                title: '姓名',
                                dataIndex: 'mainName',
                            },
                            {
                                title: '电话',
                                dataIndex: 'mainTel',
                                ellipsis: true,
                            },
                        ]}
                        rowSelection={{
                            selectedRowKeys: selectedRows.map((item) => item.mainId),
                            onChange: (selectedRowKeys, selectedRowsValue) => {
                                const temp = _.differenceBy(selectedRows, showGroupUsers, 'mainId');

                                setSelectedRows(temp.concat(selectedRowsValue));
                            },
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default RecordTemporaryRoute;
