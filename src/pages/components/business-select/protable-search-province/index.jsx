import React from 'react';
import { Select, Spin } from 'oss-ui';
import { withModel } from 'hox';
import { getDictEnums } from '@Src/common/api/service/getDictApi';
import useLoginInfoModel from '@Src/hox';

class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            options: [],
            loading: true,
        };
    }
    componentDidMount() {
        this.getOptions();
    }

    getOptions = async () => {
        const { userId, currentZone } = useLoginInfoModel.data;
        let options = [
            {
                label: currentZone.zoneName,
                value: currentZone.zoneId,
            },
        ];

        if (!currentZone.zoneName) {
            options = await getDictEnums('province_id', userId);

            options = options.map((item) => ({
                originData: item,
                label: item.value,
                value: item.key,
            }));
        }

        this.setState({
            loading: false,
            options,
        });
    };

    render() {
        const { options, loading } = this.state;

        const compProps = {
            showArrow: true,
            filterOption: false,
            options,
            notFoundContent: loading ? <Spin size="small" /> : null,
        };
        return <Select {...compProps} onSearch={this.onSearch} {...this.props} />;
    }
}

export default Index;
