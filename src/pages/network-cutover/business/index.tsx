import useLoginInfoModel from '@Src/hox';
import { VirtualTable } from 'oss-web-common';
import { Icon, Modal, message } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import AuthButton from '@Components/auth-button';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import React, { FC, useState, useEffect, useRef, useMemo } from 'react';
import { useColumnsState } from '@Src/hooks';
import { postCutoverList, postMajorEnum, deleteCutover, exportFile, findGroupByCenter } from '../api';
import { MODAL_TYPE, ALL_ENUMS, ActionType } from '../type';
import { ActionModal } from './Modals';
import { authData } from '../auth';
import getColumns from './columns';
import './index.less';

interface Props {}

const Business: FC<Props> = () => {
    const columnsState = useColumnsState({ configType: 24 });
    const formRef: any = useRef();
    const tableRef = useRef<ActionType>();
    const { provinceId, userId } = useLoginInfoModel();
    const page = useRef({
        pageSize: 20,
        current: 1,
    });
    const [enums, setEnums] = useState<ALL_ENUMS>({});
    const [visible, setVisible] = useState<boolean>(false);
    const [openId, setOpenId] = useState<string | number | null>(null);
    const [modalType, setModalType] = useState<MODAL_TYPE>(MODAL_TYPE.BUILD);

    const searchParams = window.location.search;
    const urlParams = new URLSearchParams(searchParams);
    const workOrderTheme = urlParams.get('workOrderTheme');
    const [isFirst, setIsFirst] = useState(true);
    const [preParams, setPreParams] = useState<any>('');

    // 操作打开弹层
    const openModalClick = (row, type: MODAL_TYPE) => {
        setOpenId(row?.id);
        setModalType(type);
        setVisible(true);
        sendLogFn({ authKey: 'networkCutoverBusiness-check' });
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

    // 关闭弹窗重置打开弹窗的id
    useEffect(() => {
        if (!visible) {
            setOpenId(null);
        }
    }, [visible]);
    const convertEnumData = (list) => {
        return list.map((item) => {
            return {
                label: item.value,
                value: item.key,
            };
        });
    };
    /**
     * cutover_profession 割接专业
     * cutover_classification  割接分类
     * cutover_finish_status 割接是否完成
     * operate_level  操作级别
     * isEffectBusiness 是否影响业务
     * recordSourcePlatform 记录来源
     */
    const getEnums = async () => {
        const professionalEnum = await postMajorEnum([
            'dutyProfessional',
            'cutoverAckStatus',
            'cutover_profession',
            'cutover_classification',
            'cutover_finish_status',
            'operate_level',
            'isEffectBusiness',
            'recordSourcePlatform',
            'recordSource',
        ]);
        const groupSourceEnum = await findGroupByCenter({ operateUser: userId, professionalId: '85' });
        setEnums({
            professionalEnum: convertEnumData(professionalEnum?.data?.dutyProfessional) || [],
            cutoverAckStatusEnum: convertEnumData(professionalEnum?.data?.cutoverAckStatus) || [],
            cutoverProfessionEnum: convertEnumData(professionalEnum?.data?.cutover_profession) || [],
            cutoverClassificationEnum: convertEnumData(professionalEnum?.data?.cutover_classification) || [],
            cutoverFinishStatusEnum: convertEnumData(professionalEnum?.data?.cutover_finish_status) || [],
            operateLevelEnum: convertEnumData(professionalEnum?.data?.operate_level) || [],
            isEffectBusinessEnum: convertEnumData(professionalEnum?.data?.isEffectBusiness) || [],
            recordSourceEnum: convertEnumData(professionalEnum?.data?.recordSource) || [],
            recordSourcePlatformEnum: convertEnumData(professionalEnum?.data?.recordSourcePlatform) || [],
            groupSourceEnum: groupSourceEnum?.data || [],
        });
    };

    // 表格配置
    const { formColumns = [], columns = [] } = getColumns({
        openModalClick,
        deleteClick,
        enums,
        theme: workOrderTheme || '',
    });

    useEffect(() => {
        getEnums();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const setPage = (pagination) => {
        page.current = pagination;
    };
    const handleExport = () => {
        const params = formRef.current?.getFieldsValue();
        const cutoverProfession = params?.professionTypeForm?.map((item: string) => item);

        const allParams = {
            current: page.current.current,
            pageSize: page.current.pageSize,
            dataProvince: provinceId,
            cutoverProfession,
            professionType: '85',
            cutoverStartTimeBegin: params?.cutoverStartTimeForm?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
            cutoverStartTimeEnd: params?.cutoverStartTimeForm?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
            cutoverClassification: params?.typeForm === '-1' ? undefined : params?.typeForm,
            theme: params?.themeForm || '',
        };
        exportFile(allParams);
    };

    const getList = async (params, sort) => {
        const newSort = {
            orderFieldName: Object.keys(sort)[0],
            orderType: sort[Object.keys(sort)[0]],
        };

        const cutoverProfession = params?.professionTypeForm?.map((item: string) => item);
        const allParams = {
            current: params?.current,
            pageSize: params?.pageSize,
            dataProvince: provinceId,
            cutoverProfession,
            professionType: '85',
            cutoverStartTimeBegin: params?.cutoverStartTimeForm?.[0],
            cutoverStartTimeEnd: params?.cutoverStartTimeForm?.[1],
            cutoverClassification: params?.typeForm === '-1' ? undefined : params?.typeForm,
            theme: params?.themeForm,
            ...newSort,
        };
        const paramsStr = JSON.stringify(allParams);
        const isParamNoChange = preParams === '' || paramsStr === preParams;
        setPreParams(paramsStr);
        if (isFirst && workOrderTheme && isParamNoChange) {
            allParams.theme = workOrderTheme;
        }
        const res = await postCutoverList({ ...allParams });
        setIsFirst(isParamNoChange);

        if (res.code === 200) {
            return {
                data:
                    res.data?.map((item) => {
                        return {
                            ...item,
                            INDEX_COLUMN_DATAINDEX: item.index,
                        };
                    }) || [],
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

    const tableColumns = useMemo(() => {
        return [...formColumns, ...columns];
    }, [formColumns, columns]);

    if (_.isEmpty(columnsState.value)) {
        return null;
    }
    return (
        <div style={{ height: '100%' }}>
            <VirtualTable
                global={window}
                columns={tableColumns}
                request={getList}
                actionRef={tableRef}
                formRef={formRef}
                onChange={setPage}
                scroll={{ x: 'max-content' }}
                columnsState={columnsState}
                toolBarRender={() => [
                    <AuthButton authKey={authData.add} onClick={() => openModalClick({}, MODAL_TYPE.BUILD)} type="primary" logFalse>
                        新建
                    </AuthButton>,
                    <AuthButton icon={<Icon antdIcon type="ExportOutlined" key="Export" />} authKey={authData.export} onClick={handleExport} logFalse>
                        导出
                    </AuthButton>,
                ]}
                rowClassName={(record) => {
                    const { cutoverFinishStatus } = record;
                    if (!cutoverFinishStatus) {
                        return 'network-cutover-business-table-row';
                    }
                    return '';
                }}
            />
            <ActionModal visible={visible} setVisible={setVisible} modalType={modalType} enums={enums} openId={openId} tableRef={tableRef} />
        </div>
    );
};

export default Business;
