import React, { useEffect, useRef } from 'react';
import GlobalMessage from '@Src/common/global-message';
import './index.less';

let scrollTimer = {};

const AutoScroll = (props) => {
    const { children, delay, speed = 20, id = 'motiorTimeLine', begin = false } = props;
    let scrollDiv = useRef();

    // 监听滚动
    const onDivScroll = (event) => {
        const { clientHeight } = event.target;
        const { scrollHeight } = event.target;
        const { scrollTop } = event.target;
        const isBottom = clientHeight + scrollTop >= scrollHeight - 10;
        if (isBottom) {
            // scrollDiv.current.scrollTop = 0;
            clearTimeout(scrollTimer[id]);
        }
    };
    // const onScrollDivOver = () => {
    //     if (scrollDiv.current) {
    //         clearTimeout(scrollTimer[id]);
    //     }
    // };

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

    // const onScrollDivOut = () => {
    //     if (scrollDiv.current) {
    //         getDivScroll();
    //     }
    // };

    const watchTabActiveChange = () => {
        GlobalMessage.off('activeChanged', null, null);
        GlobalMessage.on('activeChanged', ({ isActive }) => {
            if (isActive) {
                setTimeout(() => {
                    getDivScroll();
                }, 500);
            } else {
                clearTimeout(scrollTimer[id]);
            }
        });
    };

    useEffect(() => {
        if (begin) {
            watchTabActiveChange();
            // scrollDiv.current = document.getElementById(id);
            scrollDiv.current.addEventListener('scroll', (e) => {
                onDivScroll(e);
            });
        } else {
            if (scrollDiv.current) {
                scrollDiv.current.scrollTop = 0;
            }
        }
    }, [begin]);
    useEffect(() => {
        if (children && begin) {
            setTimeout(() => {
                getDivScroll();
            }, delay || 500);
        } else {
            if (scrollDiv.current) {
                scrollDiv.current.scrollTop = 0;
            }
            clearTimeout(scrollTimer[id]);
        }
        return () => {
            clearTimeout(scrollTimer[id]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [begin]);
    return (
        <div
            className="notcie-auto-scroll"
            id={id}
            ref={scrollDiv}
            // onMouseEnter={() => {
            //     onScrollDivOver();
            // }}
            // onMouseLeave={() => {
            //     onScrollDivOut();
            // }}
        >
            {React.Children.map(children, (child) => {
                return React.cloneElement(child);
            })}
            <div style={{ height: '300px' }} />
        </div>
    );
};

export default AutoScroll;
