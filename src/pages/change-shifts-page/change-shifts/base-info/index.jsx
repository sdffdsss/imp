import React from 'react';
import { Row, Col, Select } from 'oss-ui';
import { ReactComponent as WindowSvg1 } from '../img/u62.svg';
import './index.less';

export default function Index(props) {
    const { groupIdValue, schedulingObj, onGroupChange, groupDisabled } = props;
    const { workShiftUsersName = '', nextWorkShiftUsersName = '', workBeginTime = '', workEndTime = '' } = schedulingObj || {};

    return (
        <div className="base-info-continer">
            <Row>
                <Col span={6} className="base-info-continer-title">
                    班组
                </Col>
                <Col span={2} className="base-info-continer-middle">
                    <WindowSvg1 />
                </Col>
                <Col span={16}>
                    <Select
                        disabled={groupDisabled}
                        value={groupIdValue}
                        style={{ width: '160px' }}
                        options={schedulingObj?.groupList?.map((item) => {
                            return {
                                label: item.groupName,
                                value: String(item.groupId),
                            };
                        })}
                        showSearch
                        optionFilterProp="label"
                        onChange={onGroupChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={6} className="base-info-continer-title">
                    本班次人员
                </Col>
                <Col span={2} className="base-info-continer-middle">
                    <WindowSvg1 />
                </Col>
                <Col span={16} className="base-info-continer-card">
                    {workShiftUsersName &&
                        workShiftUsersName.map((item) => {
                            return <div className="base-info-continer-card-mod1">{item}</div>;
                        })}
                </Col>
            </Row>
            <Row>
                <Col span={6} className="base-info-continer-title">
                    下班次人员
                </Col>
                <Col span={2} className="base-info-continer-middle">
                    <WindowSvg1 />
                </Col>
                <Col span={16} className="base-info-continer-card">
                    {nextWorkShiftUsersName &&
                        nextWorkShiftUsersName.map((item) => {
                            return <div className="base-info-continer-card-mod2">{item}</div>;
                        })}
                </Col>
            </Row>
            <Row>
                <Col span={6} className="base-info-continer-title">
                    班次时间
                </Col>
                <Col span={2} className="base-info-continer-middle">
                    <WindowSvg1 />
                </Col>
                <Col span={16} className="base-info-continer-time">
                    {workBeginTime}-{workEndTime}
                </Col>
            </Row>
        </div>
    );
}
