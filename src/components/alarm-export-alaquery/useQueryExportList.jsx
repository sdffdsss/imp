import { useEffect, useState, useRef } from 'react';
import request from '../../common/api';
import configUrl from './config/url';
const { baseUrlRest, unicom_export_all_process } = configUrl;
const useQueryExportList = ({ userId, exportUrl = unicom_export_all_process, delay = 2000 }) => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reFresh, setReFresh] = useState(false);
    const timer = useRef();
    useEffect(() => {
        if (reFresh) {
            setLoading(true);
            clearInterval(timer.current);
            timer.current = setInterval(() => {
                request(exportUrl, {
                    type: 'post',
                    showSuccessMessage: false,
                    showErrorMessage: false,
                    data: {
                        userId,
                    },
                    baseUrlType: baseUrlRest,
                })
                    .then((res) => {
                        const { code, dataObject } = res;
                        if (`${code}` === '200' && dataObject) {
                            let { exportTypeName, exportTimeStr, progress, progressStr, total = '正在计算', fileSrc, status } = dataObject;
                            total = Object.is(total, null) ? '正在计算' : total;
                            if (progressStr === '100%' || progress === 100) {
                                clearInterval(timer.current);
                            }
                            setDataSource([
                                {
                                    type: exportTypeName,
                                    exportTime: exportTimeStr,
                                    progressNum: progress,
                                    progress: progressStr,
                                    count: total,
                                    fileSrc,
                                    status,
                                },
                            ]);
                        }
                        if (+code === 200 && dataObject === null) {
                            setDataSource([]);
                        }
                        // reFresh && setReFresh(false);
                        // loading && setLoading(false);
                    })
                    .finally(() => {
                        setReFresh(false);
                        setLoading(false);
                    });
            }, delay);
        }
        // const clear = () => {
        //     clearInterval(timer.current);
        // };
        // clearIntervalRef.current = clear;
    }, [reFresh, userId, exportUrl, delay]);

    return {
        dataSource,
        loading,
        clear: () => {
            clearInterval(timer.current);
        },
        setReFresh,
    };
};
export default useQueryExportList;
