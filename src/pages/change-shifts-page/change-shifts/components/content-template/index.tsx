import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useSetState } from 'ahooks';
import { Icon, Popconfirm, Tooltip, Input, Radio, Form, Button, message } from 'oss-ui';
import TemplateModal from './template-modal';
import { diffObjectList } from './utils';
import * as api from './api';
import './index.less';

function ContentTemplate(props, ref) {
    const { onClose, groupId } = props;
    const [form] = Form.useForm();
    const originTemplateData = useRef<any>([]);
    const [state, setState] = useSetState<any>({
        modalVisible: false,
        templateDataList: [],
        checkedTemplateId: null,
        currentTemplate: {},
        modalType: 'add',
        searchContent: '',
    });
    const getGroupWorkRecorderTemplateData = async () => {
        if (!groupId) return;
        const params = { groupId };

        const res = await api.getGroupWorkRecorderTemplateApi(params);
        if (res.resultCode === '200') {
            const { resultObj } = res;
            const findDefaultTemplate = resultObj.find((item) => item.defaultFlag === 1);
            const stateParams = {
                templateDataList: resultObj,
                checkedTemplateId: findDefaultTemplate?.templateId,
                currentTemplate: resultObj[0] ?? {},
            };

            const diffData = diffObjectList(resultObj, originTemplateData.current, 'templateId');

            originTemplateData.current = resultObj;
            if (Object.keys(state.currentTemplate).length !== 0) {
                const upDateCurrentTemplate = resultObj.find((item) => item.templateName === state.currentTemplate.templateName);
                // 编辑后更新当前模板
                if (upDateCurrentTemplate) {
                    stateParams.currentTemplate = upDateCurrentTemplate;
                }
                // 新增要选中新增的那个
                if (diffData.length === 1) {
                    // eslint-disable-next-line prefer-destructuring
                    stateParams.currentTemplate = diffData[0];
                }
            }
            setState(stateParams);
        }
    };
    const setDefaultWorkRecorderTemplateData = async (id) => {
        const params = { groupId, templateId: id };
        const res = await api.setDefaultWorkRecorderTemplateApi(params);
        if (res.resultCode === '200') {
            message.success('设置成功');
            getGroupWorkRecorderTemplateData();
        }
    };

    const saveGroupWorkRecorderTemplateData = async (content) => {
        const { modalType, currentTemplate } = state;
        const params = { groupId, ...content, templateId: modalType === 'add' ? undefined : currentTemplate.templateId };
        const res = await api.saveGroupWorkRecorderTemplateApi(params);
        if (+res.resultCode === 200) {
            setState({ modalVisible: false, searchContent: '' });
            getGroupWorkRecorderTemplateData();
        }
    };
    const deleteGroupWorkRecorderTemplateData = async () => {
        if (Object.keys(state.currentTemplate).length === 0) {
            message.warn('请选择要删除的模板');
            return;
        }

        const params = { groupId, templateId: state.currentTemplate.templateId };
        const res = await api.deleteGroupWorkRecorderTemplateApi(params);
        if (+res.resultCode === 200) {
            const newTemplateDataList = state.templateDataList.filter((item) => item.templateId !== state.currentTemplate.templateId);
            originTemplateData.current = newTemplateDataList;
            setState({ templateDataList: newTemplateDataList, currentTemplate: newTemplateDataList[0] ?? {} });
        }
    };
    const onCheckedChange = (id) => {
        let newId = id;

        if (id === state.checkedTemplateId) {
            newId = null;
        }
        setState({ checkedTemplateId: newId });
        setDefaultWorkRecorderTemplateData(newId);
    };
    useEffect(() => {
        getGroupWorkRecorderTemplateData();
        // eslint-disable-next-line
    }, [groupId]);

    useImperativeHandle(ref, () => ({
        getNewList: () => originTemplateData.current,
    }));

    const onEdit = () => {
        if (Object.keys(state.currentTemplate).length === 0) {
            message.warn('请选择要编辑的模板');
            return;
        }
        form.setFieldsValue({ templateName: state.currentTemplate.templateName, templateContent: state.currentTemplate.templateContent });
        setState({ modalVisible: true, modalType: 'edit' });
    };
    const onOk = async () => {
        const values = await form.validateFields();
        saveGroupWorkRecorderTemplateData(values);
        form.resetFields();
    };
    const onModalCancel = () => {
        form.resetFields();
        setState({ modalVisible: false });
    };
    const blurSearch = (e) => {
        const reg = new RegExp(e.target.value);
        const newTemplateDataList = originTemplateData.current.filter((item) => reg.test(item.templateName));
        setState({ templateDataList: newTemplateDataList, searchContent: e.target.value });
    };
    return (
        <>
            <div className="content-template">
                <div className="template-body">
                    <div className="template-list">
                        <div className="template-list-header">
                            <div className="header-text">模板列表</div>
                            <div className="header-button">
                                <Tooltip title="新增模板">
                                    <div onClick={() => setState({ modalVisible: true, modalType: 'add' })}>
                                        <Icon type="iconxinjian1" />
                                    </div>
                                </Tooltip>

                                <button
                                    onClick={onEdit}
                                    type="button"
                                    className={`button-btn ${state.templateDataList.length === 0 ? 'disabled' : ''} `}
                                    disabled={state.templateDataList.length === 0}
                                >
                                    <Tooltip title="编辑模板">
                                        <Icon type="iconbianji1" />
                                    </Tooltip>
                                </button>
                                <button
                                    type="button"
                                    className={`button-btn ${state.templateDataList.length === 0 ? 'disabled' : ''} `}
                                    disabled={state.templateDataList.length === 0}
                                >
                                    <Popconfirm title="确定删除该模板?" onConfirm={deleteGroupWorkRecorderTemplateData}>
                                        <Tooltip title="删除模板">
                                            <Icon type="icontrash" style={{ fontSize: 19, display: 'flex', alignItems: 'center' }} />
                                        </Tooltip>
                                    </Popconfirm>
                                </button>
                            </div>
                        </div>
                        <div className="template-list-content">
                            <div className="list-search">
                                <Input
                                    placeholder="请输入模板名称查询"
                                    value={state.searchContent}
                                    onChange={blurSearch}
                                    suffix={<Icon type="SearchOutlined" antdIcon style={{ fontSize: 15 }} />}
                                    style={{ width: 180, height: 28 }}
                                />
                            </div>
                            <div className="list-box">
                                {state.templateDataList.map((item) => {
                                    return (
                                        <div
                                            className={`list-item ${state.currentTemplate.templateName === item.templateName ? 'active' : ''}`}
                                            key={item.templateId}
                                            onClick={() => setState({ currentTemplate: item })}
                                        >
                                            <Tooltip title="更新为默认模板">
                                                <Radio
                                                    checked={state.checkedTemplateId === item.templateId}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onCheckedChange(item.templateId);
                                                    }}
                                                />
                                            </Tooltip>
                                            <span>{item.templateName}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="template-detail">
                        <div className="detail-header">模板详情</div>
                        <Input.TextArea
                            className="detail-content"
                            disabled
                            showCount
                            maxLength={600}
                            value={state.currentTemplate?.templateContent}
                        />
                    </div>
                </div>
                <div className="template-footer">
                    <Button onClick={onClose}>关闭</Button>
                </div>
            </div>
            <TemplateModal form={form} state={state} onOk={onOk} onModalCancel={onModalCancel} />
        </>
    );
}
export default forwardRef(ContentTemplate);
