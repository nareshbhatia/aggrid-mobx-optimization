import { action, decorate, observable } from 'mobx';
import { Order } from './order';

export class OrderStore {
    orderMap = new observable.map([
        [1, new Order(1, 10)],
        [2, new Order(2, 20)],
        [3, new Order(3, 30)],
        [4, new Order(4, 40)],
        [5, new Order(5, 50)],
        [6, new Order(6, 60)],
        [7, new Order(7, 70)],
        [8, new Order(8, 80)],
        [9, new Order(9, 90)],
        [10, new Order(10, 100)],
    ]);

    createRandomOrder = () => {
        const id = this.orderMap.size + 1;
        this.orderMap.set(id, new Order(id, getRandomInt(1, 100)));
    };

    updateRandomOrder = () => {
        const size = this.orderMap.size;
        const id = getRandomInt(1, size);
        const order = this.orderMap.get(id);
        order.update(getRandomInt(1, 100));
    };
}

decorate(OrderStore, {
    createRandomOrder: action
});

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
