import { useState } from 'react';
import { createModel } from 'hox';

const useColumnsInfo = () => {
    const [columnInfo, setColumnInfo] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState('1');
    const [openKeys, setOpenKeys] = useState('');
    const [status, setStatus] = useState('init');
    const [inputSeleteType, setInputSeleteType] = useState({});
    const [prcDatas, setPrcDatas] = useState([]);
    return {
        columnInfo,
        setColumnInfo,
        selectedKeys,
        setSelectedKeys,
        openKeys,
        setOpenKeys,
        status,
        setStatus,
        inputSeleteType,
        setInputSeleteType,
        prcDatas,
        setPrcDatas,
    };
};
export default createModel(useColumnsInfo);
