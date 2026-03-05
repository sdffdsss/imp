import React from 'react';
import './index.less';

const TreeCube = ({ monitorGroupName, monitorGroupPersonnelNum, onclick }) => {
    return (
        <div className="tree-cube" onClick={() => onclick()}>
            <div className="tree-cube-name">{monitorGroupName}</div>
            <div>
                <span className="tree-cube-num">{monitorGroupPersonnelNum}</span>
                <span className="tree-cube-font">&nbsp;人</span>
            </div>
        </div>
    );
};
export default TreeCube;
