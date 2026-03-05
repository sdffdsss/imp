const encodeSvg = function (svgStr: string) {
    const s = encodeURIComponent(svgStr);
    return `"data:image/svg+xml,${s}"`;
};

export default encodeSvg;
