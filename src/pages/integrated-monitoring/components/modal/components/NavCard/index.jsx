import React from 'react';
import './index.less';

const NavCard = (props) => {
    const { name, id, num, currentPro, setCurrentPro } = props;
    return (
        <div
            className={`nav-box-card ${currentPro === id ? 'nav-box-card-sclected' : ''}`}
            onClick={() => {
                setCurrentPro(id);
            }}
        >
            <span className="nav-area-font">{name}</span>
            <span className="nav-area-num">{num}</span>
        </div>
    );
};
export default NavCard;
