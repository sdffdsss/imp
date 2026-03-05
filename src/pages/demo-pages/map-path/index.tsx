import React, { useEffect, useState } from 'react';
import { BMapApiLoader } from '@Src/components/bmap-gl/ApiLoader';
import BMapGis, { MAP_MODE } from '@Pages/troubleshooting-workbench/components/bmap';

const BMapGisDemo = () => {
    const [selProfessional, setSelProfessional] = useState({});

    useEffect(() => {
        setTimeout(() => {
            setSelProfessional({});
        }, 2000);
    }, []);

    return (
        <>
            <BMapApiLoader>
                <section style={{ width: '100vw', height: '50vh' }}>
                    <BMapGis mapMode={MAP_MODE.FAULT} areaId="china" lightFlag selProfessional={selProfessional} enableHeatmap enableLinemap />
                </section>
            </BMapApiLoader>
            <BMapApiLoader>
                <section style={{ width: '100vw', height: '50vh' }}>
                    <BMapGis
                        id="kkk"
                        mapMode={MAP_MODE.FAULT}
                        areaId="china"
                        lightFlag
                        selProfessional={selProfessional}
                        enableHeatmap
                        enableLinemap
                    />
                </section>
            </BMapApiLoader>
        </>
    );
};
export default BMapGisDemo;
