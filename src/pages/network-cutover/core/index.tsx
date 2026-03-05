import useLoginInfoModel from '@Src/hox';
import { Icon, Modal, message } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import { BatchImport } from '@Pages/components';
import AuthButton from '@Components/auth-button';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import React, { FC, useState, useEffect, useRef } from 'react';
import { getProvince } from '@Common/utils/getProvince';
import moment from 'moment/moment';
import { MODAL_TYPE, ALL_ENUMS, ActionType, MAJOR_ENUM } from '../type';
import { exportFile, postMajorEnum, postCutoverList, deleteCutover, downFile, findGroupByCenter } from '../api';
import { ActionModal } from './Modals';
import getColumns from './columns';
import { authData } from '../auth';

interface Props {}

const Core: FC<Props> = () => {
    const formRef: any = useRef();
    const tableRef = useRef<ActionType>();
    const { provinceId, currentZone, userId } = useLoginInfoModel();

    const [enums, setEnums] = useState<ALL_ENUMS>({});
    const [visible, setVisible] = useState<boolean>(false);
    const [openId, setOpenId] = useState<string | number | null>(null);
    const [modalType, setModalType] = useState<MODAL_TYPE>(MODAL_TYPE.BUILD);
    const [provinceList, setProvinceList] = useState<any>([]);
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
        const professionalEnum = await postMajorEnum(['dutyProfessional', 'nmsType', 'recordSource']);
        const groupSourceEnum = await findGroupByCenter({ operateUser: userId, professionalId: '1' });
        setEnums({
            professionalEnum: professionalEnum?.data?.dutyProfessional || [],
            recordSourceEnum: professionalEnum?.data?.recordSource || [],
            nmsTypeEnum: professionalEnum?.data?.nmsType || [],
            groupSourceEnum: groupSourceEnum?.data || [],
        });
    };

    const getProvinceList = async () => {
        const options = await getProvince();
        setProvinceList(options);
    };

    useEffect(() => {
        getEnums();
        getProvinceList();
    }, []);

    const handleExport = () => {
        const formData = formRef.current.getFieldsValue(true);
        formData.dataProvince = provinceId;
        formData.cutoverStartTimeBegin = formData.cutoverStartTime?.[0]
            ? moment(formData.cutoverStartTime?.[0]).format('YYYY-MM-DD 00:00:00')
            : undefined;
        formData.cutoverStartTimeEnd = formData.cutoverStartTime?.[1]
            ? moment(formData.cutoverStartTime?.[1]).format('YYYY-MM-DD 00:00:00')
            : undefined;
        formData.cutoverEndTimeBegin = formData.cutoverEndTime?.[0] ? moment(formData.cutoverEndTime?.[0]).format('YYYY-MM-DD 00:00:00') : undefined;
        formData.cutoverEndTimeEnd = formData.cutoverEndTime?.[1] ? moment(formData.cutoverEndTime?.[1]).format('YYYY-MM-DD 00:00:00') : undefined;
        if (isFirst && sheetNo) {
            formData.serialNumber = sheetNo;
        }
        exportFile(formData, null);
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
            dataProvince: provinceId,
            cutoverStartTimeBegin: formData.cutoverStartTime?.[0] ? moment(formData.cutoverStartTime?.[0]).format('YYYY-MM-DD 00:00:00') : undefined,
            cutoverStartTimeEnd: formData.cutoverStartTime?.[1] ? moment(formData.cutoverStartTime?.[1]).format('YYYY-MM-DD 00:00:00') : undefined,
            cutoverEndTimeBegin: formData.cutoverEndTime?.[0] ? moment(formData.cutoverEndTime?.[0]).format('YYYY-MM-DD 00:00:00') : undefined,
            cutoverEndTimeEnd: formData.cutoverEndTime?.[1] ? moment(formData.cutoverEndTime?.[1]).format('YYYY-MM-DD 00:00:00') : undefined,
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
        sendLogFn({ authKey: 'networkCutoverCore-check' });
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
        provinceList,
    });

    const importCallback = () => {
        tableRef.current?.reload();
    };

    const downloadFile = () => {
        downFile({
            professionType: MAJOR_ENUM.CORE,
        });
    };

    return (
        <div style={{ height: '100%' }}>
            <VirtualTable
                global={window}
                toolBarRender={() => [
                    <AuthButton
                        authKey={authData.add}
                        disabled={currentZone.zoneLevel === '2'}
                        onClick={() => openModalClick({}, MODAL_TYPE.BUILD)}
                        type="primary"
                        logFalse
                    >
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
            <ActionModal
                visible={visible}
                setVisible={setVisible}
                modalType={modalType}
                enums={enums}
                provinceList={provinceList}
                openId={openId}
                tableRef={tableRef}
            />
        </div>
    );
};

export default Core;
