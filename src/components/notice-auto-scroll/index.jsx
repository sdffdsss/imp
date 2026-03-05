import React, { useEffect, useRef } from 'react';
import GlobalMessage from '@Src/common/global-message';
import './index.less';

let scrollTimer = {};

const AutoScroll = (props) => {
    const { children, delay, speed = 30, id = 'motiorTimeLine' } = props;
    let scrollDiv = useRef();

    // 监听滚动
    const onDivScroll = (event) => {
        if (event.target) {
            const { clientHeight } = event.target;
            const { scrollHeight } = event.target;
            const { scrollTop } = event.target;
            const isBottom = clientHeight + clientHeight + scrollTop >= scrollHeight - 10;
            if (isBottom) {
                scrollDiv.current.scrollTop = 0;
            }
        }
    };
    const onScrollDivOver = () => {
        if (scrollDiv.current) {
            clearTimeout(scrollTimer[id]);
        }
    };

    // 触发滚动
    const getDivScroll = () => {
        clearTimeout(scrollTimer[id]);
        if (scrollDiv.current) {
            scrollDiv.current.scrollTop += 1;
        }
        scrollTimer[id] = setTimeout(() => {
            getDivScroll();
        }, speed);
    };

    const onScrollDivOut = () => {
        if (scrollDiv.current) {
            getDivScroll();
        }
    };

    useEffect(() => {
        function fn({ isActive }) {
            if (isActive) {
                setTimeout(() => {
                    getDivScroll();
                }, 500);
            } else {
                clearTimeout(scrollTimer[id]);
            }
        }
        GlobalMessage.on('activeChanged', fn);

        return () => {
            GlobalMessage.off('activeChanged', fn, null);
        };
    }, []);

    useEffect(() => {
        const dom = scrollDiv.current;

        dom.addEventListener('scroll', onDivScroll);

        return () => {
            dom.removeEventListener('scroll', onDivScroll);
        };
    }, []);

    useEffect(() => {
        if (children) {
            setTimeout(() => {
                getDivScroll();
            }, delay || 500);
        }
        return () => {
            clearTimeout(scrollTimer[id]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div
            className="notcie-auto-scroll"
            id={id}
            ref={scrollDiv}
            onMouseEnter={() => {
                onScrollDivOver();
            }}
            onMouseLeave={() => {
                onScrollDivOut();
            }}
        >
            {React.Children.map(children, (child) => {
                return React.cloneElement(child);
            })}
            <div style={{ height: '300px' }} />
        </div>
    );
};

export default AutoScroll;
