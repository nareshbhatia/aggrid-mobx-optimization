import { action, decorate, observable } from 'mobx';

export class Order {
    id;
    quantity;

    constructor(id, quantity) {
        this.id = id;
        this.quantity = quantity;
    }

    update = quantity => {
        console.log(`Order ${this.id}: quantity ${this.quantity} -> ${quantity}`);
        this.quantity = quantity;
    };
}

decorate(Order, {
    id: observable,
    quantity: observable,
    update: action
});
