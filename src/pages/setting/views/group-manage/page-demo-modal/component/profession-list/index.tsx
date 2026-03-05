import React, { useMemo } from 'react';
import { ProfessionalsType } from '../../type';
import ProfessionListItem from './ProListItem';
import './index.less';

interface Iprops {
    data: ProfessionalsType[];
}

const ProfessionList: React.FC<Iprops> = (props) => {
    const { data } = props;
    // 随机取色
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    };
    const listData = useMemo(() => {
        return data.map((el, index) => {
            return { name: el.professionalName, num: el.groupCount, id: index, color: getRandomColor() };
        });
    }, [data]);

    return (
        <div className="profession-list" style={{ justifyContent: `${data.length < 2 ? 'center' : ''}` }}>
            {listData.map((item) => {
                return <ProfessionListItem key={item.id} name={item.name} num={item.num} dotColor={item.color} />;
            })}
        </div>
    );
};
export default ProfessionList;
