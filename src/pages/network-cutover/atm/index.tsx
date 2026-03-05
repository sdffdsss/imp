import useLoginInfoModel from '@Src/hox';
import { Icon, Modal, message, Button } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { BatchImport } from '@Pages/components';
import AuthButton from '@Components/auth-button';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import NewAuthButton from '@Pages/components/auth/auth-button';
import React, { FC, useState, useEffect, useRef } from 'react';
import { MODAL_TYPE, ALL_ENUMS, MAJOR_ENUM, ActionType } from '../type';
import { postCutoverList, postMajorEnum, deleteCutover, exportFile, downFile } from '../api';
import { ActionModal } from './Modals';
import getColumns from './columns';
import { authData } from '../auth';

interface Props {}

const Atm: FC<Props> = () => {
    const formRef: any = useRef();
    const tableRef = useRef<ActionType>();
    const { provinceId } = useLoginInfoModel();

    const [enums, setEnums] = useState<ALL_ENUMS>({});
    const [visible, setVisible] = useState<boolean>(false);
    const [openId, setOpenId] = useState<string | number | null>(null);
    const [modalType, setModalType] = useState<MODAL_TYPE>(MODAL_TYPE.BUILD);

    // 关闭弹窗重置打开弹窗的id
    useEffect(() => {
        if (!visible) {
            setOpenId(null);
        }
    }, [visible]);

    const getEnums = async () => {
        const professionalEnum = await postMajorEnum(['dutyProfessional', 'affiliatedNetwork', 'completionStatus']);
        setEnums({
            professionalEnum: professionalEnum?.data?.dutyProfessional || [],
            affiliatedNetworkEnum: professionalEnum?.data?.affiliatedNetwork || [],
            completionStatusEnum: professionalEnum?.data?.completionStatus || [],
        });
    };

    useEffect(() => {
        getEnums();
    }, []);

    const handleExport = () => {
        const formData = formRef.current.getFieldsValue(true);
        sendLogFn({ authKey: 'network-cutover:export' });
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
        const res = await postCutoverList({ ...allParams });
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
        sendLogFn({ authKey: 'networkCutoverATM-check' });
    };
    // 删除列表项
    const deleteClick = (row) => {
        sendLogFn({ authKey: 'network-cutover:delete' });
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
            professionType: MAJOR_ENUM.ATM,
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
                    // <BatchImport title="网路故障导入" onCallback={importCallback} downFile={downloadFile} />,
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

export default Atm;
