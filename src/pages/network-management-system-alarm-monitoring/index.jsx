import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { VirtualTable } from 'oss-web-common';
import { Button, Modal, message, Form, Input, Space, Upload } from 'oss-ui';
import { getTemporaryRoute, saveInfoRoute, exportTemporaryRoute, exportTemporaryRouteTemplate, exportImportFile } from './api';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import moment from 'moment';
import { blobDownLoad } from '@Common/utils/download';
import GlobalMessage from '@Src/common/global-message';
import './index.less';
import AuthButton from '@Src/components/auth-button';
import { sendLogFn } from '@Pages/components/auth/utils';
import { useHistory, useParams } from 'react-router-dom';
//可编辑
// const EditableContext = React.createContext(null);
// const EditableRow = ({ index, ...props }) => {
//     const [form] = Form.useForm();
//     return (
//         <Form form={form} component={false}>
//             <EditableContext.Provider value={form}>
//                 <tr {...props} />
//             </EditableContext.Provider>
//         </Form>
//     );
// };
// const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, index,...restProps }) => {
//     const [editing, setEditing] = useState(false);
//     const inputRef = useRef(null);
//     const form = useContext(EditableContext);
//     useEffect(() => {
//         if (editing) {
//             inputRef.current.focus();
//         }
//     }, [editing]);
//     const toggleEdit = () => {
//         setEditing(!editing);
//         form.setFieldsValue({
//             [dataIndex]: record[dataIndex],
//         });
//     };
//     const save = async () => {
//         try {
//             const values = await form.validateFields();
//             toggleEdit();
//             handleSave({
//                 ...record,
//                 ...values,
//             });
//         } catch (errInfo) {
//             console.log('Save failed:', errInfo);
//         }
//     };
//     let childNode = children;
//     if (editable) {
//         if ((childNode = editing)) {
//             console.log(index);
//             childNode = (
//                 <Form.Item
//                     style={{
//                         margin: 0,
//                     }}
//                     name={dataIndex}
//                 >
//                     <Input ref={inputRef} onPressEnter={save} onBlur={save} />
//                 </Form.Item>
//             );
//         } else {
//             childNode = (
//                 <div
//                     className="editable-cell-value-wrap"
//                     style={{
//                         paddingRight: 24,
//                     }}
//                     onClick={toggleEdit}
//                 >
//                     {children}
//                 </div>
//             );
//         }
//     }
//     return <td {...restProps}>{childNode}</td>;
// };

