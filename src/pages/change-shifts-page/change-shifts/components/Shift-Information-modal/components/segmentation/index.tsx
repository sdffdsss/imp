import React, { FC } from 'react';
import constants from '@Src/common/constants';
import './style.less';

const Segmentation: FC = () => {
  return (
    <div className='segmentation-box'>
      <div className='segmentation-line'/>
      <div className='segmentation-icon'>
        <img src={`${constants.IMAGE_PATH}/change-shifts/person.png`} alt="sound" />
      </div>
    </div>
  )
};

export default Segmentation;