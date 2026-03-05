import React, { useState, useRef, useEffect } from 'react';
import { produce } from 'immer';
import { ProTable, Button, Icon, Modal } from 'oss-ui';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import { blobDownLoad } from '@Common/utils/download';
import DragTableHeader from '@Pages/components/drag-table-header';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import AuthButton from '@Components/auth-button';
import getColumns, { getModalColumns } from './columns';
import {
    getAttendanceOnDuty,
    getProvinceList,
    getProfessionalTypeList,
    getGroupList,
    exportAttendanceOnDuty,
    getKpiQueryApi,
    faultReportExportApi,
} from './api';
import './index.less';

const CheckDutyAttendance = () => {
    const [provinceData, setProvinceData] = useState([]);
    const [professionalData, setProfessionalData] = useState([]);
    const [groupData, setGroupData] = useState([]);
    const [dutyData, setDutyData] = useState([]);
    const [dutyTotalData, setDutyTotalData] = useState('');
    const [pagination, setPagination] = useState({});
    const { userId, provinceId } = useLoginInfoModel();

    const currProvince = provinceData.find((item) => item.regionId === provinceId);
    const [columns, setColumns] = useState([]);

    const groupId = useRef();
    const formRef = useRef();

    // 重加载
    const tableRef = useRef();
    const [groupInitial, setGroupInitial] = useState([]);
    const [loading, setLoading] = useState(true);

    // 弹窗相关
    const [wVisible, setWVisible] = useState(false);
    const [wSearchTime, setWSearchTime] = useState([moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);
    const wTimeRef = useRef([moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);
    useEffect(() => {
        // 表格配置
        const currentColumns = getColumns({
            provinceId: Number(provinceId),
            searchTime: [],
            currProvince,
            professionalData,
            groupData,
            dutyData,
            pagination,
            groupInitial,
        });
        const newCurrentColumns = currentColumns.map((item) => {
            return {
                ...item,
                width: columns.filter((item2) => item2.dataIndex === item.dataIndex)?.[0]?.width || item.width,
            };
        });
        setColumns(newCurrentColumns);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provinceId, currProvince, professionalData, groupData, dutyData, pagination, groupInitial]);

    // 获取值班数据
    const getDutyData = async (data) => {
        const res = await getAttendanceOnDuty(data);
        if (res && Array.isArray(res.data)) {
            const list = [res.total, res.workShiftSum, res.normalSum, res.abnormalSum];
            setDutyData(list);
            const dutyStr = `总值班班次数:${res.workShiftSum},正常值班班次数:${res.normalSum},未正常值班班次数:${res.abnormalSum}`;
            setDutyTotalData(dutyStr);
        }
        return res;
    };

    // 获取操作日志列表数据
    const attendanceOnDutyList = (params) => {
        setPagination({ current: params.current, pageSize: params.pageSize });
        console.log('duty=', params);
        groupId.current = params.groupObj;
        const data = {
            pageNum: params.current,
            pageSize: params.pageSize,
            provinceId: Number(provinceId),
            startTime: params.dateTime?.[0]
                ? moment(params.dateTime?.[0]).format('YYYY-MM-DD  00:00:00')
                : moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00'),
            endTime: params.dateTime?.[1] ? moment(params.dateTime?.[1]).format('YYYY-MM-DD 23:59:59') : moment().format('YYYY-MM-DD 23:59:59'),
            professionalIds: params.professionalObj?.join(','),
            groupId: params.groupObj,
            names: params.mainName ? params.mainName.split('，').join(',') : undefined,
        };
        return getDutyData(data);
    };

    // 获取归属省份
    const getProvinceData = async () => {
        const data = {
            creator: userId,
        };
        const res = await getProvinceList(data);
        if (res && Array.isArray(res)) {
            const list = res;
            setProvinceData(list);
        }
    };
    // 获取监控班组专业属性
    const getProfessionalData = async () => {
        const res = await getProfessionalTypeList({});
        if (res && Array.isArray(res.data)) {
            const list = res.data;
            setProfessionalData(list);
        }
    };
    // 获取班组名称
    const getGroupData = async (provinceIdParam) => {
        const res = await getGroupList({ provinceId: Number(provinceIdParam) });
        if (res && Array.isArray(res.rows)) {
            const list = res.rows;
            setGroupData(list);
        }
    };

    /**
     * 导出文件事件
     */
    const exportAllList = () => {
        const params = formRef.current.getFieldsValue();
        const data = {
            provinceId,
            // pageNum: pagination.current,
            // pageSize: pagination.pageSize,
            startTime: params.dateTime?.[0]
                ? moment(params.dateTime?.[0]).format('YYYY-MM-DD  00:00:00')
                : moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00'),
            endTime: params.dateTime?.[1] ? moment(params.dateTime?.[1]).format('YYYY-MM-DD 23:59:59') : moment().format('YYYY-MM-DD 23:59:59'),
            professionalIds: params.professionalObj?.join(','),
            groupId: params.groupObj,
            names: params.mainName ? params.mainName.split('，').join(',') : undefined,
        };
        exportAttendanceOnDuty(data).then((res) => {
            if (res) {
                const downloadName = `值班考勤记录详情${moment().format('YYYYMMDDHHmmss')}.xlsx`;
                blobDownLoad(res, downloadName);
            }
        });
    };

    useEffect(() => {
        getProvinceData();
        getProfessionalData();
        getGroupData(provinceId);
    }, [provinceId]);
    // 给表单项赋初始值
    useEffect(() => {
        getDefaultGroupByUser().then((res) => {
            setGroupInitial(res.groupId);
            setLoading(false);
            groupId.current = res.groupId;
            formRef.current?.setFieldsValue({
                provinceId: Number(provinceId),
                searchTime: [],
                professionalData,
                groupData,
                groupObj: res.groupId,
            });
            formRef.current?.submit();
        });
    }, []);

    const DutySearch = (dutyStr) => {
        return (
            <>
                <div style={{ color: 'red' }}>{dutyStr}</div>
            </>
        );
    };

    const handleResize =
        (index) =>
        (e, { size }) => {
            const nextColumns = produce(columns, (draft) => {
                // eslint-disable-next-line no-param-reassign
                draft[index].width = size.width;
            });
            setColumns(nextColumns);
        };

    const formatColumns = columns.map((item, index) => {
        return {
            ...item,
            onHeaderCell: (column) => ({
                width: column.width || 120,
                onResize: handleResize(index),
                isLastColumn: index === columns.length - 1,
            }),
        };
    });

    const findProfessionalId = (name) => {
        return professionalData.find((item) => item.txt === name)?.id;
    };
    const faultReportExportHandle = async (record) => {
        const professionalType = findProfessionalId(record.professional);
        const params = {
            professionalType,
            groupId: record.groupId,
            startTime: wSearchTime[0],
            endTime: wSearchTime[1],
            executor: record.dutyPerson,
            mainId: record.dutyPersonId,
        };
        const res = await faultReportExportApi(params);
        if (res) {
            const downloadName = `故障报告${moment().format('YYYYMMDDHHmmss')}.xlsx`;
            blobDownLoad(res, downloadName);
        }
    };

    const modalColumns = getModalColumns({
        groupData,
        professionalData,
        faultReportExportHandle,
        initDate: wTimeRef.current,
        groupId: groupId.current,
    });
    const getKpiQueryData = async (value) => {
        const startTime = moment(value.startTime).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endTime = moment(value.endTime).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        const professionalType =
            value.professional && value.professional.length > 0 ? value.professional.join(',') : professionalData.map((item) => item.id).join(',');
        const params = {
            professionalType,
            groupId: value.teamName ? value.teamName : -1,
            startTime,
            endTime,
            pageNum: value.current,
            pageSize: value.pageSize,
            provinceId: Number(provinceId),
        };
        if (value.startTime && value.endTime) {
            setWSearchTime([startTime, endTime]);
        }

        const res = await getKpiQueryApi(params);

        if (+res.code === 200) {
            return res;
        }
        return { data: [], success: false };
    };
    const onAnalysisModalOpen = () => {
        setWVisible(true);
    };
    return (
        <>
            {!loading && (
                <ProTable
                    rowKey="id"
                    global={window}
                    provinceId={provinceId}
                    columns={formatColumns}
                    request={attendanceOnDutyList}
                    actionRef={tableRef}
                    formRef={formRef}
                    footer={() => DutySearch(dutyTotalData)}
                    scroll={{ x: 'max-content' }}
                    components={DragTableHeader}
                    toolBarRender={() => [
                        <AuthButton authKey="check-duty-attendance:analysis" onClick={onAnalysisModalOpen} type="primary">
                            考核分析
                        </AuthButton>,
                        <Button
                            onClick={() => {
                                exportAllList();
                            }}
                        >
                            <Icon antdIcon type="ExportOutlined" />
                            导出
                        </Button>,
                    ]}
                />
            )}
            <Modal
                title="考核分析"
                visible={wVisible}
                onCancel={() => setWVisible(false)}
                onOk={() => setWVisible(false)}
                width={1450}
                footer={null}
                destroyOnClose
            >
                <div className="check-duty-attendance-modal">
                    <ProTable rowKey="id" global={window} columns={modalColumns} options={false} request={getKpiQueryData} />
                </div>
            </Modal>
        </>
    );
};

export default CheckDutyAttendance;