//组件
const NetworkManagementSystemAlarmMonitoring = (props) => {
    //const groupId = 412223492;
    // const edit = true;
    //const provinceId = -662225376;
    //const dateTime = '2023-05-15 00:00:00';
    // const { groupId, provinceId, dateTime } = props.location.state;
    const { search } = window.location;
    const searchParams = new URLSearchParams(search);
    let groupId = searchParams.get('groupId');
    let provinceId = searchParams.get('provinceId');
    let dateTime = searchParams.get('dateTime');
    let isEdit = searchParams.get('edit') === 'false';
    const [importFile, setImportFile] = useState({});
    const [fileName, setFileName] = useState('');
    const [isExp, setIsExp] = useState(true);
    const { userId, userName } = useLoginInfoModel();
    const [tableListData, setTableListData] = useState([]);
    const history = useHistory();
    const watchTabActiveChange = () => {
        GlobalMessage.off('activeChanged', null, null);
        GlobalMessage.on(
            'activeChanged',
            ({ isActive }) => {
                if (isActive) {
                    const { search: newSearch } = window.location;
                    const newSearchParams = new URLSearchParams(newSearch);
                    const newGroupId = newSearchParams.get('groupId');
                    const newProvinceId = newSearchParams.get('provinceId');
                    const newDateTime = newSearchParams.get('dateTime');
                    const newIsEdit = newSearchParams.get('edit') === 'false';
                    if (newGroupId !== groupId || newProvinceId !== provinceId || newDateTime !== dateTime) {
                        groupId = newGroupId;
                        provinceId = newProvinceId;
                        dateTime = newDateTime;
                        isEdit = newIsEdit;
                        getTemporaryRouteList();
                    }
                }
            },
            null,
        );
    };
    useEffect(() => {
        watchTabActiveChange();
        getTemporaryRouteList();
    }, [groupId, provinceId, dateTime]);

    const formRef = useRef();
    //可编辑
    // const handleSave = (row) => {
    //     const newData = [...tableListData];
    //     const index = newData.findIndex((item) => row.key === item.key);
    //     const item = newData[index];
    //     newData.splice(index, 1, {
    //         ...item,
    //         ...row,
    //     });
    //     setTableListData(newData);
    // };
    const defaultColumns = [
        {
            title: '网元名称',
            dataIndex: 'neName',
            key: 0,
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '10:30',
            dataIndex: '10:30',
            key: 1,
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '14:30',
            dataIndex: '14:30',
            key: 2,
            hideInSearch: true,
            align: 'center',
            ellipsis: true,
        },
        {
            title: '16:30',
            dataIndex: '16:30',
            key: 3,
            hideInSearch: true,
            align: 'center',
            width: 120,
        },
        {
            title: '18:30',
            dataIndex: '18:30',
            key: 4,
            hideInSearch: true,
            align: 'center',
            width: 120,
        },
        {
            title: '20:30',
            dataIndex: '20:30',
            key: 5,
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '22:30',
            dataIndex: '22:30',
            key: 6,
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '次日8:00',
            dataIndex: '次日8:00',
            key: 7,
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: '巡检人',
            dataIndex: 'inspector',
            key: 8,
            hideInSearch: true,
            align: 'center',
            width: 120,
            ellipsis: true,
            onCell: (_, index) => {
                if (index === 0) {
                    return {
                        rowSpan: tableListData.length,
                    };
                } else {
                    return {
                        colSpan: 0,
                    };
                }
            },
        },
    ];
    // const columns = defaultColumns.map((col) => {
    //     if (!col.editable) {
    //         return col;
    //     }
    //     return {
    //         ...col,
    //         onCell: (record) => {
    //             return {
    //                 record,
    //                 editable: col.editable,
    //                 dataIndex: col.dataIndex,
    //                 title: col.title,
    //                 handleSave,
    //             };
    //         },
    //     };
    // });

    // const components = {
    //     body: {
    //         row: EditableRow,
    //         cell: EditableCell,
    //     },
    // };
    const changeFile = (file) => {
        setImportFile(file);
        setFileName(file.name);
        setIsExp(false);
        return false;
    };
    /**
     * 导入文件方法
     */
    const ImportFile = () => {
        sendLogFn({ authKey: 'workbench-Workbench-NMS-AlarmMonitoring-Import' });
        const formData = new FormData();
        formData.append('file', importFile);
        formData.append('provinceId', provinceId);
        formData.append('groupId', groupId);
        formData.append('dateTime', dateTime);
        exportImportFile(formData).then((res) => {
            if (res.resultCode == '200') {
                getTemporaryRouteList();
                message.success(res.resultMsg);
            } else {
                message.error(res?.resultMsg);
            }
        });
    };
    const refreshTable = (data) => {
        let tableData = [];
        data.neNames.forEach((item, index) => {
            let obj = {
                neName: item.neName,
                inspector: data.inspector,
                key: index,
            };
            item.timePoints.forEach((t) => {
                obj[t.timePoint] = t.content;
            });
            tableData.push(obj);
        });
        return tableData;
    };
    /**
     * 下载模板
     */
    const handleExportTemplate = () => {
        const params = {
            groupId: groupId,
            provinceId: provinceId,
            dateTime: dateTime,
        };
        exportTemporaryRouteTemplate(params).then((res) => {
            if (res) {
                blobDownLoad(res, `交接班-网络系统告警监测导入模板${moment().format('YYYYMMDDHHmmss')}.xlsx`);
            }
        });
    };
    // 导出
    const handleExport = () => {
        sendLogFn({ authKey: 'workbench-Workbench-NMS-AlarmMonitoring-Export' });
        const params = {
            provinceId: provinceId,
            groupId: groupId,
            dateTime: dateTime,
        };
        exportTemporaryRoute(params).then((res) => {
            if (res) {
                blobDownLoad(res, `交接班-网络系统告警监测详情${moment().format('YYYYMMDDHHmmss')}.xlsx`);
            }
        });
    };

    // 重加载
    const tableRef = useRef();
    const reloadTable = () => {
        tableRef.current.reload();
    };
    // const reChangeData = (data, key, dataArrKey, containerArr) => {
    //     let idArray = [];
    //     let newAarray = [];
    //     data.forEach(function (ele, i) {
    //         let allData = JSON.parse(JSON.stringify(ele));
    //         if (idArray.indexOf(data[i][key]) === -1) {
    //             let obj = {};
    //             dataArrKey.forEach((item) => {
    //                 obj[item] = data[i][item];
    //                 Reflect.deleteProperty(allData, `${item}`);
    //             });
    //             obj[key] = data[i][key];
    //             obj[containerArr] = [allData];
    //             newAarray.push(obj);
    //             idArray.push(data[i][key]);
    //         } else {
    //             newAarray.forEach(function (dom, k) {
    //                 if (newAarray[k][key] === data[i][key]) {
    //                     let objT = {};
    //                     dataArrKey.forEach((item) => {
    //                         Reflect.deleteProperty(allData, `${item}`);
    //                     });
    //                     objT = allData;
    //                     newAarray[k][containerArr].push(objT);
    //                 }
    //             });
    //         }
    //     });
    //     return newAarray;
    // };
    //储存编辑的内容
    // const saveTableInfo = () => {
    //     const copyData = JSON.parse(JSON.stringify(tableListData));
    //     const initData = copyData.map((item) => {
    //         Reflect.deleteProperty(item, 'key');
    //         Reflect.deleteProperty(item, 'rowSpanO');
    //         Reflect.deleteProperty(item, 'rowSpanW');
    //         return item;
    //     });
    //     let sendStatu = true;
    //     for (let i = 0; i < initData.length; i++) {
    //         if (initData[i].executor) {
    //             if (!initData[i].workRecord) {
    //                 sendStatu = false;
    //                 break;
    //             }
    //         }
    //     }
    //     if (sendStatu) {
    //         const result = reChangeData(initData, 'mainProject', ['mainProject'], 'subProjects');
    //         const data = result.map((_) => {
    //             _.subProjects = reChangeData(_.subProjects, 'subProject', ['subProject', 'workShiftTime', 'notes', 'evaluationCriterion'], 'details');
    //             return _;
    //         });
    //         const sendData = {
    //             provinceId: provinceId,
    //             groupId: groupId,
    //             dateTime: dateTime,
    //             mainProjects: data,
    //         };

    //         saveInfoRoute(sendData).then((res) => {
    //             getTemporaryRouteList();
    //         });
    //     } else {
    //         message.warning('无法保存,存在执行人时执行记录不能为空!');
    //     }
    // };
    // 获取路由列表数据
    const getTemporaryRouteList = async (params) => {
        const data = {
            provinceId: provinceId,
            groupId: groupId,
            dateTime: dateTime,
        };
        const res = await getTemporaryRoute(data);
        if (res.data) {
            setTableListData(refreshTable(res.data));
        }
    };
    //返回
    const goBack = () => {
        history.goBack();
    };
    return (
        <div className="maintain-job-content">
            <div className="maintaiin-job-header">
                <div className="maintaiin-job-header-title" style={{ marginLeft: '20px' }}>
                    网管系统告警监测
                </div>
                <div style={{ marginRight: '20px' }}>
                    <Space>
                        {/* <Button type="primary" onClick={saveTableInfo}>
                            保存
                        </Button> */}
                        {/* <Button onClick={goBack}>返回</Button> */}
                    </Space>
                </div>
            </div>
            <VirtualTable
                options={{ reload: false }}
                // components={components}
                global={window}
                search={false}
                toolBarRender={() => [<Button onClick={handleExport}>导出</Button>]}
                columns={defaultColumns}
                pagination={false}
                dataSource={tableListData}
                actionRef={tableRef}
                formRef={formRef}
                scroll={{ x: 'max-content' }}
                rowClassName={() => 'editable-row'}
            />
            <div style={{ height: '110px', padding: '10px 0 0 10px', backgroundColor: 'white' }}>
                <Space>
                    导入内容
                    <>
                        <Input value={fileName} disabled></Input>
                        <Upload showUploadList={false} beforeUpload={changeFile} accept=".xls, .xlsx">
                            <Button disabled={isEdit}>选择文件</Button>
                        </Upload>
                        <Button disabled={isExp || isEdit} onClick={ImportFile}>
                            导入
                        </Button>
                        <Button type="link" block disabled={isEdit} onClick={handleExportTemplate}>
                            下载模板
                        </Button>
                    </>
                </Space>
            </div>
        </div>
    );
};

export default NetworkManagementSystemAlarmMonitoring;
