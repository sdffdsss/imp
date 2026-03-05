import React from 'react';
import PageContainer from '@Src/components/page-container';
import { withModel } from 'hox';
import useLoginInfoModel from '@Src/hox';
import EditContent from './edit-content';
import ViewContent from './view-content';
import { Icon, Popover } from 'oss-ui';
import { InterruptExplain } from './interrupt-explain';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modelType: this.props.match.params.type
        };
    }

    render() {
        const { modelType } = this.state;
        const title = { new: '新建', edit: '编辑', view: '查看' };
        return (
            <PageContainer
                gridContentStyle={{ height: `calc(100% - 51px)` }}
                title={
                    <div className="volume-title">
                        <span className="volume-form-box"></span>
                        <span>{title[`${modelType}`]}</span>
                        {modelType === 'view' &&
                            <Popover
                                content={<InterruptExplain />}
                            >
                                <span style={{ margin: '0 5px 0 10px', fontWeight: 'normal' }}>
                                    监测说明
                                </span>
                                <Icon antdIcon type="QuestionCircleOutlined" />
                            </Popover>
                        }
                    </div>
                }
            >
                {modelType === 'view' ? <ViewContent /> : <EditContent />}
            </PageContainer>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login
}))(Index);
