import React from 'react';
import NavCard from '../NavCard';
import './index.less';

const NavBar = (props) => {
    const { dataSourse, orientation, currentPro, onChange } = props;
    return (
        <div className="monitoring-detail-content-nav-box">
            <div className="monitoring-detail-content-nav-box-title">{orientation}：</div>
            <div className="monitoring-detail-content-nav-box-bar">
                {dataSourse
                    ? dataSourse.map((item) => {
                          return (
                              <NavCard
                                  key={item.provinceId}
                                  id={item.provinceId}
                                  name={item.provinceName}
                                  num={item.monitorCenterNum}
                                  currentPro={currentPro}
                                  setCurrentPro={onChange}
                              />
                          );
                      })
                    : null}
            </div>
        </div>
    );
};
export default NavBar;
