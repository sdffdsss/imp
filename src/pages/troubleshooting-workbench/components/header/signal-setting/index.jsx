import React, { useState, useEffect } from 'react';
import { Modal, Switch, Tooltip, Button, Checkbox, message, Icon } from 'oss-ui';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
// import Footer from './footer';
import moment from 'moment';
import soundOpen from './asset/soundOpen.png';
import soundClose from './asset/soundClose.png';
import signalOpen from './asset/signalOpen.png';
import signalClose from './asset/signalClose.png';
import appClose from './asset/appClose.png';
import appOpen from './asset/appOpen.png';
import popupClose from './asset/popupClose.png';
import popupOpen from './asset/popupOpen.png';
import { getLightSetting, saveLightSetting, getProfessionalListApi } from '../../../api';

import './index.less';

const SignalSetting = (props) => {
    const login = useLoginInfoModel();
    const { visible, setVisible, getSetting, timeType } = props;
    const [sound, setSound] = useState('0');
    const [signal, setSignal] = useState('0');
    const [appFlag, setAppFlag] = useState('0');
    const [chooseFlag, setChooseFlag] = useState('0');
    const [checkedList, setCheckedList] = useState([]);
    const [professionalList, setProfessionalList] = useState([]);
    const checkAll = professionalList.length === checkedList.length;
    const indeterminate = checkedList.length > 0 && checkedList.length < professionalList.length;

    const getLightSettings = async () => {
        const res = await getLightSetting(login.userId);
        if (res?.data) {
            setSound(res.data.voiceFlag);
            setSignal(res.data.lightFlag);
            setAppFlag(res.data.appFlag);
            setChooseFlag(res.data.switchFlag);
            setCheckedList(res.data.specialty?.split(',') || []);
        }
    };

    const onCheckAllChange = (e) => {
        setCheckedList(e.target?.checked ? professionalList.map((ite) => ite.value) : []);
    };

    const handleOk = async () => {
        const { userId } = login;
        const param = {
            userId,
            voiceFlag: sound,
            lightFlag: signal,
            specialty: checkedList?.join(','),
            switchFlag: chooseFlag,
            appFlag,
        };
        if (checkedList.length === 0 && chooseFlag === '1') {
            message.error('请至少勾选1个需要提醒的专业');
            return;
        }
        const res = await saveLightSetting(param);
        console.log(res);
        getSetting();
        setVisible(false);
    };
    const handleCancel = () => {
        setVisible(false);
    };
    const onChangeSound = (checked) => {
        setSound(checked ? '1' : '0');
    };
    const onChangeSignal = (checked) => {
        setSignal(checked ? '1' : '0');
    };
    const onChangeAppFlag = (checked) => {
        setAppFlag(checked ? '1' : '0');
    };
    const onCheckChange = (list) => {
        setCheckedList(list);
    };
    const getProfessionalList = async () => {
        const param = {
            userId: login.userId,
            time: moment().format('YYYY-MM-DD HH:mm:ss'),
            timeType,
        };
        const result = await getProfessionalListApi(param);
        if (result.data) {
            const specialList = result.data.faultSpecialtyCount
                ?.filter((e) => e.code && e.code !== '16')
                .map((ite) => {
                    return {
                        label: ite.desc,
                        value: ite.code,
                    };
                })
                // .sort((e) => (e.value === '11' || e.value === '10' ? -1 : 1));
                .sort((a, b) => Number(a.value) - Number(b.value));
            const showList = _.partition(specialList, (item) => item.value === '11' || item.value === '10').flat();
            console.log('showList', showList);
            setProfessionalList(showList);
        }
    };
    const changeChooseFlag = (val) => {
        setChooseFlag(val ? '1' : '0');
    };
    useEffect(() => {
        getLightSettings();
        getProfessionalList();
    }, []);
    return (
        <>
            <Modal
                visible={visible}
                width="600px"
                title="提醒设置"
                bodyStyle={{
                    background: 'rgb(12, 61, 110)',
                }}
                maskClosable={false}
                getContainer={false}
                style={{
                    paddingBottom: 0,
                    position: 'relative',
                    left: props.cardsDockedLeft ? -60 : 0,
                    top: props.cardsDockedLeft ? 257 : undefined,
                }}
                className="signal-setting-modal"
                onCancel={handleCancel}
                footer={
                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                        <Button type="primary" onClick={handleOk}>
                            保存
                        </Button>
                        <Button type="ghost" onClick={handleCancel}>
                            取消
                        </Button>
                    </div>
                }
            >
                <div className="soundAndLight">
                    <div className="notice-title">提醒方式：</div>
                    <div className="sound">
                        <img className="signal-setting-logo-left" src={sound === '1' ? soundOpen : soundClose} alt=""></img>
                        <Switch size="small" className="switch" onChange={onChangeSound} checked={sound === '1'} />
                        <div>
                            <span className="signal-setting-content-left">声音开关</span>
                            <span className="signal-setting-detail-left">
                                <Tooltip title="打开后, 当勾选的专业收到新上报故障时, 系统将会发出声音提醒">
                                    <Icon antdIcon type="InfoCircleOutlined" style={{ width: 16, height: 16, color: '#fff' }} alt="" />
                                </Tooltip>
                            </span>
                        </div>
                    </div>
                    <div className="light">
                        <img className="signal-setting-logo-right" src={signal === '1' ? signalOpen : signalClose} alt=""></img>
                        <Switch size="small" className="switch" onChange={onChangeSignal} checked={signal === '1'} />
                        <div>
                            <span className="signal-setting-content-right">光信号开关</span>
                            <span className="signal-setting-detail-right">
                                <Tooltip title="打开后, 当勾选的专业收到新上报故障时, 系统将会发出光信号提醒">
                                    <Icon antdIcon type="InfoCircleOutlined" style={{ width: 16, height: 16, color: '#fff' }} alt="" />
                                </Tooltip>
                            </span>
                        </div>
                    </div>
                    <div className="light">
                        <img className="signal-setting-logo-right" src={chooseFlag === '1' ? popupOpen : popupClose} alt=""></img>
                        <Switch size="small" className="switch" onChange={changeChooseFlag} checked={chooseFlag === '1'} />
                        <div>
                            <span className="signal-setting-content-right">弹窗提醒开关</span>
                            <span className="signal-setting-detail-right">
                                <Tooltip title="打开后，当勾选专业自动识别到故障需确认上报时，页面将强制弹框提醒">
                                    <Icon antdIcon type="InfoCircleOutlined" style={{ width: 16, height: 16, color: '#fff' }} alt="" />
                                </Tooltip>
                            </span>
                        </div>
                    </div>
                    <div className="light">
                        <img className="signal-setting-logo-right" src={appFlag === '1' ? appOpen : appClose} alt=""></img>
                        <Switch size="small" className="switch" onChange={onChangeAppFlag} checked={appFlag === '1'} />
                        <div>
                            <span className="signal-setting-content-right">APP提醒开关</span>
                            <span className="signal-setting-detail-right">
                                <Tooltip title="打开后，勾选专业的故障环节会进行联通网络APP消息推送">
                                    <Icon antdIcon type="InfoCircleOutlined" style={{ width: 16, height: 16, color: '#fff' }} alt="" />
                                </Tooltip>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="alertModal">
                    <div className="notice-title">提醒专业：</div>
                    <div className="alertChoose">
                        <div className="checkAll">
                            {/* <Tooltip title="勾选专业自动识别到故障需确认上报时，页面将强制弹框提醒">
                                <Icon antdIcon type="QuestionCircleOutlined" style={{ width: 16, height: 16, color: '#fff' }} alt="" />
                            </Tooltip>
                            <Switch size="small" className="switch" checked={chooseFlag} onChange={changeChooseFlag} /> */}
                            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                {checkAll ? '取消全选' : '全选'}
                            </Checkbox>
                        </div>
                        <Checkbox.Group
                            className="fault-report-form-selector"
                            multiple
                            options={professionalList}
                            onChange={onCheckChange}
                            value={checkedList}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SignalSetting;
