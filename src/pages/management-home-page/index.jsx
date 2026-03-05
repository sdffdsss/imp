import React from 'react';
import {} from 'oss-ui';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import './index.less';
import DutyCalendar from './duty-calendar';
import WorkRecord from './work-record';
import MyDuty from './my-duty';
import MenuEntry from './menu-entry';
import BasicInfo from './basic-info';
import { getShiftingOfDutyStatus } from './api';

class ManagementHomePage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isDuty: false,
            state: {},
        };
    }

    componentDidMount() {
        this.authorityJudge();
    }

    authorityJudge = async () => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const data = {
            userId,
            regionId: systemInfo.currentZone?.zoneId,
        };
        let result = await getShiftingOfDutyStatus(data);

        if (result.resultCode === '1') {
            this.setState({
                isDuty: true,
                state: { type: Number(result.resultCode), schedulingObj: result.resultObj },
            });
        } else {
            this.setState({
                isDuty: false,
                state: {},
            });
        }
    };

    render() {
        const { isDuty, state } = this.state;
        return (
            <div className="management-home-page">
                <div className="menu-entry">
                    <div className="base-info">
                        <BasicInfo />
                    </div>
                    <div className="menu-entry">
                        <MenuEntry />
                    </div>
                </div>
                <div className="menu-entry-other">
                    <div className="my-duty">
                        <MyDuty history={this.props.history} />
                    </div>
                    <div className="duty-calendar">
                        {!isDuty && <DutyCalendar />}
                        {isDuty && <WorkRecord state={state} />}
                    </div>
                </div>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(ManagementHomePage);
