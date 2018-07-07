ag-Grid MobX Optimization
=========================

This example is an attempt to optimize ag-Grid's rendering when populated from a MobX store. The challenge here is that ag-Grid maintains its own internal store to optimize renders. If we maintain the data outside of ag-Grid (in a MobX store), then we need to call specific ag-Grid apis to synchronize its internal store. This means calling the correct apis whenever a row is added, deleted or updated.

This example contains a MobX store called `OrderStore`. This store maintains an observable map of Orders. An `Order` has an `id` and a `quantity`. Orders themselves are observables. Here's how the `OrderStore` is initialized:

```ecmascript 6
orderMap = new observable.map([
    [1, new Order(1, 10)],
    [2, new Order(2, 20)],
    ...
]);
```

After initialization, a random order is selected every second and it's quantity is updated. This should trigger the update of a single row in ag-Grid.

In addition, a random order is created every 5 seconds. This should trigger a render of the ag-Grid showing the new order.

Currently I achieve both these renders by setting up an `autorun()` that watches for adds and updates and calling the appropriate [ag-Grid APIs](https://www.ag-grid.com/javascript-grid-data-update/#transactions) - see [this code in OrderTable](https://github.com/nareshbhatia/aggrid-mobx-optimization/blob/master/src/order-table.js#L16-L53). Unfortunately, the code mixes up changes to the `orderMap` and changes to the `orders`. As a result, it iterates through every order even if a single order has changed. It would be ideal to set up separate reactions for changes to the map vs. changes to individual orders. How can I do this more elegantly in MobX?

Specifically:

1. How to set up an `autorun()` on the map and figure out whether it was called for an add or a delete and for which order?
2. How to set up reactions on individual orders as they are created?

Running the example
-------------------
```bash
$ yarn install
$ yarn start
```

Now point your browser to http://localhost:3000/.
