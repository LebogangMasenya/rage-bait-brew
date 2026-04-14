import { Injectable } from "@angular/core";
import {type  OrderState } from "../data/order.model";
@Injectable({
    providedIn: 'root'
})
export class OrderService {
   private state: OrderState = {};

  updateState<K extends keyof OrderState>(stage: K, data: OrderState[K]) {
    this.state = { ...this.state, [stage]: data };
  }

  getState(): OrderState {
    return this.state;
  }
}