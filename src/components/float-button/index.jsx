import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { Button, Icon } from 'oss-ui';
import QueueAnim from 'rc-queue-anim';
import PropTypes from 'prop-types';
import './index.less';

const FloatButton = (props) => {
    const { style, buttonList = [], iconType } = props;
    const [visible, setVisible] = useState(false);
    const [bounds, setBounds] = useState(null);
    const floatRef = useRef();
    const onMouseEnterHandle = () => {
        setVisible(true);
    };

    const onMouseLeaveHandle = () => {
        setVisible(false);
    };

    const onWidgetsItemClickHandle = (type) => {
        props.onWidgetsItemClickHandle && props.onWidgetsItemClickHandle(type);
    };

    useEffect(() => {
        if (floatRef && floatRef.current) {
            setBounds({
                left: -window.innerWidth + floatRef.current.offsetHeight,
                right: 0,
                top: -window.innerHeight / 2,
                bottom: window.innerHeight / 2 - floatRef.current.offsetHeight,
            });
        }

        return () => {};
    }, []);

    return (
        <>
            <Draggable bounds={bounds}>
                <div
                    ref={floatRef}
                    className="float-button"
                    style={{
                        ...style,
                    }}
                    onMouseEnter={onMouseEnterHandle}
                    onMouseLeave={onMouseLeaveHandle}
                >
                    <div className="float-action">
                        <Icon type={iconType} className="float-icon" />
                    </div>
                    <QueueAnim type={['right', 'left']} ease={['easeOutQuart', 'easeInOutQuart']} className="queue-anim-container">
                        {visible && [
                            buttonList.map((item) => {
                                return (
                                    <Button
                                        key={item.value}
                                        className="float-menu-item"
                                        block
                                        onClick={onWidgetsItemClickHandle.bind(this, item.value)}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            }),
                        ]}
                    </QueueAnim>
                </div>
            </Draggable>
        </>
    );
};

FloatButton.propTypes = {
    buttonList: PropTypes.array,
    iconType: PropTypes.string,
};
FloatButton.defaultProps = {
    iconType: 'iconlayout-fill',
};
export default FloatButton;
