import React, { Fragment } from 'react';
import { Button, Icon, Table } from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import './index.less';
import { findScheduleByUser } from '../api';
import shareActions from '@Src/share/actions';
import { logNew } from '@Common/api/service/log';
import { ReactComponent as WindowSvg1 } from '../img/u2498.svg';

class MyDuty extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
    }

    formRef = React.createRef();

    get columns() {
        return [
            {
                title: '序号',
                key: 'num',
                dataIndex: 'num',
                ellipsis: true,
                align: 'center',
                width: '40px',
            },
            {
                title: '班组名称',
                key: 'groupName',
                dataIndex: 'groupName',
                ellipsis: true,
                align: 'center',
            },
            {
                title: '值班时间',
                key: 'dateTime',
                dataIndex: 'dateTime',
                ellipsis: true,
                align: 'center',
                width: '80px',
            },
            {
                title: '班次',
                key: 'workShiftName',
                dataIndex: 'workShiftName',
                ellipsis: true,
                align: 'center',
                width: '80px',
            },
            {
                title: '操作',
                valueType: 'option',
                dataIndex: 'action',
                width: '50px',
                align: 'center',
                ellipsis: true,
                render: (text, row) => [
                    <Button onClick={this.jumpPage.bind(this, row)} type="text" style={{ padding: 0 }}>
                        {row.isDuty === 1 ? <Icon antdIcon key="edit" type="EditOutlined" /> : <Icon antdIcon key="edit" type="SearchOutlined" />}
                    </Button>,
                ],
            },
        ];
    }

    componentDidMount() {
        this.getTableData();
    }

    jumpPage = (row) => {
        const { actions, messageTypes } = shareActions;
        logNew(`值班管理我的值班`, '300052');
        if (row.isDuty === 1) {
            if (actions?.postMessage) {
                actions.postMessage(messageTypes.openRoute, {
                    entry: `/unicom/management-home-page/change-shifts-page`,
                });
            }
        } else {
            if (actions?.postMessage) {
                actions.postMessage(messageTypes.openRoute, {
                    entry: `/unicom/management-home-page/change-shifts-page/change-shifts`,
                    search: { type: 3, ...row, dateTime: row.dateTime },
                });
            }
        }
    };

    /**
     * @description: 获取列表数据
     * @param params
     * @return n*o
     */

    getTableData = async () => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const data = {
            operateUser: userId,
            regionId: systemInfo.currentZone?.zoneId,
        };

        const result = await findScheduleByUser(data);
        if (result?.rows) {
            this.setState({
                dataSource: result.rows,
            });
        }
    };

    render() {
        const { dataSource } = this.state;
        return (
            <Fragment>
                <div className="duty-title">
                    <WindowSvg1 />
                    <div style={{ marginLeft: '4px', fontSize: '16px' }}>我的值班</div>
                </div>
                <div className="duty-table">
                    <Table
                        size="small"
                        columns={this.columns}
                        formRef={this.formRef}
                        dataSource={dataSource}
                        // request={this.getTableData}
                        rowKey={(record) => record.num}
                        bordered={false}
                        dateFormatter="string"
                        pagination={false}
                    />
                </div>
            </Fragment>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(MyDuty);
