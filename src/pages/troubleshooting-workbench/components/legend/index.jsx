import React, { useEffect, useState } from 'react';
import { Image } from 'oss-ui';
import constants from '@Src/common/constants';
import useLoginInfoModel from '@Src/hox';
import { getLineDataApi } from '../bmap/api';
import './index.less';

const Legend = (props) => {
    const { isCountry, provinceId, cardsDockedLeft } = props;
    const [data, setData] = useState({});
    const { zoneLevelFlags, currentZone } = useLoginInfoModel();
    const list = [
        {
            name: isCountry ? '在网省份' : '在网地市',
            url: `${constants.IMAGE_PATH}/group-workbench/online.png`,
        },
        {
            name: isCountry ? '脱网省份' : '脱网地市',
            url: `${constants.IMAGE_PATH}/group-workbench/offline.png`,
        },
        {
            name: '正常链接',
            url: '',
        },
        {
            name: '链接中断',
            url: '',
        },
    ];
    let styleContent = {
        top: 215,
        left: 342,
        minHeight: 700,
    };
    const getLineFaultData = async () => {
        let curProvinceId;
        if (zoneLevelFlags.isCountryZone) {
            curProvinceId = provinceId === 'china' ? '0' : provinceId;
        } else {
            curProvinceId = provinceId === 'china' ? currentZone.zoneId : provinceId;
        }
        const params = {
            regionId: curProvinceId,
            mapLevel: isCountry ? 1 : 2,
        };
        const res = await getLineDataApi(params);
        setData(res);
    };
    useEffect(() => {
        if (isCountry) {
            getLineFaultData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCountry, provinceId]);
    return (
        <div className="workbench-legend-top-left" style={styleContent}>
            <div className="fault-legend">
                <div className="fault-legend-item" style={{ backgroundImage: `url(${constants.IMAGE_PATH}/group-workbench/city.png)` }}>
                    <span>{isCountry ? '脱网省份' : '脱网地市'}</span>
                    <span className="num">{isCountry ? data.offlineRegionCount : 0}</span>
                </div>
                <div className="fault-legend-item" style={{ backgroundImage: `url(${constants.IMAGE_PATH}/group-workbench/fault.png)` }}>
                    <span>线路故障</span>
                    <span className="num">{isCountry ? data.lineFaultCount : 0}</span>
                </div>
            </div>
            <div className="legend-content" style={{ left: cardsDockedLeft ? 150 : 0 }}>
                <div className="legend-tip">图例</div>
                {list.map((item, index) => {
                    return (
                        <div className="legend-item">
                            <span>{item.name}</span>
                            {item.url ? <Image src={item.url} preview={false} /> : <div className={index === 2 ? 'normalLine' : 'breakLine'} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default Legend;
