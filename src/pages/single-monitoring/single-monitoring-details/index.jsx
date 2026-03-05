import React from 'react';
import { Modal, Input } from 'oss-ui';

const { TextArea } = Input;
export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            editRow: {}
        };
    }

    componentDidUpdate() {}

    componentDidMount() {}

    handleCancel = (e) => {
        const { onChange } = this.props;
        onChange();
    };

    render() {
        const { visible, data } = this.props;

        return (
            <Modal width={800} title="告警详细查看" visible={visible} onCancel={this.handleCancel} footer={null}>
                <TextArea rows={8} disabled={true} value={data} />
            </Modal>
        );
    }
}
