import React, { FC } from 'react';
import { Empty } from 'oss-ui';
import constants from '@Common/constants';
import './index.less';

interface IEmptyProps {
    showImage?: boolean;
    description?: React.ReactNode;
}
const UnicomEmpty: FC<IEmptyProps> = ({ showImage = false, description = '没有满足条件的数据' }) => {
    return (
        <Empty
            image={showImage ? `${constants.IMAGE_PATH}/empty/empty.png` : ''}
            imageStyle={{ display: showImage ? 'block' : 'none' }}
            description={<div className="unicom-common-empty-desc-wrapper">{description}</div>}
        />
    );
};
export default UnicomEmpty;
