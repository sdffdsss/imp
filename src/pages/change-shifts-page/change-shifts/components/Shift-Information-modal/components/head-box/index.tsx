import React, { FC } from 'react';
import './style.less';

interface Props {
  title?: string;
  color?: string;
  width?: number;
}

const HeadBox: FC<Props> = (props) => {
  const {title, color,width, children } = props;
  return (
    <div className="head-box">
      <header style={{borderLeftColor: color}}>{title}</header>
      
      <div className="head-content">
        <div style={{width}}>
        {children}
        </div>
       </div>
    </div>
  )
};

export default HeadBox;