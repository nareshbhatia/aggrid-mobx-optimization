ag-Grid MobX Optimization
=========================

This example is an attempt to optimize ag-Grid rendering when populated from a MobX store. The challenge here is that ag-Grid saves its data in an internal store and optimizes rendering against this store. If we maintain the application data in a MobX store, then we need to efficiently synchronize that store with ag-Grid's store. This implies calling ag-Grid's api's whenever rows are added, deleted or updated.

This example contains a MobX store called `OrderStore`. This store maintains an observable map of Orders. Orders themselves are observables. Here's how the `OrderStore` is initialized:

```ecmascript 6
orderMap = new observable.map([
    [1, new Order(1, 10)],
    [2, new Order(2, 20)],
    ...
    [10, new Order(10, 100)],
]);
```
After initialization, a random order is selected every second and it's quantity is updated. This should trigger a render of the `OrderTable` component. Unfortunately it doesn't. This is the first issue I am running into. Look at `OrderTable.js`. Note that `OrderTable` is an observer and it dereferences all orders in its `render()` method. In spite of this, the component is not re-rendered when an order is updated.

Once this issue is solved, we can try to optimize ag-Grid's rendering by redrawing only the row that is updated. For that we need to stop rendering the entire grid on updates and call `rowNode.setData(order);` for the row that has changed. See [ag-Grid documentation](https://www.ag-grid.com/javascript-grid-data-update/#updating-rownodes-data) for details.


Getting Started
---------------
```bash
$ yarn install
$ yarn start
```

Now point your browser to http://localhost:3000/.
