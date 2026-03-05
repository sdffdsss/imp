import { useState, useContext, useEffect } from 'react';
import GlobalStateContext from '@Pages/international-resource-monitor/context';
import { TabButtonEnum } from '@Pages/international-resource-monitor/type';

export default function useItemState(props) {
    const { index, item, isSelected, isEditing } = props;
    const contextValue = useContext<any>(GlobalStateContext);

    const { mode } = contextValue;

    const [showAddButton, setShowAddButton] = useState(false);
    const [showContentMode, setShowContentMode] = useState<'edit' | 'show' | 'history'>('edit');

    useEffect(() => {
        setShowAddButton(index === 1);
    }, [index]);

    useEffect(() => {
        if (mode.startsWith(TabButtonEnum.HISTORY)) {
            setShowContentMode('history');
        } else if (isEditing) {
            setShowContentMode('edit');
        } else {
            setShowContentMode('show');
        }
    }, [item, isSelected, isEditing, mode]);

    return { showAddButton, showContentMode };
}
