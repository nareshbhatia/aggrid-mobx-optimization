ag-Grid MobX Optimization
=========================

This example optimizes ag-Grid's rendering when populated from a MobX store. The challenge here is that ag-Grid maintains its own data structures to optimize renders (see ag-Grid's [Row Model](https://www.ag-grid.com/javascript-grid-row-models/#deeper-understanding-of-row-models)). If we maintain the data outside of ag-Grid (in a MobX store), then we need to call its [updateRowData()](https://www.ag-grid.com/javascript-grid-data-update/#transactions) API to synchronize the internal state.

This example contains a MobX store called `OrderStore`. This store maintains an observable map of Orders. An `Order` has an `id` and a `quantity`. Orders themselves are observables. Here's how the `OrderStore` is initialized:

```ecmascript 6
orderMap = new observable.map([
    [1, new Order(1, 10)],
    [2, new Order(2, 20)],
    ...
]);
```

After initialization, a random order is selected every second and it's quantity is updated. This should trigger the update of a single row in ag-Grid.

In addition, a random order is created every 5 seconds. This should trigger a render of ag-Grid, showing the new order.

I achieve these renders by using the `observe()` and `reaction()` APIs of MobX.

- I have set up a `MobX.observe()` on the orderMap (see [here](https://github.com/nareshbhatia/aggrid-mobx-optimization/blob/master/src/order-table.js#L16-L42)). This triggers an event whenever an order is added or deleted from the map. I use these events to add/remove rows from ag-Grid using `gridApi.updateRowData()`.

- Whenever an order is added, I also start tracking it using `MobX.reaction()` (see [here](https://github.com/nareshbhatia/aggrid-mobx-optimization/blob/master/src/order-table.js#L104-L117)). This allows me to sync order updates to agGrid using `gridApi.updateRowData()`. Note that updates to a single order never update the `orderMap()`, i.e. I don't call `orderMap.set()` with a new order. In order to optimize rendering we need to be more granular than that. Hence order updates are performed by changing the order's properties directly (see [order.update()](https://github.com/nareshbhatia/aggrid-mobx-optimization/blob/master/src/order.js#L13-L19)). This ensures that we are reacting only to that order's change and syncing it to ag-Grid.

Running the example
-------------------
```bash
$ yarn install
$ yarn start
```

Now point your browser to http://localhost:3000/.
