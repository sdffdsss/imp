import { useEffect } from 'react';
import { useSetState } from 'ahooks';

const useTablePagination = () => {
    const [state, setState] = useSetState({
        current: 1,
        pageSize: 20,
    });
    const catchPageIndex = sessionStorage.getItem('faultReportPage');

    const onChange = (page: number, pageSize: number) => {
        setState({
            current: page,
            pageSize,
        });
    };
    const setCatchPageIndex = (page: number) => {
        sessionStorage.setItem('faultReportPage', page.toString());
    };

    useEffect(() => {
        if (catchPageIndex && Number(catchPageIndex) > state.pageSize) {
            setState({ current: Math.ceil(Number(catchPageIndex) / state.pageSize) }); // 恢复当前页
            setTimeout(() => {
                sessionStorage.removeItem('faultReportPage');
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return {
        current: state.current,
        pageSize: state.pageSize,
        onChange,
        setCatchPageIndex,
    };
};
export default useTablePagination;
