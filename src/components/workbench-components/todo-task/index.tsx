import { Form, Image, Select, Row, Col } from 'oss-ui';
import React, { FC, useEffect, useState, useRef, ReactNode } from 'react';
import './index.less';
import select from './images/select.png';
import TaskDetail from './task-detail';
import { clearConfirmDataType } from '../type';

interface alarmTodoDataType {
    areaId?: string;
    groupId?: string;
    level?: string;
    level1Count?: string | undefined;
    level2Count?: string | undefined;
    level3Count?: string | undefined;
    level4Count?: string | undefined;
    noClearNoConfirm?: string;
    noClearNoConfirmFailSend?: string;
    noClearNoConfirmNoSend?: string;
    noClearYesConfirm?: string;
    noClearYesConfirmManual?: string;
    noClearYesConfirmSuccessSend?: string;
    rightBottom?: string;
    viewCount?: string;
    viewId?: string;
    viewName?: string;
    yesClearNoConfirm?: string;
    yesClearNoConfirmAuto?: string;
    yesClearNoConfirmManual?: string;
    yesClearYesConfirm?: string;
    yesClearYesConfirmNoArchive?: string;
    yesClearYesConfirmYesArchive?: string;
}

interface Iprops {
    alarmTodoData?: alarmTodoDataType[];
    specialData?: any;
    alarmViewChange: () => void;
    isBorder: string;
    onViewChange: (e) => void;
    viewId: string | undefined;
    onAlarmStutasChange: (e) => void;
    nodeType?: string;
}

interface Ioption {
    label?: string;
    value?: string;
}

const TodoTask: FC<Iprops> = (props) => {
    const { alarmTodoData, onAlarmStutasChange, specialData } = props || {};
    const [levelCountData, setlevelCountData] = useState<any[]>([]);
    const [noClearNoConfirmData, setNoClearNoConfirmData] = useState<clearConfirmDataType[]>([]);
    const [noClearYesConfirmData, setNoClearYesConfirmData] = useState<clearConfirmDataType[]>([]);
    const [taskOptions, setTaskOptions] = useState<Ioption[] | undefined>([]);
    // const [selectValue, setSelectValue] = useState<string>('0');
    // const [isBorder, setIsBorder] = useState<string>(props.isBorder);

    const formRef = useRef<any>();

    const icon: ReactNode = <Image preview={false} src={select} />;

    const backgroundData: string[] = ['#ff0404', '#FFA304 ', '#FCFF04', '#0468FF'];

    const singleDetailTitles: string[][] = [
        ['未派单', '派单失败'],
        ['手动确认', '派单成功'],
    ];

    useEffect(() => {
        const initialTaskOptions: Ioption[] | undefined = alarmTodoData?.map((item) => ({ label: item.viewName, value: item.viewId || '0' }));
        setTaskOptions(initialTaskOptions);
        const selectValue = initialTaskOptions[0]?.value;
        renderData(selectValue);

        formRef.current?.setFieldsValue({ viewId: selectValue });
        // handleTagTitle();
        // document.addEventListener('click', () => {
        //     setIsBorder(false);
        // });
        // return () => {
        //     document.removeEventListener('click', () => {
        //         setIsBorder(false);
        //     });
        // };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alarmTodoData]);

    const renderData = (viewId: string | null) => {
        let initiallevelCountData: any[] = [];
        const initialNoClearNoConfirmData = alarmTodoData
            ?.filter((item) => (item.viewId || '0') === viewId)
            .map((item) => {
                initiallevelCountData.push(item?.level1Count, item?.level2Count, item?.level3Count, item?.level4Count);
                return {
                    allTask: item.noClearNoConfirm,
                    noSendTask: item.noClearNoConfirmNoSend,
                    failSendTask: item.noClearNoConfirmFailSend,
                };
            });
        const initialNoClearYesConfirmData = alarmTodoData
            ?.filter((item) => (item.viewId || '0') === viewId)
            .map((item) => ({
                allTask: item.noClearYesConfirm,
                noSendTask: item.noClearYesConfirmManual,
                failSendTask: item.noClearYesConfirmSuccessSend,
            }));
        setlevelCountData(initiallevelCountData);
        setNoClearNoConfirmData(initialNoClearNoConfirmData!);
        setNoClearYesConfirmData(initialNoClearYesConfirmData!);
    };

    const onSelectChange = (value: string) => {
        const viewId = value;
        renderData(viewId);
    };
    const dropdownRender = (menu) => {
        return (
            <>
                <div className="task-select-dropdown">{menu}</div>
            </>
        );
    };

    return (
        <div
            className="task-dealt-container-wb"
            onClick={(e) => {
                e.nativeEvent.stopImmediatePropagation();
            }}
            style={props.isBorder === '1' && props.nodeType !== '1' ? { border: '2px solid #26a6ff' } : undefined}
        >
            <div className="task-dealt-header">
                <div className="task-header-right">
                    {backgroundData.map((item, index) => (
                        <>
                            <div className="redio" style={{ background: item }}></div>
                            {/* <Tooltip title={levelCountData[index]}> */}
                            <div className="levelCount">{levelCountData[index] || 0}</div>
                            {/* </Tooltip> */}
                        </>
                    ))}
                </div>
            </div>
            <div className="task-dealt-select">
                <Form ref={formRef}>
                    <Form.Item name="viewId" initialValue="0">
                        <Select
                            style={{ width: '100%', height: '100%' }}
                            dropdownRender={dropdownRender}
                            showArrow
                            suffixIcon={icon}
                            // defaultValue=""
                            // value={selectValue}
                            options={taskOptions}
                            onChange={onSelectChange}
                        />
                    </Form.Item>
                </Form>
            </div>
            <div className="task-line">
                <div className="line-top">
                    <div />
                    <div />
                </div>
                <div className="line-bottom">
                    <div />
                </div>
            </div>
            <div className="task-dealt-show">
                <TaskDetail
                    taskDetailData={noClearNoConfirmData}
                    taskTitle="未清除未确认"
                    taskType={['noClearNoConfirmAlarm', 'noClearNoConfirmNoSendAlarm', 'noClearNoConfirmFailSendAlarm']}
                    singleDetailTitle={singleDetailTitles[0]}
                    failureStyle={{ background: 'rgba(255,0,0,0.1)', border: '1px solid #FF0000' }}
                    unitStyle={{ color: '#12B4FD' }}
                    onAlarmStutasChange={onAlarmStutasChange}
                />
                <TaskDetail
                    taskType={['noClearYesConfirmAlarm', 'noClearYesConfirmManualAlarm', 'noClearYesConfirmSuccessSendAlarm']}
                    onAlarmStutasChange={onAlarmStutasChange}
                    singleDetailTitle={singleDetailTitles[1]}
                    taskDetailData={noClearYesConfirmData}
                    taskTitle="未清除已确认"
                />
            </div>
        </div>
    );
};

export default TodoTask;
