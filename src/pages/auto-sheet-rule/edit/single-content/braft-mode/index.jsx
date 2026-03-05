/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable no-var */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import { Modal, Input, Select, Button, Divider, Popover } from 'oss-ui';
// import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
// import { ContentUtils } from 'braft-utils';
// import BarBlockComponent from './bloc-component';
import { customAlphabet } from 'nanoid';
import _isEmpty from 'lodash/isEmpty';
import _findIndex from 'lodash/findIndex';
import _omit from 'lodash/omit';
import './style.less';

// const controls = [];
// let fieldDataMap = {};
// const filterHTMLTag = function (msg) {
//     var msg = msg.replace(/<\/?[^>]*>/g, ''); // 去除HTML Tag
//     msg = msg.replace(/[|]*\n/, ''); // 去除行尾空格
//     msg = msg.replace(/&npsp;/gi, ''); // 去掉npsp
//     return msg;
// };
const nanoid = customAlphabet('1234567890', 15);
let countObj = {
    key: null,
    index: 0,
    type: 'input'
};
export default class Index extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            ediorDataObj: {},
            edtiorStateList: []
        };
    }
    getTxt1CursorPosition = (id) => {
        var $input = document.getElementById(`${id}`);
        var cursurPosition = 0;
        if ($input.selectionStart) {
            //非IE
            cursurPosition = $input.selectionStart;
        } else {
            //IE
            try {
                var range = document.selection.createRange();
                range.moveStart('character', -$input.value.length);
                cursurPosition = range.text.length;
            } catch (e) {
                cursurPosition = 0;
            }
        }
        countObj = {
            key: id,
            type: 'input',
            index: cursurPosition
        };
        console.log(cursurPosition); //打印当前索引
    };
    getTextKeyDown = (id, event) => {
        if (event.keyCode === 37 || event.keyCode === 39) this.getTxt1CursorPosition(id);
    };
    onSelectChange = (id, value) => {
        const { edtiorStateList } = this.state;
        let list = edtiorStateList.map((item) => {
            if (item.key === id) {
                item.value = value;
            }
            return item;
        });
        this.setState({
            edtiorStateList: list
        });
    };
    deleteSelect = (id) => {
        const { ediorDataObj, edtiorStateList } = this.state;
        let list = edtiorStateList.filter((item) => item.key !== id);
        let field = _omit(ediorDataObj, [id]);
        this.setState({
            edtiorStateList: list,
            ediorDataObj: field
        });
    };
    inputField = (id, value) => {
        const { ediorDataObj } = this.state;
        console.log(ediorDataObj);
        return {
            key: id,
            type: 'input',
            value: value || undefined
        };
    };
    selectField = (id, value) => {
        const { ediorDataObj } = this.state;
        console.log(ediorDataObj);
        return {
            key: id,
            type: 'select',
            value: value || null
        };
    };
    inputChange = (id, e) => {
        const { edtiorStateList } = this.state;
        this.getTxt1CursorPosition(id);

        let list = edtiorStateList.map((item) => {
            if (item.key === id) {
                item.value = e.target.value;
            }
            return item;
        });
        this.setState({
            edtiorStateList: list
        });
    };
    addSelect = () => {
        const { edtiorStateList } = this.state;
        const selectValue = this.props.fieldDataList[0]?.value || undefined;
        let list = edtiorStateList.concat([]);
        const nanid1 = `${nanoid()}`;
        const nanid2 = `${nanoid()}`;
        const nanid3 = `${nanoid()}`;
        // let fieldObj = {};
        // let newObj = Object.assign(ediorDataObj, {});
        console.log(countObj);
        if (countObj.key && countObj.type === 'input') {
            let index = _findIndex(edtiorStateList, (item) => item.key === countObj.key);
            if (edtiorStateList.find((item) => item.key === countObj.key)?.value) {
                const data = edtiorStateList.find((item) => item.key === countObj.key)?.value;

                if (countObj.index === data.length) {
                    if (edtiorStateList[index + 1]) {
                        if (edtiorStateList[index + 1].type === 'input') {
                            // fieldObj = { [nanid2]: selectValue };
                            list.splice(index + 1, 0, this.selectField(nanid2, selectValue));
                        } else {
                            // fieldObj = { [nanid2]: selectValue, [nanid3]: null };
                            list.splice(index + 1, 0, this.selectField(nanid2, selectValue), this.inputField(nanid3));
                        }
                    } else {
                        // fieldObj = { [nanid2]: selectValue, [nanid3]: null };
                        list.splice(index + 1, 0, this.selectField(nanid2, selectValue), this.inputField(nanid3));
                    }
                } else if (countObj.index === 0) {
                    if (edtiorStateList[index - 1]) {
                        if (edtiorStateList[index + 1].type === 'input') {
                            // fieldObj = { [nanid2]: selectValue };
                            list.splice(index, 0, this.selectField(nanid2, selectValue));
                        } else {
                            // fieldObj = { [nanid1]: null, [nanid2]: selectValue };
                            list.splice(index, 0, this.inputField(nanid1), this.selectField(nanid2, selectValue));
                        }
                    } else {
                        // fieldObj = { [nanid1]: null, [nanid2]: selectValue };
                        list.splice(index, 0, this.inputField(nanid1), this.selectField(nanid2, selectValue));
                    }
                } else {
                    let str = data.slice(0, countObj.index);
                    let str2 = data.slice(countObj.index, data.length);
                    list.splice(index, 1, this.inputField(nanid1, str), this.selectField(nanid2, selectValue), this.inputField(nanid3, str2));
                }
            } else {
                if (edtiorStateList[index + 1]) {
                    if (edtiorStateList[index + 1].type === 'input') {
                        // fieldObj = { [nanid2]: selectValue };
                        list.splice(index + 1, 0, this.selectField(nanid2, selectValue));
                    } else {
                        list.splice(index + 1, 0, this.selectField(nanid2, selectValue), this.inputField(nanid3));
                    }
                } else {
                    // fieldObj = { [nanid2]ue, [nanid3]: null };
                    list.splice(index + 1, 0, this.selectField(nanid2, selectValue), this.inputField(nanid3));
                }
            }
        } else if (countObj.key && countObj.type === 'select') {
            let index = _findIndex(edtiorStateList, (item) => item.key === countObj.key);
            console.log(index);
            if (edtiorStateList[index + 1]) {
                if (edtiorStateList[index + 1].type === 'input') {
                    // fieldObj = { [nanid1]: null, [nanid2]: selectValue };
                    list.splice(index + 1, 0, this.inputField(nanid1), this.selectField(nanid2, selectValue));
                } else {
                    // fieldObj = { [nanid1]: null, [nanid2]: selectValue, [nanid3]: null };
                    list.splice(index + 1, 0, this.inputField(nanid1), this.selectField(nanid2, selectValue), this.inputField(nanid3));
                }
            } else {
                // fieldObj = { [nanid1]: null, [nanid2]: selectValue, [nanid3]: null };
                list.splice(index + 1, 0, this.inputField(nanid1), this.selectField(nanid2, selectValue), this.inputField(nanid3));
            }
        } else {
            list = [...list, this.selectField(nanid2, selectValue), this.inputField(nanid3)];
        }
        countObj = { key: nanid2, index: 0, type: 'select' };
        this.setState({
            edtiorStateList: list
        });
    };
    // blockExportFn = (contentState, block) => {
    //     if (block.type === 'atomic') {
    //         const ranges = block.entityRanges.length > 0 ? block.entityRanges[0] : -1;
    //         if (ranges !== -1) {
    //             const entity = contentState.getEntity(contentState.getBlockForKey(block.key).getEntityAt(0));
    //             if (entity && entity.getType() === 'selectElement') {
    //                 return `<div class='select-data-map' >${block.key}</div>`;
    //             }
    //         }
    //     }
    //     if (block.type === 'block-bar') {
    //         return `<div class='my-block-bar' >${block.key}</div>`;
    //     }
    // };
    // blockImportFn = (nodeName, node) => {
    //     if (nodeName === 'div' && node.classList.contains('my-block-bar')) {
    //         const dataA = node.dataset.a;
    //         return {
    //             type: 'block-bar',
    //             data: {
    //                 selectValue: dataA
    //             }
    //         };
    //     }
    // };
    // blockRendererFn = (block, { editor, editorState }) => {
    //     if (block.getType() === 'atomic') {
    //         const entity =
    //             editorState?.getCurrentContent() && block.getEntityAt(0) && editorState?.getCurrentContent()?.getEntity(block.getEntityAt(0));
    //         if (entity && entity.getType() === 'selectElement') {
    //             return {
    //                 component: BarBlockComponent,
    //                 editable: false,
    //                 props: {
    //                     editor,
    //                     editorState,
    //                     fieldDataList: this.props.fieldDataList,
    //                     onChangeValue: this.onChagneValue,
    //                     id: block.key,
    //                     fieldDataMap
    //                 }
    //             };
    //         }
    //     }
    //     if (block.getType() === 'block-bar') {
    //         return {
    //             component: BarBlockComponent,
    //             editable: false,
    //             props: { editor, editorState, fieldDataList: this.props.fieldDataList, onChangeValue: this.onChagneValue, id: block.key }
    //         };
    //     }
    // };
    // onChagneValue = (field) => {
    //     fieldDataMap = {
    //         ...fieldDataMap,
    //         ...field
    //     };
    // };
    componentDidMount() {
        this.isLivinig = true;
        const nanoids = `${nanoid()}`;
        this.setState({
            edtiorStateList: [this.inputField(nanoids)],
            ediorDataObj: { [nanoids]: null }
        });
        // 3秒后更改编辑器内容
        // setTimeout(this.setEditorContentAsync, 3000);
    }

    componentWillUnmount() {
        this.isLivinig = false;
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value || (this.props.visible && !prevProps.visible)) {
            console.log(456);
            const str = this.props.value.mapData
                ? Array.isArray(this.props.value.mapData)
                    ? this.props.value.mapData.length > 0
                        ? this.props.value.mapData.join(',')
                        : ''
                    : this.props.value.mapData
                : '';
            const list = (str && str?.split('~')) || [];
            console.log(list);
            const dataList = list.filter((item) => item !== '');
            let editList = [];
            let editObj = {};
            dataList?.forEach((item, index) => {
                if (item.indexOf('[') !== -1 && item.indexOf(']') !== -1) {
                    const nanoids = nanoid();
                    let itemStr = item.replace(']', '');
                    itemStr = itemStr.replace('[', '');
                    editList.push(this.selectField(nanoids, itemStr));
                    editObj = {
                        ...editObj,
                        [nanoids]: itemStr
                    };
                    if (index === dataList.length - 1) {
                        const inputId = nanoid();
                        editList.push(this.inputField(inputId));
                        editObj = {
                            ...editObj,
                            [inputId]: null
                        };
                    }
                } else {
                    const nanoids = nanoid();
                    editList.push(this.inputField(nanoids, item));
                    editObj = {
                        ...editObj,
                        [nanoids]: item
                    };
                }
            });

            this.setState({
                edtiorStateList: editList,
                ediorDataObj: editObj,
                id: this.props.value.id
            });
        }
        // console.log(this.props);
    }

    handleCancel = () => {
        const { onChange } = this.props;
        countObj = {
            key: null,
            index: 0,
            type: 'input'
        };
        onChange(false);
    };
    handleOk = () => {
        const { onChange } = this.props;
        const { edtiorStateList, id } = this.state;
        let str = '';
        if (!_isEmpty(edtiorStateList)) {
            edtiorStateList
                .filter((item) => item.value)
                .forEach((item) => {
                    if (item.type === 'select') {
                        str += `~[${item.value}]~`;
                    } else {
                        str += item.value;
                    }
                });
        }
        onChange(id, str);
        countObj = {
            key: null,
            index: 0,
            type: 'input'
        };
        this.setState({
            edtiorStateList: []
        });
    };
    render() {
        const { edtiorStateList } = this.state;
        const { visible } = this.props;
        // const extendControls = [
        //     {
        //         key: 'custom-button',
        //         type: 'button',
        //         text: '添加字段',
        //         onClick: this.insertHello,
        //     },
        // ];
        return (
            <Modal destroyOnClose={true} width={800} visible={visible} onCancel={this.handleCancel} onOk={this.handleOk}>
                <div>
                    <div className="editor-wrapper" style={{ height: 500, overflowY: 'auto' }}>
                        <Button type="text" onClick={this.addSelect}>
                            添加字段
                        </Button>
                        <Divider className="editor-warpper-divider" />
                        <div className="editor-wrapper-content">
                            {!_isEmpty(edtiorStateList) &&
                                edtiorStateList.map((item) => {
                                    return (
                                        <div
                                            className={
                                                item.type === 'input' ? 'editor-wrapper-content-field-input' : 'editor-wrapper-content-field-select'
                                            }
                                            key={item.key}
                                        >
                                            {item.type === 'input' ? (
                                                <Input.TextArea
                                                    className="editor-wrapper-content-field-input"
                                                    autoSize={true}
                                                    id={item.key}
                                                    value={item.value || null}
                                                    onChange={(e) => this.inputChange(item.key, e)}
                                                    onKeyUp={(e) => this.getTextKeyDown(item.key, e)}
                                                    onClick={() => this.getTxt1CursorPosition(item.key)}
                                                />
                                            ) : (
                                                <Popover
                                                    content={
                                                        <Button type="link" onClick={() => this.deleteSelect(item.key)}>
                                                            删除
                                                        </Button>
                                                    }
                                                >
                                                    <Select
                                                        showSearch
                                                        style={{ width: 120 }}
                                                        value={item.value || undefined}
                                                        placeholder={'请选择字段'}
                                                        options={this.props.fieldDataList}
                                                        onChange={(values) => this.onSelectChange(item.key, values)}
                                                        optionFilterProp="label"
                                                        // value={selectValue || undefined}
                                                    />
                                                </Popover>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>

                        {/* <BraftEditor
                            ref={(instance) => (this.editorInstance = instance)}
                            value={editorState}
                            onChange={this.handleChange}
                            controls={controls}
                            extendControls={extendControls}
                            // blockRenderMap={blockRenderMap}
                            blockRendererFn={this.blockRendererFn}
                            converts={{ blockImportFn: this.blockImportFn, blockExportFn: this.blockExportFn }}
                        /> */}
                    </div>
                    <h5>输出内容</h5>
                    <div className="output-content">
                        {!_isEmpty(edtiorStateList) &&
                            edtiorStateList
                                .filter((item) => item.value)
                                .map((item) => {
                                    return item.type === 'select' ? `~[${item.value}]~` : item.value;
                                })}
                    </div>
                </div>
            </Modal>
        );
    }
}
