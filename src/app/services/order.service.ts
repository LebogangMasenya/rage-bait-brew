import { Injectable } from "@angular/core";
@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private orderState = {
        identity: null,
        base: null,
        ingredients: [],
        payment: null
    }

    updateState(stage: string, data: any) {
        this.orderState = {
            ...this.orderState,
            [stage]: data
        }
    }

    getState() {
        return this.orderState;
    }
}