import React, { useRef, useEffect, useState } from 'react';
import ModalFooter from '@Components/custom-modal-footer';
import { Modal, message, Button, Tooltip, Icon } from 'oss-ui';
import useLoginInfoModel from '@Src/hox';
import ModalContent from './modal-content';
import { updateFault, addFault, addNoFault, approvalApi, approvalAndSaveApi, saveAsDraft } from '../api';
import { IProps } from './types';
import './index.less';

/**
 * 出发点：目前项目中使用到的Modal组件的代码中，modal组件与主页面的交互逻辑不统一，但是不同页面又需要引用同一个modal，现有modal复用不方便或者modal内容需要复用。
 * 所以这里只是为了定义一种Modal业务的开发模式，实现modal组件与页面主体、modal框与内部内容逻辑解耦，提高复用性。
 * 模板代码！！！
 * 复制后继续修改文件  大部分修改应该集中在modal-content组件中
 */
const ModalWapper: React.FC<IProps> = ({ mode = 'new', contentProps = {}, ...otherModalProps }) => {
    const {
        onOk: onOkProps,
        onCancel,
        cancelText,
        okText,
        confirmLoading,
        okType,
        cancelButtonProps,
        okButtonProps,
        // customFooterRender,
        okAuthKey,
        customProps,
    } = otherModalProps;
    const { userId, currentZone } = useLoginInfoModel();

    const modalContentRef = useRef<any>(null);

    const filterParams = (value) => {
        const tempValue = {};
        Object.entries(value).forEach(([key, val]) => {
            if (val === '--') {
                tempValue[key] = null;
            } else {
                tempValue[key] = val;
            }
        });
        return tempValue;
    };

    async function onOk(e) {
        // 调用内容组件抛出的某个事件 自定义后续行为
        const values = await modalContentRef.current?.getValues();
        const originValues = modalContentRef.current?.getInitValues();
        const isEdit = modalContentRef.current?.getIsEdited();
        console.log('values', { o: originValues, n: values });

        let api;
        if (mode === 'new') {
            api = values.haveMalfunction ? addFault : addNoFault;
        } else if (mode === 'review' && isEdit) {
            api = approvalAndSaveApi;
        } else if (mode === 'review') {
            api = approvalApi;
        } else if (mode === 'edit' && contentProps?.initialValues?.dataState === 0) {
            api = values.haveMalfunction ? addFault : addNoFault;
            values.dataState = 0;
        } else {
            api = updateFault;
        }
        let finalValues = {
            ...values,
            modifier: userId,
            reportProvince: currentZone.zoneId,
        };
        if (mode === 'new') {
            finalValues = {
                ...values,
                reportProvince: currentZone.zoneId,
            };
        } else if (mode === 'edit') {
            // 编辑模式下必须包含id
            finalValues = {
                ...values,
                id: contentProps?.initialValues?.id,
                modifier: userId,
                reportProvince: currentZone.zoneId,
            };
        }
        if (mode === 'review') {
            finalValues = {
                newRecord: filterParams(values),
                oldRecord: filterParams(originValues),
                pass: values.pass,
                suggestions: values.suggestions,
                userId,
            };
        }

        try {
            const res = await api(finalValues);
            if (mode === 'new' || mode === 'edit') {
                if (res.code === 200) {
                    message.success('提交成功');
                } else {
                    message.error(res.message || '提交失败');
                }
            }
            if (mode === 'review') {
                if (res.code === 200) {
                    message.success('审核成功');
                } else {
                    message.error(res.message || '审核失败');
                }
            }
            // 如果需要在确定按钮回传数据做其他处理则调用
            // @ts-ignore
            onOkProps?.(e, res);
        } catch (error: any) {
            console.error('提交失败:', error);
            // 提取错误信息：优先使用 error.data.message
            const errorMessage = error?.data?.message || 
                                error?.response?.data?.message || 
                                error?.message || 
                                '提交失败，请稍后重试';
            message.error(errorMessage);
        }
    }

    const onSave = async (e) => {
        // 保存：新增“保存”按钮。点击保存，即不做必填项校验，将相关字段数据保存，数据状态为“草稿”。关闭弹窗，刷新列表数据，页面上方提示信息为“保存成功”。
        const values = await modalContentRef?.current?.getUnCheckFields();
        // 需要处理时间字段，将时间字段转换为moment
        const params = {
            ...values,
            dataSource: 1,
            reportProvince: currentZone.zoneId,
        };
        try {
            if (mode === 'new') {
                const res = await saveAsDraft(params);
                if (res.code === 200) {
                    message.success('保存成功');
                    // 如果需要在确定按钮回传数据做其他处理则调用
                    // @ts-ignore
                    onOkProps?.(e, res);
                } else {
                    message.error(res.message || '保存失败');
                }
            } else if (mode === 'edit') {
                // 编辑模式下，id为必填项
                const editDraftParams = {
                    ...params,
                    id: contentProps?.initialValues?.id,
                };
                const res = await saveAsDraft(editDraftParams);
                if (res.code === 200) {
                    message.success('保存成功');
                    // 如果需要在确定按钮回传数据做其他处理则调用
                    // @ts-ignore
                    onOkProps?.(e, res);
                } else {
                    message.error(res.message || '保存失败');
                }
            }
        } catch (error: any) {
            console.error('保存失败:', error);
            // 提取错误信息：优先使用 error.data.message
            const errorMessage = error?.data?.message || 
                                error?.response?.data?.message || 
                                error?.message || 
                                '保存失败，请稍后重试';
            message.error(errorMessage);
        }
    };

    const footerRender = () => {
        const isEdit = modalContentRef.current?.getIsEdited();

        let btnText = '提交';
        if (mode === 'review') {
            btnText = '提交';
            if (isEdit) {
                btnText = '提交并保存';
            }
        }
        let tipText = '提交后，等待集团审核，等待过程中，不可对数据进行操作。';
        if (customProps.isGroupLeader && customProps.hasReviewAuth) {
            tipText = '提交后，数据则进行归档操作，无特殊情况不可再变更。';
        }

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={onCancel}>取消</Button>
                {(contentProps?.initialValues?.dataState === 0 || contentProps?.initialValues?.dataState === undefined) && (
                    <Button type="primary" onClick={onSave} disabled={mode === 'view'}>
                        保存
                    </Button>
                )}
                <Button type="primary" onClick={onOk} disabled={mode === 'view'}>
                    {btnText}
                </Button>
                <div style={{ margin: '0 10px 0 5px' }}>
                    {mode === 'review' && (
                        <Tooltip title={tipText} key="show">
                            <Icon antdIcon type="QuestionCircleOutlined" />
                        </Tooltip>
                    )}
                </div>
            </div>
        );
    };
    const footerProps = {
        onCancel,
        cancelText,
        okText,
        confirmLoading,
        okType,
        cancelButtonProps,
        okButtonProps: { ...(okButtonProps || {}), disabled: mode === 'view' },
        render: footerRender,
        authKey: okAuthKey,
    };
    const [footerDom, setFooterDom] = useState<any>(footerProps);
    function genTitle() {
        switch (mode) {
            case 'new':
                return '新建';
            case 'edit':
                return '编辑';
            case 'review':
                return '审核';
            default:
                return '查看';
        }
    }
    const renderFooter = () => {
        setFooterDom(footerProps);
    };
    useEffect(() => {
        setFooterDom(footerProps);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentProps?.initialValues?.dataState, mode]);

    return (
        <Modal title={genTitle()} onCancel={onCancel} className="modal-content-as" footer={<ModalFooter {...footerDom} />} {...otherModalProps}>
            <ModalContent ref={modalContentRef} {...contentProps} mode={mode} renderFooter={renderFooter} />
        </Modal>
    );
};

export default ModalWapper;
export * from './types';
