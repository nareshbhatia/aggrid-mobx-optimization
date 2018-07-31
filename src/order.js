import { action, decorate, observable } from 'mobx';

export class Order {
    id;
    quantity;

    constructor(id, quantity) {
        // console.log(`Order ${id} created: quantity ${quantity}`);
        this.id = id;
        this.quantity = quantity;
    }

    update = quantity => {
        // console.log(
        //     `Order ${this.id} updated: quantity ${this.quantity} -> ${quantity}`
        // );
        this.quantity = quantity;
    };
}

decorate(Order, {
    id: observable,
    quantity: observable,
    update: action
});
