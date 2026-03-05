import React from 'react';
import PreMessage from '../components/pre-message';
import CommonWrapper from '../../components/common-wrapper';
import './index.less';

export default function Index({ title, schedulingObj, moduleId }) {
    return (
        <CommonWrapper title={title} moduleId={moduleId}>
            <div className="text-show-wrapper">
                <PreMessage label={schedulingObj?.lastRemainingProblems?.userName} content={schedulingObj?.lastRemainingProblems?.content} />
            </div>
        </CommonWrapper>
    );
}
