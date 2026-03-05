import React from 'react';

import { Button } from 'oss-ui';
import cancelImg from './asset/cancel.png';
const buttonLeft = {
    position: 'absolute',
    width: '60px',
    height: '30px',
    left: '28.66%',
    top: '83.33%',
    background: 'rgb(34, 128, 219)',
};

const buttonRight = {
    position: 'absolute',
    width: '60px',
    height: '30px',
    left: '174px',
    top: '250px',
    background: 'rgba(34, 128, 219, 0.31)',
};

const cancel = {
    position: 'absolute',
    width: '16px',
    height: '16px',
    left: '91.46%',
    top: '4%',
};
const Footer = (props) => {
    let { handleOk, handleCancel } = props;

    return (
        <div>
            <Button type="primary" style={buttonLeft} onClick={handleOk}>
                保存
            </Button>
            <Button type="primary" style={buttonRight} onClick={handleCancel}>
                取消
            </Button>
            <img src={cancelImg} style={cancel} onClick={handleCancel} alt=""></img>
        </div>
    );
};

export default Footer;
