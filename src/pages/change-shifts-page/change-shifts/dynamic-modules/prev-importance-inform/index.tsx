import React, { Fragment } from 'react';
import CommonWrapper from '../../components/common-wrapper';
import PreMessage from '../components/pre-message';
import './index.less';

export default function Index({ title, schedulingObj, moduleId }) {
    const arr =
        schedulingObj?.lastImportanceInforms && schedulingObj?.lastImportanceInforms.length > 0
            ? schedulingObj?.lastImportanceInforms
            : [
                  {
                      userName: '',
                      content: '无',
                  },
              ];

    return (
        <CommonWrapper title={title} moduleId={moduleId}>
            <div className="text-show-wrapper">
                {arr.map((item, index) => {
                    return (
                        <Fragment key={index}>
                            <PreMessage label={item.userName} content={item.content} />
                            {schedulingObj?.lastImportanceInforms && index < schedulingObj?.lastImportanceInforms.length - 1 && (
                                <div style={{ height: '10px' }} />
                            )}
                        </Fragment>
                    );
                })}
            </div>
        </CommonWrapper>
    );
}
