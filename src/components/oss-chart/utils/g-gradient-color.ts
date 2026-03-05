export interface colorStopsItem {
    offset: number;
    color: string;
}

export interface gradientColorCfg {
    type: string;
    colorStops: colorStopsItem[];
    angle: number;
    x: number;
    y: number;
    r: number;
}

/**
 * gradientColor
 * @param {object} cfg
 * ex:
 *  - 线性渐变色
 *    {
 *      type:"linear",
 *      colorStops:[
 *          {offset:0,color:'red'},
 *          ...
 *      ]
 *    }
 *  - 径向渐变
 *    {
 *      type:"radial",
 *      x:0.5,
 *      y:0.5,
 *      r:0.8,
 *      colorStops:[
 *          {offset:0,color:'red'},
 *          ...
 *      ]
 *    }
 */
const gradientColor = (cfg: gradientColorCfg): string => {
    const { type, angle = 0, colorStops, x = 0.5, y = 0.5, r = 0.8 } = cfg || {};

    let colorStopsStr = '';
    if (Array.isArray(colorStops) && colorStops.length > 0) {
        colorStops.forEach((c) => {
            colorStopsStr += `${c.offset}:${c.color} `;
        });
    }

    if (colorStopsStr.length > 0) {
        let color = '';
        switch (type) {
            case 'linear':
                color = angle !== undefined ? `l(${angle}) ${colorStopsStr}` : '';
                break;
            case 'radial':
                color = [x, y, r].every((d) => d !== undefined) ? `r(${x},${y},${r}) ${colorStopsStr}` : '';
                break;
            default:
            // nothing
        }

        return color;
    }

    return '';
};

export default gradientColor;
