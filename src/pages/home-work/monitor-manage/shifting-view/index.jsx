import React from 'react';
import './index.less';

export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            colunms: [
                {
                    key: 1,
                    title: '重点告警数'
                },
                {
                    key: 2,
                    title: '待受理工单数'
                },
                {
                    key: 3,
                    title: '待确认工单数'
                },
                {
                    key: 4,
                    title: '超时工单数'
                }
            ]
        };
    }
    render() {
        const { colunms } = this.state;
        const { dataSheetList } = this.props;
        return (
            <section className="shifting-view-container">
                <section className="data-list-container">
                    <section className="data-header data-item">
                        <section></section>
                        {colunms.map((column) => {
                            return <section key={column.key}>{column.title}</section>;
                        })}
                    </section>
                    {dataSheetList.map((item) => {
                        return (
                            <section className="data-body data-item">
                                <section>{item.title}</section>
                                {item.data.map((prop, index) => {
                                    if (index === 0) {
                                        return (
                                            <section className="specail-section">
                                                <span>{prop.name}</span>
                                                <span>
                                                    <span className="left-num">{prop.onDuty}</span>|<span className="right-num">{prop.realTime}</span>
                                                </span>
                                            </section>
                                        );
                                    }
                                    return (
                                        <section>
                                            <span className="left-num">{prop.onDuty}</span>|<span className="right-num">{prop.realTime}</span>
                                        </section>
                                    );
                                })}
                            </section>
                        );
                    })}
                </section>
            </section>
        );
    }
}
