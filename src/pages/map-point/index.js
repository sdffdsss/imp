/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState, useRef } from 'react';
import { Map, InfoWindow, MapvglView, MapvglLayer, Circle, Polyline } from 'react-bmapgl';
import { Checkbox } from 'oss-ui';
import { AimOutlined } from '@ant-design/icons';
import constants from '@Common/constants';
import { queryEquipment, getRbiEnums } from './api';
import { _ } from 'oss-web-toolkits';
import classNames from 'classnames';
import './index.less';

const checkList = [
    { id: 1, name: '市电断电', url: `${constants.MAP_PATH}/市电断电.png` },
    { id: 2, name: '大面积断站', url: `${constants.MAP_PATH}/大面积断站.png` },
    { id: 4, name: '网元', url: `${constants.MAP_PATH}/网元.png` },
    { id: 6, name: '故障网元', url: `${constants.MAP_PATH}/故障网元.png` },
    {
        id: 3,
        name: '处理人',
        url: `${constants.MAP_PATH}/处理人打点.png`,
        url2: `${constants.MAP_PATH}/处理人.png`,
    },
    { id: 7, name: '故障网元2', url: `${constants.MAP_PATH}/故障网元打点.png` },
];

const dataList = {
    '-1': { data: [], show: true },
    1: { data: [], show: true },
    2: { data: [], show: true },
    3: { data: [], show: true },
    4: { data: [], show: true },
    5: { data: [], show: true },
    6: { data: [], show: true },
    7: { data: [], show: true },
    8: { data: [], show: true },
    9: { data: [], show: true },
    10: { data: [], show: true },
    11: { data: [], show: true },
    12: { data: [], show: true },
    13: { data: [], show: true },
    14: { data: [], show: true },
    15: { data: [], show: true },
    16: { data: [], show: true },
    17: { data: [], show: true },
    18: { data: [], show: true },
    19: { data: [], show: true },
    20: { data: [], show: true },
    21: { data: [], show: true },
    22: { data: [], show: true },
    23: { data: [], show: true },
};
let centerDatas = {};

