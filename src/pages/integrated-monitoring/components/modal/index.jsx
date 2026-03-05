import React, { useEffect, useState } from 'react';
import { getInitialProvince } from '@Common/utils/getInitialProvince';
import useLoginInfoModel from '@Src/hox';
import { Modal } from 'oss-ui';
import './index.less';
import DetailContentBox from './components/detail-content-box';
import NavBar from './components/NavBar';
import api from '../../api';

const HomeUnicom = (props) => {
    const [tabList, setTabList] = useState([]);
    const [area, setArea] = useState({});
    const login = useLoginInfoModel();
    const { userInfo, zoneLevelFlags } = login;
    const { operations } = JSON.parse(userInfo);
    const [currentPro, setCurrentPro] = useState();

    const init = async () => {
        const result = await api.getWorkbenchGroupData(getInitialProvince(login));
        const resArea = await api.getProvinceArea(getInitialProvince(login));
        setArea(resArea);
        if (result.length === 0) return;
        setTabList(result);
        if (zoneLevelFlags.isCountryZone) {
            setCurrentPro(0);
        } else if (zoneLevelFlags.isRegionZone) {
            setCurrentPro(login.provinceId * 1);
        } else {
            setCurrentPro(result[0].provinceId);
        }
    };
    const computedHeight = () => {
        let height = '';
        if (zoneLevelFlags.isCountryZone) {
            height = '730px';
        } else if (zoneLevelFlags.isRegionZone) {
            height = '580px';
        } else {
            height = '520px';
        }
        return height;
    };
    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // TODO 集团账号进 显示南北方大区三栏 currentZone.zoneLevel
    // TODO 大区显示下挂省份
    // TODO 省份直接显示监控中心
    return (
        <Modal
            className="monitoring-detail"
            title="监控中心详情"
            width={1220}
            visible={props.visible}
            footer={null}
            onCancel={props.closeModal}
            centered
            destroyOnClose
        >
            <div className="monitoring-detail-content" style={{ height: computedHeight() }}>
                {/* 集团账号进 */}
                {zoneLevelFlags.isCountryZone ? (
                    <>
                        <NavBar dataSourse={area.southernProvince} orientation="南方省" currentPro={currentPro} onChange={setCurrentPro} />
                        <NavBar dataSourse={area.northernProvince} orientation="北方省" currentPro={currentPro} onChange={setCurrentPro} />
                        <NavBar dataSourse={area.districtOrGroup} orientation="集团/大区" currentPro={currentPro} onChange={setCurrentPro} />
                    </>
                ) : null}
                {/* 大区账号进 */}
                {zoneLevelFlags.isRegionZone ? (
                    <NavBar dataSourse={area.provinces} orientation="省份" currentPro={currentPro} onChange={setCurrentPro} />
                ) : null}
                {tabList.find((item) => item.provinceId === currentPro)
                    ? tabList
                          .find((item) => item.provinceId === currentPro)
                          .monitorCenterList.map((items) => {
                              const { monitorCenterName, monitorCenterId, monitorGroupList, dispatchGroupList, monitorCenterPersonnelNum } = items;
                              return (
                                  <DetailContentBox
                                      key={monitorCenterId}
                                      monitorCenterName={monitorCenterName}
                                      monitorGroupList={monitorGroupList}
                                      dispatchGroupList={dispatchGroupList}
                                      monitorCenterPersonnelNum={monitorCenterPersonnelNum}
                                      monitorCenterId={monitorCenterId}
                                      operations={operations}
                                      provinceId={currentPro}
                                      closeModal={props.closeModal}
                                  />
                              );
                          })
                    : null}
            </div>
        </Modal>
    );
};

export default HomeUnicom;
