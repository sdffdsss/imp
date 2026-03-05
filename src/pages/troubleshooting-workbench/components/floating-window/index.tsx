import React from 'react';
import { Tooltip } from 'oss-ui';
import constants from '@Common/constants';
import './index.less';

enum StrLength {
    SYSTEMCONTENTLENGTH = 14 * 20 * 2, // 字符串长度 = 字体大小 * 一行字数 * 行数
    NECONTENTLENGTH = 14 * 22 * 2,
    REUSECONTENTLENGTH = 14 * 21 * 2,
}
interface FloatingWindowInfoType {
    systemInfo: string;
    NEInfo: string;
    reuse: string;
    top?: number;
    left?: number;
}
interface Iprops {
    onClick: () => void;
    floatingWindowInfo?: FloatingWindowInfoType;
}

const FloatingWindow: React.FC<Iprops> = (props) => {
    const { onClick, floatingWindowInfo = { systemInfo: '--', NEInfo: '--', reuse: '--' } } = props;

    const str1 = floatingWindowInfo.systemInfo;
    // 这是测字数的，勿删
    // const str1 = '测试传输系统名称展示测试传输系统名称展示测试传输系统名称展示测试传输系统名称展使啊';
    const str2 = floatingWindowInfo.NEInfo;
    const str3 = floatingWindowInfo.reuse;

    const getTextWidth = (text: string, font: number) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = `${font}px 思源黑体`;
            return context.measureText(text).width;
        }
        return 0;
    };
    return (
        <div className="floating-window-container" style={{ top: floatingWindowInfo.top - 200, left: floatingWindowInfo.left - 260 }}>
            <img
                src={`${constants.IMAGE_PATH}/group-workbench/close.png`}
                className="close-image-button"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
                alt=""
            />
            <div className="floating-window-system">
                <div className="floating-window-system-label">传输系统名称：</div>
                <div className="floating-window-system-content overflow-content">
                    {getTextWidth(str1, 14) > StrLength.SYSTEMCONTENTLENGTH ? <Tooltip title={str1}>{str1}</Tooltip> : str1}
                </div>
            </div>
            <div className="floating-window-NE">
                <div className="floating-window-NE-label">网元名称：</div>
                <div className="floating-window-NE-content overflow-content">
                    {getTextWidth(str2, 14) > StrLength.NECONTENTLENGTH ? <Tooltip title={str2}>{str2}</Tooltip> : str2}
                </div>
            </div>
            <div className="floating-window-reuse">
                <div className="floating-window-reuse-label">复用段名称：</div>
                <div className="floating-window-reuse-content overflow-content">
                    {getTextWidth(str3, 14) > StrLength.REUSECONTENTLENGTH ? <Tooltip title={str3}>{str3}</Tooltip> : str3}
                </div>
            </div>
        </div>
    );
};
export default FloatingWindow;
