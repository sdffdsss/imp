import moment from 'moment';
import React, { forwardRef, useRef, useState, useLayoutEffect, useMemo, useCallback } from 'react';
import { Input, Tooltip, Icon, Button, Switch, Upload, message, DatePicker, Select } from 'oss-ui';
import { ReactComponent as SaveSvg } from '../img/u243.svg';

const Index = forwardRef((props) => {
    const {
        pattern,
        contentEditAreaDomRef,
        data,
        onCompleteChange,
        onSave,
        onDelete,
        onDeleteFile,
        onDownload,
        onUpload,
        // onDateChange,
        showUserName,
        onFocus,
        onBlur,
        templateList,
        modifyScope,
        state,
        setState,
    } = props;

    const hiddenFileListRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [fileOverflow, setFileOverflow] = useState(false);

    const onTextAreaChange = (e) => {
        setState({ itemData: { ...state.itemData, content: e.target.value } });
    };

    useLayoutEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (let index = 0; index < entries.length; index++) {
                const { target, contentRect } = entries[index];

                if (target === hiddenFileListRef.current) {
                    setFileOverflow(contentRect.height > 36);
                }
            }
        });
        resizeObserver.observe(hiddenFileListRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

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
    // 点击选择时间外的区域要隐藏时间选择器
    const clickFun = useCallback(() => {
        document.body.removeEventListener('click', clickFun);
        setState({ datePickerVisible: false });
        // eslint-disable-next-line
    }, []);
    const onDateClick = () => {
        document.body.addEventListener('click', clickFun);
        setState({ datePickerVisible: true });
    };
    const onCancel = () => {
        document.body.removeEventListener('click', clickFun);
        setState({ datePickerVisible: false });
    };

    const datePickerOk = (time = state.datePickerValue) => {
        const newItem = { ...data, operationTime: time.format('YYYY-MM-DD HH:mm:ss') };
        setState({ datePickerVisible: false, itemData: newItem });
    };
    const timeList = useMemo(() => {
        const now = moment().startOf('hour');
        return [
            moment(now).subtract(60, 'minute'),
            moment(now).subtract(30, 'minute'),
            now,
            moment(now).add(30, 'minute'),
            moment(now).add(60, 'minute'),
        ];
    }, []);
    const templateListOptions = useMemo(() => {
        return templateList.map((item) => {
            return {
                ...item,
                label: item.templateName,
                value: item.templateId,
            };
        });
    }, [templateList]);
    const onTemplateSelect = (value) => {
        const template = templateList.find((item) => item.templateId === value);

        setState({ itemData: { ...state.itemData, content: template.templateContent }, currentTemplateId: value });
    };
    const isFinished = data.finishedFlag === 1;
    const isPrevLegacy = data.prevFlag === 1;

    const userNameWidth = (data?.userName || '').length * 14;

    return (
        <div className="timeline-item-content-wrapper">
            <div className={`item-title-wrapper${isExpanded ? ' expanded' : ''}`}>
                <div className="left-content" style={{ flex: showUserName ? `0 0 ${244 + userNameWidth + 14}px` : '0 0 244px' }}>
                    <span className={`is-legacy-icon${isPrevLegacy ? ' blue' : ''}`}>{isPrevLegacy ? '上' : '本'}</span>
                    <span className="title-text" onClick={onDateClick}>
                        {state.itemData.operationTime}
                    </span>
                    {showUserName && <span className="username">{data.userName}</span>}
                    <Switch
                        disabled={pattern === 'readonly'}
                        checkedChildren={<span style={{ fontSize: '14px' }}>已完成</span>}
                        unCheckedChildren={<span style={{ fontSize: '14px' }}>未完成</span>}
                        checked={isFinished}
                        onChange={onCompleteChange}
                    />
                </div>
                {pattern === 'editable' && state.datePickerVisible && (
                    <div
                        className="date-picker"
                        onMouseEnter={() => document.body.removeEventListener('click', clickFun)}
                        onMouseLeave={() => document.body.addEventListener('click', clickFun)}
                    >
                        <div className="picker-title">快速选择</div>
                        {timeList.map((item) => {
                            return (
                                <div
                                    className="exp-time"
                                    onClick={() => {
                                        datePickerOk(item);
                                    }}
                                >
                                    {item.format('YYYY-MM-DD HH:mm:ss')}
                                </div>
                            );
                        })}

                        <div className="picker">
                            <div className="picker-label">时间</div>
                            <div className="picker-value">
                                <DatePicker
                                    format="YYYY-MM-DD HH:mm:ss"
                                    showTime
                                    onChange={(v) => setState({ datePickerValue: v })}
                                    value={state.datePickerValue}
                                    allowClear={false}
                                />
                            </div>
                        </div>
                        <div className="btn-list">
                            <Button onClick={onCancel}>取消</Button>
                            <Button onClick={() => datePickerOk(moment())}>此刻</Button>
                            <Button onClick={() => datePickerOk()}>确定</Button>
                        </div>
                    </div>
                )}
                {pattern === 'editable' && (
                    <div className="center-content">
                        {modifyScope === 'record' && (
                            <Select
                                style={{ width: 175 }}
                                options={templateListOptions}
                                value={state.currentTemplateId}
                                placeholder={templateList.length > 0 ? '请选择模版' : '暂无可选模版'}
                                onChange={onTemplateSelect}
                            />
                        )}

                        <Tooltip title="保存">
                            <Button
                                type="text"
                                icon={<SaveSvg />}
                                style={{ display: 'block', lineHeight: '26px' }}
                                onClick={() => {
                                    onSave(state.itemData);
                                    onCancel();
                                }}
                            />
                        </Tooltip>

                        <Tooltip title="删除">
                            <Button
                                className="operation-button"
                                type="text"
                                icon={<Icon antdIcon type="iconshanchu" />}
                                onClick={() => onDelete(data)}
                            />
                        </Tooltip>
                        <Tooltip title="上传附件：附件支持上传文件(word/excel/ppt/pdf/wps)和图片(BMP/JPEG/PNG);每个附件不超过10M;最多上传6个附件">
                            <Upload
                                beforeUpload={beforeUpload}
                                accept=".ppt, .doc, .docx, .pdf, .xls, .xlsx, .pptx, .jpg, .jpeg, .png, .bmp"
                                customRequest={(file) => onUpload(file, data)}
                                showUploadList={false}
                            >
                                <Button
                                    className="operation-button"
                                    type="text"
                                    disabled={pattern === 'readonly' || data.fileInfos.length === 6}
                                    icon={<Icon antdIcon type="UploadOutlined" />}
                                />
                            </Upload>
                        </Tooltip>
                    </div>
                )}
                {state.itemData.fileInfos?.map((itemFile, indexFile) => {
                    return (
                        <div className="file-item" key={indexFile}>
                            <span onClick={() => onDownload(itemFile)}>{itemFile.fileName}</span>
                            {pattern === 'editable' && (
                                <Icon antdIcon type="CloseCircleOutlined" onClick={() => onDeleteFile(itemFile, indexFile, data)} />
                            )}
                        </div>
                    );
                })}
                {fileOverflow && !isExpanded && (
                    <div className="expand-all-dom" onClick={() => setIsExpanded(true)}>
                        全部&gt;
                    </div>
                )}
                {fileOverflow && isExpanded && (
                    <div className="expand-all-dom" onClick={() => setIsExpanded(false)}>
                        收起&lt;
                    </div>
                )}
            </div>
            <div className="hidden-file-list-wrapper" ref={hiddenFileListRef}>
                <div className="placehodler" style={{ flex: showUserName ? `0 0 ${244 + userNameWidth + 14 + 92}px` : '0 0 332px' }} />
                {data.fileInfos?.map((item, index) => {
                    return (
                        <div className="file-item" key={index}>
                            <span>{item.fileName}</span>
                            <Icon antdIcon type="CloseCircleOutlined" />
                        </div>
                    );
                })}
            </div>
            <div className="item-content-wrapper">
                <Input.TextArea
                    className={isPrevLegacy ? 'is-prev-legacy' : ''}
                    style={{ backgroundImage: isPrevLegacy ? 'linear-gradient(270deg, #f8fcff, #d1e8ff)' : '' }}
                    ref={contentEditAreaDomRef}
                    value={state.itemData.content}
                    maxLength={2000}
                    onChange={onTextAreaChange}
                    rows={4}
                    disabled={pattern === 'readonly'}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            </div>
        </div>
    );
});

export default Index;
