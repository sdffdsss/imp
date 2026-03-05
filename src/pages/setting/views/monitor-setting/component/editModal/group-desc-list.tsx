import React, { useMemo } from 'react';
import { _ } from 'oss-web-toolkits';
import { Col, message, Row } from 'oss-ui';
import Empty from '@Components/empty';
import './index.less';
import GroupDesc from './group-descriptions';

const INFO_TYPE = {
    default: 0,
    update: 1,
    cache: 2,
};
interface IGroupDescListProps {
    value: any;
    onChange: any;
    provinceList: any[];
    type: string;
    cacheGroupList: any[];
    setCacheGroupList: React.Dispatch<React.SetStateAction<any[]>>;
    groupFilterProvince: any;
    updateGroupList: any[];
    setUpdateGroupList: React.Dispatch<React.SetStateAction<any[]>>;
}

/**
 *
 */
const GroupDescList = ({
    value,
    onChange,
    provinceList,
    type,
    cacheGroupList,
    setCacheGroupList,
    groupFilterProvince,
    updateGroupList,
    setUpdateGroupList,
}: IGroupDescListProps): JSX.Element => {
    const list = [
        ...(value || []),
        ...updateGroupList?.map((updateitem) => ({
            title: updateitem?._data?.groupName,
            labelGroup: updateitem?._data?.groupUserBeanList.filter((groupItem) => groupItem?.isLeader === 0).map((groupItem) => groupItem?.userName),
            groupLeader: updateitem?._data?.groupUserBeanList?.find((groupItem) => groupItem?.isLeader)?.userName,
            type: INFO_TYPE.update,
            groupId: updateitem?._data?.groupId,
        })),
        ...cacheGroupList?.map((cacheitem) => ({
            title: cacheitem?._data?.groupName,
            labelGroup: cacheitem?._data?.groupUserBeanList.filter((groupItem) => groupItem?.isLeader === 0).map((groupItem) => groupItem?.userName),
            groupLeader: cacheitem?._data?.groupUserBeanList?.find((groupItem) => groupItem?.isLeader)?.userName,
            type: INFO_TYPE.cache,
        })),
    ];

    const handleDelete = (deleteValue) => {
        const _value = value?.filter((item) => item.title !== deleteValue);
        const _cacheGroupList = cacheGroupList?.filter((item) => item?._data?.groupName !== deleteValue);
        const _updateGroupList = updateGroupList?.filter((item) => item?._data?.groupName !== deleteValue);
        onChange(_value);
        setCacheGroupList(_cacheGroupList);
        setUpdateGroupList(_updateGroupList);
    };

    const handleUpdate = (newData) => {
        if (newData?._data?.groupId) {
            const hasSame = updateGroupList.find((item) => item?._data?.groupId === newData?._data?.groupId);
            const result = updateGroupList.map((item) => {
                if (item._data?.groupId === newData?._data?.groupId) {
                    return newData;
                } else {
                    return item;
                }
            });
            // if (!hasSame) {
            //     const updategroupNameInex = updateGroupList
            //         ?.filter((item) => Boolean(item))
            //         .findIndex((item) => item?._data?.groupName === newData._data.groupName);
            //     if (updateGroupList?.length && !(updategroupNameInex === -1)) {
            //         message.error('班组名称重复');
            //         return;
            //     }
            // }

            const _updateGroupList = hasSame ? result : [...updateGroupList, newData];
            setUpdateGroupList(_updateGroupList);
        } else {
            const hasSame = cacheGroupList.find((item) => item?.time === newData?.time);
            const result = cacheGroupList.map((item) => {
                if (item.time === newData?.time) {
                    return newData;
                } else {
                    return item;
                }
            });

            // if (!hasSame) {
            //     const cachegroupNameIndex = cacheGroupList
            //         ?.filter((item) => Boolean(item))
            //         .findIndex((item) => item?._data?.groupName === newData._data.groupName);

            //     if (cacheGroupList?.length && !(cachegroupNameIndex === -1)) {
            //         message.error('班组名称重复');
            //         return;
            //     }
            // }

            const _cacheGroupList = hasSame ? result : [...cacheGroupList, newData];
            setUpdateGroupList(_cacheGroupList);
        }

        const _value = value?.filter((item) => item.groupId !== newData?._data?.groupId);
        console.log(_value);

        onChange(_value);
    };

    return (
        <div className="desc-contanier">
            {_.isEmpty(list) ? (
                <Empty showImage />
            ) : (
                <Row gutter={[20, 10]} justify={'start'}>
                    {_.uniqBy(list, 'title').map((d, i) => (
                        <Col span={6} key={`${d.name}_${i}`}>
                            <GroupDesc
                                detail={d}
                                provinceList={provinceList}
                                onDelete={(data) => {
                                    handleDelete(data);
                                }}
                                cacheGroupList={cacheGroupList}
                                updateGroupList={updateGroupList}
                                disabled={type === 'view'}
                                onUpdate={(newData) => {
                                    handleUpdate(newData);
                                }}
                                groupFilterProvince={groupFilterProvince}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};
// #endregion

export default GroupDescList;
