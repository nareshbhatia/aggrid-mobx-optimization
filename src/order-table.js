import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { autorun } from 'mobx';
import { inject } from 'mobx-react';

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-blue.css';
import './order-table.css';

export const OrderTable = inject('orderStore')(
    class extends React.Component {
        constructor(props) {
            super(props);

            const { orderStore } = props;
            this.disposer = autorun(() => {
                console.log(
                    'autorun() triggered. gridApi:',
                    this.gridApi ? true : false
                );

                // This will trigger the autorun whenever orderMap changes,
                // specifically when orders are added.
                const orders = Array.from(orderStore.orderMap.values());

                // This will trigger the autorun whenever an order changes.
                // It's kind of odd to dereference order just to trigger a reaction!
                orders.forEach(order => {
                    const quantity = order.quantity;
                });

                // Update ag-grid when an order is added or updated.
                // This is very inefficient because it iterates over all orders!
                // It would be good to separate adds from updates.
                if (this.gridApi) {
                    const addedRows = [];
                    const updatedRows = [];

                    orders.forEach(order => {
                        const rowNode = this.gridApi.getRowNode(order.id);
                        if (rowNode) {
                            updatedRows.push(order);
                        } else {
                            addedRows.push(order);
                        }
                    });

                    this.gridApi.updateRowData({
                        add: addedRows,
                        update: updatedRows
                    });
                }
            });
        }

        componentWillUnmount() {
            this.disposer();
        }

        render() {
            const columnDefs = [
                {
                    headerName: 'ID',
                    field: 'id',
                    type: 'numericColumn',
                    width: 100,
                    enableCellChangeFlash: true
                },
                {
                    headerName: 'Quantity',
                    field: 'quantity',
                    type: 'numericColumn',
                    width: 160,
                    enableCellChangeFlash: true
                }
            ];

            return (
                <div className="ag-theme-blue order-table-container">
                    <AgGridReact
                        columnDefs={columnDefs}
                        getRowNodeId={this.getRowNodeId}
                        onGridReady={this.onGridReady}
                    />
                </div>
            );
        }

        onGridReady = params => {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        };

        getRowNodeId = data => {
            return data.id;
        };
    }
);
