import React, { PureComponent } from 'react';
// import { QRNormal } from 'oss-ui';

class index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            loading: false,
        };
    }
    showModal = () => {
        this.setState({ visible: true });
    };

    onFinish = (v) => {
        console.log(v);
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

    render() {
        // const { isCreate = true } = this.props;
        // const shiftMode = this.props.location.state;
        // let codeValue = "codeName: '小李',codeJobs: '值班长',";

        // const titleWorld = '';
        // //判断shiftMode状态，1-交接班，2-替班
        // if (shiftMode === '1') {
        //     titleWorld = '扫码交接班';
        // } else if (shiftMode === '2') {
        //     titleWorld = '扫码替班';
        // } else if (shiftMode === '3') {
        //     titleWorld = '临时离岗';
        // }

        return (
            /*  <Modal
                width={400}
                style={{ height: '500px' }}
                title={titleWorld}
                visible={visible}
                centered
                footer={null}
            >
                <QRNormal value = {codeValue}  /> 
            </Modal> */
            // 放到模态框中宽度可以去掉
            <div style={{ width: '30%', margin: '0 auto' }}>{/* <QRNormal value={codeValue} /> */}</div>
        );
    }
}
export default index;
