import React from 'react';
import { Col, Row, Timeline, Card } from 'oss-ui';
import './index.less';
import moment from 'moment';
import { _ } from 'oss-web-toolkits';

const InfoItem = (props) => {
    return (
        <div className="preprocess-info-item">
            <div>
                <span>第{props.step_id}步</span>
                <span>{props.step_name}</span>
            </div>
            <div>
                执行时间：
                <span>{moment(props.execut_time).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
            <div>
                返回结果：
                <div dangerouslySetInnerHTML={{ __html: props.result_info }} />
            </div>
        </div>
    );
};
const FormSection = ({ title, children }) => {
    return (
        <>
            <div className="share-subscription-form-title-line">
                <span>{title}</span>
            </div>
            {children}
        </>
    );
};

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        // const WyName = this.getJsonObjectKey(props.infoLocation, 'eNodeB名称');
        // const cellId = this.getJsonObjectKey(props.infoLocation, '本地小区标识');
        this.state = {
            // info: [
            //     {
            //         step: 1,
            //         title: '获取告警正文中的基站名称和小区标识信息',
            //         content: `获取告警正文中的基站名称和小区标识信息，得到结果为:{["${WyName}"; "${cellId}"]}`,
            //     },
            //     {
            //         step: 2,
            //         title: '连接网元',
            //         content: `根据网元名称:${WyName}`,
            //     },
            //     {
            //         step: 3,
            //         title: '登陆网元下发指令:LST ALMAF',
            //         content: `登陆网元下发指令:LST ALMAF`,
            //     },
            //     {
            //         step: 4,
            //         title: '获取指令结果中的告警名称',
            //         content: `获取指令结果中的告警名称，得到结果为:{["X2接口故障告警"]; ["射频单元直流掉电告警"]; ["射频单元直流掉电告警"]; ["射频单元直流掉电告警"]; ["小区不可用告警"]; ["小区不可用告警"]; ["射频单元维护链路异常告警"]; ["射频单元维护链路异常告警"]; ["小区不可用告警"]; ["射频单元维护链路异常告警"]; ["小区不可用告警"]; ["小区不可用告警"]; ["小区不可用告警"]; ["射频单元维护链路异常告警"]; ["射频单元维护链路异常告警"]; ["射频单元维护链路异常告警"]; ["BBU"]; ["BBU"]; ["BBU"]}。 `,
            //     },
            //     {
            //         step: 5,
            //         title: '查询关联表中关联告警信息',
            //         content: `查询关联表中关联告警信息，得到结果为:[["ORIG_ALARM_FP0":1053933092; "ORIG_ALARM_FP1":2022272753; "ORIG_ALARM_FP2":318892036; "ORIG_ALARM_FP3":454415292]; ["ORIG_ALARM_FP0":3610117415; "ORIG_ALARM_FP1":3076980772; "ORIG_ALARM_FP2":1103256955; "ORIG_ALARM_FP3":3175530429]]`,
            //     },
            //     {
            //         step: 6,
            //         title: '查询告警表中告警信息',
            //         content: `查询告警表中告警信息，得到结果为:[["ORIG_ALARM_FP0":1053933092; "ORIG_ALARM_FP1":2022272753; "ORIG_ALARM_FP2":318892036&sbquo; "ORIG_ALARM_FP3":454415292]; ["ORIG_ALARM_FP0":3610117415; "ORIG_ALARM_FP1":3076980772; "ORIG_ALARM_FP2":1103256955; "ORIG_ALARM_FP3":3175530429]]`,
            //     },
            //     {
            //         step: 7,
            //         title: '输出结果',
            //         content: `
            //         【关联告警】用“LST ALMAF”指令查看基站当前告警，确认包含,射频单元直流掉电告警。
            //         【原因预判】初步判断为RRU掉电导致。
            //         【处理建议】请维护人员现场核实处理。
            //         `,
            //     },
            // ],
        };
    }

    // getJsonObjectKey(jsonObj, key) {
    //     var arrObj = jsonObj.split(',');
    //     for (var i = 0; i < arrObj.length; i++) {
    //         var v = arrObj[i];
    //         var index = v.indexOf('=');
    //         var Objkey = v.substring(0, index).trim();
    //         var Objvalue = v.substring(index + 1).trim();
    //         if (key === Objkey) {
    //             return Objvalue;
    //             // break;
    //         }
    //     }
    //     return '';
    // }

    render() {
        // const { info } = this.state;
        const { infoLocation } = this.props;
        return (
            <Card className="filter-show-content">
                <Row>
                    <Col span={12}>
                        <div style={{ margin: '0 30px' }}>
                            <FormSection title="预处理结果">
                                <Timeline style={{ height: '300px' }}>
                                    {!_.isEmpty(infoLocation) ? (
                                        infoLocation.map((item, index) => {
                                            return (
                                                <Timeline.Item>
                                                    {item.step_name}
                                                    <div style={{ margin: '10px 0' }}></div>
                                                </Timeline.Item>
                                            );
                                        })
                                    ) : (
                                        <div></div>
                                    )}
                                    {/* <Timeline.Item>
                                        获取告警正文中的基站名称和小区标识信息
                                        <div style={{ margin: '10px 0' }}></div>
                                    </Timeline.Item>
                                    <Timeline.Item>
                                        连接网元
                                        <div style={{ margin: '10px 0' }}></div>
                                    </Timeline.Item>
                                    <Timeline.Item>
                                        登陆网元下发指令：LST ALMAF
                                        <div style={{ margin: '10px 0' }}></div>
                                    </Timeline.Item>
                                    <Timeline.Item>
                                        获取指令结果中的告警名称
                                        <div style={{ margin: '10px 0' }}></div>
                                    </Timeline.Item>
                                    <Timeline.Item>
                                        查询关联表中关联告警信息
                                        <div style={{ margin: '10px 0' }}></div>
                                    </Timeline.Item>
                                    <Timeline.Item>
                                        查询告警表中告警信息
                                        <div style={{ margin: '10px 0' }}></div>
                                    </Timeline.Item>
                                    <Timeline.Item>
                                        输出结果
                                        <div style={{ margin: '10px 0' }}></div>
                                    </Timeline.Item> */}
                                </Timeline>
                            </FormSection>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{ margin: '0 30px' }}>
                            <FormSection title="日志详情">
                                <div style={{ overflowY: 'auto', height: '320px' }}>
                                    {!_.isEmpty(infoLocation) ? (
                                        infoLocation.map((item) => {
                                            return <InfoItem {...item}></InfoItem>;
                                        })
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </FormSection>
                        </div>
                    </Col>
                </Row>
            </Card>
        );
    }
}
