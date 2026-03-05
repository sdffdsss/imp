import React, { PureComponent } from 'react';
import { Descriptions, Spin, Tabs } from 'oss-ui';
import { alarmTextShow, alarmReadyTextShow } from '../../common/alarm-show-config';
import ReactJson from 'react-json-view';
import { _ } from 'oss-web-toolkits';

export default class Default extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            recordsDetail: [],
            alarmTextLoading: true,
        };
    }

    componentDidMount() {
        const { record } = this.props;
        console.log(this.props);
        this.setState({
            recordsDetail: record,
            alarmTextLoading: false,
        });
        // if (extendEventMap?.getRecordsDetail) {
        //     extendEventMap.getRecordsDetail(textTarget, (res) => {
        //         if (res && res.length && res[0]) {
        //             this.setState({
        //                 alarmTextLoading: false,
        //                 recordsDetail: Object.values(res[0]),
        //             });
        //         } else {
        //             message.error('获取数据失败');
        //             this.setState({
        //                 alarmTextLoading: false,
        //                 recordsDetail: {},
        //             });
        //         }
        //     });
        //     return;
        // }
        // request(null, {
        //     fullUrl: `${useEnvironmentModel.data.environment.viewItemUrl?.direct}/flow/alarm-detail`,
        //     type: 'post',
        //     showSuccessMessage: false,
        //     showErrorMessage: true,
        //     defaultErrorMessage: '获取数据失败',
        //     data: {
        //         alarmIdList: record.map((item) => item.alarm_id),
        //         sessionId: '',
        //     },
        // })
        //     .then((result) => {

        //     })
        //     .catch(() => {
        //         this.setState({
        //             recordsDetail: [],
        //             alarmTextLoading: false,
        //         });
        //     });
    }

    formatterText = (text, fieldName) => {
        const isJSON_test = (str) => {
            if (typeof str == 'string') {
                try {
                    const obj = JSON.parse(str);
                    return true;
                } catch (e) {
                    return false;
                }
            } else {
                return false;
            }
        };
        if (fieldName === 'alarm_text') {
            if (isJSON_test(text) && _.isObject(JSON.parse(text))) {
                return (
                    <div style={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto' }}>
                        <ReactJson
                            style={{ backgroundColor: 'transparent' }}
                            theme={'grayscale:inverted'}
                            displayObjectSize={false}
                            displayDataTypes={false}
                            name={false}
                            src={JSON.parse(text)}
                        />
                    </div>
                );
            } else {
                return (
                    <div style={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto' }}>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>
                    </div>
                );
            }
        }
        if (fieldName === 'preprocess_result') {
            let message = `${text}`;
            const epx = /(?:https?|ftp):\/\/([^\s"'>]+)/g;
            const url = message.match(epx);
            let link = null;
            if (Array.isArray(url)) {
                link = (
                    <a href="javascript:;" onClick={() => window.open(url[0])}>
                        {url[0]}
                    </a>
                );
                message = message.replace(url[0], '');
            }

            return (
                <div style={{ maxHeight: 'calc(100vh - 450px)', overflowY: 'auto' }}>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                        {message}
                        {link || ''}
                    </pre>
                </div>
            );
        }
        return text;
    };

    render() {
        const { recordsDetail, alarmTextLoading } = this.state;
        const { TabPane } = Tabs;
        console.log(alarmReadyTextShow);
        console.log(alarmTextShow);
        return (
            <Tabs>
                {this.props.hideAlarm ? null : (
                    <TabPane tab="告警信息" key="2">
                        <Spin spinning={alarmTextLoading}>
                            <Descriptions bordered>
                                {alarmTextShow.map((field) => (
                                    <Descriptions.Item label={field.label} span={field.span} labelStyle={{ minWidth: '115px' }} key={field.fieldName}>
                                        {this.formatterText(
                                            recordsDetail[0]
                                                ? recordsDetail[0][field.fieldName]?.lable || recordsDetail[0][field.fieldName]?.value
                                                : '-',
                                            field.fieldName,
                                        )}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        </Spin>
                    </TabPane>
                )}
                <TabPane tab="预处理信息" key="1">
                    <Descriptions bordered>
                        {alarmReadyTextShow.map((field) => (
                            <Descriptions.Item
                                style={{ width: 200 }}
                                label={field.label}
                                span={field.span}
                                labelStyle={{ minWidth: '115px' }}
                                key={field.fieldName}
                            >
                                {this.formatterText(
                                    _.find(recordsDetail[0], { field: field.fieldName })?.lable ||
                                        _.find(recordsDetail[0], { field: field.fieldName })?.value ||
                                        '-',
                                    field.fieldName,
                                )}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </TabPane>
            </Tabs>
        );
    }
}
