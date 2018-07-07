import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { OrderTable } from './order-table';
import { OrderStore } from './order-store';

const orderStore = new OrderStore();

// Create orders every 5 seconds
setInterval(function() {
    orderStore.createRandomOrder();
}, 5000);

// Update orders every second
setInterval(function() {
    orderStore.updateRandomOrder();
}, 1000);

export class App extends Component {
    render() {
        return (
            <Provider orderStore={orderStore}>
                <OrderTable />
            </Provider>
        );
    }
}
