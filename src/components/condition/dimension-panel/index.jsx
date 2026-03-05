/* eslint-disable consistent-return */
import React, { PureComponent } from 'react';
import { Collapse, Icon, Input } from 'oss-ui';
import AccordionItem from './accordion-item';
import { _ } from 'oss-web-toolkits';
import useLoginInfoModel from '@Src/hox';
import { withModel } from 'hox';
import './index.less';

class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            activeKey: []
        };
        this.onSearchCond = _.debounce(this.onSearchCond, 300);
    }

    componentDidMount() {
        this.setState({
            activeKey: this.props.accordionActiveKey
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.accordionActiveKey !== this.props.accordionActiveKey) {
            this.setState({
                activeKey: this.props.accordionActiveKey
            });
        }
    }

    onSearchCond = (e) => {
        const inputValue = e?.target?.value?.trim() || '';
        if (this.props.onSearch) {
            this.props.onSearch(inputValue);
        }
    };

    onCollapseChange = (activeKey) => {
        this.setState({
            activeKey
        });
    };

    getCollapseActiveHeight = (group) => {
        const { heightCustomSet } = this.props;
        const { activeKey } = this.state;

        if (!heightCustomSet) {
            return `calc(${100 / activeKey.length}%  - ${28 * (3 - activeKey.length)}px)`;
        }
        if (activeKey.length === 1) {
            return `calc(${100}%  - ${28 * 2}px)`;
        }

        if (activeKey.length === 2) {
            if (group.groupType === '1') {
                return `calc(${(100 / 3) * 2}%  - ${14}px)`;
            }
            if (!activeKey.includes('1')) {
                return `calc(${100 / 2}%  - ${14}px)`;
            }
            return `calc(${100 / 3}%  - ${14}px)`;
        }

        if (activeKey.length === 3) {
            if (group.groupType === '1') {
                return `calc(${(100 / 3) * 2}%)`;
            }
            if (group.groupType !== '1') {
                return `calc(${100 / 6}%)`;
            }
        }
    };
    render() {
        const { activeKey } = this.state;
        const { groupList, login } = this.props;
        const theme = login.systemInfo.theme || 'light';
        return (
            <div className="dimension-panel-wrapper">
                <div className="dimension-panel-header">
                    <div className="title-text">可选条件</div>
                    <Input
                        suffix={<Icon antdIcon type="SearchOutlined" />}
                        className="search-input"
                        onChange={(e) => {
                            e.persist();
                            this.onSearchCond(e);
                        }}
                    />
                </div>
                <div className="dimension-panel">
                    <Collapse bordered activeKey={activeKey} onChange={this.onCollapseChange} className="collapse-container">
                        {groupList.map((group) => {
                            return (
                                <Collapse.Panel
                                    className={`collapse-item collapse-item-${theme}`}
                                    header={group.groupTitle}
                                    key={group?.groupType?.toString()}
                                    style={{
                                        height: activeKey.includes(group.groupType.toString()) ? this.getCollapseActiveHeight(group) : '28px'
                                    }}
                                >
                                    <div className="accordion-container">
                                        {Array.isArray(group.children) &&
                                            group.children.map((accordionItem, accordionIndex) => (
                                                <AccordionItem
                                                    key={accordionIndex}
                                                    itemInfo={{
                                                        ...accordionItem,
                                                        fieldCategory: 'common'
                                                    }}
                                                />
                                            ))}
                                    </div>
                                </Collapse.Panel>
                            );
                        })}
                    </Collapse>
                </div>
            </div>
        );
    }
}

export default withModel(useLoginInfoModel, (login) => ({
    login
}))(Index);
