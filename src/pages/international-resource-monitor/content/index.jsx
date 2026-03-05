import React, { Component, createRef } from 'react';
import DescriptionList from './description-list';
import Title from './components/title';
import AlarmList from './alarm-list';
import { TabButtonEnum, TabButtonHistoryEnum } from '../type';
import './index.less';

import GlobalStateContext from '../context';

export default class Index extends Component {
    static contextType = GlobalStateContext;
    AlarmListRef = createRef();
    LeftBoxRef = createRef();
    LineRef = createRef();

    constructor(props) {
        super(props);
        this.state = {
            selectedFaultDesc: undefined,
            selectedRows: [],
            moveType: false,
            clickRelateIconFlag: false,
        };
    }

    componentDidMount() {
        const LineDOM = this.LineRef.current;
        LineDOM?.addEventListener('mousedown', this.startResize);
    }
    handleSelectDescChange = (data) => {
        this.setState({ selectedFaultDesc: data });
    };

    handleRelatedAlarmClick = (isRelate) => {
        this.setState({ selectedRows: [], clickRelateIconFlag: isRelate });
        // this.AlarmListRef.current?.switchShowRowSelectColumn(isRelate);
    };

    handleSelectRowsChange = (param) => {
        if (typeof param === 'function') {
            this.setState(param);
        } else {
            this.setState({ selectedRows: param });
        }
    };

    // 鼠标按下开始拖动
    startResize = (e) => {
        e.preventDefault();
        const { leftCardWidth, setLeftCardWidth } = this.props;

        const resize = (e2) => {
            this.setState({
                moveType: true,
            });
            const moveDistance = e2.clientX - e.clientX; // 位移的距离
            const newWidth = leftCardWidth + moveDistance; // 新的宽度
            // 限制宽度要大于200px
            if (newWidth > 200) {
                setLeftCardWidth(newWidth);
            }
        };

        const stopResize = () => {
            this.setState({
                moveType: false,
            });
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        };

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    };

    render() {
        const { leftCardWidth } = this.props;
        const { selectedRows, selectedFaultDesc, moveType, clickRelateIconFlag } = this.state;

        const { mode } = this.context;

        const TitleInlineStyle = { marginBottom: 12 };

        const title = () => {
            if (mode === TabButtonEnum.CABLE) {
                return '海缆故障说明';
            }
            if (mode === TabButtonEnum.LANDCABLE) {
                return '陆缆通道监控故障说明';
            }
            if (mode === TabButtonHistoryEnum.CABLEHISTORY) {
                return '海缆故障说明';
            }
            if (mode === TabButtonHistoryEnum.LANDCABLEHISTORY) {
                return '陆缆通道监控故障说明';
            }
            return '';
        };

        return (
            <div className="international-resource-monitor-wrapper">
                <div
                    className={`cable-fault-description-wrapper ${leftCardWidth === 0 ? 'cable-fault-description-wrapper-none' : ''} ${
                        moveType ? 'cable-fault-description-wrapper-drag' : ''
                    }`}
                    ref={this.LeftBoxRef}
                    style={{ width: leftCardWidth }}
                >
                    <div style={{ padding: '18px 0 0 16px', height: '100%' }}>
                        <Title text={title()} style={TitleInlineStyle} />
                        <DescriptionList
                            onSelectDescChange={this.handleSelectDescChange}
                            handleRelatedAlarmClick={this.handleRelatedAlarmClick}
                            selectedFaultDesc={selectedFaultDesc}
                            selectedRows={selectedRows}
                            onSelectRowsChange={this.handleSelectRowsChange}
                            context={this.context}
                        />
                    </div>
                </div>

                {/* 中间拖动 */}
                <div className="cable-segmentation-line" style={{ width: leftCardWidth === 0 ? '0' : '12px' }} ref={this.LineRef} />

                <div className="cable-alarms-wrapper">
                    <AlarmList
                        ref={this.AlarmListRef}
                        selectedFaultDesc={selectedFaultDesc}
                        onSelectDescChange={this.handleSelectDescChange}
                        onSelectRowsChange={this.handleSelectRowsChange}
                        selectedRows={selectedRows}
                        mode={mode}
                        clickRelateIconFlag={clickRelateIconFlag}
                    />
                </div>
            </div>
        );
    }
}
