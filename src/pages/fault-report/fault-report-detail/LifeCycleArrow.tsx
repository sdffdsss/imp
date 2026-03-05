import React from 'react';
import blueFirstArrow from './img/first-arrow.png';
import selectFirstArrow from './img/firstBlueArrow.png';
import blueArrow from './img/other-arrow.png';
import selectArrow from './img/selected-arrow.png';
import greyArrow from './img/grey-arrow.png';
import firstGreyArrow from './img/first-grey-arrow.png';

interface Iprops {
    title: string;
    time: string;
    index: number;
    name?: string;
    continueType: string;
    reportLevel: string;
    onClick: (title: string, continueType: string, reportLevel: string, time: string) => void;
    theme?: string;
}
const LifeCycleArrow: React.FC<Iprops> = (props) => {
    const { title, time, index, onClick, name, continueType, reportLevel, theme } = props;
    const { pathname } = window.location;
    const isFaultReport = pathname.split('/').includes('fault-report') || pathname.split('/').includes('fault-report-wireless');
    console.log('是否故障：', isFaultReport);
    const searchParams = window.location.search;
    const urlParams = new URLSearchParams(searchParams);
    const windowTheme = urlParams.get('windowTheme'); // 是否为嵌入的故障上报

    const firstArrow = isFaultReport || windowTheme === 'white' || theme === 'white' ? firstGreyArrow : blueFirstArrow;
    const otherArrow = isFaultReport || windowTheme === 'white' || theme === 'white' ? greyArrow : blueArrow;
    const [arrow, setArrow] = React.useState<string>(otherArrow);
    const [firstArrowImg, setFirstArrowImg] = React.useState<string>(firstArrow);

    return (
        <div
            className="life-cycle-arrow"
            onMouseEnter={() => {
                setArrow(selectArrow);
                setFirstArrowImg(selectFirstArrow);
            }}
            onMouseLeave={() => {
                setArrow(otherArrow);
                setFirstArrowImg(firstArrow);
            }}
            onClick={() => onClick(title, continueType, reportLevel, time)}
        >
            <img src={index === 0 ? firstArrowImg : arrow} alt="arrow" />
            <div className="arrow-info">
                <div className="arrow-title">{title}</div>
                <div className="arrow-content">
                    {name ? (
                        <div className="arrow-name" title={name}>
                            {name}
                        </div>
                    ) : null}
                    <div className="arrow-time">{time}</div>
                </div>
            </div>
        </div>
    );
};
export default LifeCycleArrow;
