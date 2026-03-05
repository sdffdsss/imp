import React, { useState, useRef, useEffect } from 'react';
import { Button, Checkbox, Space } from 'oss-ui';
import { useLocation, useHistory } from 'react-router-dom';
// import PageContainer from '@Components/page-container';
import useLoginInfoModel from '@Src/hox';
import { getManualReportDerivedRuleConfig } from '@Src/pages/troubleshooting-workbench/api';
import constants from '@Src/common/constants';
import { FAILURE_REPORT_STATUS } from '@Src/pages/fault-report/type';
import FormContainer, { FormContainerRef } from './fault-report-form/form-container';
import './index.less';

const FaultReportAdd = () => {
    const history = useHistory();
    const { search } = useLocation();
    const searchParamsIns = new URLSearchParams(search);
    const flagId = searchParamsIns.get('flagId');
    const status = searchParamsIns.get('status');
    const type = searchParamsIns.get('type');
    const isMajor = searchParamsIns.get('isMajor') === 'true';
    const activeKey = searchParamsIns.get('activeKey');
    const isWorkbench = searchParamsIns.get('isWorkbench');
    const btnKey = searchParamsIns.get('btnKey');
    const isFaultReportNew = searchParamsIns.get('isFaultReportNew') === 'true';

    const [isSync, setIsSync] = useState(0);
    const ref = useRef<FormContainerRef>(null);

    const [loading, setLoading] = useState(false);
    const [faultReportDataSource, setFaultReportDataSource] = useState<any>(null);
    const isWireless = window.location.href.indexOf('isWireless') !== -1;
    const [isContinueReportView, setIsContinueReportView] = useState(false);
    const [ruleConfig, setRuleConfig] = useState(null);

    const goBack = () => {
        if (activeKey) {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/major-fault-report?activeKey=${activeKey}`);
        } else if (isWorkbench) {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench`);
        } else {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report`);
        }
    };
    const onReset = () => {
        if (ref && ref.current && ref.current.onReset) {
            setIsSync(0);

            ref.current.onReset();
        }
    };

    const onSave = () => {
        if (ref && ref.current && ref.current.onSave) {
            ref.current.onSave();
        }
    };
    const onSubmit = () => {
        if (ref && ref.current && ref && ref.current.onSubmit) {
            localStorage.setItem('backToList', 'yes');
            ref.current.onSubmit();
        }
    };

    const { userInfo, systemInfo, provinceId } = useLoginInfoModel();
    const parseUserInfo = userInfo && JSON.parse(userInfo);

    const getRuleConfig = async () => {
        const res = await getManualReportDerivedRuleConfig({ provinceId });
        if (res && res.data) {
            setRuleConfig(res.data);
        }
    };

    useEffect(() => {
        const pushToListPage =
            systemInfo?.currentZone &&
            parseUserInfo?.zones?.every((item) => {
                return item.zoneId !== systemInfo?.currentZone?.zoneId;
            });
        if (pushToListPage) {
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom/home/troubleshooting-workbench/fault-report`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parseUserInfo, systemInfo?.currentZone?.zoneId]);

    useEffect(() => {
        getRuleConfig();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFaultReportNew]);

    return (
        // <PageContainer
        // title={<span className="fault-report-add-header-title">{flagId ? '续报' : '首报'}</span>}
        // extra={
        //     <Button onClick={goBack} style={{ marginLeft: 20 }}>
        //         返回列表
        //     </Button>
        // }
        // >
        <div className="fault-report-add">
            <FormContainer
                setLoading={setLoading}
                flagId={flagId}
                hideListButton
                ref={ref}
                faultReportStatus={status}
                onFinish={goBack}
                source={faultReportDataSource?.source}
                setFaultReportDataSource={setFaultReportDataSource}
                dataSource={faultReportDataSource}
                standardAlarmId={faultReportDataSource?.standardAlarmId}
                sync={{ isSync, setIsSync }}
                setIsContinueReportView={setIsContinueReportView}
                isMajor={isMajor}
                btnKey={btnKey}
                isFaultReportNew={isFaultReportNew}
                ruleConfig={ruleConfig}
            />
            <div className="fault-report-add-back">
                <Space>
                    <Button type="ghost" onClick={goBack}>
                        取消
                    </Button>

                    <Button type="ghost" onClick={onReset}>
                        重置
                    </Button>

                    {status !== FAILURE_REPORT_STATUS.FINAL_REPORT && type !== '2' && !isMajor && btnKey !== 'faultReport:upload' ? (
                        <Button type="primary" onClick={onSave} loading={loading}>
                            保存
                        </Button>
                    ) : null}

                    <Button type="primary" onClick={onSubmit} loading={loading}>
                        提交
                    </Button>

                    {isContinueReportView ? (
                        <div>
                            <Checkbox checked={!!isSync} onChange={(e) => setIsSync(e.target.checked ? 1 : 0)} />
                            <span className="fault-report-modal-sync">同步至网络故障集中存档</span>
                        </div>
                    ) : null}
                </Space>
            </div>
        </div>
        // </PageContainer>
    );
};

export default FaultReportAdd;
