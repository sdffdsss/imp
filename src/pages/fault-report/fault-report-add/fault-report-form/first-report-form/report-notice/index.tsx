import React, { useState, useEffect, useRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useMemo } from 'react';
import { Button, Modal, Row, Col, Select, Input, Space, Checkbox } from 'oss-ui';
import NoticeTemplate from '@Components/notice-template';
import request from '@Common/api';
import useLoginInfoModel from '@Src/hox';
import UserSelect from '@Components/user-select';
import uniqBy from 'lodash/uniqBy';
import classNames from 'classnames';
import { NoticeTable } from '../../../../components';
import NoticeTypeCheckbox, { NoticeTypeDataSource } from './components/NoticeTypeCheckbox';
import { ReportNoticeDefaultValue, ReportType, defaultNotificationDetailList, NoticeTemplateType } from '../../../../type';
import btnType from './btnType';
import './index.less';

type ReportNoticeProps = {
    value?: any;
    onChange?: (value) => void;
    reportNoticeError?: string;
    className?: string;
    templateBtnType?: any;
    tableDeleteBtnType?: string;
    tableMaxHeight?: number;
    defaultValue?: ReportNoticeDefaultValue;
    disabledProvince?: boolean;
    noticeTemplateClassName?: string;
    noticeTemplateAddClassName?: string;
    userGroupSelectModalClassName?: string;
    labelColSpan?: number;
    wrapperColSpan?: number;
    reportType?: string;
    hasDraftStatus?: boolean;
    noticeSettingFlag?: boolean;
    GNOCdisable?: boolean;
    faultLevel: string[];
    isWireless?: boolean;
    theme?: string; // 主题 ''| white
};

type ReportNoticeRef = {
    handleReportTypeChange: (type: string) => void;
    handleSelectedNoticeData: (data: any) => void;
};

