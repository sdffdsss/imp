import React, { PureComponent } from 'react';

import constants from '../../common/constants';
import './index.less';

export default class FlayAway extends PureComponent {
    render() {
        return (
            <div className="flay-away-box">
                <div className="page-content">
                    <div className="flay-away-icon">
                        <img alt="" src={`${constants.IMAGE_PATH}/flyaway.png`} />
                    </div>
                    <div className="flay-away-text">啊哦，页面飞走了...</div>
                </div>
            </div>
        );
    }
}
