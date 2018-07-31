import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { observe, reaction, toJS } from 'mobx';
import { inject } from 'mobx-react';

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-blue.css';
import './order-table.css';

export const OrderTable = inject('orderStore')(
    class extends React.Component {
        constructor(props) {
            super(props);

            const { orderStore } = props;
            this.orderMapDisposer = observe(orderStore.orderMap, event => {
                const jsOrders = [];
                let order;
                switch (event.type) {
                    case 'add':
                        order = event.newValue;
                        this.trackOrder(order);
                        jsOrders.push(toJS(order));
                        if (this.gridApi) {
                            this.gridApi.updateRowData({ add: jsOrders });
                        }
                        break;
                    case 'update':
                        console.log('This should never be called');
                        break;
                    case 'delete':
                        order = event.oldValue;
                        this.untrackOrder(order);
                        jsOrders.push(toJS(order));
                        if (this.gridApi) {
                            this.gridApi.updateRowData({ remove: jsOrders });
                        }
                        break;
                    default:
                        break;
                }
            });

            // Keep a map of disposers for each order
            this.discreteOrderDisposerMap = new Map();
        }

        componentWillUnmount() {
            this.orderMapDisposer();
            Array.from(this.discreteOrderDisposerMap.values()).map(disposer =>
                disposer()
            );
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

            // Add initial set of rows to ag-grid
            const { orderStore } = this.props;
            const orders = Array.from(orderStore.orderMap.values());
            const jsOrders = [];
            orders.forEach(order => {
                this.trackOrder(order);
                jsOrders.push(toJS(order));
            });

            this.gridApi.updateRowData({ add: jsOrders });
        };

        getRowNodeId = data => {
            return data.id;
        };

        trackOrder(order) {
            console.log(`Track ${order.id}:\n${stringify(order)}`);

            const orderDisposer = reaction(
                () => toJS(order),
                jsOrder => {
                    console.log(`Update ${order.id}:\n${stringify(order)}`);
                    const jsOrders = [];
                    jsOrders.push(jsOrder);
                    this.gridApi.updateRowData({ update: jsOrders });
                }
            );
            this.discreteOrderDisposerMap.set(order.id, orderDisposer);
        }

        untrackOrder(order) {
            console.log(`Untrack ${order.id}:\n${stringify(order)}`);

            const disposer = this.discreteOrderDisposerMap.get(order.id);
            if (disposer) {
                // Dispose the observer
                disposer();

                // Delete the entry
                this.discreteOrderDisposerMap.delete(order.id);
            }
        }
    }
);

function stringify(object) {
    return JSON.stringify(object, null, 4);
}
