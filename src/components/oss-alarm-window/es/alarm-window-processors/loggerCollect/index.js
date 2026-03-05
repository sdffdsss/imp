// import React, { PureComponent } from 'react';
// import { Table, Button } from 'oss-ui';
// import ReactDOM from 'react-dom';
// import JSONViewer from 'react-json-view';
// import './index.less';
// const columns = [
//     {
//         title: '请求名称',
//         dataIndex: 'methodName',
//     },
//     {
//         title: '请求发起时间',
//         dataIndex: 'startTime',
//     },
//     {
//         title: '响应时间',
//         dataIndex: 'endTime',
//     },
//     {
//         title: 'sessionId',
//         dataIndex: 'clientSessionId',
//     },
// ];

// class LoggerCollect extends PureComponent {
//     refScroll = null;

//     constructor(props) {
//         super();

//         this.state = {
//             loggerDataList: [],
//             scrollY: window.innerHeight * 0.55,
//         };
//     }

//     dataFormat = (list, map) => {
//         const handleList = list.map((item) => {
//             return map.get(item);
//         });
//         return handleList;
//     };

//     componentDidMount() {
//         this.refScroll =
//             ReactDOM.findDOMNode(this).getElementsByClassName('oss-ui-table-body')[0] || ReactDOM.findDOMNode(this);

//         this.setState({
//             loggerDataList: this.dataFormat(this.props.loggerData.dataList, this.props.loggerData.dataMap),
//         });
//     }

//     getSnapshotBeforeUpdate(prevProps, prevState) {
//         // 我们是否在 list 中添加新的 items ？
//         // 捕获滚动​​位置以便我们稍后调整滚动位置。
//         const list = this.refScroll;
//         const nextDataList = this.dataFormat(this.props.loggerData.dataList, this.props.loggerData.dataMap);
//         if (JSON.stringify(prevState.loggerDataList) !== JSON.stringify(nextDataList) && this.refScroll) {
//             return list.scrollHeight - list.scrollTop;
//         } else {
//             return null;
//         }
//     }

//     componentDidUpdate(prevProps, prevState, snapshot) {
//         // 如果我们 snapshot 有值，说明我们刚刚添加了新的 items，
//         // 调整滚动位置使得这些新 items 不会将旧的 items 推出视图。
//         //（这里的 snapshot 是 getSnapshotBeforeUpdate 的返回值）
//         const nextDataList = this.dataFormat(this.props.loggerData.dataList, this.props.loggerData.dataMap);
//         if (JSON.stringify(prevState.loggerDataList) !== JSON.stringify(nextDataList)) {
//             this.setState({
//                 loggerDataList: nextDataList,
//             });
//         }

//         if (snapshot !== null) {
//             const list = this.refScroll;
//             list.scrollTop = list.scrollHeight - snapshot;
//         }

//         if (prevProps.height === 0 && this.props.height > 0) {
//             this.toggleObserver(false);
//             this.toggleObserver();
//         }
//     }

//     getRealTimeData = () => {
//         this.props.operator.getRealtimeAlarm();
//     };

//     realTimeStatusChange = () => {
//         this.props.realTimeStatusChange(!this.props.realTimeStatus);
//     };

//     render() {
//         const { loggerDataList, scrollY } = this.state;
//         return (
//             <div>
//                 <div style={{ height: 30 }}>
//                     <Button
//                         onClick={this.realTimeStatusChange}
//                         size="small"
//                         className="show-dialog-btn"
//                         key="a"
//                         style={{ display: sessionStorage.getItem('developMode') === 'true' ? 'inline-block' : 'none' }}
//                     >
//                         {this.props.realTimeStatus ? '实时流水开关（开）' : '实时流水开关（关）'}
//                     </Button>
//                     {!this.props.realTimeStatus && (
//                         <Button
//                             onClick={this.getRealTimeData}
//                             size="small"
//                             className="show-dialog-btn"
//                             key="b"
//                             style={{
//                                 display: sessionStorage.getItem('developMode') === 'true' ? 'inline-block' : 'none',
//                             }}
//                         >
//                             获取单次流水
//                         </Button>
//                     )}
//                     <Button onClick={() => this.props.toggleLoggerCollect()} size="small" key="c">
//                         {this.props.loggerStatus ? '关闭日志收集' : '开启日志收集'}
//                     </Button>
//                 </div>
//                 <div style={{ height: window.innerHeight * 0.6 }}>
//                     <Table
//                         dataSource={loggerDataList}
//                         columns={columns}
//                         size="small"
//                         pagination={false}
//                         rowKey="key"
//                         scroll={{ y: scrollY }}
//                         expandable={{
//                             expandedRowRender: (record) => {
//                                 let tempObj = {};
//                                 if (record.res && record.res.responseDataJSON) {
//                                     try {
//                                         tempObj.wrap = JSON.parse(record.res.responseDataJSON);
//                                     } catch (e) {
//                                         tempObj.wrap = record.res.responseDataJSON;
//                                     }
//                                 }
//                                 return (
//                                     <div className="json-container">
//                                         请求参数
//                                         <JSONViewer src={record.param && JSON.parse(record.param)} collapsed={true} />
//                                         响应结果
//                                         <JSONViewer src={tempObj} collapsed={true} />
//                                     </div>
//                                 );
//                             },
//                         }}
//                     />
//                 </div>
//             </div>
//         );
//     }
// }

// export default LoggerCollect;