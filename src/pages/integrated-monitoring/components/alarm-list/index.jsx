import { Icon, Image } from 'oss-ui';
import React from 'react';
import './index.less';
import constants from '@Src/common/constants';

export class AlarmList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 1,
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                data: this.props.data,
            });
        }
    }
    toLeft = () => {
        let { page } = this.state;
        if (page === 1) {
            return;
        } else {
            this.setState({
                page: page - 1,
            });
        }
    };
    toRight = () => {
        let { page, data } = this.state;
        const maxPage = Math.ceil(data.length / 4);
        if (page === maxPage) {
            return;
        } else {
            this.setState({
                page: page + 1,
            });
        }
    };
    render() {
        const { data, page } = this.state;
        return (
            <div className="alarm-list">
                {data.length > 4 && (
                    <div
                        className="alarm-list-handle"
                        style={{
                            borderRadius: '4px 0px 0px 4px',
                            boxShadow: '4px 1px 9px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <Icon antdIcon type="LeftOutlined" onClick={() => this.toLeft()} />
                    </div>
                )}
                <div className="alarm-list-content">
                    {data.length === 1 &&
                        data.map((group) => (
                            <section key={group.groupCode} className="alarm-list-item alone">
                                <Image preview={false} src={constants.IMAGE_PATH + '/monitor/告警监控.png'} />
                                <div className="alarm-list-item-right">
                                    <section title={group.groupName} className="alarm-list-item-title">
                                        {group.groupName}
                                    </section>
                                    <section style={{ fontWeight: 700 }}>{group.alarmCount}</section>
                                </div>
                            </section>
                        ))}
                    {data.length > 1 &&
                        data.slice((page - 1) * 4, page * 4).map((group) => (
                            <section key={group.groupCode} className="alarm-list-item">
                                <Image preview={false} src={constants.IMAGE_PATH + '/monitor/告警监控.png'} />
                                <div className="alarm-list-item-right">
                                    <section title={group.groupName} className="alarm-list-item-title">
                                        {group.groupName}
                                    </section>
                                    <section style={{ fontWeight: 700 }}>{group.alarmCount}</section>
                                </div>
                            </section>
                        ))}
                </div>
                {data.length > 4 && (
                    <div
                        className="alarm-list-handle"
                        style={{
                            borderRadius: '0px 4px 4px 0px',
                            boxShadow: '-4px 1px 9px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <Icon antdIcon type="RightOutlined" onClick={() => this.toRight()} />
                    </div>
                )}
            </div>
        );
    }
}
