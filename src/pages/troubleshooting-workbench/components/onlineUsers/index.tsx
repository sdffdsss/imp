import React from 'react';
import './index.less';

interface Iprops {
    source: Array<any>;
    top?: number | string;
    left?: number | string;
    right?: number | string;
}

const OnlineUsers: React.FC<Iprops> = (props) => {
    const { source } = props;
    const getName = (name: string) => {
        if (name.length > 3) {
            return `${name.slice(0, 3)}...`;
        }
        return name;
    };
    return (
        <div className="online-users-container">
            <div className="online-header">
                <h1>在线人员清单</h1>
            </div>

            <div className="online-table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '15%' }}>序号</th>
                            <th style={{ width: '25%' }}>人员姓名</th>
                            <th style={{ width: '30%' }}>手机号</th>
                        </tr>
                    </thead>
                    <tbody>
                        {source.map((item) => (
                            <tr key={item.id}>
                                <td style={{ width: '15%' }}>{item.num}</td>
                                <td style={{ width: '25%' }}>
                                    <div title={item.userName}>{getName(item.userName)}</div>
                                </td>
                                <td style={{ width: '30%' }}>{item.userMobile}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default OnlineUsers;
