import React from 'react';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import CUOWU from '../change-shifts/img/cuowu.png';
import ZWSJ from '../change-shifts/img/zwsj.png';
import CHAOSHI from '../change-shifts/img/chaoshi.png';
import { SuccessionModal } from './modals';
import constants from '@Common/constants';
import './index.less';

const imgMap = {
    1: CUOWU,
    2: ZWSJ,
    3: CHAOSHI,
};

class AbnormalPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            countdown: 5,
        };
    }

    componentDidMount() {
        // 6-交班成功页面，7-接班成功页面
        if (this.props.location?.state?.type === '6' || this.props.location?.state?.type === '7') {
            this.startCountdown();
        }
    }

    startCountdown = () => {
        let num = 5;
        const timer = setInterval(() => {
            num--;
            this.setState({
                countdown: num,
            });
            if (num === 0) {
                clearInterval(timer);
                this.props.history.push({ pathname: `/znjk/${constants.CUR_ENVIRONMENT}/unicom/change-shifts-page` });
            }
        }, 1000);
    };

    render() {
        const { countdown } = this.state;

        let imgType;
        let message;

        switch (this.props.location?.state?.type) {
            case 4:
                imgType = 1;
                message = `对不起，您当前不是当班人，无法编辑当班工作。`;
                break;

            case 5:
                imgType = 3;
                message = `对不起，当班人还未交班，请稍后。`;
                break;

            case '6':
                imgType = 1;
                message = `恭喜您交班成功!(${countdown}秒)`;
                break;

            case '7':
                imgType = 1;
                message = `恭喜您接班成功!(${countdown}秒)`;
                break;

            default:
                imgType = 1;
                message = this.props.location?.state?.message;
                break;
        }

        return (
            <div className="change-shifts-page-continer">
                <div>
                    <img src={imgMap[imgType]} alt="" className="change-shifts-page-img" />
                </div>
                <div>
                    <span className="change-shifts-page-word">{message}</span>
                    {this.props.location?.state?.type === '9' && <SuccessionModal />}
                </div>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(AbnormalPage);
