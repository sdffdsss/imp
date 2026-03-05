import React, { useEffect, useState } from 'react';
import { Descriptions, Row, Col, Button, Icon, message, Modal } from 'oss-ui';
import './style.less';
import { Api } from '../api';
import request from '@Common/api';
import { sendLogFn } from '@Src/pages/components/auth/utils';
import useLoginInfoModel from '@Src/hox';
import { getInitialProvince } from '@Common/utils/getInitialProvince.js';
import CustomModalFooter from '@Components/custom-modal-footer';
import AlarmDetail from '@Components/new-alarm-details';
interface ViewProps {
    sheetNo: any;
    closeModal: Function;
}
interface SheetInfo {
    sheetNo: string;
    sheetLabel: string;
    eventTime: string;
    neLabel: string;
    uniqueId?: any;
    forwardTime?: any;
}
const sheetInfoDef: SheetInfo = { sheetNo: '', sheetLabel: '', eventTime: '', neLabel: '' };
const SheetField = (props: ViewProps) => {
    const [sheetInfo, setSheetInfo] = useState<SheetInfo>(sheetInfoDef);
    const [field, setField] = useState([{}]);
    const [visible, setVisible] = useState(false);

    const login = useLoginInfoModel.data;
    const { loginId, userInfo } = login;

    const frameInfo = JSON.parse(userInfo) || {};

    const modalContainer = frameInfo?.container || document.body;
    const province = getInitialProvince(login);
    login;
    const renderDescriptionsItem = () => {
        const sheetFileld = [
            { id: 'sheetNo', txt: '工单编号' },
            { id: 'sheetLabel', txt: '工单主题' },
            { id: 'eventTime', txt: '发生时间' },
            { id: 'neLabel', txt: '故障描述' },
        ];
        return sheetFileld.map((item) => {
            return (
                <Descriptions.Item key={item.id} label={item.txt}>
                    {sheetInfo[item.id]}
                </Descriptions.Item>
            );
        });
    };
    useEffect(() => {
        if (props.sheetNo) {
            Api.getSheetDetail(props.sheetNo).then((res) => {
                setSheetInfo(res.data || sheetInfoDef);
            });
        }
    }, [props.sheetNo]);

    const getSheetDetailsUrl = () => {
        const data = {
            logInId: loginId,
            provinceId: province,
            sheetNo: props.sheetNo,
            professionalType: '6',
            forwardTime: sheetInfo?.forwardTime,
        };
        request('work/sheet/v1/getEmosUrl', {
            data,
            type: 'post',
            showSuccessMessage: false,
            baseUrlType: 'failureSheetExportUrl',
        })
            .then((res) => {
                if (res) {
                    if (res.code === 200) {
                        window.open(res.data);
                    } else {
                        message.warn(res.message);
                    }
                }
            })
            .catch(() => {});
    };

    const onOrderClick = () => {
        sendLogFn({ authKey: 'troubleshootingWorkbench:orderDetail' });
        props.sheetNo && getSheetDetailsUrl();
    };
    const getAlarmDetailData = async () => {
        console.log(sheetInfo);
        const alarmIds = [`${sheetInfo.uniqueId}`];
        const res = await Api.getAlarmRecord(alarmIds);

        if (res && res.data.length && res.data[0][sheetInfo.uniqueId]) {
            let field = {};
            Object.keys(res.data[0][sheetInfo.uniqueId]).forEach((item) => {
                field = {
                    ...field,
                    [item]: res.data[0][sheetInfo.uniqueId][item],
                };
            });
            let data = {
                ...field,
                alarm_id: sheetInfo.uniqueId,
                uniqueId: sheetInfo.uniqueId,
            };

            setField([data]);
            setVisible(true);
        } else {
            setField([{}]);
            setVisible(true);
        }
    };
    const onCancel = () => {
        props.closeModal();
        setVisible(false);
    };

    return (
        <div className="sheet-field">
            <Row gutter={24} className="sheet-field-header">
                <Col span={8} className="sheet-field-header-title">
                    故障基本信息
                </Col>

                <Col span={16} style={{ textAlign: 'right' }}>
                    <Button type="text" onClick={onOrderClick}>
                        <Icon antdIcon type="FileTextOutlined" style={{ marginRight: 5 }} />
                        工单详情
                    </Button>
                    <Button type="text" onClick={getAlarmDetailData}>
                        <Icon antdIcon type="AlignLeftOutlined" style={{ marginRight: 5 }} />
                        预处理信息
                    </Button>
                </Col>
            </Row>
            <Descriptions bordered className="sheet-info" column={1}>
                {renderDescriptionsItem()}
            </Descriptions>

            <Modal
                centered
                destroyOnClose
                title={'预处理详细信息'}
                visible={visible}
                maskClosable={false}
                wrapClassName="alarm-window-context-modal"
                prefixCls="oss-ui-modal"
                okButtonProps={{ prefixCls: 'oss-ui-btn' }}
                cancelButtonProps={{ prefixCls: 'oss-ui-btn' }}
                width={800}
                footer={<CustomModalFooter okText="" onCancel={onCancel} cancelText={'关闭'} />}
                getContainer={modalContainer}
                onCancel={onCancel}
            >
                <AlarmDetail record={field} hideAlarm={true} />
            </Modal>
        </div>
    );
};
export default SheetField;
