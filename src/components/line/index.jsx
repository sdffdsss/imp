/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-classes-per-file */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

const defaultAnchor = { x: 0.5, y: 0.5 };
const defaultLineColor = '#ddd';
const defaultLineStyle = 'solid';
const defaultLineWidth = 2;

const optionalStyleProps = {
    lineColor: PropTypes.string,
    lineStyle: PropTypes.string,
    lineWidth: PropTypes.number,
    className: PropTypes.string,
    zIndex: PropTypes.number,
};

const parseAnchorPercent = (value) => {
    const percent = parseFloat(value) / 100;
    if (isNaN(percent) || !isFinite(percent)) {
        throw new Error(`LinkTo could not parse percent value "${value}"`);
    }
    return percent;
};

const parseAnchorText = (value) => {
    switch (value) {
        case 'top':
            return { y: 0 };
        case 'left':
            return { x: 0 };
        case 'middle':
            return { y: 0.5 };
        case 'center':
            return { x: 0.5 };
        case 'bottom':
            return { y: 1 };
        case 'right':
            return { x: 1 };
        default:
            return null;
    }
};

const parseAnchor = (value) => {
    if (!value) {
        return defaultAnchor;
    }
    const parts = value.split(' ');
    if (parts.length > 2) {
        throw new Error('LinkTo anchor format is "<x> <y>"');
    }
    const [x, y] = parts;
    return {
        ...defaultAnchor,
        ...(x ? parseAnchorText(x) || { x: parseAnchorPercent(x) } : {}),
        ...(y ? parseAnchorText(y) || { y: parseAnchorPercent(y) } : {}),
    };
};

const findElement = (selector) => {
    return document.querySelector(selector);
};

export default class LogicLine extends React.Component {
    static propTypes = {
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        within: PropTypes.string,
        fromAnchor: PropTypes.string,
        toAnchor: PropTypes.string,
        ...optionalStyleProps,
    };

    componentDidMount() {
        this.setState({
            fromAnchor: parseAnchor(this.props.fromAnchor),
            toAnchor: parseAnchor(this.props.toAnchor),
        });
    }

    componentWillUnmount() {}

    detect() {
        const { from, to, within = '' } = this.props;

        const elementFrom = findElement(from);
        const elementTo = findElement(to);

        if (!elementFrom || !elementTo || !this.state) {
            return false;
        }

        // TODO:计算锚点位置
        const anchorFrom = this.state.fromAnchor;
        const anchorTo = this.state.toAnchor;

        const boxFrom = elementFrom.getBoundingClientRect();
        const boxTo = elementTo.getBoundingClientRect();

        // 是否有滚动条导致偏移
        let offsetX = window.pageXOffset;
        let offsetY = window.pageYOffset;

        if (within) {
            const p = findElement(within);
            const boxp = p.getBoundingClientRect();

            offsetX -= boxp.left + (window.pageXOffset || document.documentElement.scrollLeft);
            offsetY -= boxp.top + (window.pageYOffset || document.documentElement.scrollTop);
        }

        const x0 = boxFrom.left + boxFrom.width * anchorFrom.x + offsetX;
        const x1 = boxTo.left + boxTo.width * anchorTo.x + offsetX;
        const y0 = boxFrom.top + boxFrom.height * anchorFrom.y + offsetY;
        const y1 = boxTo.top + boxTo.height * anchorTo.y + offsetY;

        return { x0, y0, x1, y1 };
    }

    render() {
        const points = this.detect();
        return points ? <Line {...points} {...this.props} /> : null;
    }
}

export class RightAngleLogicLine extends LogicLine {
    render() {
        const points = this.detect();
        return points ? <RightAngleLine {...points} {...this.props} /> : null;
    }
}

export class Line extends PureComponent {
    static propTypes = {
        x0: PropTypes.number.isRequired,
        y0: PropTypes.number.isRequired,
        x1: PropTypes.number.isRequired,
        y1: PropTypes.number.isRequired,
        ...optionalStyleProps,
    };

    componentDidMount() {
        this.within?.appendChild(this.el);
    }

    componentWillUnmount() {
        this.within?.removeChild(this.el);
    }

    render() {
        const { x0, y0, x1, y1, within = '' } = this.props;

        this.within = within ? findElement(within) : document.body;

        const dy = y1 - y0;
        const dx = x1 - x0;

        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const length = Math.sqrt(dx * dx + dy * dy);

        const positionStyle = {
            position: 'absolute',
            top: `${y0}px`,
            left: `${x0}px`,
            width: `${length}px`,
            zIndex: Number.isFinite(this.props.zIndex) ? String(this.props.zIndex) : '1',
            transform: `rotate(${angle}deg)`,
            // Rotate around (x0, y0)
            transformOrigin: '0 0',
        };

        const defaultStyle = {
            borderTopColor: this.props.lineColor || defaultLineColor,
            borderTopStyle: this.props.lineStyle || defaultLineStyle,
            borderTopWidth: this.props.lineWidth || defaultLineWidth,
        };

        const props = {
            className: this.props.className,
            style: { ...defaultStyle, ...positionStyle },
        };

        return (
            <div>
                <div
                    ref={(el) => {
                        this.el = el;
                    }}
                    {...props}
                />
            </div>
        );
    }
}

export class RightAngleLine extends PureComponent {
    static propTypes = {
        x0: PropTypes.number.isRequired,
        y0: PropTypes.number.isRequired,
        x1: PropTypes.number.isRequired,
        y1: PropTypes.number.isRequired,
        orientation: PropTypes.oneOf(['h', 'v']),
        ...optionalStyleProps,
    };

    render() {
        if (this.props.orientation === 'h') {
            return this.renderHorizontal();
        }
        return this.renderVertical();
    }

    renderVertical() {
        const { x0, y0, x1, y1 } = this.props;

        const dx = x1 - x0;
        if (dx === 0) {
            return <Line {...this.props} />;
        }

        const lineWidth = this.props.lineWidth || defaultLineWidth;
        const y2 = (y0 + y1) / 2;

        const xOffset = dx > 0 ? lineWidth : 0;
        const minX = Math.min(x0, x1) - xOffset;
        const maxX = Math.max(x0, x1);

        return (
            <div>
                <Line {...this.props} x0={x0} y0={y0} x1={x0} y1={y2} />
                <Line {...this.props} x0={x1} y0={y1} x1={x1} y1={y2} />
                <Line {...this.props} x0={minX} y0={y2} x1={maxX} y1={y2} />
            </div>
        );
    }

    renderHorizontal() {
        const { x0, y0, x1, y1 } = this.props;

        const dy = y1 - y0;
        if (dy === 0) {
            return <Line {...this.props} />;
        }

        const lineWidth = this.props.lineWidth || defaultLineWidth;
        const x2 = (x0 + x1) / 2;

        const yOffset = dy < 0 ? lineWidth : 0;
        const minY = Math.min(y0, y1) - yOffset;
        const maxY = Math.max(y0, y1);

        return (
            <div>
                <Line {...this.props} x0={x0} y0={y0} x1={x2} y1={y0} />
                <Line {...this.props} x0={x1} y0={y1} x1={x2} y1={y1} />
                <Line {...this.props} x0={x2} y0={minY} x1={x2} y1={maxY} />
            </div>
        );
    }
}
