import React, { useState, useEffect, useRef, useMemo } from 'react';
import constants from '@Src/common/constants';
import {
    Steps,
    Card,
    Form,
    Input,
    Select,
    Button,
    Row,
    Col,
    InputNumber,
    Tabs,
    Radio,
    Checkbox,
    Modal,
    Switch,
    message,
    Space,
    Layout,
    Tag,
} from 'oss-ui';
import { useHistory } from 'react-router-dom';
import Field from '@ant-design/pro-field';
import request from '@Common/api';
import useLoginInfoModel from '@Src/hox';
import SMSTemplate from '@Components/sms-template';
import Edit from '@Components/sms-template/edit';
import { _ } from 'oss-web-toolkits';
import formatReg from '@Common/formatReg';
import NotifyTimeRange from '../notify-time-range';
import SendSheetRule from './send-sheet-rule';
import { Api } from '../../api';
import VoiceControlledReplay from '../voice-replay';
import { formatNotificationTimeRange } from './utils';
import './index.less';

const { Step } = Steps;
const tempTips = {
    formLabel: '临时手机号码',
    validateEmptyTip: '请输入手机号码',
    validateRepeatTip: '手机号码重复',
    validateFormatTip: '手机号格式不对',
};

const EditContent = (props) => {
    const formRef = useRef<any>(null);
    const history = useHistory();
    const [current, setCurrent] = useState<number>(0);
    const [levelCount, setLevelCount] = useState<number>(0);
    const [selectValue, setSelectValue] = useState<any>(undefined);
    const [visible, setVisible] = useState<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [optionKey, setOptionKey] = useState<string>('');
    const [smsTemplateList, setSmsTemplateList] = useState<any[]>([]);
    const [provinceList, setProvinceList] = useState<any[]>([]);
    const [professionList, setProfessionList] = useState<any[]>([]);
    const [faultYypeList, setFaultYypeList] = useState<any>([]);
    const [sheetStatus, setSheetStatus] = useState<any>([]);
    const [teamGroupRoles, setTeamGroupRoles] = useState<any>([]);
    const [tabValue, setTabValue] = useState<string>('0');
    const [dispatchRuleOption, setDispatchRuleOption] = useState<any[]>([]);

    const [happenGroupList, setHappenGroupList] = useState<any[]>([]);
    const [levelGroupList, setlevelGroupList] = useState<any[]>([]);
    const [periodicGroupList, setPeriodicGroupList] = useState<any[]>([]);

    const groupRef = useRef({ happenGroupList: [], levelGroupList: {} });

    const [allRadioValues, setAllRadioValues] = useState<any>({});

    const [basicInformation, setBasicInformation] = useState<any>({});
    const [notificationCondition, setNotificationCondition] = useState<any>({});

    const [happenData, setHappenData] = useState<any>({});
    const [levelData, setLevelData] = useState<any>({});
    const [periodicNoticData, setPeriodicNoticData] = useState<any>({});
    const [recoveryNoticeData, setRecoveryNoticeData] = useState<any>({});

    const [faulNoticeId, setFaulNoticeId] = useState<any>('');

    // const [happenNotice, setHappenNotice] = useState<any>('');
    // const [periodicNotic, setPeriodicNotic] = useState<any>(false);

    const [levelIndex, setLevelIndex] = useState<any>(undefined);
    const [smsTitleType, setSmsTitleType] = useState<string>('');
    const [contentId, setContentId] = useState<any>('');
    const [finalHappenData, setFinalHappenData]: any = useState<any>({ temps: [] });
    const [finalLevelData, setFinalLevelData]: any = useState<any>({ temps0: [] });
    const [finalCircleData, setFinalCircleData]: any = useState<any>({ temps: [] });
    // const [finalRecoverData, setFinalRecoverData]: any = useState<any>({ temps: [] });

    const [defaultCurrent, setDefaultCurrent] = useState<number>(0);

    const [flag, setFlag] = useState<boolean>(false);

    const [provinceId, setProvinceId] = useState<any>('');

    const mode = props.mode || 'edit';

    const modelType = props?.type;

    const levelEnum = useMemo(() => {
        let arr: any[] = [];
        for (let i = 0; i < levelCount; i++) {
            let data = {
                labelFlag: String(i + 1),
                labelValues: {
                    // roles: allRadioValues[i + 1]
                    //     ?.filter((item) => item.label === String(i + 1))
                    //     .map((item) => item.value)
                    //     .join(','),
                    ...levelData[i + 1],
                },
            };
            arr.push(data);
        }
        return arr;
    }, [levelCount, levelData, allRadioValues]);

    useEffect(() => {
        if (defaultCurrent === 1 && modelType === 'new') {
            setHappenData({
                ...happenData,
                switch: '0',
            });
            setPeriodicNoticData({
                ...periodicNoticData,
                switch: '0',
            });
            setRecoveryNoticeData({
                ...recoveryNoticeData,
                switch: '0',
            });
        }
        if (defaultCurrent === 2 && modelType === 'new') formRef.current?.setFieldsValue({ recoveryStrategy: '1' });
    }, [defaultCurrent]);

    const notificationStrategy = useMemo(() => {
        return {
            earlyWarningLevel: levelCount,
            strategies: [
                {
                    labelFlag: '21',
                    labelValues: {
                        // roles: allRadioValues[0]
                        //     ?.filter((item) => item.label === '发')
                        //     ?.map((item) => item.value)
                        //     .join(','),
                        ...happenData,
                    },
                },
                ...levelEnum,
                {
                    labelFlag: '22',
                    labelValues: {
                        ...periodicNoticData,
                    },
                },
                {
                    labelFlag: '23',
                    labelValues: {
                        ...recoveryNoticeData,
                    },
                },
            ],
        };
    }, [levelCount, levelEnum, happenData, periodicNoticData, recoveryNoticeData, allRadioValues]);

    const login = useLoginInfoModel.data;
    const { userName, container } = login;

    useEffect(() => {
        getFaultDictionaryData('fault_type');
        getFaultDictionaryData('sheet_status');
        getFaultDictionaryData('team_group_roles');
        getProvinceData();
        getprofessionData();
        if (modelType !== 'new') {
            getDetail();
        }
    }, []);

    const getDetail = async () => {
        const noticeid = mode === 'read' ? props?.modeParams.id : props?.noticeId;
        const { data: res } = await Api.getNotice(noticeid);
        const { basicInformation, notificationCondition, notificationStrategy, recoveryInformation } = res || {};
        setBasicInformation(basicInformation);
        const { notificationName, describe, noticeId, provinceId, professionalTypes, ifEnable } = basicInformation || {};
        setFaulNoticeId(noticeId);
        formRef?.current?.setFieldsValue({
            notificationName,
            provinceId,
            professionalTypes: professionalTypes?.map((item) => Number(item)),
            describe,
            ifEnable,
        });
        setProvinceId(provinceId);

        const {
            faulsLevels,
            faulsProfessionalTypes = [],
            faulsScens,
            notificationWays,
            blocRuleIds,
            provinceRuleIds,
            workSheetStatus,
        } = notificationCondition || {};
        // 根据专业获取派单规则信息
        // getDispatchRuleData(faulsProfessionalTypes[0]);
        const newNotificationCondition = {
            notificationWays: notificationWays?.map((item) => Number(item)),
            faulsLevels: faulsLevels?.map((item) => Number(item)),
            faulsProfessionalTypes: Number(faulsProfessionalTypes?.map((item) => item).join('')),
            faulsScens: faulsScens?.map((item) => Number(item)),
            ruleIds: {
                blocRuleIds: blocRuleIds?.map((item) => Number(item)) || [],
                provinceRuleIds: provinceRuleIds?.map((item) => Number(item)) || [],
            },
            workSheetStatus: workSheetStatus?.map((item) => Number(item)),
        };
        formRef?.current?.setFieldsValue(newNotificationCondition);
        setNotificationCondition(newNotificationCondition);

        // 通知内容
        const { earlyWarningLevel, strategies, ...notificationTimeRange } = notificationStrategy || {};

        formRef.current?.setFieldsValue({
            notificationTimeRange: formatNotificationTimeRange(notificationTimeRange),
        });
        const happenData = strategies?.find((item) => item.labelFlag === 21)?.labelValues;

        // 获取班组信息
        getGroupsData(happenData?.provinceId, 'happen');

        // 发生通知
        // setHappenNotice(happenData?.provinceId ? 1 : '');
        formRef.current?.setFieldsValue({
            // happenNotice: happenData?.provinceId ? 1 : '',
            happenNotification: happenData?.switch === '1' ? true : false,
            happenProvince: happenData?.provinceId ? Number(happenData?.provinceId) : '',
            happenGroup: happenData?.groupId ? Number(happenData?.groupId) : '',
            happenCheckRole: happenData?.roles ? happenData?.roles?.split(',') : [],
            happenStrategy: happenData?.contentTemplateId,
            happenSmsTitle: happenData?.content,
            happenNotificationSwitch: happenData.busySwith === '1',
            happenNotificationReplayCount: Number(happenData.redialCount),
            happenNotificationReplayInterval: Number(happenData.redialDistance),
        });
        setHappenData({ ...happenData });
        if (happenData.temporaryNumber) {
            setFinalHappenData({ temps: happenData.temporaryNumber?.split(',') || [] });
        }

        let newAllRadioValues = _.cloneDeep(allRadioValues);
        // newAllRadioValues['0'] = happenData?.roles?.split(',').map((item) => ({ label: '发', value: item }));
        newAllRadioValues['0'] = happenData?.rolesSelect;

        // 预警信息
        let newLevelData = _.cloneDeep(levelData);
        for (let i = 0; i < earlyWarningLevel; i++) {
            newLevelData[i + 1] = strategies?.find((item) => item.labelFlag === i + 1)?.labelValues;

            formRef.current?.setFieldsValue({
                [`level${i + 1}FaultTime`]: newLevelData[i + 1]?.elapsedTime,
                [`level${i + 1}Province`]: newLevelData[i + 1]?.provinceId ? Number(newLevelData[i + 1]?.provinceId) : '',
                [`level${i + 1}Group`]: newLevelData[i + 1]?.groupId ? Number(newLevelData[i + 1]?.groupId) : '',
                [`level${i + 1}CheckRole`]: newLevelData[i + 1]?.rolesSelect?.map((item) => item.value),
                [`level${i + 1}Strategy`]: newLevelData[i + 1]?.contentTemplateId,
                [`level${i + 1}SmsTitle`]: newLevelData[i + 1]?.content,
                [`level${i + 1}VoiceReplaySwitch`]: newLevelData[i + 1]?.busySwith === '1',
                [`level${i + 1}VoiceReplayReplayCount`]: Number(newLevelData[i + 1]?.redialCount),
                [`level${i + 1}VoiceReplayReplayInterval`]: Number(newLevelData[i + 1]?.redialDistance),
            });
            if (newLevelData[i + 1]?.temporaryNumber) {
                setFinalLevelData((prev) => {
                    return {
                        ...prev,
                        [`temps${i}`]: newLevelData[i + 1]?.temporaryNumber?.split(',') || [],
                    };
                });
            }

            getGroupsData(newLevelData[i + 1]?.provinceId, String(i + 1));

            newAllRadioValues[String(i + 1)] = newLevelData[i + 1]?.rolesSelect;
        }

        setLevelData({
            ...newLevelData,
        });

        setAllRadioValues({
            ...newAllRadioValues,
        });

        // 周期性通知
        const periodicNoticData = strategies?.find((item) => item.labelFlag === 22)?.labelValues;
        formRef.current?.setFieldsValue({
            periodicNotification: periodicNoticData?.switch === '1' ? true : false,
            cycleTime: periodicNoticData?.elapsedTime,
            // periodicNotic: periodicNoticData?.provinceId ? 1 : '',
            periodicProvince: periodicNoticData?.provinceId ? Number(periodicNoticData?.provinceId) : '',
            periodicGroup: periodicNoticData?.groupId ? Number(periodicNoticData?.groupId) : '',
            periodicCheckRole: periodicNoticData?.roles ? periodicNoticData?.roles?.split(',') : [],
            periodicStrategy: periodicNoticData?.contentTemplateId,
            periodicSmsTitle: periodicNoticData?.content,
            periodicNotificationSwitch: periodicNoticData?.busySwith === '1',
            periodicNotificationReplayCount: periodicNoticData?.redialCount,
            periodicNotificationReplayInterval: periodicNoticData?.redialDistance,
        });
        getGroupsData(periodicNoticData?.provinceId, 'periodic');
        setPeriodicNoticData(periodicNoticData);
        // setPeriodicNotic(periodicNoticData?.provinceId ? 1 : '');
        if (periodicNoticData?.temporaryNumber) {
            setFinalCircleData({ temps: periodicNoticData?.temporaryNumber?.split(',') || [] });
        }

        // 恢复通知
        const recoveryNoticeData = strategies?.find((item) => item.labelFlag === 23)?.labelValues;
        formRef.current?.setFieldsValue({
            revertSwitch: recoveryNoticeData?.switch === '1' ? true : false,
            recoveryStrategyContent: recoveryNoticeData?.contentTemplateId,
            recoverySmsTitle: recoveryNoticeData?.content,
            revertSwitchSwitch: recoveryNoticeData?.busySwith === '1',
            revertSwitchReplayCount: recoveryNoticeData?.redialCount,
            revertSwitchReplayInterval: recoveryNoticeData?.redialDistance,
        });
        setRecoveryNoticeData(recoveryNoticeData);
        if (recoveryNoticeData?.temporaryNumber) {
            setFinalCircleData({ temps: recoveryNoticeData?.temporaryNumber?.split(',') || [] });
        }

        // 预警等级
        formRef?.current?.setFieldsValue({
            earlyWarningLevel,
        });
        setLevelCount(earlyWarningLevel);

        // 恢复机制
        const { recoveryStrategy, rate } = recoveryInformation || {};
        formRef.current?.setFieldsValue({ recoveryStrategy: String(recoveryStrategy), rate: rate });
        // formRef.current?.setFieldsValue({
        //     recoveryStrategy: e.target.value,
        //     rate: '',
        // });
    };

    // 获取省份信息
    const getProvinceData = async () => {
        const { userId, systemInfo } = login;
        const res = await Api.getProvinceData(userId);

        let provinceList = res || [];
        setProvinceList(provinceList.map((item) => ({ label: item.regionName, value: Number(item.regionId) })) || []);

        if (modelType === 'new') {
            const provinceId = provinceList.filter((item) =>
                systemInfo?.currentZone?.zoneId ? systemInfo?.currentZone?.zoneId === item.regionId : true,
            )[0]?.regionId;

            setProvinceId(provinceId);
            formRef.current?.setFieldsValue({ provinceId: Number(provinceId) });
        }
    };

    // 获取专业信息
    const getprofessionData = async () => {
        const { userId } = login;
        const data = {
            pageSize: 100,
            dictName: 'professional_type',
            en: false,
            modelId: 2,
            creator: userId,
        };
        const { data: res } = await Api.getprofession(data);
        let professionList = res.map((item) => ({ label: item.value, value: Number(item.key) })) || [];
        setProfessionList(professionList);
    };

    // 获取派单规则
    const getDispatchRuleData = async (value) => {
        const { userId } = login;

        const { data: res } = await Api.getDispatchRule({
            current: 1,
            pageSize: 9999,
            modelId: 2,
            moduleId: 10,
            filterProvince: String(provinceId),
            filterProfessional: value,
            creator: userId,
        });
        const data = res?.map((item) => ({ label: item.filterName, value: item.filterId }));
        setDispatchRuleOption(data);
    };

    // 获取故障字典值
    const getFaultDictionaryData = async (dictName) => {
        const res = (await Api.getFaultDictionary(dictName)) || [];
        const data = res.data.map((item) => ({ label: item.dName, value: Number(item.dCode) }));
        switch (dictName) {
            case 'fault_type':
                return setFaultYypeList(data);
            case 'sheet_status':
                return setSheetStatus(data);
            case 'team_group_roles':
                return setTeamGroupRoles(res.data.map((item) => ({ label: item.dName, value: item.dName })));
        }
    };

    const setLevelGroupData = (value, data) => {
        const newLevelGroupList = _.cloneDeep(levelGroupList);
        newLevelGroupList[value] = data;
        setlevelGroupList([...newLevelGroupList]);
    };

    const getGroupsData = async (value, type) => {
        const { userId } = login;

        const res = await Api.getTeamInfo({
            pageNumNew: 1,
            pageSizeNew: 9000,
            userId,
            provinceId: value,
        });
        const data = res.rows.map((item) => ({ label: item.name, value: item.id })) || [];
        switch (type) {
            case 'happen':
                groupRef.current.happenGroupList = data;
                setHappenGroupList(data);
                break;
            case 'periodic':
                setPeriodicGroupList(data);
                break;
            case '1':
                groupRef.current.levelGroupList['1'] = data;
                setLevelGroupData('1', data);
                break;
            case '2':
                groupRef.current.levelGroupList['2'] = data;
                setLevelGroupData('2', data);
                break;
            case '3':
                groupRef.current.levelGroupList['3'] = data;
                setLevelGroupData('3', data);
                break;
            case '4':
                groupRef.current.levelGroupList['4'] = data;
                setLevelGroupData('4', data);
                break;
            case '5':
                groupRef.current.levelGroupList['5'] = data;
                setLevelGroupData('5', data);
                break;
            default:
                break;
        }
    };

    const getSmsTemplateList = (content, name) => {
        const contentName = formRef?.current?.getFieldValue(contentId);

        request('alarmmodel/filter/v1/filter/smsTemplate', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            data: {
                userName: userName,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        }).then((res) => {
            if (res && res.data) {
                setOptionKey(res.data.optionKey);
                if (res.data.smsTemplateList && res.data.smsTemplateList.length) {
                    const smsList = res.data.smsTemplateList.map((item) => ({
                        key: item.templateName,
                        label: item.templateName,
                        value: item.templateContent,
                    }));
                    if (contentName === name && formRef.current && content) {
                        formRef.current?.setFieldsValue({ [smsTitleType]: content });
                        formRef.current?.setFieldsValue({ [contentId]: undefined });

                        switch (smsTitleType) {
                            case 'happenSmsTitle':
                                setHappenData({
                                    ...happenData,
                                    content,
                                    contentTemplateId: undefined,
                                });
                                break;
                            case 'periodicSmsTitle':
                                setPeriodicNoticData({
                                    ...periodicNoticData,
                                    content,
                                    contentTemplateId: undefined,
                                });
                                break;
                            case 'recoverySmsTitle':
                                setRecoveryNoticeData({
                                    ...recoveryNoticeData,
                                    content,
                                    contentTemplateId: undefined,
                                });
                                break;
                            default:
                                let newLevelData = _.cloneDeep(levelData);
                                newLevelData[levelIndex] = levelData[levelIndex];
                                newLevelData[levelIndex]['content'] = content;
                                newLevelData[levelIndex]['contentTemplateId'] = undefined;
                                setLevelData({
                                    ...newLevelData,
                                });
                                break;
                        }
                    }

                    setSelectValue(undefined);
                    // setSelectCancelValue(undefined);
                    // form.setFieldsValue({ smsTitle: '', cancelTitle: '' });
                    setSmsTemplateList(smsList);
                }
            } else if (res && !res.data) {
                // 后端没数据时无法返回optionKey，需要从上层获取
                setOptionKey(userName);
                setSmsTemplateList([]);
            }
        });
    };

    const showSMSTemplateClick = (type, contentId, index) => {
        setSmsTitleType(type);
        setContentId(contentId);
        if (index) {
            setLevelIndex(index);
        }
        setVisible(true);
    };

    const showSMSTemplateEditClick = (type, contentId, index) => {
        setSmsTitleType(type);
        setContentId(contentId);
        if (index) {
            setLevelIndex(index);
        }
        setEditVisible(true);
    };

    const setSmsContentValue = (value, type, index) => {
        formRef.current?.setFieldsValue({ [type]: value });
        switch (type) {
            case 'happenSmsTitle':
                setHappenData({
                    ...happenData,
                    content: value,
                });
                break;
            case 'periodicSmsTitle':
                setPeriodicNoticData({
                    ...periodicNoticData,
                    content: value,
                });
                break;
            case 'recoverySmsTitle':
                setRecoveryNoticeData({
                    ...recoveryNoticeData,
                    content: value,
                });
                break;
            default:
                let newLevelData = _.cloneDeep(levelData);
                newLevelData[index] = levelData[index];
                if (newLevelData && newLevelData[index]) {
                    newLevelData[index]['content'] = value;
                    setLevelData({
                        ...newLevelData,
                    });
                }

                break;
        }
    };

    const onEditVisibleChange = (isVisible: boolean) => {
        setEditVisible(isVisible);
    };

    const smsTitleChange = (e, type, index) => {
        setSmsContentValue(e.target.value, type, index);
    };

    const onCancel = () => {
        setVisible(false);
    };

    const getValueEnum = (option) => {
        const options = option || [];
        let obj = {};
        options.forEach((item) => {
            obj[item.value] = { text: item.label };
        });
        return obj;
    };

    const numEnum = ['一', '二', '三', '四', '五'];

    const faultLevelOptions = [
        {
            label: 'L1',
            value: 1,
        },
        {
            label: 'L2',
            value: 2,
        },
        {
            label: 'L3',
            value: 3,
        },
        {
            label: 'L4',
            value: 4,
        },
        {
            label: 'L5',
            value: 5,
        },
        {
            label: 'L6',
            value: 6,
        },
        {
            label: 'L7',
            value: 7,
        },
        {
            label: 'L8',
            value: 8,
        },
    ];

    const recoverymechanismSelectOptions = [
        {
            label: '1/2',
            value: '1/2',
        },
        {
            label: '1/3',
            value: '1/3',
        },
        {
            label: '2/3',
            value: '2/3',
        },
        {
            label: '1',
            value: '1',
        },
    ];

    const recoverymechanismEnum = useMemo(() => {
        return [
            {
                label: '主告警恢复',
                value: '1',
            },
            {
                label: '子告警恢复',
                value: '2',
                render: () => {
                    return (
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const recoveryStrategy = getFieldValue('recoveryStrategy');

                                return (
                                    <Form.Item
                                        noStyle
                                        name="rate"
                                        rules={recoveryStrategy === '2' ? [{ required: true, message: '不可为空' }] : undefined}
                                    >
                                        {recoveryStrategy === '2' ? (
                                            <Select disabled={mode === 'read'} placeholder="" options={recoverymechanismSelectOptions} />
                                        ) : null}
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    );
                },
            },
            {
                label: '主告警恢复 且 子告警恢复',
                value: '3',
                render: () => {
                    return (
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const recoveryStrategy = getFieldValue('recoveryStrategy');
                                return (
                                    <Form.Item
                                        noStyle
                                        name="rate"
                                        rules={recoveryStrategy === '3' ? [{ required: true, message: '不可为空' }] : undefined}
                                    >
                                        {recoveryStrategy === '3' ? (
                                            <Select disabled={mode === 'read'} placeholder="" options={recoverymechanismSelectOptions} />
                                        ) : null}
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    );
                },
            },
            {
                label: '主告警恢复 或 子告警恢复',
                value: '4',
                render: () => {
                    return (
                        <Form.Item noStyle shouldUpdate>
                            {({ getFieldValue }) => {
                                const recoveryStrategy = getFieldValue('recoveryStrategy');
                                return (
                                    <Form.Item
                                        noStyle
                                        name="rate"
                                        rules={recoveryStrategy === '4' ? [{ required: true, message: '不可为空' }] : undefined}
                                    >
                                        {recoveryStrategy === '4' ? (
                                            <Select disabled={mode === 'read'} placeholder="" options={recoverymechanismSelectOptions} />
                                        ) : null}
                                    </Form.Item>
                                );
                            }}
                        </Form.Item>
                    );
                },
            },
        ];
    }, [formRef.current?.getFieldValue('recoveryStrategy'), recoverymechanismSelectOptions]);

    useEffect(() => {
        getSmsTemplateList(undefined, undefined);
    }, []);

    const onStepChange = (value) => {
        setCurrent(value);
    };

    const prevClick = () => {
        setCurrent(current - 1);
    };

    const nextClick = async () => {
        const values = formRef.current?.getFieldValue();

        if (current === 0) {
            await formRef.current?.validateFields();
            const { userId, userName } = login || {};
            const { notificationName, provinceId, professionalTypes, describe, ifEnable } = values || {};
            const params = {
                notificationName,
                provinceId,
                professionalTypes: professionalTypes.map((item) => String(item)),
                describe,
                ifEnable,
                operatorId: userId,
                operatorName: userName,
            };
            setBasicInformation(params);
            if (modelType === 'edit') {
                setBasicInformation({ ...params, noticeId: faulNoticeId });
            }
        } else if (current === 1) {
            if (flag) return message.info('高级别预警的故障历时要大于低级预警的故障历时');

            const { happenNotification, periodicNotification } = values;

            if (happenNotification) {
                formRef.current?.setFields([
                    {
                        name: 'happenProvince',
                        errors: [], // 清除之前的错误
                    },
                    {
                        name: 'happenGroup',
                        errors: [], // 清除之前的错误
                    },
                ]);
                // 判断班组和临时号码是否至少填了一个
                if (!happenData?.roles && finalHappenData?.temps && finalHappenData?.temps?.length === 0) {
                    return message.info('发生通知对象班组角色和临时号码至少填一个');
                }
            }
            if (levelCount) {
                for (let i = 1; i <= levelCount; i++) {
                    const notificationObj = notificationStrategy.strategies.find((item) => {
                        return item.labelFlag === String(i);
                    });
                    if (notificationObj) {
                        formRef.current?.setFields([
                            {
                                name: `level${i}Province`,
                                errors: [], // 清除之前的错误
                            },
                            {
                                name: `level${i}Group`,
                                errors: [], // 清除之前的错误
                            },
                        ]);
                        if (
                            (notificationObj.labelValues?.roles === undefined || !notificationObj.labelValues?.roles) &&
                            finalLevelData?.[`temps${i - 1}`] &&
                            finalLevelData?.[`temps${i - 1}`]?.length === 0
                        ) {
                            return message.info(`${numEnum[i - 1]}级预警通知对象班组角色和临时号码至少填一个`);
                        }
                    }
                }
            }
            if (periodicNotification) {
                formRef.current?.setFields([
                    {
                        name: 'periodicProvince',
                        errors: [], // 清除之前的错误
                    },
                    {
                        name: 'periodicGroup',
                        errors: [], // 清除之前的错误
                    },
                ]);
                // 判断班组和临时号码是否至少填了一个
                if (!periodicNoticData?.roles && finalCircleData?.temps && finalCircleData?.temps?.length === 0) {
                    return message.info('周期性通知对象班组角色和临时号码至少填一个');
                }
            }
            try {
                await formRef.current?.validateFields();
            } catch (e) {
                throw message.info('当前或其他tab页信息不全，请填写完整');
            }
            if (String(happenData.switch) === '1') {
                if (String(happenData.busySwith) === '1') {
                    if (!happenData.redialCount) {
                        return message.info('发生通知重拨次数为空');
                    }

                    if (!happenData.redialDistance) {
                        return message.info('发生通知重拨间隔为空');
                    }
                }
            }

            for (let index = 0; index < Object.values(levelData).length; index++) {
                const temp = Object.values(levelData)[index];

                // @ts-ignore
                if (String(temp.busySwith) === '1') {
                    if (!temp.redialCount) {
                        return message.info('预警重拨次数为空');
                    }

                    if (!temp.redialDistance) {
                        return message.info('预警重拨间隔为空');
                    }
                }
            }

            if (String(periodicNoticData.switch) === '1') {
                if (String(periodicNoticData.busySwith) === '1') {
                    if (!periodicNoticData.redialCount) {
                        return message.info('周期性通知重拨次数为空');
                    }

                    if (!periodicNoticData.redialDistance) {
                        return message.info('周期性通知重拨间隔为空');
                    }
                }
            }

            if (String(recoveryNoticeData.switch) === '1') {
                if (String(recoveryNoticeData.busySwith) === '1') {
                    if (!recoveryNoticeData.redialCount) {
                        return message.info('恢复通知重拨次数为空');
                    }

                    if (!recoveryNoticeData.redialDistance) {
                        return message.info('恢复通知重拨间隔为空');
                    }
                }
            }

            const {
                notificationWays,
                faulsLevels,
                faulsProfessionalTypes,
                faulsScens = [],
                sendSheetRuleIds,
                workSheetStatus,
                ruleIds,
            } = values || {};

            setNotificationCondition({
                notificationWays,
                faulsLevels,
                faulsProfessionalTypes: faulsProfessionalTypes ? [faulsProfessionalTypes] : [],
                faulsScens: faulsScens,
                ...ruleIds,
                workSheetStatus: workSheetStatus || [],
            });
        }

        setCurrent(current + 1);
        setDefaultCurrent(defaultCurrent + 1);
    };

    const cancelClick = () => {
        history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/fault-scheduling-notification`);
    };

    const handleTempAdd = (type, ind) => {
        const temp = formRef.current.getFieldValue('temporaryNumber');

        if (!temp) {
            message.warn(tempTips.validateEmptyTip);
            return;
        }
        const data = type === 'circle' ? finalCircleData : type === 'happen' ? finalHappenData : finalLevelData;
        if (type) {
            if (data?.temps.includes(temp)) {
                message.warn(tempTips.validateRepeatTip);
                return;
            }
        } else {
            if ((data?.[`temps${ind}`] || []).includes(temp)) {
                message.warn(tempTips.validateRepeatTip);
                return;
            }
        }

        if (formatReg['userMobile'].test(temp)) {
            if (type === 'circle') {
                setFinalCircleData((prev) => {
                    return {
                        temps: prev.temps.concat([temp]),
                    };
                });
            } else if (type === 'recover') {
                // setFinalRecoverData((prev) => {
                //     return {
                //         temps: prev.temps.concat([temp]),
                //     };
                // });
            } else if (type === 'happen') {
                setFinalHappenData((prev) => {
                    return {
                        temps: prev.temps.concat([temp]),
                    };
                });
                for (let i = 0; i < levelCount; i++) {
                    if ((finalLevelData[`temps${i}`] || []).includes(temp)) return;
                    setFinalLevelData((prev) => {
                        return {
                            ...prev,
                            [`temps${i}`]: (prev[`temps${i}`] || []).concat([temp]),
                        };
                    });
                }
            } else {
                setFinalLevelData((prev) => {
                    return {
                        ...prev,
                        [`temps${ind}`]: (prev[`temps${ind}`] || []).concat([temp]),
                    };
                });
                console.log(tabValue, '====123');
                for (let i = +tabValue; i < levelCount; i++) {
                    if ((finalLevelData[`temps${i}`] || []).includes(temp)) return;
                    setFinalLevelData((prev) => {
                        return {
                            ...prev,
                            [`temps${i}`]: (prev[`temps${i}`] || []).concat([temp]),
                        };
                    });
                }
            }
        } else {
            message.warn(tempTips.validateFormatTip);
        }
    };

    const finishClick = async () => {
        await formRef.current?.validateFields();
        const values = formRef.current?.getFieldValue();
        const { recoveryStrategy, rate, notificationTimeRange } = values || {};
        const recoveryInformation = { recoveryStrategy, rate };

        if (modelType === 'new') {
            const result = await Api.checkNoticeName({
                province: Number(provinceList[0].value),
                noticeName: basicInformation?.notificationName,
            });

            const { code } = result || {};

            if (code === 500) return message.error('同一省份下不允许存在相同规则名称的通知！');
        }
        const strategy = {
            ...notificationStrategy,
        };
        strategy.strategies.forEach((item, ind) => {
            if (!item.labelValues?.roles || item.labelValues?.roles.length === 0) {
                if (item.labelValues.provinceId) {
                    delete item.labelValues.provinceId;
                }
                if (item.labelValues.groupId) {
                    delete item.labelValues.groupId;
                }
            }

            if (item.labelFlag === '21') {
                item.labelValues = {
                    ...item.labelValues,
                    temporaryNumber: finalHappenData.temps.toString(),
                };
            }
            if (item.labelFlag === '22') {
                item.labelValues = {
                    ...item.labelValues,
                    temporaryNumber: finalCircleData.temps?.toString(),
                };
            }
            // if (item.labelFlag === '23') {
            //     item.labelValues = {
            //         ...item.labelValues,
            //         temporaryNumber: finalRecoverData.temps?.toString(),
            //     };
            // }
            if (+item.labelFlag < 20) {
                item.labelValues = {
                    ...item.labelValues,
                    temporaryNumber: finalLevelData?.[`temps${+item.labelFlag - 1}`]?.toString(),
                };
            }
        });

        const res = await Api.addNotice({
            basicInformation,
            notificationCondition,
            recoveryInformation,
            notificationStrategy: {
                ...strategy,
                ...formatNotificationTimeRange(notificationTimeRange, 'save'),
            },
        });
        if (res.code === 200) {
            cancelClick();
            message.success(modelType === 'edit' ? '修改成功' : '添加成功');
        }
    };

    const levelChange = (value) => {
        setLevelCount(value);
    };

    const onTebChange = (value) => {
        setTabValue(value);
        formRef.current?.setFieldsValue({
            temporaryNumber: '',
        });
    };

    const onRadioChange = (value: any[]) => {
        const values = _.cloneDeep(allRadioValues);
        let label = '发';
        switch (tabValue) {
            case '0':
                label = '发';
                break;
            case '6':
                label = '';
                break;
            default:
                label = tabValue;
                break;
        }
        const result = value.map((item) => {
            return {
                label,
                value: item,
            };
        });
        for (let i = Number(tabValue); i < 6; i++) {
            const targetValue = result.map((item) => {
                const target = allRadioValues[i]?.find((i) => i.value === item.value);
                return target || item;
            });
            values[i] = targetValue;
        }
        setAllRadioValues(values);

        formRef.current?.setFieldsValue({
            happenCheckRole: values[0]?.map((item) => item.value),
        });
        setHappenData({
            ...happenData,
            roles: values[0]
                // ?.filter((item) => item.label === '发')
                ?.map((item) => item.value)
                .join(','),
            rolesSelect: values[0],
        });

        let newLevelData = _.cloneDeep(levelData);

        for (let i = 0; i < levelCount; i++) {
            formRef.current?.setFieldsValue({
                [`level${i + 1}CheckRole`]: values[Number(i + 1)]?.map((item) => item.value),
            });

            newLevelData[i + 1] = { ...levelData[i + 1] };
            newLevelData[i + 1].roles = values[i + 1]?.map((item) => item.value).join(',') || [];
            newLevelData[i + 1].rolesSelect = values[i + 1];

            setLevelData({
                ...levelData[i + 1],
                roles: values[i + 1]
                    // ?.filter((item) => item.label === String(i + 1))
                    .map((item) => item.value)
                    .join(','),
            });
        }

        // formRef.current?.setFieldsValue({
        //     [`level${tabValue}CheckRole`]: values[Number(tabValue)]?.map((item) => item.value),
        // });

        // newLevelData[tabValue] = { ...levelData[tabValue] };

        // (newLevelData[tabValue].roles = values[tabValue]
        //     ?.filter((item) => item.label === String(tabValue))
        //     .map((item) => item.value)
        //     .join(',')),
        //     (newLevelData[tabValue].rolesSelect = values[tabValue]);
        setLevelData({
            ...newLevelData,
        });
    };

    const typeGroup = (value) => {
        if (value === 'happen') {
            for (let i = 0; i < levelCount; i++) {
                groupRef.current.levelGroupList[String(i + 1)] = groupRef.current.happenGroupList;
            }
        } else {
            for (let i = value; i < levelCount; i++) {
                groupRef.current.levelGroupList[String(i + 1)] = groupRef.current.levelGroupList[String(value)];
                setLevelGroupData(String(i + 1), levelGroupList[i + 1]);
            }
        }
    };

    /**
     * @description 下面四个函数是分别控制语音遇忙重拨的函数，是由四个state控制的表单项
     */

    const onVoiceSwitchHappenData = (value: number, key: string) => {
        setHappenData({
            ...happenData,
            [key]: value,
        });
    };
    const onVoiceSwitchPeriodicNoticData = (value: number, key: string) => {
        setPeriodicNoticData({
            ...periodicNoticData,
            [key]: value,
        });
    };
    const onVoiceSwitchRecoveryNoticeData = (value: number, key: string) => {
        setRecoveryNoticeData({
            ...recoveryNoticeData,
            [key]: value,
        });
    };
    const onVoiceSwitchLevelData = (value: number, key: string, index?: number) => {
        const levelDataItem = levelData[index as number];
        const newLevelDataItem = { ...levelDataItem, [key]: value };
        setLevelData({
            ...levelData,
            [index as number]: newLevelDataItem,
        });
    };
    return (
        <>
            <Form style={{ height: '100%' }} ref={formRef}>
                <div className="edit-content-page">
                    <Layout>
                        <Layout.Header>
                            <Steps
                                style={{ width: mode === 'read' ? '74%' : '68%' }}
                                current={current}
                                labelPlacement="vertical"
                                onChange={onStepChange}
                            >
                                <Step disabled={mode !== 'read'} title="基本信息" />
                                <Step disabled={mode !== 'read'} title="通知内容" />
                                <Step disabled={mode !== 'read'} title="恢复机制" />
                            </Steps>
                        </Layout.Header>

                        <Layout.Content>
                            {current === 0 ? (
                                <Card className="basic-card" style={mode === 'read' ? { width: '72%' } : undefined}>
                                    <Form.Item
                                        label="名称"
                                        name="notificationName"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 8 }}
                                        rules={[
                                            { required: true, message: '不可为空' },
                                            {
                                                validator: async (rule, value) => {
                                                    value = value || '';
                                                    if (value.trim().length > 20) {
                                                        throw new Error('名称不可超过20个字符');
                                                    }
                                                },
                                            },
                                        ]}
                                    >
                                        <Field
                                            mode={mode}
                                            renderFormItem={() => {
                                                return <Input placeholder="" />;
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="归属省份"
                                        name="provinceId"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 8 }}
                                        rules={[{ required: true, message: '不可为空' }]}
                                    >
                                        <Field
                                            mode={mode}
                                            valueEnum={getValueEnum(provinceList)}
                                            renderFormItem={() => {
                                                return <Select placeholder="" optionFilterProp="label" options={provinceList} />;
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="归属专业"
                                        name="professionalTypes"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 8 }}
                                        rules={[{ required: true, message: '不可为空' }]}
                                    >
                                        <Field
                                            mode={mode}
                                            valueEnum={getValueEnum(professionList)}
                                            renderFormItem={() => {
                                                return (
                                                    <Select
                                                        placeholder=""
                                                        mode="multiple"
                                                        options={professionList}
                                                        optionFilterProp="label"
                                                        showSearch
                                                        allowClear
                                                    />
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item label="描述" name="describe" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                                        <Field
                                            mode={mode}
                                            renderFormItem={() => {
                                                return (
                                                    <Input.TextArea placeholder="" maxLength={100} autoSize={{ minRows: 5, maxRows: 6 }} allowClear />
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="是否启用"
                                        name="ifEnable"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 3 }}
                                        rules={[{ required: true, message: '不可为空' }]}
                                        initialValue={0}
                                    >
                                        <Field
                                            mode={mode}
                                            valueEnum={{
                                                0: {
                                                    text: '否',
                                                },
                                                1: {
                                                    text: '是',
                                                },
                                            }}
                                            renderFormItem={() => {
                                                return (
                                                    <Select
                                                        placeholder=""
                                                        options={[
                                                            { label: '是', value: 1 },
                                                            { label: '否', value: 0 },
                                                        ]}
                                                    />
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                </Card>
                            ) : null}

                            {current === 1 ? (
                                <>
                                    <Card className="conditions-card" style={mode === 'read' ? { width: '72%' } : undefined}>
                                        <div className="common-title">
                                            <div className="common-title-box"></div>
                                            通知条件
                                        </div>
                                        <Form.Item
                                            label="通知方式"
                                            name="notificationWays"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 10 }}
                                            rules={[{ required: true, message: '不可为空' }]}
                                        >
                                            <Field
                                                mode={mode}
                                                valueEnum={{
                                                    1: {
                                                        text: 'IVR外呼',
                                                    },
                                                    2: {
                                                        text: 'chatops入群',
                                                    },
                                                    3: {
                                                        text: '短信通知',
                                                    },
                                                }}
                                                renderFormItem={() => {
                                                    return (
                                                        <Checkbox.Group disabled={mode === 'read'} className="checkbox-group">
                                                            <Checkbox value={1}>IVR外呼</Checkbox>
                                                            <Checkbox value={2}>chatops入群</Checkbox>
                                                            <Checkbox value={3}>短信通知</Checkbox>
                                                        </Checkbox.Group>
                                                    );
                                                }}
                                            />
                                        </Form.Item>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="故障专业"
                                                    name="faulsProfessionalTypes"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 14 }}
                                                    rules={[{ required: true, message: '不可为空' }]}
                                                >
                                                    <Field
                                                        mode={mode}
                                                        valueEnum={getValueEnum(professionList)}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Select
                                                                    optionFilterProp="label"
                                                                    placeholder=""
                                                                    options={professionList}
                                                                    showSearch
                                                                    allowClear
                                                                    onChange={(value) => {
                                                                        // getDispatchRuleData(value);
                                                                        formRef?.current?.setFieldsValue({
                                                                            faulsProfessionalTypes: value,
                                                                        });
                                                                    }}
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="故障场景"
                                                    name="faulsScens"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 14 }}
                                                    rules={[{ required: true, message: '不可为空' }]}
                                                >
                                                    <Field
                                                        mode={mode}
                                                        valueEnum={getValueEnum(faultYypeList)}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Select
                                                                    optionFilterProp="label"
                                                                    mode="multiple"
                                                                    maxTagCount={1}
                                                                    placeholder=""
                                                                    options={faultYypeList}
                                                                    allowClear
                                                                    showSearch
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="工单优先级"
                                                    name="faulsLevels"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 14 }}
                                                    rules={[{ required: true, message: '不可为空' }]}
                                                >
                                                    <Field
                                                        mode={mode}
                                                        valueEnum={getValueEnum(faultLevelOptions)}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Select placeholder="" mode="multiple" showSearch allowClear>
                                                                    {faultLevelOptions.map((item) => (
                                                                        <Select.Option value={item.value} key={item.value}>
                                                                            {item.label}
                                                                        </Select.Option>
                                                                    ))}
                                                                </Select>
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="工单状态"
                                                    name="workSheetStatus"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 14 }}
                                                    rules={[{ required: true, message: '不可为空' }]}
                                                    initialValue={[2, 3]}
                                                >
                                                    <Field
                                                        mode={mode}
                                                        valueEnum={getValueEnum(sheetStatus)}
                                                        renderFormItem={() => {
                                                            return (
                                                                <Select
                                                                    optionFilterProp="label"
                                                                    placeholder=""
                                                                    mode="multiple"
                                                                    maxTagCount={2}
                                                                    showSearch
                                                                    allowClear
                                                                    options={sheetStatus}
                                                                />
                                                            );
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item
                                            shouldUpdate={(prevValues, curValues) =>
                                                prevValues.faulsProfessionalTypes !== curValues.faulsProfessionalTypes
                                            }
                                        >
                                            {({ getFieldValue }) => {
                                                return (
                                                    <Form.Item name="ruleIds" noStyle>
                                                        <SendSheetRule
                                                            mode={mode}
                                                            provinceId={basicInformation.provinceId}
                                                            filterProfessional={getFieldValue('faulsProfessionalTypes')}
                                                        />
                                                    </Form.Item>
                                                );
                                            }}
                                        </Form.Item>
                                    </Card>
                                    <Card className="strategy-card" style={mode === 'read' ? { width: '72%' } : undefined}>
                                        <div className="common-title">
                                            <div className="common-title-box"></div>
                                            通知内容
                                        </div>
                                        <Form.Item label="通知时间段" name="notificationTimeRange" labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
                                            <NotifyTimeRange mode={mode} />
                                        </Form.Item>
                                        <Form.Item
                                            style={{ marginBottom: 7 }}
                                            label="预警级别"
                                            name="earlyWarningLevel"
                                            labelCol={{ span: 3 }}
                                            wrapperCol={{ span: 4 }}
                                            rules={[
                                                { required: true },
                                                {
                                                    validator: async (_, value) => {
                                                        let reg = /^(0|\+?[1-9][0-9]*)$/;
                                                        if (!reg.test(value)) {
                                                            throw new Error('请输入0-5的正整数');
                                                        }
                                                    },
                                                },
                                            ]}
                                            initialValue={0}
                                        >
                                            {/* <Field
                                        mode={mode}
                                        renderFormItem={() => { */}
                                            {mode === 'read' ? (
                                                levelCount
                                            ) : (
                                                <InputNumber value={levelCount} min={0} max={5} precision={0} onChange={levelChange} />
                                            )}
                                            {/* }}
                                    /> */}
                                        </Form.Item>
                                        <Tabs type="card" activeKey={tabValue} onChange={onTebChange}>
                                            <Tabs.TabPane tab="发生通知" key="0" forceRender>
                                                <Form.Item
                                                    style={{ margin: 2 }}
                                                    name="happenNotification"
                                                    label="发生通知"
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 20 }}
                                                    valuePropName="checked"
                                                >
                                                    <Switch
                                                        checkedChildren="开"
                                                        unCheckedChildren="关"
                                                        disabled={mode === 'read'}
                                                        onChange={(value) => {
                                                            setHappenData({
                                                                ...happenData,
                                                                switch: value ? '1' : '0',
                                                            });
                                                            formRef.current?.setFieldsValue({
                                                                happenNotification: value,
                                                            });
                                                        }}
                                                    />
                                                </Form.Item>
                                                <Form.Item required label="通知对象" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                                    <Form.Item noStyle shouldUpdate>
                                                        <Row gutter={24}>
                                                            <Col span={6}>
                                                                <Form.Item
                                                                    style={{ margin: 0 }}
                                                                    name="happenProvince"
                                                                    rules={
                                                                        formRef.current?.getFieldValue('happenCheckRole') &&
                                                                        formRef.current?.getFieldValue('happenCheckRole')?.length > 0
                                                                            ? [{ required: true, message: '不可为空' }]
                                                                            : undefined
                                                                    }
                                                                >
                                                                    <Field
                                                                        mode={mode}
                                                                        valueEnum={getValueEnum(provinceList)}
                                                                        renderFormItem={() => {
                                                                            return (
                                                                                <Select
                                                                                    // value={happenData?.provinceId}
                                                                                    placeholder=""
                                                                                    // disabled={isChecked ? false : true}
                                                                                    disabled={
                                                                                        mode === 'read' ||
                                                                                        !formRef.current?.getFieldValue('happenNotification')
                                                                                    }
                                                                                    allowClear={true}
                                                                                    options={provinceList}
                                                                                    onChange={(value) => {
                                                                                        formRef.current?.setFieldsValue({
                                                                                            happenProvince: value,
                                                                                        });
                                                                                        setHappenData({
                                                                                            ...happenData,
                                                                                            provinceId: String(value),
                                                                                        });
                                                                                        formRef.current?.setFieldsValue({
                                                                                            happenGroup: '',
                                                                                        });
                                                                                        getGroupsData(value, 'happen');
                                                                                        typeGroup('happen');
                                                                                        let newLevelData = _.cloneDeep(levelData);
                                                                                        for (let i = 0; i < levelCount; i++) {
                                                                                            formRef.current?.setFieldsValue({
                                                                                                [`level${i + 1}Province`]: value,
                                                                                            });
                                                                                            formRef.current?.setFieldsValue({
                                                                                                [`level${i + 1}Group`]: '',
                                                                                            });
                                                                                            newLevelData[i + 1] = { ...levelData[i + 1] };
                                                                                            newLevelData[i + 1]['provinceId'] = String(value);
                                                                                        }
                                                                                        setLevelData({
                                                                                            ...newLevelData,
                                                                                        });
                                                                                    }}
                                                                                />
                                                                            );
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={8}>
                                                                <Form.Item
                                                                    style={{ margin: 0 }}
                                                                    name="happenGroup"
                                                                    rules={
                                                                        formRef.current?.getFieldValue('happenCheckRole') &&
                                                                        formRef.current?.getFieldValue('happenCheckRole')?.length > 0
                                                                            ? [{ required: true, message: '不可为空' }]
                                                                            : undefined
                                                                    }
                                                                >
                                                                    <Field
                                                                        mode={mode}
                                                                        valueEnum={getValueEnum(happenGroupList)}
                                                                        renderFormItem={() => {
                                                                            return (
                                                                                <Select
                                                                                    // value={happenData?.groupId}
                                                                                    showSearch
                                                                                    optionFilterProp="label"
                                                                                    placeholder=""
                                                                                    allowClear={true}
                                                                                    // disabled={isChecked ? false : true}
                                                                                    disabled={
                                                                                        mode === 'read' ||
                                                                                        !formRef.current?.getFieldValue('happenNotification')
                                                                                    }
                                                                                    options={happenGroupList}
                                                                                    onChange={(value) => {
                                                                                        formRef.current?.setFieldsValue({
                                                                                            happenGroup: value,
                                                                                        });

                                                                                        setHappenData({
                                                                                            ...happenData,
                                                                                            groupId: String(value),
                                                                                        });

                                                                                        let newLevelData = _.cloneDeep(levelData);
                                                                                        for (let i = 0; i < levelCount; i++) {
                                                                                            formRef.current?.setFieldsValue({
                                                                                                [`level${i + 1}Group`]: value,
                                                                                            });
                                                                                            newLevelData[i + 1] = { ...levelData[i + 1] };
                                                                                            newLevelData[i + 1]['groupId'] = String(value);
                                                                                        }
                                                                                        setLevelData({
                                                                                            ...newLevelData,
                                                                                        });

                                                                                        typeGroup('happen');
                                                                                    }}
                                                                                ></Select>
                                                                            );
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>

                                                        <Form.Item
                                                            style={{ margin: 0 }}
                                                            name="happenCheckRole"
                                                            // rules={isChecked ? [{ required: true, message: '不可为空' }] : undefined}
                                                        >
                                                            <Checkbox.Group
                                                                value={allRadioValues['0']?.map((item) => item.value)}
                                                                onChange={onRadioChange}
                                                                style={{ background: 'rgb(247,247,247)', padding: '5px 0' }}
                                                            >
                                                                {teamGroupRoles.map((item) => (
                                                                    <Checkbox
                                                                        disabled={
                                                                            mode === 'read' || !formRef.current?.getFieldValue('happenNotification')
                                                                        }
                                                                        className="checked-role"
                                                                        key={item.value}
                                                                        value={item.value}
                                                                    >
                                                                        {item.label}
                                                                        {allRadioValues['0']?.find((i) => i.value === item.value)?.label ? (
                                                                            <div className="checked-tip">
                                                                                <span>
                                                                                    {allRadioValues['0']?.find((i) => i.value === item.value)?.label}
                                                                                </span>
                                                                            </div>
                                                                        ) : null}
                                                                    </Checkbox>
                                                                ))}
                                                            </Checkbox.Group>
                                                        </Form.Item>
                                                    </Form.Item>
                                                </Form.Item>
                                                <Form.Item label="临时手机号码" style={{ marginLeft: 104 }} labelCol={{ span: 4 }}>
                                                    <Row align="middle">
                                                        <Col>
                                                            <Form.Item
                                                                rules={[
                                                                    {
                                                                        validator: async (rule, val, callback) => {
                                                                            const reg = new RegExp('^1[3578][0-9]{9}(,1[3578][0-9]{9})*$');
                                                                            if (reg.test(val) || !val) {
                                                                                callback();
                                                                            } else {
                                                                                throw new Error('请输入正确格式');
                                                                            }
                                                                        },
                                                                    },
                                                                ]}
                                                                noStyle
                                                                name="temporaryNumber"
                                                            >
                                                                <Input
                                                                    style={{ marginLeft: 5 }}
                                                                    disabled={
                                                                        mode === 'read' || !formRef.current?.getFieldValue('happenNotification')
                                                                    }
                                                                    allowClear
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                type="primary"
                                                                disabled={mode === 'read' || !formRef.current?.getFieldValue('happenNotification')}
                                                                style={{ margin: '0 12px' }}
                                                                onClick={() => {
                                                                    handleTempAdd('happen', '');
                                                                }}
                                                            >
                                                                添加
                                                            </Button>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                type="primary"
                                                                disabled={mode === 'read' || !formRef.current?.getFieldValue('happenNotification')}
                                                                onClick={() => {
                                                                    formRef.current.setFieldsValue({ temporaryNumber: '' });
                                                                    setFinalHappenData({ temps: [] });
                                                                }}
                                                            >
                                                                清空
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                    <div className="tag-groups" style={{ marginTop: 12 }}>
                                                        {(finalHappenData?.temps || []).map((item, index) => {
                                                            return (
                                                                <Tag
                                                                    key={index}
                                                                    onClose={(e) => {
                                                                        e.preventDefault();
                                                                        setFinalHappenData((prev) => {
                                                                            return {
                                                                                temps: prev.temps.filter((temp) => temp !== item),
                                                                            };
                                                                        });
                                                                    }}
                                                                    closable={mode !== 'read'}
                                                                >
                                                                    {item}
                                                                </Tag>
                                                            );
                                                        })}
                                                    </div>
                                                </Form.Item>
                                                <Form.Item
                                                    style={{ marginBottom: 5 }}
                                                    required
                                                    label="通知内容"
                                                    name="happenStrategy"
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 20 }}
                                                >
                                                    <Row gutter={8}>
                                                        <Col>
                                                            <Field
                                                                mode={mode}
                                                                render={() => {
                                                                    return <span style={{ lineHeight: '30px' }}>{selectValue}</span>;
                                                                }}
                                                                renderFormItem={() => {
                                                                    return (
                                                                        <Select
                                                                            disabled={!formRef.current?.getFieldValue('happenNotification')}
                                                                            value={happenData?.contentTemplateId}
                                                                            style={{ width: 120 }}
                                                                            onChange={(value, option) => {
                                                                                const target = smsTemplateList.find((item) => item.key === value);

                                                                                setSelectValue(target?.label);
                                                                                formRef.current?.setFieldsValue({
                                                                                    happenSmsTitle: target?.value,
                                                                                    happenStrategy: target?.label,
                                                                                });
                                                                                // if (formRef.current?.getFieldValue('isUseSmsTitle')) {
                                                                                //     formRef.current?.setFieldsValue({
                                                                                //         cancelTitle: `告警已于<cancel_time>清除 ${target?.value})}`,
                                                                                //     });
                                                                                // }

                                                                                setHappenData({
                                                                                    ...happenData,
                                                                                    contentTemplateId: target?.label,
                                                                                    content: target?.value,
                                                                                });
                                                                            }}
                                                                            placeholder="请选择模板"
                                                                        >
                                                                            {smsTemplateList.map((item) => {
                                                                                return (
                                                                                    <Select.Option label={item.value} key={item.key} value={item.key}>
                                                                                        {item.label}
                                                                                    </Select.Option>
                                                                                );
                                                                            })}
                                                                        </Select>
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                onClick={() => showSMSTemplateClick('happenSmsTitle', 'happenStrategy', undefined)}
                                                                disabled={mode === 'read' || !formRef.current?.getFieldValue('happenNotification')}
                                                            >
                                                                模板管理
                                                            </Button>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                onClick={() =>
                                                                    showSMSTemplateEditClick('happenSmsTitle', 'happenStrategy', undefined)
                                                                }
                                                                disabled={mode === 'read' || !formRef.current?.getFieldValue('happenNotification')}
                                                            >
                                                                编辑
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Form.Item>

                                                <Form.Item noStyle shouldUpdate>
                                                    {({ getFieldValue }) => {
                                                        return (
                                                            <Form.Item
                                                                name="happenSmsTitle"
                                                                wrapperCol={{ offset: 4 }}
                                                                rules={
                                                                    !formRef.current?.getFieldValue('happenNotification')
                                                                        ? undefined
                                                                        : [{ required: true, message: '不可为空' }]
                                                                }
                                                            >
                                                                <Field
                                                                    mode={mode}
                                                                    render={() => {
                                                                        return getFieldValue('happenSmsTitle');
                                                                    }}
                                                                    renderFormItem={() => {
                                                                        return (
                                                                            <Input.TextArea
                                                                                style={{ marginBottom: 20 }}
                                                                                disabled={!formRef.current?.getFieldValue('happenNotification')}
                                                                                maxLength={1024}
                                                                                onChange={(e) => smsTitleChange(e, 'happenSmsTitle', undefined)}
                                                                                autoSize={{ minRows: 3, maxRows: 5 }}
                                                                                allowClear
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        );
                                                    }}
                                                </Form.Item>

                                                <Form.Item label="语音遇忙重拨" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                                    <VoiceControlledReplay
                                                        isControlled
                                                        mode={mode}
                                                        disableControlled="happenNotification"
                                                        onSwitchChange={onVoiceSwitchHappenData}
                                                    />
                                                </Form.Item>
                                            </Tabs.TabPane>
                                            {levelEnum.map((item, index) => {
                                                return (
                                                    <Tabs.TabPane tab={`${numEnum[index]}级预警`} key={index + 1} forceRender>
                                                        <Form.Item
                                                            style={{ position: 'relative', marginBottom: 8 }}
                                                            required
                                                            label="故障历时"
                                                            labelCol={{ span: 4 }}
                                                            wrapperCol={{ span: 4 }}
                                                        >
                                                            <Form.Item
                                                                style={{ margin: 0 }}
                                                                name={`level${index + 1}FaultTime`}
                                                                wrapperCol={{ span: 24 }}
                                                                rules={[
                                                                    {
                                                                        validator: async (_, value) => {
                                                                            if (
                                                                                !value ||
                                                                                isNaN(value) ||
                                                                                value.toString().split('.')[1]?.length > 1
                                                                            ) {
                                                                                throw new Error('请输入最多一位小数的数');
                                                                            }
                                                                        },
                                                                    },
                                                                ]}
                                                            >
                                                                {/* <Field
                                                            mode={mode}
                                                            renderFormItem={() => {
                                                                return ( */}
                                                                {mode === 'read' ? (
                                                                    formRef?.current?.getFieldValue(`level${index + 1}FaultTime`)
                                                                ) : (
                                                                    <InputNumber
                                                                        // value={levelData[index + 1]?.faultTime}
                                                                        placeholder=""
                                                                        style={{ width: '100%' }}
                                                                        controls={false}
                                                                        min={0}
                                                                        max={10000}
                                                                        onChange={(value) => {
                                                                            formRef.current?.setFieldsValue({
                                                                                [`level${index + 1}FaultTime`]: value,
                                                                            });
                                                                            let newLevelData = _.cloneDeep(levelData);

                                                                            newLevelData[index + 1] = { ...levelData[index + 1] };
                                                                            newLevelData[index + 1]['elapsedTime'] = String(value);
                                                                            setLevelData({
                                                                                ...newLevelData,
                                                                            });

                                                                            if (index > 0) {
                                                                                let flag = false;
                                                                                for (let i = 1; i < index + 1; i++) {
                                                                                    if (value <= newLevelData[i]?.elapsedTime) {
                                                                                        flag = true;
                                                                                    }
                                                                                }
                                                                                setFlag(flag);
                                                                                if (flag) {
                                                                                    message.warning('高级别预警的故障历时要大于低级预警的故障历时');
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                )}

                                                                {/* );
                                                            }}
                                                        /> */}
                                                            </Form.Item>
                                                            <span className="fault-hour">(小时)</span>
                                                        </Form.Item>
                                                        <Form.Item required label="通知对象" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                                            <Form.Item noStyle shouldUpdate>
                                                                <Row gutter={24}>
                                                                    <Col span={6}>
                                                                        <Form.Item
                                                                            style={{ margin: 0 }}
                                                                            name={`level${index + 1}Province`}
                                                                            rules={
                                                                                !formRef.current?.getFieldValue(`level${index + 1}CheckRole`) ||
                                                                                formRef.current?.getFieldValue(`level${index + 1}CheckRole`)
                                                                                    ?.length === 0
                                                                                    ? undefined
                                                                                    : [{ required: true, message: '不可为空' }]
                                                                            }
                                                                        >
                                                                            <Field
                                                                                mode={mode}
                                                                                valueEnum={getValueEnum(provinceList)}
                                                                                renderFormItem={() => {
                                                                                    return (
                                                                                        <Select
                                                                                            // value={levelData[index + 1]?.provinceId}
                                                                                            placeholder=""
                                                                                            options={provinceList}
                                                                                            allowClear={true}
                                                                                            onChange={(value) => {
                                                                                                // formRef.current?.setFieldsValue({
                                                                                                //     [`level${index + 1}Province`]: value,
                                                                                                // });
                                                                                                let newLevelData = _.cloneDeep(levelData);

                                                                                                // newLevelData[index + 1] = {
                                                                                                //     ...levelData[index + 1],
                                                                                                // };
                                                                                                // newLevelData[index + 1]['provinceId'] =
                                                                                                //     String(value);
                                                                                                // setLevelData({
                                                                                                //     ...newLevelData,
                                                                                                // });

                                                                                                for (let i = index; i < levelCount; i++) {
                                                                                                    formRef.current?.setFieldsValue({
                                                                                                        [`level${i + 1}Province`]: value,
                                                                                                    });
                                                                                                    formRef.current?.setFieldsValue({
                                                                                                        [`level${i + 1}Group`]: '',
                                                                                                    });
                                                                                                    newLevelData[i + 1] = {
                                                                                                        ...levelData[i + 1],
                                                                                                    };
                                                                                                    newLevelData[i + 1]['provinceId'] = String(value);
                                                                                                }
                                                                                                setLevelData({
                                                                                                    ...newLevelData,
                                                                                                });

                                                                                                getGroupsData(value, String(index + 1));
                                                                                                typeGroup(index + 1);
                                                                                            }}
                                                                                        />
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col span={8}>
                                                                        <Form.Item
                                                                            style={{ margin: 0 }}
                                                                            name={`level${index + 1}Group`}
                                                                            rules={
                                                                                !formRef.current?.getFieldValue(`level${index + 1}CheckRole`) ||
                                                                                formRef.current?.getFieldValue(`level${index + 1}CheckRole`)
                                                                                    ?.length === 0
                                                                                    ? undefined
                                                                                    : [{ required: true, message: '不可为空' }]
                                                                            }
                                                                        >
                                                                            <Field
                                                                                mode={mode}
                                                                                valueEnum={getValueEnum(
                                                                                    groupRef.current.levelGroupList[String(index + 1)],
                                                                                )}
                                                                                renderFormItem={() => {
                                                                                    return (
                                                                                        <Select
                                                                                            // value={levelData[index + 1]?.groupId}
                                                                                            showSearch
                                                                                            optionFilterProp="label"
                                                                                            placeholder=""
                                                                                            allowClear={true}
                                                                                            options={
                                                                                                groupRef.current.levelGroupList[String(index + 1)]
                                                                                            }
                                                                                            onChange={(value) => {
                                                                                                // formRef.current?.setFieldsValue({
                                                                                                //     [`level${index + 1}Group`]: value,
                                                                                                // });
                                                                                                let newLevelData = _.cloneDeep(levelData);
                                                                                                // newLevelData[index + 1] = {
                                                                                                //     ...levelData[index + 1],
                                                                                                // };
                                                                                                // newLevelData[index + 1]['groupId'] =
                                                                                                //     String(value);
                                                                                                // setLevelData({
                                                                                                //     ...newLevelData,
                                                                                                // });

                                                                                                for (let i = index; i < levelCount; i++) {
                                                                                                    formRef.current?.setFieldsValue({
                                                                                                        [`level${i + 1}Group`]: value,
                                                                                                    });
                                                                                                    newLevelData[i + 1] = {
                                                                                                        ...levelData[i + 1],
                                                                                                    };
                                                                                                    newLevelData[i + 1]['groupId'] = String(value);
                                                                                                }
                                                                                                setLevelData({
                                                                                                    ...newLevelData,
                                                                                                });

                                                                                                typeGroup(index + 1);
                                                                                            }}
                                                                                        />
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                                <Form.Item style={{ margin: 0 }} name={`level${index + 1}CheckRole`}>
                                                                    <Checkbox.Group
                                                                        // value={allRadioValues[index + 1]?.map((item) => item.value)}
                                                                        onChange={onRadioChange}
                                                                        style={{ background: 'rgb(247,247,247)', padding: '5px 0' }}
                                                                    >
                                                                        {teamGroupRoles.map((item) => (
                                                                            <Checkbox
                                                                                disabled={mode === 'read'}
                                                                                className="checked-role"
                                                                                key={item.value}
                                                                                value={item.value}
                                                                            >
                                                                                {item.label}
                                                                                {allRadioValues['0']?.find((i) => i.value === item.value)?.label ? (
                                                                                    <div className="checked-tip">
                                                                                        <span>
                                                                                            {
                                                                                                allRadioValues['0']?.find(
                                                                                                    (i) => i.value === item.value,
                                                                                                )?.label
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                ) : null}
                                                                            </Checkbox>
                                                                        ))}
                                                                    </Checkbox.Group>
                                                                </Form.Item>
                                                            </Form.Item>
                                                        </Form.Item>
                                                        <Form.Item label="临时手机号码" style={{ marginLeft: 104 }} labelCol={{ span: 4 }}>
                                                            <Row align="middle">
                                                                <Col>
                                                                    <Form.Item
                                                                        rules={[
                                                                            {
                                                                                validator: async (rule, val, callback) => {
                                                                                    const reg = new RegExp('^1[3578][0-9]{9}(,1[3578][0-9]{9})*$');
                                                                                    if (reg.test(val) || !val) {
                                                                                        callback();
                                                                                    } else {
                                                                                        throw new Error('请输入正确格式');
                                                                                    }
                                                                                },
                                                                            },
                                                                        ]}
                                                                        noStyle
                                                                        name="temporaryNumber"
                                                                    >
                                                                        <Input style={{ marginLeft: 5 }} allowClear />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col>
                                                                    <Button
                                                                        type="primary"
                                                                        disabled={mode === 'read'}
                                                                        style={{ margin: '0 12px' }}
                                                                        onClick={() => {
                                                                            handleTempAdd('', index);
                                                                        }}
                                                                    >
                                                                        添加
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button
                                                                        type="primary"
                                                                        disabled={mode === 'read'}
                                                                        onClick={() => {
                                                                            formRef.current.setFieldsValue({ temporaryNumber: '' });
                                                                            setFinalLevelData((prev) => {
                                                                                return {
                                                                                    ...prev,
                                                                                    [`temps${index}`]: [],
                                                                                };
                                                                            });
                                                                        }}
                                                                    >
                                                                        清空
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                            <div className="tag-groups" style={{ marginTop: 12 }}>
                                                                {(finalLevelData?.[`temps${index}`] || []).map((item, inds) => {
                                                                    return (
                                                                        <Tag
                                                                            key={inds}
                                                                            onClose={(e) => {
                                                                                e.preventDefault();
                                                                                console.log(index, '===ind', finalLevelData);
                                                                                setFinalLevelData((prev) => {
                                                                                    return {
                                                                                        ...prev,
                                                                                        [`temps${index}`]: prev?.[`temps${index}`].filter(
                                                                                            (temp) => temp !== item,
                                                                                        ),
                                                                                    };
                                                                                });
                                                                            }}
                                                                            closable={mode !== 'read'}
                                                                        >
                                                                            {item}
                                                                        </Tag>
                                                                    );
                                                                })}
                                                            </div>
                                                        </Form.Item>
                                                        <Form.Item
                                                            style={{ marginBottom: 5 }}
                                                            required
                                                            label="通知内容"
                                                            name={`level${index + 1}Strategy`}
                                                            labelCol={{ span: 4 }}
                                                            wrapperCol={{ span: 20 }}
                                                        >
                                                            <Row gutter={8}>
                                                                <Col>
                                                                    <Field
                                                                        mode={mode}
                                                                        render={() => {
                                                                            return <span style={{ lineHeight: '30px' }}>{selectValue}</span>;
                                                                        }}
                                                                        renderFormItem={() => {
                                                                            return (
                                                                                <Select
                                                                                    value={levelData[index + 1]?.contentTemplateId}
                                                                                    style={{ width: 120 }}
                                                                                    onChange={(value, option) => {
                                                                                        const target = smsTemplateList.find(
                                                                                            (item) => item.key === value,
                                                                                        );

                                                                                        setSelectValue(target?.label);
                                                                                        formRef.current?.setFieldsValue({
                                                                                            [`level${index + 1}SmsTitle`]: target?.value,
                                                                                            [`level${index + 1}Strategy`]: target?.label,
                                                                                        });
                                                                                        // if (formRef.current?.getFieldValue('isUseSmsTitle')) {
                                                                                        //     formRef.current?.setFieldsValue({
                                                                                        //         cancelTitle: `告警已于<cancel_time>清除 ${target?.value})}`,
                                                                                        //     });
                                                                                        // }

                                                                                        let newLevelData = _.cloneDeep(levelData);

                                                                                        newLevelData[index + 1] = {
                                                                                            ...levelData[index + 1],
                                                                                        };
                                                                                        newLevelData[index + 1]['contentTemplateId'] = target?.label;
                                                                                        newLevelData[index + 1]['content'] = target?.value;
                                                                                        setLevelData({
                                                                                            ...newLevelData,
                                                                                        });
                                                                                    }}
                                                                                    placeholder="请选择模板"
                                                                                >
                                                                                    {smsTemplateList.map((item) => {
                                                                                        return (
                                                                                            <Select.Option
                                                                                                label={item.value}
                                                                                                key={item.key}
                                                                                                value={item.key}
                                                                                            >
                                                                                                {item.label}
                                                                                            </Select.Option>
                                                                                        );
                                                                                    })}
                                                                                </Select>
                                                                            );
                                                                        }}
                                                                    />
                                                                </Col>
                                                                <Col>
                                                                    <Button
                                                                        onClick={() =>
                                                                            showSMSTemplateClick(
                                                                                `level${index + 1}SmsTitle`,
                                                                                `level${index + 1}Strategy`,
                                                                                index + 1,
                                                                            )
                                                                        }
                                                                        disabled={mode === 'read'}
                                                                    >
                                                                        模板管理
                                                                    </Button>
                                                                </Col>
                                                                <Col>
                                                                    <Button
                                                                        onClick={() =>
                                                                            showSMSTemplateEditClick(
                                                                                `level${index + 1}SmsTitle`,
                                                                                `level${index + 1}Strategy`,
                                                                                index + 1,
                                                                            )
                                                                        }
                                                                        disabled={mode === 'read'}
                                                                    >
                                                                        编辑
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                        </Form.Item>

                                                        <Form.Item noStyle shouldUpdate>
                                                            {({ getFieldValue }) => {
                                                                return (
                                                                    <Form.Item
                                                                        name={`level${index + 1}SmsTitle`}
                                                                        wrapperCol={{ offset: 4 }}
                                                                        rules={[{ required: true, message: '不可为空' }]}
                                                                    >
                                                                        <Field
                                                                            mode={mode}
                                                                            render={() => {
                                                                                return getFieldValue(`level${index + 1}SmsTitle`);
                                                                            }}
                                                                            renderFormItem={() => {
                                                                                return (
                                                                                    <Input.TextArea
                                                                                        style={{ marginBottom: 20 }}
                                                                                        maxLength={1024}
                                                                                        onChange={(e) =>
                                                                                            smsTitleChange(e, `level${index + 1}SmsTitle`, index + 1)
                                                                                        }
                                                                                        autoSize={{ minRows: 3, maxRows: 5 }}
                                                                                        allowClear
                                                                                    />
                                                                                );
                                                                            }}
                                                                        />
                                                                    </Form.Item>
                                                                );
                                                            }}
                                                        </Form.Item>

                                                        <Form.Item label="语音遇忙重拨" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                                            <VoiceControlledReplay
                                                                mode={mode}
                                                                isControlled={false}
                                                                onSwitchChange={onVoiceSwitchLevelData}
                                                                disableControlled={`level${index + 1}VoiceReplay`}
                                                                levelIndex={index + 1}
                                                            />
                                                        </Form.Item>
                                                    </Tabs.TabPane>
                                                );
                                            })}

                                            <Tabs.TabPane tab="周期性通知" key="6" forceRender>
                                                <Form.Item
                                                    style={{ marginBottom: 8 }}
                                                    valuePropName="checked"
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 20 }}
                                                    name="periodicNotification"
                                                    label="周期性通知"
                                                >
                                                    <Switch
                                                        checkedChildren="开"
                                                        unCheckedChildren="关"
                                                        disabled={mode === 'read'}
                                                        onChange={(value) => {
                                                            setPeriodicNoticData({
                                                                ...periodicNoticData,
                                                                switch: value ? '1' : '0',
                                                            });
                                                        }}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    required
                                                    label="间隔周期"
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 4 }}
                                                    style={{ marginBottom: 8 }}
                                                >
                                                    <Form.Item
                                                        style={{ margin: 0 }}
                                                        wrapperCol={{ span: 24 }}
                                                        name="cycleTime"
                                                        rules={
                                                            !formRef.current?.getFieldValue('periodicNotification')
                                                                ? undefined
                                                                : [
                                                                      {
                                                                          validator: async (_, value) => {
                                                                              if (
                                                                                  !value ||
                                                                                  isNaN(value) ||
                                                                                  value.toString().split('.')[1]?.length > 1
                                                                              ) {
                                                                                  throw new Error('请输入最多一位小数的数');
                                                                              }
                                                                              if (value > 10000) {
                                                                                  throw new Error('间隔周期不可大于10000');
                                                                              }
                                                                          },
                                                                      },
                                                                  ]
                                                        }
                                                    >
                                                        {/* <Field
                                                    mode={mode}
                                                    renderFormItem={() => {
                                                        return ( */}
                                                        {mode === 'read' ? (
                                                            formRef?.current?.getFieldValue('cycleTime')
                                                        ) : (
                                                            <InputNumber
                                                                disabled={!formRef.current?.getFieldValue('periodicNotification')}
                                                                // value={periodicNoticData?.intervalPeriod}
                                                                placeholder=""
                                                                style={{ width: '100%' }}
                                                                controls={false}
                                                                type="number"
                                                                min={0}
                                                                // max={10000}
                                                                onChange={(value) => {
                                                                    formRef.current?.setFieldsValue({
                                                                        cycleTime: value,
                                                                    });
                                                                    setPeriodicNoticData({
                                                                        ...periodicNoticData,
                                                                        elapsedTime: String(value),
                                                                    });
                                                                }}
                                                            />
                                                        )}

                                                        {/* );
                                                    }}
                                                /> */}
                                                    </Form.Item>

                                                    <span className="fault-hour">(小时)</span>
                                                </Form.Item>

                                                <Form.Item required label="通知对象" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                                    <Form.Item noStyle shouldUpdate>
                                                        <Row gutter={24}>
                                                            <Col span={6}>
                                                                <Form.Item
                                                                    style={{ margin: 0 }}
                                                                    name="periodicProvince"
                                                                    rules={
                                                                        !formRef.current?.getFieldValue('periodicCheckRole') ||
                                                                        formRef.current?.getFieldValue('periodicCheckRole')?.length === 0
                                                                            ? undefined
                                                                            : [{ required: true, message: '不可为空' }]
                                                                    }
                                                                >
                                                                    <Field
                                                                        mode={mode}
                                                                        valueEnum={getValueEnum(provinceList)}
                                                                        renderFormItem={() => {
                                                                            return (
                                                                                <Select
                                                                                    // value={periodicNoticData?.provinceId}
                                                                                    placeholder=""
                                                                                    options={provinceList}
                                                                                    allowClear={true}
                                                                                    disabled={
                                                                                        mode === 'read' ||
                                                                                        !formRef.current?.getFieldValue('periodicNotification')
                                                                                    }
                                                                                    onChange={(value) => {
                                                                                        formRef.current?.setFieldsValue({
                                                                                            periodicProvince: value,
                                                                                        });
                                                                                        formRef.current?.setFieldsValue({
                                                                                            periodicGroup: '',
                                                                                        });
                                                                                        setPeriodicNoticData({
                                                                                            ...periodicNoticData,
                                                                                            provinceId: String(value),
                                                                                        });
                                                                                        getGroupsData(value, 'periodic');
                                                                                    }}
                                                                                />
                                                                            );
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={8}>
                                                                <Form.Item
                                                                    style={{ margin: 0 }}
                                                                    name="periodicGroup"
                                                                    rules={
                                                                        !formRef.current?.getFieldValue('periodicCheckRole') ||
                                                                        formRef.current?.getFieldValue('periodicCheckRole')?.length === 0
                                                                            ? undefined
                                                                            : [{ required: true, message: '不可为空' }]
                                                                    }
                                                                >
                                                                    <Field
                                                                        mode={mode}
                                                                        valueEnum={getValueEnum(periodicGroupList)}
                                                                        renderFormItem={() => {
                                                                            return (
                                                                                <Select
                                                                                    // value={periodicNoticData?.groupId}
                                                                                    showSearch
                                                                                    optionFilterProp="label"
                                                                                    placeholder=""
                                                                                    allowClear={true}
                                                                                    options={periodicGroupList}
                                                                                    disabled={
                                                                                        mode === 'read' ||
                                                                                        !formRef.current?.getFieldValue('periodicNotification')
                                                                                    }
                                                                                    onChange={(value) => {
                                                                                        formRef.current?.setFieldsValue({
                                                                                            periodicGroup: value,
                                                                                        });
                                                                                        setPeriodicNoticData({
                                                                                            ...periodicNoticData,
                                                                                            groupId: String(value),
                                                                                        });
                                                                                    }}
                                                                                />
                                                                            );
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                        <Form.Item style={{ margin: 0 }} name="periodicCheckRole">
                                                            <Checkbox.Group
                                                                onChange={(values) => {
                                                                    formRef.current?.setFieldsValue({ periodicCheckRole: values });
                                                                    setPeriodicNoticData({
                                                                        ...periodicNoticData,
                                                                        roles: values.join(','),
                                                                    });
                                                                }}
                                                                // value={periodicNoticData?.roles}
                                                                style={{ background: 'rgb(247,247,247)', padding: '5px 0' }}
                                                            >
                                                                {teamGroupRoles.map((item) => (
                                                                    <Checkbox
                                                                        disabled={
                                                                            mode === 'read' || !formRef.current?.getFieldValue('periodicNotification')
                                                                        }
                                                                        className="checked-role"
                                                                        key={item.value}
                                                                        value={item.value}
                                                                    >
                                                                        {item.label}
                                                                        {allRadioValues['0']?.find((i) => i.value === item.value)?.label ? (
                                                                            <div className="checked-tip">
                                                                                <span>
                                                                                    {allRadioValues['0']?.find((i) => i.value === item.value)?.label}
                                                                                </span>
                                                                            </div>
                                                                        ) : null}
                                                                    </Checkbox>
                                                                ))}
                                                            </Checkbox.Group>
                                                        </Form.Item>
                                                    </Form.Item>
                                                </Form.Item>
                                                <Form.Item label="临时手机号码" style={{ marginLeft: 104 }} labelCol={{ span: 4 }}>
                                                    <Row align="middle">
                                                        <Col>
                                                            <Form.Item
                                                                rules={[
                                                                    {
                                                                        validator: async (rule, val, callback) => {
                                                                            const reg = new RegExp('^1[3578][0-9]{9}(,1[3578][0-9]{9})*$');
                                                                            if (reg.test(val) || !val) {
                                                                                callback();
                                                                            } else {
                                                                                throw new Error('请输入正确格式');
                                                                            }
                                                                        },
                                                                    },
                                                                ]}
                                                                noStyle
                                                                name="temporaryNumber"
                                                                // fieldKey={[field.fieldKey, 'temporaryNum']}
                                                            >
                                                                <Input
                                                                    style={{ marginLeft: 5 }}
                                                                    disabled={
                                                                        mode === 'read' || !formRef.current?.getFieldValue('periodicNotification')
                                                                    }
                                                                    allowClear
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                type="primary"
                                                                disabled={mode === 'read' || !formRef.current?.getFieldValue('periodicNotification')}
                                                                style={{ margin: '0 12px' }}
                                                                onClick={() => {
                                                                    handleTempAdd('circle', '');
                                                                }}
                                                            >
                                                                添加
                                                            </Button>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                type="primary"
                                                                disabled={mode === 'read' || !formRef.current?.getFieldValue('periodicNotification')}
                                                                onClick={() => {
                                                                    formRef.current.setFieldsValue({ temporaryNumber: '' });
                                                                    setFinalCircleData({ temps: [] });
                                                                }}
                                                            >
                                                                清空
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                    <div className="tag-groups" style={{ marginTop: 12 }}>
                                                        {(finalCircleData?.temps || []).map((item, index) => {
                                                            return (
                                                                <Tag
                                                                    key={index}
                                                                    onClose={(e) => {
                                                                        e.preventDefault();
                                                                        setFinalCircleData((prev) => {
                                                                            return {
                                                                                temps: prev.temps.filter((temp) => temp !== item),
                                                                            };
                                                                        });
                                                                    }}
                                                                    closable={mode !== 'read'}
                                                                >
                                                                    {item}
                                                                </Tag>
                                                            );
                                                        })}
                                                    </div>
                                                </Form.Item>
                                                <Form.Item
                                                    style={{ marginBottom: 5 }}
                                                    required
                                                    label="通知内容"
                                                    name="periodicStrategy"
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 20 }}
                                                >
                                                    <Row gutter={8}>
                                                        <Col>
                                                            <Field
                                                                mode={mode}
                                                                render={() => {
                                                                    return <span style={{ lineHeight: '30px' }}>{selectValue}</span>;
                                                                }}
                                                                renderFormItem={() => {
                                                                    return (
                                                                        <Select
                                                                            disabled={!formRef.current?.getFieldValue('periodicNotification')}
                                                                            value={periodicNoticData?.contentTemplateId}
                                                                            style={{ width: 120 }}
                                                                            onChange={(value, option) => {
                                                                                const target = smsTemplateList.find((item) => item.key === value);

                                                                                setSelectValue(target?.label);
                                                                                formRef.current?.setFieldsValue({
                                                                                    periodicSmsTitle: target?.value,
                                                                                    periodicStrategy: target?.label,
                                                                                });
                                                                                // if (formRef.current?.getFieldValue('isUseSmsTitle')) {
                                                                                //     formRef.current?.setFieldsValue({
                                                                                //         cancelTitle: `告警已于<cancel_time>清除 ${target?.value})}`,
                                                                                //     });
                                                                                // }
                                                                                setPeriodicNoticData({
                                                                                    ...periodicNoticData,
                                                                                    contentTemplateId: target?.label,
                                                                                    content: target?.value,
                                                                                });
                                                                            }}
                                                                            // value={selectValue}
                                                                            placeholder="请选择模板"
                                                                        >
                                                                            {smsTemplateList.map((item) => {
                                                                                return (
                                                                                    <Select.Option label={item.value} key={item.key} value={item.key}>
                                                                                        {item.label}
                                                                                    </Select.Option>
                                                                                );
                                                                            })}
                                                                        </Select>
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                onClick={() =>
                                                                    showSMSTemplateClick('periodicSmsTitle', 'periodicStrategy', undefined)
                                                                }
                                                                disabled={mode === 'read' || !formRef.current?.getFieldValue('periodicNotification')}
                                                            >
                                                                模板管理
                                                            </Button>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                onClick={() =>
                                                                    showSMSTemplateEditClick('periodicSmsTitle', 'periodicStrategy', undefined)
                                                                }
                                                                disabled={mode === 'read' || !formRef.current?.getFieldValue('periodicNotification')}
                                                            >
                                                                编辑
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Form.Item>

                                                <Form.Item noStyle shouldUpdate>
                                                    {({ getFieldValue }) => {
                                                        return (
                                                            <Form.Item
                                                                name="periodicSmsTitle"
                                                                wrapperCol={{ offset: 4 }}
                                                                rules={
                                                                    !formRef.current?.getFieldValue('periodicNotification')
                                                                        ? undefined
                                                                        : [{ required: true, message: '不可为空' }]
                                                                }
                                                            >
                                                                <Field
                                                                    mode={mode}
                                                                    render={() => {
                                                                        return getFieldValue('periodicSmsTitle');
                                                                    }}
                                                                    renderFormItem={() => {
                                                                        return (
                                                                            <Input.TextArea
                                                                                style={{ marginBottom: 10 }}
                                                                                disabled={!formRef.current?.getFieldValue('periodicNotification')}
                                                                                maxLength={1024}
                                                                                onChange={(e) => smsTitleChange(e, 'periodicSmsTitle', undefined)}
                                                                                autoSize={{ minRows: 3, maxRows: 5 }}
                                                                                allowClear
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        );
                                                    }}
                                                </Form.Item>

                                                <Form.Item label="语音遇忙重拨" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                                    <VoiceControlledReplay
                                                        mode={mode}
                                                        isControlled
                                                        disableControlled="periodicNotification"
                                                        onSwitchChange={onVoiceSwitchPeriodicNoticData}
                                                    />
                                                </Form.Item>
                                            </Tabs.TabPane>

                                            <Tabs.TabPane tab="恢复通知" key="7" forceRender className="recovert-notice">
                                                <Form.Item
                                                    style={{ marginBottom: 5 }}
                                                    valuePropName="checked"
                                                    label="恢复通知"
                                                    name="revertSwitch"
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 20 }}
                                                >
                                                    <Switch
                                                        checkedChildren="开"
                                                        unCheckedChildren="关"
                                                        disabled={mode === 'read'}
                                                        onChange={(value) => {
                                                            formRef?.current?.setFieldsValue({ revertSwitch: value });
                                                            setRecoveryNoticeData({
                                                                ...recoveryNoticeData,
                                                                switch: value ? '1' : '0',
                                                            });
                                                        }}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    style={{ marginBottom: 5 }}
                                                    required
                                                    label="通知内容"
                                                    name="recoveryStrategyContent"
                                                    labelCol={{ span: 4 }}
                                                    wrapperCol={{ span: 20 }}
                                                >
                                                    <Row gutter={8}>
                                                        <Col>
                                                            <Field
                                                                mode={mode}
                                                                render={() => {
                                                                    return <span style={{ lineHeight: '30px' }}>{selectValue}</span>;
                                                                }}
                                                                renderFormItem={() => {
                                                                    return (
                                                                        <Select
                                                                            disabled={!formRef.current?.getFieldValue('revertSwitch')}
                                                                            value={recoveryNoticeData?.contentTemplateId}
                                                                            style={{ width: 120 }}
                                                                            onChange={(value, option) => {
                                                                                const target = smsTemplateList.find((item) => item.key === value);

                                                                                setSelectValue(target?.label);
                                                                                formRef.current?.setFieldsValue({
                                                                                    recoverySmsTitle: target?.value,
                                                                                    recoveryStrategyContent: target?.label,
                                                                                });
                                                                                // if (formRef.current?.getFieldValue('isUseSmsTitle')) {
                                                                                //     formRef.current?.setFieldsValue({
                                                                                //         cancelTitle: `告警已于<cancel_time>清除 ${target?.value})}`,
                                                                                //     });
                                                                                // }
                                                                                setRecoveryNoticeData({
                                                                                    ...recoveryNoticeData,
                                                                                    contentTemplateId: target?.label,
                                                                                    content: target?.value,
                                                                                });
                                                                            }}
                                                                            // value={selectValue}
                                                                            placeholder="请选择模板"
                                                                        >
                                                                            {smsTemplateList.map((item) => {
                                                                                return (
                                                                                    <Select.Option label={item.value} key={item.key} value={item.key}>
                                                                                        {item.label}
                                                                                    </Select.Option>
                                                                                );
                                                                            })}
                                                                        </Select>
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                onClick={() =>
                                                                    showSMSTemplateClick('recoverySmsTitle', 'recoveryStrategyContent', undefined)
                                                                }
                                                                disabled={mode === 'read' || !formRef.current?.getFieldValue('revertSwitch')}
                                                            >
                                                                模板管理
                                                            </Button>
                                                        </Col>
                                                        <Col>
                                                            <Button
                                                                onClick={() =>
                                                                    showSMSTemplateEditClick('recoverySmsTitle', 'recoveryStrategyContent', undefined)
                                                                }
                                                                disabled={mode === 'read' || !formRef.current?.getFieldValue('revertSwitch')}
                                                            >
                                                                编辑
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Form.Item>

                                                <Form.Item noStyle shouldUpdate>
                                                    {({ getFieldValue }) => {
                                                        return (
                                                            <Form.Item
                                                                name="recoverySmsTitle"
                                                                wrapperCol={{ offset: 4 }}
                                                                rules={
                                                                    !formRef.current?.getFieldValue('revertSwitch')
                                                                        ? undefined
                                                                        : [{ required: true, message: '不可为空' }]
                                                                }
                                                            >
                                                                <Field
                                                                    mode={mode}
                                                                    render={() => {
                                                                        return getFieldValue('recoverySmsTitle');
                                                                    }}
                                                                    renderFormItem={() => {
                                                                        return (
                                                                            <Input.TextArea
                                                                                style={{ marginBottom: 20 }}
                                                                                disabled={!formRef.current?.getFieldValue('revertSwitch')}
                                                                                maxLength={1024}
                                                                                onChange={(e) => smsTitleChange(e, 'recoverySmsTitle', undefined)}
                                                                                autoSize={{ minRows: 3, maxRows: 5 }}
                                                                                allowClear
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        );
                                                    }}
                                                </Form.Item>

                                                <Form.Item label="语音遇忙重拨" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                                                    <VoiceControlledReplay
                                                        mode={mode}
                                                        isControlled
                                                        disableControlled="revertSwitch"
                                                        onSwitchChange={onVoiceSwitchRecoveryNoticeData}
                                                    />
                                                </Form.Item>
                                                <div className="instructions">说明: &nbsp;&nbsp;故障恢复通知对象为最后一轮预警级别对应的人员</div>
                                            </Tabs.TabPane>
                                        </Tabs>
                                    </Card>
                                </>
                            ) : null}

                            {current === 2 ? (
                                <Card className="fault-recovery-card" style={mode === 'read' ? { width: '72%' } : undefined}>
                                    <Form.Item
                                        name="recoveryStrategy"
                                        required
                                        label="故障恢复机制"
                                        labelCol={{ span: 5 }}
                                        wrapperCol={{ span: 19 }}
                                        rules={[{ required: true, message: '不可为空' }]}
                                    >
                                        <Radio.Group
                                            disabled={mode === 'read'}
                                            className="fault-recovery-card-radio"
                                            onChange={(e) => {
                                                formRef.current?.setFieldsValue({
                                                    recoveryStrategy: e.target.value,
                                                    rate: '',
                                                });
                                            }}
                                        >
                                            {recoverymechanismEnum.map((item) => (
                                                <Row gutter={2}>
                                                    <Col>
                                                        <Radio key={item.value} value={item.value}>
                                                            {item.label}
                                                        </Radio>
                                                    </Col>
                                                    <Col span={4}>{item.render ? item.render() : null}</Col>
                                                </Row>
                                            ))}
                                        </Radio.Group>
                                        {/* );
                                    }}
                                /> */}
                                    </Form.Item>
                                </Card>
                            ) : null}
                        </Layout.Content>

                        <Layout.Footer>
                            <Space>
                                {current !== 0 && (
                                    <Button style={mode === 'read' ? { display: 'none' } : undefined} type="primary" onClick={prevClick}>
                                        上一步
                                    </Button>
                                )}
                                {current === 2 ? (
                                    <Button style={mode === 'read' ? { display: 'none' } : undefined} type="primary" onClick={finishClick}>
                                        {modelType === 'edit' ? '保存' : '完成'}
                                    </Button>
                                ) : (
                                    <Button style={mode === 'read' ? { display: 'none' } : undefined} type="primary" onClick={nextClick}>
                                        下一步
                                    </Button>
                                )}
                                <Button style={mode === 'read' ? { display: 'none' } : undefined} type="default" onClick={cancelClick}>
                                    取消
                                </Button>
                            </Space>
                        </Layout.Footer>
                    </Layout>
                </div>
            </Form>
            {editVisible && (
                <Edit
                    modalContainer={container}
                    reloadList={getSmsTemplateList}
                    smsTemplateList={smsTemplateList}
                    type="edit"
                    setSmsContentValue={setSmsContentValue}
                    optionKey={optionKey}
                    visible={editVisible}
                    onVisibleChange={onEditVisibleChange}
                    moduleId={'14'}
                />
            )}
            <Modal
                title={'通知模板'}
                width={800}
                bodyStyle={{ height: '450px' }}
                onCancel={onCancel}
                visible={visible}
                destroyOnClose={true}
                getContainer={container}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={onCancel}> 关闭</Button>
                    </div>
                }
            >
                <SMSTemplate moduleId={'14'} optionKey={optionKey} login={login} reloadList={getSmsTemplateList} smsTemplateList={smsTemplateList} />
            </Modal>
        </>
    );
};

export default EditContent;
