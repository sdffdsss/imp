import React, { useEffect, useRef, useState } from 'react';
import WindowCard from './window-card';
import useLoginInfoModel from '@Src/hox';
// import { getView } from './api';
import _isEmpty from 'lodash/isEmpty';
import { Modal, message } from 'oss-ui';
import ManualDispatch from '@Components/manual-dispatch-unicom';
import AddToSheet from '@Components/add-to-sheet';
import AlarmClear from '@Components/alarm-manual-clearing';
import CustomModalFooter from '@Src/components/custom-modal-footer';

// import _cloneDeep from 'lodash/cloneDeep';
import { alarmDispatch, alarmRightClick } from './api';
import './style.less';
const typeMap = {
    dispatch: '手工派单',
    addDispatch: '手工追单',
    clear: '独立清除',
};
const FaultDispathched = ({ viewData, onResultChange }) => {
    const login = useLoginInfoModel();
    const contentRef: any = useRef();
    const alarmType: any = useRef();
    const menuComponentFormRef: any = useRef();
    const dataRef: any = useRef();
    const [visible, setVisible] = useState(false);
    const [alarmData, setAlarmData] = useState<any>([]);
    useEffect(() => {
        // getViewList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getCallBackChange = (e) => {
        if (e.changeEventWinInfoList) {
            const data = e.changeEventWinInfoList[0]?.alarmCountResult?.customCountIndex || {};
            onResultChange(data);
        }
    };
    const onRecord = (data, type, flag) => {
        alarmType.current = type;
        setAlarmData(data);
        if (flag) {
            setVisible(true);
        }
    };
    const addDispatchChange = (data) => {
        dataRef.current = data;
    };
    const actionChange = async () => {
        setVisible(false);
        // const fields = await dataRef?.current;
        const { userId, userName, loginId } = login;
        const data = {
            operatorId: userId, //操作人ID
            operatorName: userName, //操作人名称
            loginId: loginId,
            requestInfo: {
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            },
            clientRequestInfo: encodeURI(
                JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                })
            ),
            alarmPropertiesList: alarmData.map((item) => {
                let field = {};
                Object.keys(item).forEach((items) => {
                    field = {
                        ...field,
                        [items]: item[items]?.value,
                    };
                });
                return field;
            }),
            operateType: '',
            operateProps: {},
        };
        switch (alarmType.current) {
            case 'dispatch':
                data.operateProps = {
                    clientName: 'reactor-client', //客户端名称
                    sheetNo: '', //工单号
                    isDup: false, //是否判重，true/false,是，sheetNo不能为空
                    repeatTimes: 2, //调用emos接口重试次数
                    repeatInterval: 100, //重试间隔时间
                };

                const res = await alarmDispatch(data);
                if (res.data) {
                    window.open(res.data);
                }
                break;
            case 'addDispatch':
                data.operateProps = dataRef.current;
                data.operateType = 'alarm_manual_send';
                if (!dataRef.current?.sheetNo) {
                    message.error('工单号不能为空');
                    return;
                }
                const resAdd = await alarmDispatch(data);
                if (resAdd) {
                    message.success('手工追单成功');
                }
                break;
            case 'clear':
                data.operateType = 'alarm_cancel';
                data.operateProps = dataRef.current ? dataRef.current : { reson: '' };
                const resClear = await alarmRightClick(data);
                if (resClear.data) {
                    message.success('独立清除操作成功');
                }
                break;
            default:
                break;
        }
    };
    return (
        <div className="fault-dispathched-page">
            <div className="fault-dispathched-page-window" ref={contentRef}>
                {!_isEmpty(viewData) && (
                    <WindowCard
                        // ref={windowCard}
                        selectedRows={viewData}
                        i={0}
                        contentWidth={contentRef?.current?.clientWidth}
                        windowType="duty"
                        defaultSize="default"
                        getCallBackData={(e) => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            getCallBackChange(e);
                        }}
                        tabItem={1}
                        windowBar={'1'}
                        onRecord={onRecord}
                    />
                )}
            </div>
            <Modal
                footer={<CustomModalFooter onCancel={() => setVisible(false)} onOk={actionChange} />}
                destroyOnClose
                visible={visible}
                title={typeMap[alarmType.current]}
                onOk={actionChange}
                onCancel={() => setVisible(false)}
                width={800}
            >
                {alarmType.current === 'dispatch' && <ManualDispatch record={alarmData} />}
                {alarmType.current === 'addDispatch' && (
                    <AddToSheet menuComponentFormRef={menuComponentFormRef} addDispatchChange={addDispatchChange} record={alarmData} />
                )}
                {alarmType.current === 'clear' && (
                    <AlarmClear menuComponentFormRef={menuComponentFormRef} addDispatchChange={addDispatchChange} record={alarmData} />
                )}
            </Modal>
        </div>
    );
};
export default FaultDispathched;
