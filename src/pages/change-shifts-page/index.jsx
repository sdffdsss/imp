import React from 'react';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import shareActions from '@Src/share/actions';
import constants from '@Common/constants';
import GlobalMessage from '@Src/common/global-message';
import './index.less';
import api from './api';
import ChangeShifts from './change-shifts';

/**
 * resultCode
 * 0--有班组无交接班的人员
 * 1--当班待交班人员
 * 2--待接班人员
 * 3--交班完成人员
 * 9--没有班组的人员
 * 1001--该班组已经交班，但是该人员未交班打卡
 * 1002--该班组已经接班，但是该人员未接班打卡
 */
const hasAuthStatus = ['0', '1', '2', '1001', '1002'];
class BaseInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            changeShiftsVisible: false,
            result: {},
            changeShiftsComponentKey: Date.now(),
        };
        this.userIdCache = useLoginInfoModel.data.userId;
    }

    componentDidMount() {
        this.watchUserChangeFromOtherTab();
        this.authorityJudge();
    }
    // componentDidUpdate(prevProps) {
    //     if (prevProps.login.userInfo !== this.props.login.userInfo) {
    //         this.authorityJudge();
    //     }
    // }

    componentWillUnmount() {
        GlobalMessage.off('activeChanged', this.userChangeCallbackFromOtherTab);
    }

    authorityJudge = async () => {
        const {
            login: { userId, systemInfo },
        } = this.props;
        const data = {
            userId,
            regionId: systemInfo.currentZone?.zoneId,
        };
        const result = await api.getShiftingOfDutyStatus(data);
        if (hasAuthStatus.includes(result.resultCode)) {
            this.setState({
                result,
                changeShiftsVisible: true,
                changeShiftsComponentKey: Date.now(),
            });
        } else {
            this.props.history.push({
                pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/change-shifts-page/abnormal-page`,
                state: { type: '9', message: '对不起，您不是值班人员，无法交接班' },
            });
        }
    };

    handleSwitchUser = (userId) => {
        const { actions, messageTypes } = shareActions;

        actions?.postMessage?.(messageTypes.switchUser, {
            successorId: userId,
        });

        // setTimeout(() => {
        //     this.authorityJudge();
        // }, 1000);
    };

    /**
     * @description: 其他tab下微应用主动切换登录用户后
     */
    watchUserChangeFromOtherTab = () => {
        GlobalMessage.on('activeChanged', this.userChangeCallbackFromOtherTab);
    };

    userChangeCallbackFromOtherTab = ({ isActive }) => {
        console.log('值班记录页面的activeChanged事件 :>> ', 'isActive的值', isActive);
        const newUserId = useLoginInfoModel.data.userId;

        if (this.userIdCache !== newUserId && isActive) {
            setTimeout(() => {
                this.userIdCache = newUserId;

                this.authorityJudge();
            }, 1000);
        }
    };

    render() {
        const { result, changeShiftsVisible, changeShiftsComponentKey } = this.state;

        if (!changeShiftsVisible) {
            return null;
        }

        return (
            <ChangeShifts
                key={changeShiftsComponentKey}
                schedulingObj={result.resultObj}
                type={result.resultCode}
                history={this.props.history}
                handleSwitchUser={this.handleSwitchUser}
                reload={this.authorityJudge}
            />
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(BaseInfo);