const ReportNotice: ForwardRefRenderFunction<ReportNoticeRef, ReportNoticeProps> = (props, ref) => {
    const login = useLoginInfoModel();
    const { container, provinceId, userId } = login;
    const {
        value,
        onChange,
        reportNoticeError,
        className = '',
        templateBtnType = 'default',
        tableDeleteBtnType,
        tableMaxHeight,
        defaultValue,
        disabledProvince,
        noticeTemplateClassName,
        noticeTemplateAddClassName,
        userGroupSelectModalClassName,
        labelColSpan = 2,
        wrapperColSpan = 22,
        reportType,
        hasDraftStatus,
        noticeSettingFlag,
        GNOCdisable,
        faultLevel,
        isWireless,
    } = props;

    const userSelectRef: any = useRef(null);
    const defaultTemplateRef: any = useRef('');

    const [noticeVisible, setNoticeVisible] = useState(false);
    const [noticeTemplateList, setNoticeTemplateList] = useState([]);
    const [selectValue, setSelectValue] = useState<any>();

    const [userSelectModalVisible, setUserSelectModalVisible] = useState(false);
    const [selectedNoticeData, setSelectedNoticeData] = useState<any[]>([]);
    const selectedNoticeDataRef = useRef<any>(selectedNoticeData);
    selectedNoticeDataRef.current = selectedNoticeData;
    const [notifyGNOC, setNotifyGNOC] = useState(false);
    const [noticeTypeValue, setNoticeTypeValue] = useState<NoticeTypeDataSource>({
        notificationType: [],
        notificationDetailList: defaultNotificationDetailList,
    });

    // 临时手机号列表
    const [noticePhoneList, setNoticePhoneList] = useState([]);
    const [notificationContent, setNotificationContent] = useState<string | undefined>();
    const [noticeFinalData, setNoticeFinalData] = useState<any>({ temps: [] });

    // 三按钮
    const [noticeContentType, setNoticeContentType] = useState<any>(1);
    // 首
    const [notificationContentId, setNotificationContentId] = useState<string | number>('');
    // 续
    const [continueContentId, setContinueContentId] = useState<string | number>('');
    // 终
    const [finalContentId, setFinalContentId] = useState<string | number>('');
    // 存储默认通知对象
    const defaultNoticeData = useRef<any>([]);

    const onNoticeCancel = () => {
        setNoticeVisible(false);
    };

    const onUserSelectModalVisible = () => {
        setUserSelectModalVisible(false);
    };

    const findTemplateValue = (val: number): any => {
        const findValue = noticeTemplateList.find((item: any) => item.templateId === val);
        return findValue || {};
    };
    const onUserSelectModalOk = () => {
        if (userSelectRef && userSelectRef.current && userSelectRef.current.getValues) {
            const values = userSelectRef.current.getValues();
            console.log(values, 'values');
            const tableData: any = [];
            const groupIds = Object.keys(values).filter((item) => item !== 'temps');
            groupIds.forEach((groupId) => {
                values[groupId].forEach((item) => {
                    tableData.push({
                        ...item,
                        provinceNames: item.zoneName || item.provinceNames,
                    });
                });
            });
            console.log(tableData);
            setSelectedNoticeData(uniqBy(tableData, 'userId'));
            selectedNoticeDataRef.current = uniqBy(tableData, 'userId');
            setNoticePhoneList(values['temps']);
            setNoticeFinalData(values);
        }

        setUserSelectModalVisible(false);
    };

    const getNoticeTemplateList = () => {
        return request('faultReport/queryTemplate', {
            type: 'get',
            baseUrlType: 'fault',
            showSuccessMessage: false,
            data: {
                provinceId,
                pageIndex: 1,
                pageSize: 100,
                faultDistinctionType: 1,
            },
        }).then((res) => {
            if (res && res.data) {
                const smsList = res.data.map((item) => ({
                    ...item,
                    label: item.templateName,
                    value: item.templateId,
                }));
                setNoticeTemplateList(smsList);
            }
            return res;
        });
    };

    const getUserGroupList = ({ zoneId, zoneLevel }) => {
        return request('api/user/groups/list', {
            type: 'get',
            baseUrlType: 'userMangeUrl',
            showSuccessMessage: false,
            data: {
                zone_id: zoneId,
                zone_level: zoneLevel,
            },
        });
    };
    const getProvinceList = () => {
        return request(`api/users/${userId}/mgmt/zonesAndGroup`, {
            type: 'get',
            baseUrlType: 'userMangeUrl',
            showSuccessMessage: false,
            data: {},
        });
    };
    const getUserTableData = (groupId) => {
        if (!groupId) {
            return Promise.resolve({});
        }
        return request(`api/user/groups/${groupId}/pageUsers`, {
            type: 'get',
            baseUrlType: 'userMangeUrl',
            showSuccessMessage: false,
            data: {
                pageSize: 999999,
                pageNum: 1,
            },
        });
    };

    const onTableDelete = (data) => {
        setSelectedNoticeData((prev) => {
            return prev.filter((item) => item.userId !== data.userId);
        });
        selectedNoticeDataRef.current = selectedNoticeDataRef.current?.filter((item) => item.userId !== data.userId);
        setNoticeFinalData((prev) => {
            const prevData = { ...prev };
            const groupIds = Object.keys(prevData).filter((item) => item !== 'temps');
            groupIds.forEach((groupId) => {
                prevData[groupId] = prevData[groupId].filter((item) => item.userId !== data.userId);
            });
            return prevData;
        });
    };
    const onTagDelete = (data) => {
        // userSelectRef.current.onTagClose(data);
        setNoticePhoneList((prev) => {
            return prev.filter((item) => item !== data);
        });
        setNoticeFinalData((prev) => {
            return {
                ...prev,
                temps: prev['temps'].filter((item) => item !== data),
            };
        });
    };

    useEffect(() => {
        getNoticeTemplateList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWireless]);

    const onReportTypeChange = (type, draftFlag?) => {
        let templateType;
        switch (type) {
            case ReportType.FIRST_NEWSPAPER:
                templateType = NoticeTemplateType.FIRST_NEWSPAPER;
                break;
            case ReportType.RENEWAL:
                templateType = NoticeTemplateType.RENEWAL;
                break;
            case ReportType.FINAL_REPORT:
                templateType = NoticeTemplateType.FINAL_REPORT;
                break;

            default:
                break;
        }
        if (templateType) {
            defaultTemplateRef.current = noticeTemplateList.find((item: any) => item.templateType === templateType);
            if (!draftFlag) {
                setNotificationContent(defaultTemplateRef.current?.templateContent);
            }
        }
    };

    useEffect(() => {
        onReportTypeChange(reportType, hasDraftStatus);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noticeTemplateList, hasDraftStatus]);

    useEffect(() => {
        if (onChange) {
            const params = {
                ...value,
                notificationTel: noticePhoneList.join(','),
                notificationUser: selectedNoticeData
                    .map((item) => {
                        return item.userId;
                    })
                    .join(','),

                reportNoticeError,
                selectedNoticeData,
                notificationType: noticeTypeValue?.notificationType?.join(','),
                notificationDetailList: noticeTypeValue?.notificationDetailList,
                notificationContent: notificationContentId.toString(),
                notificationContentId: notificationContentId.toString(),
                continueContent: continueContentId.toString(),
                finalContent: finalContentId.toString(),
            };
            onChange(params);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedNoticeData,
        noticePhoneList,
        notificationContent,
        reportNoticeError,
        noticeTypeValue,

        notificationContentId,
        continueContentId,
        finalContentId,
    ]);

    useEffect(() => {
        if (defaultValue) {
            const {
                notificationTel = '',
                notificationUserInfos = [],
                notificationType = '',
                notificationDetailList,
                whetherNotifyGNOC,
                notificationContentId: notificationContentIds = '',
                continueContentId: continueContentIds = '',
                finalContentId: finalContentIds = '',
            } = defaultValue as any;
            const phoneList = notificationTel ? notificationTel.split(',') : [];

            if (reportType) {
                const thisValue = noticeTemplateList?.find((item: any) => item.templateId === (Number(notificationContentIds) || +reportType + 1));
                setSelectValue(thisValue);
                setNotificationContentId(notificationContentIds || +reportType + 1);
            } else {
                let thisType = '';
                switch (noticeContentType) {
                    case 1:
                        thisType = notificationContentIds;
                        break;
                    case 2:
                        thisType = continueContentIds;
                        break;
                    case 3:
                        thisType = finalContentIds;
                        break;
                    default:
                        break;
                }
                const thisValue = noticeTemplateList?.find((item: any) => item.templateId === (Number(thisType) || noticeContentType));
                setNotificationContentId(notificationContentIds);
                setSelectValue(thisValue);
            }
            setContinueContentId(continueContentIds);
            setFinalContentId(finalContentIds);

            setNoticePhoneList(phoneList);
            const originUserInfos = notificationUserInfos.map((item: any) => {
                return {
                    ...item,
                    originType: 'origin',
                };
            });
            // console.log(originUserInfos, 'originUserInfos');
            setSelectedNoticeData(originUserInfos || []);
            selectedNoticeDataRef.current = originUserInfos || [];
            setNoticeFinalData({ ls: originUserInfos || [], temps: phoneList });

            setNoticeTypeValue({
                notificationType: notificationType?.split(',') || [],
                notificationDetailList: notificationDetailList || defaultNotificationDetailList,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue, noticeTemplateList.length, (defaultValue as any).notificationContentId, reportType]);

    useEffect(() => {
        if (userSelectRef && userSelectRef.current && userSelectRef.current.handleSetFinalData) {
            console.log('noticeFinalData', noticeFinalData);
            userSelectRef.current.handleSetFinalData(noticeFinalData);
        }
    }, [noticeFinalData]);

    useEffect(() => {
        if (faultLevel && faultLevel?.includes('0')) {
            console.log('faultLevel', defaultNoticeData.current, selectedNoticeData);
            // const newData = uniqBy([...defaultNoticeData.current, ...selectedNoticeData], 'userId');
            const newData = uniqBy([...defaultNoticeData.current, ...selectedNoticeDataRef.current], 'userId');
            setSelectedNoticeData(newData);
            selectedNoticeDataRef.current = newData;
            setNoticeFinalData((prev) => {
                return { temps: prev.temps || [], ls: newData || [] };
            });
        }

        // eslint-disable-next-line
    }, [JSON.stringify(faultLevel)]);
    useImperativeHandle(ref, () => {
        return {
            // 父级的追加类型续报终报切换时调用
            handleReportTypeChange: onReportTypeChange,
            handleSelectedNoticeData: (val) => {
                defaultNoticeData.current = val;
                setSelectedNoticeData(val);
                setNoticeFinalData((prev) => {
                    return { temps: prev.temps || [], ls: val || [] };
                });
            },
        };
    });
    const switchFaultType = (val) => {
        switch (val) {
            case 1:
                setSelectValue(findTemplateValue(Number(notificationContentId) || 1));
                break;
            case 2:
                setSelectValue(findTemplateValue(Number(continueContentId) || 2));
                break;
            case 3:
                setSelectValue(findTemplateValue(Number(finalContentId) || 3));
                break;
            case 6:
                setSelectValue(findTemplateValue(6));
                break;
            case 7:
                setSelectValue(findTemplateValue(7));
                break;
            case 8:
                setSelectValue(findTemplateValue(8));
                break;
            default:
        }
        setNoticeContentType(val);
    };
    const rollBackScroll = () => {
        const el = document.getElementById('inputNoticeContentType');
        if (el) {
            el.scrollTop = 0;
        }
    };
    const templateContent = useMemo(() => {
        if (noticeSettingFlag) {
            switch (noticeContentType) {
                case 1:
                    return findTemplateValue(Number(notificationContentId || 1)).templateContent;
                case 2:
                    return findTemplateValue(Number(continueContentId || 2)).templateContent;
                case 3:
                    return findTemplateValue(Number(finalContentId || 3)).templateContent;
                case 6:
                    return findTemplateValue(6).templateContent;
                case 7:
                    return findTemplateValue(7).templateContent;
                case 8:
                    return findTemplateValue(8).templateContent;
                default:
                    return '';
            }
        } else {
            return findTemplateValue(Number(notificationContentId || 1)).templateContent;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [continueContentId, finalContentId, noticeContentType, noticeSettingFlag, notificationContentId, selectValue, noticeVisible, defaultValue]);

    const frameVisible = window.location.href.indexOf('hideNav') !== -1; // 是否为嵌入的故障上报
    const modalClassName = frameVisible ? 'frame-notice-template-modal' : classNames(noticeTemplateClassName, 'notice-template-modal');

    return (
        <>
            <div className={`report-notice-container ${className}`}>
                <Row gutter={[0, 20]}>
                    {/* <div className="report-notice-item"> */}
                    <Col span={labelColSpan}>
                        <div style={{ textAlign: 'right', lineHeight: '28px' }}>通知内容：</div>
                    </Col>
                    {noticeSettingFlag && (
                        <Col span={wrapperColSpan}>
                            <Space>
                                {btnType.map((item) => {
                                    return (
                                        <Button
                                            ghost={noticeContentType !== item.key}
                                            onClick={() => {
                                                switchFaultType(item.key);
                                                rollBackScroll();
                                            }}
                                        >
                                            {item.value}
                                        </Button>
                                    );
                                })}
                            </Space>
                        </Col>
                    )}
                    <Col span={wrapperColSpan} offset={noticeSettingFlag ? labelColSpan : 0}>
                        <Space>
                            <Select
                                style={{ width: 160 }}
                                onChange={(v) => {
                                    const changeValue = findTemplateValue(v);
                                    setSelectValue(changeValue);
                                    switch (noticeContentType) {
                                        case 1:
                                            setNotificationContentId(v);
                                            break;
                                        case 2:
                                            setContinueContentId(v);
                                            break;
                                        case 3:
                                            setFinalContentId(v);
                                            break;
                                        default:
                                    }
                                }}
                                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                                value={selectValue}
                                placeholder="请选择通知模板"
                                options={noticeTemplateList}
                            />
                            <Button
                                onClick={() => {
                                    setNoticeVisible(true);
                                }}
                                type={templateBtnType}
                            >
                                模板管理
                            </Button>
                        </Space>
                    </Col>
                    <Col span={wrapperColSpan} offset={labelColSpan}>
                        <Input.TextArea
                            id="inputNoticeContentType"
                            value={templateContent}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            allowClear
                            maxLength={3000}
                            placeholder="请输入通知内容，短信/IVR字数上限70，超出部分将被自动截取"
                            disabled
                        />
                    </Col>
                    <Col span={labelColSpan}>
                        <div style={{ textAlign: 'right' }}>通知方式：</div>
                    </Col>
                    <Col span={wrapperColSpan}>
                        <NoticeTypeCheckbox dataSource={noticeTypeValue} onChange={setNoticeTypeValue} />
                    </Col>
                    <Col span={labelColSpan}>
                        <div style={{ textAlign: 'right', lineHeight: '28px' }}>通知对象：</div>
                    </Col>
                    <Col span={wrapperColSpan}>
                        <Button
                            type="primary"
                            onClick={() => {
                                setUserSelectModalVisible(true);
                            }}
                        >
                            选择用户
                        </Button>
                        {!noticeSettingFlag && (
                            <Checkbox
                                disabled={GNOCdisable}
                                checked={value?.whetherNotifyGNOC}
                                onChange={(val) => {
                                    onChange?.({ ...value, whetherNotifyGNOC: val.target.checked });
                                }}
                                style={{ marginLeft: '20px' }}
                            >
                                通知GNOC值班室
                            </Checkbox>
                        )}
                    </Col>

                    <Col span={wrapperColSpan} offset={labelColSpan}>
                        <NoticeTable
                            dataSource={selectedNoticeData}
                            phoneList={noticePhoneList}
                            editable
                            onTagDelete={onTagDelete}
                            onTableDelete={onTableDelete}
                            tableDeleteBtnType={tableDeleteBtnType}
                            maxHeight={tableMaxHeight}
                            faultLevel={faultLevel}
                        />
                    </Col>

                    {reportNoticeError && (
                        <Col span={wrapperColSpan} offset={labelColSpan}>
                            <span style={{ color: 'red' }} className="report-notice-error-text">
                                {reportNoticeError}
                            </span>
                        </Col>
                    )}
                </Row>

                <Modal
                    title="通知模板管理"
                    width={800}
                    bodyStyle={{ height: '450px' }}
                    onCancel={onNoticeCancel}
                    visible={noticeVisible}
                    destroyOnClose
                    className={modalClassName}
                    getContainer={container}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button onClick={onNoticeCancel}> 关闭</Button>
                        </div>
                    }
                >
                    <NoticeTemplate
                        provinceId={provinceId}
                        login={login}
                        reloadList={getNoticeTemplateList}
                        templateList={noticeTemplateList}
                        noticeTemplateAddClassName={frameVisible ? '' : noticeTemplateAddClassName}
                        isWireless={isWireless}
                    />
                </Modal>

                <Modal
                    width="85vw"
                    title="选择用户"
                    destroyOnClose
                    visible={userSelectModalVisible}
                    onCancel={onUserSelectModalVisible}
                    className={frameVisible ? 'user-group-select-modal' : classNames('user-group-select-modal', userGroupSelectModalClassName)}
                    onOk={onUserSelectModalOk}
                >
                    <UserSelect
                        ref={userSelectRef}
                        getUserGroupList={getUserGroupList}
                        getProvinceList={getProvinceList}
                        getUserTableData={getUserTableData}
                        // userGroupList={userGroupList}
                        ruleType="userMobile"
                        mode="edit"
                        noticeFinalData={noticeFinalData}
                        disabledProvince={disabledProvince}
                        faultLevel={faultLevel}
                        // initData={selectedUserData[addReceiverEmailDestTypeRef.current]}
                    />
                </Modal>
                {/* </Form.Item> */}
                {/* </Form> */}
            </div>
        </>
    );
};
export default forwardRef(ReportNotice);
