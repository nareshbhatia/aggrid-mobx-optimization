import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { inject, observer } from 'mobx-react';

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-blue.css';
import './order-table.css';

export const OrderTable = inject('orderStore')(
    observer(
        class extends React.Component {
            render() {
                console.log('---> OrderTable.render()');
                const { orderStore } = this.props;

                // This forces ag-grid to redraw when orderMap changes,
                // specifically when rows are added
                const orders = Array.from(orderStore.orderMap.values());

                // This should force ag-grid to redraw when an order changes
                // But it doesn't
                if (this.api) {
                    orders.forEach(order => {
                        const rowNode = this.api.getRowNode(order.id);
                        if (rowNode) {
                            rowNode.setData(order);
                        }
                    });
                }

                const columnDefs = [
                    {
                        headerName: 'ID',
                        field: 'id',
                        type: 'numericColumn',
                        width: 100
                    },
                    {
                        headerName: 'Quantity',
                        field: 'quantity',
                        type: 'numericColumn',
                        width: 160
                    }
                ];

                return (
                    <div className="ag-theme-blue order-table-container">
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={orders}
                            getRowNodeId={this.getRowNodeId}
                            onGridReady={this.onGridReady}
                        />
                    </div>
                );
            }

            onGridReady = params => {
                this.api = params.api;
                this.columnApi = params.columnApi;
            };

            getRowNodeId = data => {
                return data.id;
            };
        }
    )
);
