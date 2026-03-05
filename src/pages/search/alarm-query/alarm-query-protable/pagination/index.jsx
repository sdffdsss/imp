// import { adapter_dataSource } from '../../common/adaper/adapter_dataSource';
import Immutable from 'immutable';

export default class pagination {
    constructor(searchTable, adapter) {
        this.searchTable = searchTable;
        this.adapter = adapter;
        this.pageSize = adapter.pageConfig.pageSize;
    }
    total;
    pageSize;
    adapter;
    searchTable;
    // defaultPageSize;
    defaultCurrent = 1;
    onChange = (page, pageSize) => {
        if (this.adapter) {
            const startIndex = (page - 1) * pageSize;
            this.adapter._getAlarm(startIndex, pageSize).then((records) => {
                const dataSource = JSON.parse(records.data);
                this.searchTable.setState({ dataSource });
            });
        }
    };
    onShowSizeChange = (current, pageSize) => {
        if (this.adapter) {
            const startIndex = (current - 1) * pageSize;
            this.adapter._getAlarm(startIndex, pageSize).then((records) => {
                const dataSource = JSON.parse(records.data);

                const {pagination} = this.searchTable.state;
                // pagination.pageSize = pageSize;
                // pagination.total = 666666;
                this.searchTable.setState({
                    dataSource,
                    pagination: Immutable.Map(pagination).set('pageSize', pageSize).set('total', 66666).toJS(),
                });
            });
        }
    };
}
