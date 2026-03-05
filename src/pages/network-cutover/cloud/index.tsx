import useLoginInfoModel from '@Src/hox';
import { Icon, Modal, message } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import request from '@Common/api';
import AuthButton from '@Components/auth-button';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import React, { FC, useState, useEffect, useRef } from 'react';
import { MODAL_TYPE, ActionType } from '../type';
import { postCutoverList, deleteCutover } from '../api';
import { ActionModal } from './Modals';
import getColumns from './columns';
import { authData } from '../auth';

interface Props {}

const Atm: FC<Props> = () => {
    const formRef: any = useRef();
    const { provinceId, currentZone } = useLoginInfoModel();

    const fixedParamsRef: any = useRef({
        professionType: 70,
        dataProvince: currentZone.zoneId,
    });
    const searchParamsRef = useRef<any>({});
    const tableRef = useRef<ActionType>();

    const [visible, setVisible] = useState<boolean>(false);
    const [openId, setOpenId] = useState<string | number | null>(null);
    const [modalType, setModalType] = useState<MODAL_TYPE>(MODAL_TYPE.BUILD);
    const searchParams = window.location.search;
    const urlParams = new URLSearchParams(searchParams);
    const sheetNo = urlParams.get('sheetNo');
    const [isFirst, setIsFirst] = useState(true);
    const [preParams, setPreParams] = useState<any>('');

    // 关闭弹窗重置打开弹窗的id
    useEffect(() => {
        if (!visible) {
            setOpenId(null);
        }
    }, [visible]);

    const handleExport = () => {
        sendLogFn({ authKey: 'network-cutover:export' });
        request(`networkCutoverInfo/export`, {
            type: 'post',
            baseUrlType: 'dutyManagerUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '导出失败，请检查服务',
            responseType: 'blob',
            data: {
                ...searchParamsRef.current,
            },
        }).then((res) => {
            const contentDisposition = res.headers['content-disposition'];
            const fileName = decodeURIComponent(contentDisposition.substring(contentDisposition.indexOf('=') + 1)).substring(7);
            // type 为需要导出的文件类型，此处为xls表格类型
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
            // 兼容不同浏览器的URL对象
            const url = window.URL || window.webkitURL;
            // 创建下载链接
            const downloadHref = url.createObjectURL(blob);
            // 创建a标签并为其添加属性
            const downloadLink = document.createElement('a');
            downloadLink.href = downloadHref;
            downloadLink.download = fileName;
            // 触发点击事件执行下载
            downloadLink.click();
        });
    };

    const getList = async (params) => {
        const allParams = {
            ...params,
            isCutoverFinish: params.isCutoverFinish === -1 ? undefined : params.isCutoverFinish,
            isShowOnBigScreen: params.isShowOnBigScreen === -1 ? undefined : params.isShowOnBigScreen,
        };
        const paramsStr = JSON.stringify(allParams);
        const isParamNoChange = preParams === '' || paramsStr === preParams;
        setPreParams(paramsStr);
        if (isFirst && sheetNo && isParamNoChange) {
            allParams.sheetNo = sheetNo;
        }
        searchParamsRef.current = allParams;
        const res = await postCutoverList({ ...allParams });
        setIsFirst(isParamNoChange);
        if (res.code === 200) {
            return {
                data: res.data || [],
                success: true,
                total: res.total,
            };
        }
        return {
            data: [],
            success: true,
            total: 0,
        };
    };

    // 操作打开弹层
    const openModalClick = (row, type: MODAL_TYPE) => {
        setOpenId(row?.id);
        setModalType(type);
        setVisible(true);
        sendLogFn({ authKey: 'networkCutoverATM-check' });
    };
    // 删除列表项
    const deleteClick = (row) => {
        sendLogFn({ authKey: 'network-cutover:delete' });
        Modal.confirm({
            title: '提示',
            content: '是否确认删除该数据？',
            onOk: async () => {
                try {
                    const res = await deleteCutover({ id: row?.id });
                    if (res.code === 200) {
                        message.success('删除成功');
                        tableRef.current?.reload();
                    } else {
                        message.error('删除失败');
                    }
                } catch {
                    message.error('接口错误');
                }
            },
            onCancel() {},
        });
    };

    // 表格配置
    const columns = getColumns({
        openModalClick,
        deleteClick,
        provinceId,
        sheetNo,
    });

    return (
        <div style={{ height: '100%' }}>
            <VirtualTable
                global={window}
                toolBarRender={() => [
                    <AuthButton icon={<Icon antdIcon type="ExportOutlined" key="Export" />} authKey={authData.export} onClick={handleExport} logFalse>
                        导出
                    </AuthButton>,
                ]}
                columns={columns}
                request={getList}
                actionRef={tableRef}
                formRef={formRef}
                scroll={{ x: 'max-content' }}
                params={fixedParamsRef.current}
                size="large"
            />
            <ActionModal visible={visible} setVisible={setVisible} modalType={modalType} openId={openId} tableRef={tableRef} />
        </div>
    );
};

export default Atm;