const MapPoint = (props) => {
    const { sheetInfo } = props;
    const { provinceId, regionId, sheetNo } = sheetInfo;
    const mapRef = useRef(null);
    const [data, setData] = useState(dataList);
    const [mapCenter, handleMapCenter] = useState({
        lng: 118.7878785,
        lat: 32.0504375,
    });
    const [infoWindowPosition, handleInfoWindowPosition] = useState([]);
    const [infoWindowText, handleInfoWindowText] = useState({
        title: '暂无',
        info: '暂无',
    });
    const [visible, handleVisible] = useState(false);
    const [boxStatus, handleBoxStatus] = useState(true);
    const [lineVisible, handleLineVisible] = useState(true);
    const [centerData, handleCenterData] = useState({});
    const [circleVisible, handleCircleVisible] = useState(false);

    const [rbiEnum, setRbiEnum] = useState([]);
    // const [newDataList, setNewDataList] = useState({});

    const getData = (type) => {
        const res = [];
        data[type].show &&
            data[type].data.forEach((item) => {
                res.push({
                    geometry: {
                        type: 'Point',
                        coordinates: item.coordinates,
                    },
                    properties: {
                        text: item.text,
                    },
                });
            });
        return res;
    };

    const legendChange = (type) => {
        const res = _.cloneDeep(data);
        res[type].show = !res[type].show;
        if (type === 20) {
            if (res[20].show) {
                handleLineVisible(true);
            } else {
                handleLineVisible(false);
            }
            // res[5].show = !res[5].show;
        }
        setData(res);
    };

    const handleConbineData = (res, flag) => {
        const newData = _.cloneDeep(data);
        const newData2 = _.cloneDeep(data);
        const conbineData = res.dataObject.data;
        const userList = [];
        if (res.dataObject.fieldForceList && Array.isArray(res.dataObject.fieldForceList)) {
            res.dataObject.fieldForceList.forEach((item) => {
                userList.push({ ...item, type: 'user' });
            });
        }
        if (res.dataObject.centreEquipmentInfo && res.dataObject.centreEquipmentInfo.equipmentInfo) {
            const centerPoint = res.dataObject.centreEquipmentInfo.equipmentInfo;
            const centerInfos = {
                coordinates: [centerPoint.longitude, centerPoint.latitude, res.dataObject.centreEquipmentInfo],
                itemData: res.dataObject.centreEquipmentInfo,
            };
            newData2[6].data.push(centerInfos);
            newData[6].data.push(centerInfos);
        }
        if (res.dataObject.carList && Array.isArray(res.dataObject.carList)) {
            res.dataObject.carList.forEach((item) => {
                const centerInfos = {
                    coordinates: [item.equipmentInfo.longitude, item.equipmentInfo.latitude, item],
                    itemData: item,
                };
                newData2[23].data.push(centerInfos);
                newData[23].data.push(centerInfos);
            });
        }
        userList.forEach((item) => {
            const ln = item?.longitude;
            const la = item?.latitude;
            if (!res.dataObject?.centreEquipmentInfo?.equipmentInfo?.latitude) {
                return;
            }
            const distance = mapRef.current?.map.getDistance(
                {
                    lat: res.dataObject?.centreEquipmentInfo?.equipmentInfo?.latitude,
                    lng: res.dataObject?.centreEquipmentInfo?.equipmentInfo?.longitude,
                },
                {
                    lng: item?.longitude,
                    lat: item.latitude,
                },
            );
            console.log('起点', mapCenter);
            console.log('终点', {
                lng: item?.longitude,
                lat: item.latitude,
            });
            console.log('距离', distance, '米');
            if (item && ln && la) {
                newData[20].data.push({
                    coordinates: [ln, la, item],
                    itemData: item,
                    text: '距离       公里',
                });

                newData[5].data.push({
                    coordinates: [ln, la, item],
                    itemData: item,
                    text: (distance / 1000).toFixed(2),
                });
                newData2[20].data.push({
                    coordinates: [ln, la, item],
                    itemData: item,
                    text: '距离       公里',
                });

                newData2[5].data.push({
                    coordinates: [ln, la, item],
                    itemData: item,
                    text: (distance / 1000).toFixed(2),
                });
            }
        });
        if (!flag) {
            centerDatas = newData2;
            handleCenterData(newData2);
        }
        conbineData.forEach((item) => {
            const ln = item.equipmentInfo?.longitude;
            const la = item.equipmentInfo?.latitude;
            if (item?.alarmInfoList?.length) {
                let type = item?.alarmInfoList[0]?.alarmScenceType;
                if (type === '') {
                    type = 21;
                }
                newData[1].data.push({
                    coordinates: [ln, la, item],
                    itemData: item,
                });
            } else if (item?.equipmentInfo?.baseStationType && ln && la) {
                const source = {
                    0: 22,
                    67551101: 1,
                    67551102: 2,
                    67551103: 20,
                };
                newData[source[0]].data.push({
                    coordinates: [ln, la, item],
                    itemData: item,
                });
            }
        });
        if (flag) {
            newData[21] = centerDatas[21] || newData[21];
            newData[5] = centerDatas[5] || newData[5];
            newData[20] = centerDatas[20] || newData[20];
            for (let i in newData) {
                newData[i].show = true;
            }
            return setData(newData);
        }
        for (let i in newData) {
            newData[i].show = true;
        }
        setData(newData);
    };

    const getDefaultData = (radius) => {
        console.log(props);
        queryEquipment({
            query: {
                workNo: sheetNo,
                province: provinceId,
                region: regionId,
                radius,
            },
        }).then((res) => {
            if (
                res &&
                res.dataObject &&
                res.dataObject.data &&
                Array.isArray(res.dataObject.data) &&
                res.dataObject.centreEquipmentInfo &&
                res.dataObject.centreEquipmentInfo.equipmentInfo
            ) {
                handleCircleVisible(true);
                handleMapCenter({
                    lat: res.dataObject.centreEquipmentInfo.equipmentInfo.latitude,
                    lng: res.dataObject.centreEquipmentInfo.equipmentInfo.longitude,
                });
                handleConbineData(res, false);
            }
        });
    };

    useEffect(() => {
        getRbiEnums().then((res) => {
            if (res && res.data) {
                const tempList = res.data.map((el) => {
                    if (el.faultType === 20) {
                        const listItem = {
                            id: el.faultType,
                            name: el.faultTypeDesc,
                            url: `${constants.MAP_PATH}/处理人打点.png`,
                            url2: `${constants.MAP_PATH}/处理人.png`,
                        };
                        return listItem;
                    }
                    return { id: el.faultType, name: el.faultTypeDesc, url: `${constants.MAP_PATH}/${el.faultTypeDesc}.png` };
                });
                setRbiEnum(tempList);
                // setData(dataListTwo);
            }
        });
        if (sheetNo) {
            getDefaultData(0.5);
            getDefaultData();
        }
        if (mapRef.current) {
            const left = mapRef.current.map.getBounds().getNorthEast(); // 左下
            const right = mapRef.current.map.getBounds().getSouthWest(); // 右上
            const longitudeLeftTop = right.lng;
            const latitudeLeftTop = left.lat;
            const longitudeRightLower = left.lng;
            const latitudeRightLower = right.lat;
            handleVisible(false);

            queryEquipment({
                query: {
                    workNo: sheetNo,
                    province: provinceId,
                    region: regionId,
                    longitudeLeftTop,
                    latitudeLeftTop,
                    longitudeRightLower,
                    latitudeRightLower,
                },
            }).then((res) => {
                if (
                    res &&
                    res.dataObject &&
                    res.dataObject.data &&
                    Array.isArray(res.dataObject.data)
                    // res.dataObject.centreEquipmentInfo &&
                    // res.dataObject.centreEquipmentInfo.equipmentInfo
                ) {
                    handleConbineData(res, true);
                }
            });
        }
    }, [sheetNo, mapRef.current]);

    const handlePoint = (e) => {
        const left = mapRef.current.map.getBounds().getNorthEast(); // 左下
        const right = mapRef.current.map.getBounds().getSouthWest(); // 右上
        const longitudeLeftTop = right.lng;
        const latitudeLeftTop = left.lat;
        const longitudeRightLower = left.lng;
        const latitudeRightLower = right.lat;
        handleVisible(false);
        if (e.currentTarget.getZoom && e.currentTarget.getZoom() < 15) {
            setData(dataList);
            return;
        }
        console.log(props);
        queryEquipment({
            query: {
                workNo: sheetNo,
                province: provinceId,
                region: regionId,
                longitudeLeftTop,
                latitudeLeftTop,
                longitudeRightLower,
                latitudeRightLower,
            },
        }).then((res) => {
            if (
                res &&
                res.dataObject &&
                res.dataObject.data &&
                Array.isArray(res.dataObject.data)
                // res.dataObject.centreEquipmentInfo &&
                // res.dataObject.centreEquipmentInfo.equipmentInfo
            ) {
                handleConbineData(res, true);
            }
        });
    };

    useEffect(() => {
        if (mapRef.current && sheetNo) {
            mapRef.current.map.addEventListener('zoomend', (e) => {
                handlePoint(e);
            });
            mapRef.current.map.addEventListener('dragend', (e) => {
                handlePoint(e);
            });
        }
        return () => {
            if (mapRef?.current?.map) {
                mapRef.current.map.removeEventListener('zoomend');
                mapRef.current.map.removeEventListener('dragend');
            }
            // window.BMapGL = null;
        };
    }, [sheetNo]); // 依赖工单，缩放拖动回调

    const handleInfoWindow = (e) => {
        if (e.dataIndex < 0) {
            return;
        }
        handleVisible(false);
        handleInfoWindowText({
            title: '暂无',
            info: '暂无',
        });
        handleInfoWindowPosition([]);
        setTimeout(() => {
            if (e.dataItem && e.dataItem.geometry) {
                if (e.dataItem.geometry.coordinates[2]?.alarmInfoList && Array.isArray(e.dataItem.geometry.coordinates[2]?.alarmInfoList)) {
                    const errorList = e.dataItem.geometry.coordinates[2]?.alarmInfoList;
                    handleVisible(true);
                    handleInfoWindowText({
                        title: e.dataItem.geometry.coordinates[2]?.equipmentInfo?.equipmentName,
                        info: errorList.map((item) => item.alarmTitle).join(','),
                    });
                    handleInfoWindowPosition(e.dataItem.geometry.coordinates);
                } else {
                    const source = {
                        0: '网元',
                        67551101: 'A级',
                        67551102: 'B级',
                        67551103: 'C级',
                    };
                    handleVisible(true);
                    handleInfoWindowText({
                        name: e.dataItem.geometry.coordinates[2]?.equipmentInfo?.equipmentName,
                        cover: e.dataItem.geometry.coordinates[2]?.equipmentInfo?.coverArea,
                        type: source[e.dataItem.geometry.coordinates[2]?.equipmentInfo?.baseStationType],
                    });
                    handleInfoWindowPosition(e.dataItem.geometry.coordinates);
                }
            } else {
                handleVisible(false);
                handleInfoWindowText({
                    title: '暂无',
                    info: '暂无',
                });
                handleInfoWindowPosition([]);
            }
        }, 0);
    };

    const handleTaggleClick = () => {
        handleBoxStatus(!boxStatus);
    };
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Map
                center={mapCenter}
                style={{ height: '100%' }}
                zoom="18"
                ref={mapRef}
                enableScrollWheelZoom
                displayOptions={{
                    poiIcon: false,
                }}
            >
                <MapvglView>
                    {rbiEnum.map((el) => {
                        return (
                            <MapvglLayer
                                type="IconLayer"
                                data={getData(el.id * 1)}
                                options={{
                                    enablePicked: true,
                                    icon: `${constants.MAP_PATH}/${el.name}打点.png`,
                                    width: 30,
                                    height: 30,
                                    onClick: (e) => {
                                        handleInfoWindow(e);
                                    },
                                }}
                            />
                        );
                    })}

                    {data[20].data.map(() => {
                        return (
                            <MapvglLayer
                                type="TextLayer"
                                data={getData(20)}
                                options={{
                                    fontFamily: 'Microsoft Yahei',
                                    color: 'black',
                                    offset: [18, 0],
                                    fontSize: 12,
                                }}
                            />
                        );
                    })}
                    {lineVisible &&
                        data[20].data.map((item) => {
                            return (
                                <Polyline
                                    path={[mapCenter, { lng: item.coordinates[0], lat: item.coordinates[1] }]}
                                    strokeColor="#FFC200"
                                    strokeWeight={2}
                                />
                            );
                        })}
                </MapvglView>
                {infoWindowPosition.length && (
                    <InfoWindow
                        enableMassClear={true}
                        position={{
                            lng: infoWindowPosition[0],
                            lat: infoWindowPosition[1],
                        }}
                        onClose={() => {
                            handleInfoWindowPosition([]);
                            handleVisible(false);
                        }}
                        onClickclose={() => {
                            handleInfoWindowPosition([]);
                            handleVisible(false);
                        }}
                        height={infoWindowText?.type ? 120 : 90}
                        width={280}
                        // text={infoWindowText}
                        title={null}
                    >
                        <div className="pop-div">
                            {infoWindowText?.title && <p title={infoWindowText?.title}>工单标题:{infoWindowText?.title}</p>}
                            {infoWindowText?.info && <p title={infoWindowText?.info}>故障描述:{infoWindowText?.info}</p>}
                            {infoWindowText?.name && <p title={infoWindowText?.name}>名称:{infoWindowText?.name}</p>}
                            {(infoWindowText?.cover || infoWindowText?.cover === '') && (
                                <p title={infoWindowText?.cover}>覆盖类型:{infoWindowText?.cover}</p>
                            )}
                            {infoWindowText?.type && <p title={infoWindowText?.type}>基站类型:{infoWindowText?.type}</p>}
                        </div>
                    </InfoWindow>
                )}
                {circleVisible && (
                    <Circle
                        center={mapCenter}
                        radius={250}
                        strokeOpacity={0}
                        strokeWeight={1}
                        strokeColor="#36AFF4"
                        fillColor="#36AFF4"
                        fillOpacity={0.3}
                    />
                )}
            </Map>
            <div className={classNames('check-box-container', boxStatus ? '' : 'hide')}>
                <div
                    className="taggle"
                    onClick={() => {
                        handleTaggleClick();
                    }}
                >
                    {boxStatus ? '<' : '>'}
                </div>
                <div className="check-box-container-box">
                    {rbiEnum.map((item) => {
                        return (
                            <Checkbox
                                defaultChecked
                                checked={data[item.id]?.show}
                                className="check-box-container-box-checkBox"
                                onChange={() => legendChange(item.id)}
                            >
                                <img style={{ width: 20, height: 20 }} src={item.id === 20 ? item.url2 : item.url} alt="img" />
                                <span className="checkBox-box-name">{item.name}</span>
                            </Checkbox>
                        );
                    })}
                </div>
            </div>
            <AimOutlined
                style={{
                    position: 'absolute',
                    top: '50px',
                    left: '50px',
                    zIndex: 10,
                    fontSize: '26px',
                    color: '#1890ff',
                }}
                onClick={() => {
                    mapRef.current.map.flyTo(mapCenter, 17);
                }}
            />
        </div>
    );
};

export default MapPoint;
