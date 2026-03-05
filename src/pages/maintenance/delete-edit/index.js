import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'oss-ui';
import api from '../api';
import './index.less';
import useLoginInfoModel from '@Src/hox';

const Index = (props) => {
    const login = useLoginInfoModel();
    const [userSource, handleUserSource] = useState([]);
    const { curSelParmExport = {}, mteamInfo } = props;
    const getSource = () => {
        const { province, region, professional, team } = curSelParmExport;
        api.queryDeptUserInfo({
            provinceId: province?.regionId || mteamInfo?.provinceId,
            regionId: region?.regionId || mteamInfo?.regionId,
            operator: login.userId,
        }).then((res) => {
            if (res && Array.isArray(res)) {
                // handleUserSource(res);
            }
        });
        api.queryUnusedUserInfo({
            provinceId: province?.regionId || mteamInfo?.provinceId,
            regionId: region?.regionId || mteamInfo?.regionId,
            professionalType: professional?.key || mteamInfo?.professionalId?.toString(),
            ruleType: team?.name || mteamInfo?.mteamName,
            operator: login.userId,
        }).then((res) => {
            handleUserSource(res);
        });
    };
    useEffect(() => {
        getSource();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const colStyle = {
        borderStyle: 'solid solid solid none',
        borderWidth: '1px',
        marginBottom: '-1px',
        textAlign: 'center',
        borderColor: '#ccc',
    };
    const colStyle1 = {
        borderStyle: 'solid solid solid none',
        borderBottom: 'none',
        borderWidth: '1px',
        marginBottom: '-1px',
        textAlign: 'center',
        borderColor: '#ccc',
    };
    const divStyle = {
        borderLeft: 'solid',
        borderWidth: '1px',
        textAlign: 'center',
        borderColor: '#ccc',
    };
    const columns = [
        {
            title: '类型',
            dataIndex: "deptormanName",
            key: "deptormanName",
            align: "center",
            render: (text) => {
                return <div className='dot-container'>
                    <div className={`dot ${text === '人员' ? 'man' : 'dept'}`} />
                    <span>{text}</span>
                </div>
            },
        },
        {
            title: '对象',
            dataIndex: "userName",
            align: "center",
            key: "userName",
        },
        {
            title: '电话',
            dataIndex: "mobilephone",
            align: "center",
            key: "mobilephone",
        },
      ];
    return (
        <div style={{ maxHeight: '400px', overflow: 'auto', minHeight: '100px' }}>
            <div className="noman-list">
                <Table
                    columns={columns}
                    dataSource={userSource}
                    pagination={false}
                    // scroll={{ y: 260 }}
                    // bordered
                />
            </div>
        </div>
    );
};

export default Index;
