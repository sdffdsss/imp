import useLoginInfoModel from '@Src/hox';
import { Icon, Modal, message, Button } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { BatchImport } from '@Pages/components';
import AuthButton from '@Components/auth-button';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import React, { FC, useState, useEffect, useRef } from 'react';
import { MODAL_TYPE, ALL_ENUMS, MAJOR_ENUM, ActionType } from '../type';
import { postCutoverList, postMajorEnum, deleteCutover, exportFile, downFile, findGroupByCenter } from '../api';
import { ActionModal } from './Modals';
import { authData } from '../auth';
import getColumns from './columns';

interface Props {}

const Internet: FC<Props> = () => {
    const formRef: any = useRef();
    const tableRef = useRef<ActionType>();
    const { provinceId, userId } = useLoginInfoModel();

    const [enums, setEnums] = useState<ALL_ENUMS>({});
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

    const getEnums = async () => {
        const professionalEnum = await postMajorEnum(['dutyProfessional', 'affiliatedNetwork', 'completionStatus']);
        const groupSourceEnum = await findGroupByCenter({ operateUser: userId, professionalId: '9999' });
        setEnums({
            professionalEnum: professionalEnum?.data?.dutyProfessional || [],
            affiliatedNetworkEnum: professionalEnum?.data?.affiliatedNetwork || [],
            completionStatusEnum: professionalEnum?.data?.completionStatus || [],
            groupSourceEnum: groupSourceEnum?.data || [],
        });
    };

    useEffect(() => {
        getEnums();
    }, []);

    const handleExport = () => {
        const formData = formRef.current.getFieldsValue();
        formData.cutoverStartTimeBegin = formData?.cutoverStartTime?.[0]?.format('YYYY-MM-DD 00:00:00');
        formData.cutoverStartTimeEnd = formData?.cutoverStartTime?.[1]?.format('YYYY-MM-DD 23:59:59');
        formData.cutoverEndTimeBegin = formData?.cutoverEndTime?.[0]?.format('YYYY-MM-DD 00:00:00');
        formData.cutoverEndTimeEnd = formData?.cutoverEndTime?.[1]?.format('YYYY-MM-DD 23:59:59');
        if (isFirst && sheetNo) {
            formData.serialNumber = sheetNo;
        }
        exportFile(formData);
    };

    const getList = async (params, sort) => {
        const newSort = {
            orderFieldName: Object.keys(sort)[0],
            orderType: sort[Object.keys(sort)[0]],
        };
        const formData = formRef.current.getFieldsValue(true); // 防止初次请求获取不到 initialValue 的问题
        const allParams = {
            ...formData,
            ...params,
            ...newSort,
        };
        const paramsStr = JSON.stringify(allParams);
        const isParamNoChange = preParams === '' || paramsStr === preParams;
        setPreParams(paramsStr);
        if (isFirst && sheetNo && isParamNoChange) {
            allParams.serialNumber = sheetNo;
        }
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
            success: false,
            total: 0,
        };
    };

    // 操作打开弹层
    const openModalClick = (row, type: MODAL_TYPE) => {
        setOpenId(row?.id);
        setModalType(type);
        setVisible(true);
        sendLogFn({ authKey: 'networkCutoverInternet-check' });
    };
    // 删除列表项
    const deleteClick = (row) => {
        Modal.confirm({
            title: '提示',
            content: '是否确认删除?',
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
        enums,
    });

    const importCallback = (data: Record<string, any>) => {
        console.log(60, data);
        tableRef.current?.reload();
    };

    const downloadFile = () => {
        downFile({
            professionType: MAJOR_ENUM.INTERNET,
        });
    };

    return (
        <div style={{ height: '100%' }}>
            <VirtualTable
                global={window}
                toolBarRender={() => [
                    <AuthButton authKey={authData.add} onClick={() => openModalClick({}, MODAL_TYPE.BUILD)} type="primary" logFalse>
                        新建
                    </AuthButton>,
                    <BatchImport title="网络割接记录导入" onCallback={importCallback} downFile={downloadFile} authKey={authData.import} />,
                    <AuthButton icon={<Icon antdIcon type="ExportOutlined" key="Export" />} authKey={authData.export} onClick={handleExport} logFalse>
                        导出
                    </AuthButton>,
                    // <Button onClick={() => openModalClick({}, MODAL_TYPE.BUILD)} type="primary">
                    //     新建
                    // </Button>,
                    // <BatchImport title="网路故障导入" onCallback={importCallback} downFile={downloadFile} authKey={authData.import} />,
                    // <Button onClick={handleExport}>
                    //     <Icon key="Export" antdIcon type="ExportOutlined" />
                    //     导出
                    // </Button>,
                ]}
                columns={columns}
                request={getList}
                actionRef={tableRef}
                formRef={formRef}
                scroll={{ x: 'max-content' }}
            />
            <ActionModal visible={visible} setVisible={setVisible} modalType={modalType} enums={enums} openId={openId} tableRef={tableRef} />
        </div>
    );
};

export default Internet;
