import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    //
    Form,
    Button,
    message,
    Input,
    List,
    Icon,
    Upload,
    Tooltip,
} from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import { usePersistFn } from 'ahooks';
import useLoginInfoModel from '@Src/hox';

import WorkRecordTime from '../../work-record-time';
import { TimeSelect } from './form-items/time-select';
import { ExecutorModal } from './form-items/executor-modal';
import { SelectResult } from './form-items/select-result';
import { TextArea } from './form-items/textarea';
import { InputText } from './form-items/input-text';
import { useTableContext } from './context';

// 可编辑
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            {/* @ts-ignore */}
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = (props: any) => {
    // console.log('log-------------------props', props);

    const {
        //
        title,
        editable,
        children,
        dataIndex,
        handleSave,
        editDisabledReason,
        selectUsersFn,
        groupInfo,
        internalRecord = {},
        record,
        ...restProps
    } = props;

    const { state: tableState } = useTableContext();
    const { userName } = useLoginInfoModel();
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const WorkRecordChangeFnRef = useRef(null);
    // const realExecTimeChangeFnRef = useRef(null);
    const form = useContext(EditableContext);

    // const currentCol = _.get(internalRecord, 'col') ?? {};
    const cellComponentType = internalRecord.cellComponentType ?? null;
    const currentCell = internalRecord.current ?? {};

    useEffect(() => {
        if (editing) {
            // @ts-ignore
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        const { search } = window.location;
        const searchParams = new URLSearchParams(search);
        const isEdit = searchParams.get('edit') === 'false';
        if (isEdit) return;
        setEditing(!editing);
        if (dataIndex) {
            // @ts-ignore
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
            // @ts-ignore
            const values = await form.validateFields();
            // 如果是编辑的是评价，则直接写入 当前评价人
            if (values.evaluate) {
                values.evaluatorName = userName;
            }

            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    // @ts-ignore
    WorkRecordChangeFnRef.current = usePersistFn(
        _.debounce((newValue) => {
            handleSave({
                ...record,
                workRecordArray: newValue,
            });
        }, 400),
    );

    // @ts-ignore
    // realExecTimeChangeFnRef.current = usePersistFn(
    //     _.debounce((newValue) => {
    //         //  保存数据
    //         // console.log('log----------------保存数据', {
    //         //     ...(record ?? {}),
    //         //     realExecTime: newValue,
    //         // });
    //         // handleSave({
    //         //     ...record,
    //         //     realExecTime: newValue,
    //         // });
    //     }, 400),
    // );

    function beforeUpload(file) {
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
    }

    function deleteFile(fileId) {
        handleSave({
            ...record,
            files: record.files.filter((item) => item.fileId !== fileId),
        });
    }

    let childNode = children;

    if (editable) {
        if (editing) {
            if (title === '----执行人--') {
                // todo: 暂留
                childNode = (
                    <div className="executors" onClick={toggleEdit} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {(record[dataIndex] || []).map((item, index) => {
                            return (
                                <>
                                    {index % 2 === 0 && index > 0 && <br />}
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
                                        key={item.userId}
                                    >
                                        {item.userName}
                                    </div>
                                </>
                            );
                        })}
                    </div>
                );
            } else if (title === '---工作记录---') {
                // todo: 暂留
                childNode = (
                    <Form.Item
                        style={{
                            margin: 0,
                        }}
                        name={dataIndex}
                    >
                        <WorkRecordTime config={record.workRecordArray} onChange={WorkRecordChangeFnRef.current} />
                    </Form.Item>
                );
            } else if (title === '--附件---') {
                // todo: 暂留
                childNode = (
                    <div className="maintain-job-files">
                        {(record[dataIndex] || []).map((item) => {
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
                                        <span>{item.fileName.length > 10 ? `${item.fileName.slice(0, 10)}...` : item.fileName}</span>
                                        <Icon
                                            style={{ marginLeft: '10px', color: '#1890ff' }}
                                            antdIcon
                                            type="CloseCircleOutlined"
                                            // @ts-ignore
                                            onClick={() => deleteFile(item.fileId)}
                                        />
                                    </div>
                                </>
                            );
                        })}
                    </div>
                );
            } else {
                childNode = (
                    <Form.Item
                        style={{
                            margin: 0,
                        }}
                        name={dataIndex}
                    >
                        <Input maxLength={300} ref={inputRef} onPressEnter={save} onBlur={save} />
                    </Form.Item>
                );
            }
        } else {
            if (title === '--工作记录--') {
                // todo：暂留
                childNode = (
                    <div className="editable-cell-value-wrap" onClick={toggleEdit}>
                        <List
                            dataSource={record[dataIndex]}
                            renderItem={(item, index) => {
                                return (
                                    <List.Item style={{ padding: record[dataIndex].length > 1 ? '8px 0' : 0 }}>
                                        <List.Item.Meta avatar={`${index + 1}.`} />
                                        <div style={{ width: '100%', textAlign: 'left' }}>
                                            {/* @ts-ignore */}
                                            {item.reduce((accuIn, itemIn) => {
                                                return `${accuIn}${itemIn.result}`;
                                            }, '') || '-'}
                                        </div>
                                    </List.Item>
                                );
                            }}
                        />
                    </div>
                );
            } else if (title === '--执行人--') {
                // todo：暂留
                childNode = (
                    <div className="executors" onClick={toggleEdit} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {(record[dataIndex] || []).map((item, index) => {
                            return (
                                <>
                                    {index % 2 === 0 && index > 0 && <br />}
                                    <div
                                        className="executors-item"
                                        style={{
                                            color: '#000',
                                            fontSize: '12px',
                                            padding: '0 4px',
                                            lineHeight: '20px',
                                            margin: '0 2px 2px',
                                            backgroundColor: 'rgba(140,185,237,0.15)',
                                        }}
                                        key={item.userId}
                                    >
                                        {item.userName}
                                    </div>
                                </>
                            );
                        })}
                    </div>
                );
            } else if (title === '--附件--') {
                // todo：暂留
                childNode = (
                    <div className="maintain-job-files" onClick={toggleEdit}>
                        {(record[dataIndex] || []).map((item) => {
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
                                        key={item.fileName}
                                    >
                                        <span>{item.fileName.length > 10 ? `${item.fileName.slice(0, 10)}...` : item.fileName}</span>
                                        <Icon
                                            style={{ marginLeft: '10px', color: '#1890ff' }}
                                            antdIcon
                                            type="CloseCircleOutlined"
                                            // @ts-ignore
                                            onClick={() => deleteFile(item.fileId)}
                                        />
                                    </div>
                                </>
                            );
                        })}
                    </div>
                );
            } else if (title === '--操作--') {
                // todo：暂留
                childNode = (
                    <Tooltip title="上传附件：附件支持上传文件(word/excel/ppt/pdf/wps)和图片(BMP/JPEG/PNG);每个附件不超过10M;最多上传2个附件">
                        <Upload
                            beforeUpload={beforeUpload}
                            accept=".ppt, .doc, .docx, .pdf, .xls, .xlsx, .pptx, .jpg, .jpeg, .png, .bmp"
                            customRequest={(file) => handleUpload(file)}
                            showUploadList={false}
                            disabled={record.files?.length === 2}
                        >
                            <Button type="text" icon={<Icon antdIcon type="UploadOutlined" />} />
                        </Upload>
                    </Tooltip>
                );
            } else if (cellComponentType === 'textarea') {
                childNode = (
                    <div className="editable-cell-value-wrap" style={{ padding: 0 }}>
                        <TextArea rows={3} placeholder="请输入备注" record={currentCell} />
                    </div>
                );
            } else if (cellComponentType === 'inputText') {
                childNode = (
                    <div className="editable-cell-value-wrap" style={{ padding: 0 }}>
                        <InputText record={currentCell} />
                    </div>
                );
            } else if (cellComponentType === 'timeSelect') {
                if (currentCell?.value === '实时') {
                    childNode = <div>{currentCell?.value || ''}</div>;
                } else {
                    childNode = (
                        <div className="editable-cell-value-wrap" style={{ padding: 0 }}>
                            <Form.Item
                                style={{
                                    margin: 0,
                                }}
                                name={dataIndex}
                                valuePropName="cellValue"
                            >
                                <TimeSelect record={currentCell} />
                            </Form.Item>
                        </div>
                    );
                }
            } else if (cellComponentType === 'selectResult') {
                childNode = (
                    <div className="editable-cell-value-wrap">
                        <SelectResult record={currentCell} />
                    </div>
                );
            } else if (cellComponentType === 'executorModal') {
                childNode = (
                    <div className="editable-cell-value-wrap">
                        <ExecutorModal record={currentCell} />
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

        if (!tableState.editable && !['executorModal'].includes(cellComponentType)) {
            childNode = <div className="editable-cell-value-wrap">{children}</div>;
        }
    }

    /* eslint-disable */
    const style =
        dataIndex === 'workRecordArray'
            ? editable
                ? editing
                    ? { ...restProps.style, padding: '0 8px' }
                    : { ...restProps.style }
                : { ...restProps.style, padding: '0 8px' }
            : { ...restProps.style };
    /* eslint-enable */

    return (
        <td {...restProps} style={style}>
            {childNode}
        </td>
    );
};

export const tableComponents = {
    body: {
        row: EditableRow,
        cell: EditableCell,
    },
};
