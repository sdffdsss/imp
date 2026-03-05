// import React,{useEffect,useState}from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { Image } from 'oss-ui';
import ImgDetail from './img-detail';
import './style.less';
import { getSheetReturnDetail, downloadByEmos, downloadByEmosAnnex } from './api';
import { useEnvironmentModel } from '@Src/hox';
import classNames from 'classnames';
import IconBack from './img/u3340.svg';
import EmptyImg from './img/empty.svg';
// import GlobalMessage from "@Src/common/global-message";
import moment from 'moment';
// import img1 from './img/1.png';
// import img2 from './img/2.png';
// import img3 from './img/3.png';
interface SelectOptionJson {
    src: string;
    key: number;
}
interface InfoListJson {
    src: string;
    key: number;
    createPName: string;
    attId: string;
    createTime: string;
    attGroupKey: string;
    sheetCreateTime: string;
    createPCode: string;
    attOrigName: string;
    attSuffix: string;
}

interface NewInfoListJson {
    state: string;
    dataList: InfoListJson[];
}

// const infoList = [
//     {
//         createPName: '张三',
//         title: '回传信息',
//         contect: '光缆中的部分束管中断或单束管中的部分光纤中断，正在修复，预计还有2小时恢复',
//         time: '2022-04-19 19:23:43',
//         imgList: [
//             {
//                 src: img1,
//                 key: 1,
//             },
//             {
//                 src: img1,
//                 key: 2,
//             },
//         ],
//     },
//     {
//         createPName: '张三',
//         title: '回传信息',
//         contect: '容纤盘内光纤松动，光纤弹起在容纤盘边缘或盘上螺丝处被挤压，正在修复',
//         time: '2022-04-19 19:23:43',
//         imgList: [
//             {
//                 src: img2,
//                 key: 1,
//             },
//             {
//                 src: img2,
//                 key: 2,
//             },
//         ],
//     },
// ];
interface ViewProps {
    sheetNo: any;
}
let timer: NodeJS.Timeout;
const InfoBack = (props: ViewProps) => {
    const [imgDetailVisible, setImgDetailVisible] = useState(false);
    const [imgList, setImgList] = useState<SelectOptionJson[]>([]);
    const [infoList, setInfoList] = useState<NewInfoListJson[]>([]);
    const imgDataList: any = useRef({});
    const [imgData, setImgDataList] = useState<any>({});
    const [refreshTime, handleRefreshTime] = useState('');

    const closeModal = () => {
        setImgDetailVisible(false);
    };

    // 获取故障类型
    const getSheetReturnDetailData = async () => {
        const dataCode = {
            sheetNo: props.sheetNo,
        };
        const result = await getSheetReturnDetail(dataCode);

        if (result && result.data) {
            setInfoList(result?.data);
            // const newInfoList: InfoListJson[] = [];
            result.data.forEach(async (items) => {
                if (items.dataList) {
                    items.dataList.forEach(async (item) => {
                        const dataCodes = {
                            attId: item.attId,
                            watermark: '',
                            fileName: item.attOrigName,
                        };
                        const results = await downloadByEmos(dataCodes);
                        imgDataList.current = {
                            ...imgDataList.current,
                            [item.attId]: {
                                src: results && results.data ? useEnvironmentModel.data.environment.infoImgListUrl + results.data : '',
                                key: 1,
                            },
                        };
                        setImgDataList(imgDataList.current);
                    });
                }

                // newInfoList.push({
                //     ...item,
                //     imgList: [
                //         {
                //             src: results && results.data ? useEnvironmentModel.data.environment.failureSheetUrl.direct + results.data : '',
                //             key: 1,
                //         },
                //     ],
                // });
            });
        } else {
            setInfoList([]);
        }
    };

    const handleTimer = () => {
        if (props.sheetNo) {
            getSheetReturnDetailData();
        }
        timer = setTimeout(() => {
            handleRefreshTime(moment().format('YYYY-MM-DD HH:mm:ss'));
            handleTimer();
        }, 300000);
    };
    // const watchTabActiveChange = () => {
    //     GlobalMessage.off("activeChanged", null, null);
    //     GlobalMessage.on("activeChanged", ({ isActive }) => {
    //       if (!isActive) {
    //         clearTimeout(timer);
    //       }
    //     },null);
    // };
    useEffect(() => {
        handleRefreshTime(moment().format('YYYY-MM-DD HH:mm:ss'));
    }, []);
    useEffect(() => {
        // watchTabActiveChange()
        if (props.sheetNo) {
            handleTimer();
        }
        return () => {
            clearTimeout(timer);
        };
    }, [props.sheetNo]);

    const downloadAccessory = async (obj) => {
        const dataCodes = {
            attId: obj.attId,
            watermark: '',
            fileName: obj.attOrigName,
        };
        const res = await downloadByEmosAnnex(dataCodes);
        // type 为需要导出的文件类型，此处为xls表格类型
        const blob = new Blob([res]);
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL;
        // 创建下载链接
        const downloadHref = url.createObjectURL(blob);
        // 创建a标签并为其添加属性
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadHref;
        downloadLink.download = obj.attOrigName;
        // 触发点击事件执行下载
        downloadLink.click();
    };
    return (
        <div className="info-back-continer">
            <div className="progress-line-page-header oss-imp-alart-common-bg">
                <img src={IconBack} alt="" />
                <span className="title">信息回传</span>
                {refreshTime !== '' && <span className="refreshTime">{`${refreshTime}`}</span>}
            </div>
            {infoList.length ? (
                <div className="info-back-card">
                    {infoList.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={classNames(
                                    'info-back-module',
                                    'oss-imp-alart-common-bg',
                                    index === 0 ? 'info-back-first-radius' : 'info-back-radius',
                                )}
                            >
                                <div className="info-back-titel">上传步骤：{item.state}</div>
                                {item.dataList &&
                                    item.dataList.map((items) => {
                                        return (
                                            <div key={items.attId} className="info-back-attachment">
                                                <div className="attachment-name">
                                                    {items.createPName} &nbsp;&nbsp;&nbsp; {items.createTime}
                                                </div>
                                                <div className="attachment-file">
                                                    附件：
                                                    <a
                                                        onClick={() => {
                                                            downloadAccessory(items);
                                                        }}
                                                    >
                                                        {items.attOrigName}
                                                    </a>
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        setImgDetailVisible(true);
                                                        setImgList([imgData[items.attId]]);
                                                    }}
                                                >
                                                    <Image
                                                        style={{ width: '100%', borderRadius: '10px' }}
                                                        preview={false}
                                                        src={imgData[items.attId]?.src}
                                                        // src={img3}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="info-back-card-empty">
                    <img src={EmptyImg} alt="" className="info-back-card-empty-img" />
                    <span className="info-back-card-empty-message">暂无信息回传</span>
                </div>
            )}

            <ImgDetail
                visible={imgDetailVisible}
                closeModal={() => {
                    closeModal();
                }}
                imgList={imgList}
            />
        </div>
    );
};
export default InfoBack;
