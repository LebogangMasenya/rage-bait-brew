import { Component, inject, Input } from "@angular/core";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { OrderService } from "../../services/order.service";
import { ButtonSideToSideDirective } from "../../directives/button.directive";
@Component({
  selector: 'payment-stage',
  template: `
  <form [formGroup]="paymentForm" class="stage-container">
    <h2>Payment Information</h2>
    <p class="instruction">Enter your payment details to complete your order.</p>

    <section class="order-summary">
      <h3>Your Order Summary</h3>
      <p><strong>Base:</strong> {{orderService.getState().base}}</p>
      <p><strong>Ingredients:</strong> {{orderService.getState().ingredients.join(', ')}}</p>
      <p><strong>Total:</strong> 100000 BTC because why not?</p>
    </section>  


    <div class="field">
      <label>Card Number</label>
      <input type="text" formControlName="cardNumber" placeholder="1234 5678 9012 3456">
      <div *ngIf="paymentForm.get('cardNumber')?.invalid && paymentForm.get('cardNumber')?.touched" class="error">
        Please enter a valid 16-digit card number.
      </div>
    </div>

    <div class="field">
      <label>Expiry Date (MM/YY)</label>
      <input type="text" formControlName="expiryDate" placeholder="MM/YY">
      <div *ngIf="paymentForm.get('expiryDate')?.invalid && paymentForm.get('expiryDate')?.touched" class="error">
        Please enter a valid expiry date in MM/YY format.
      </div>
    </div>

    <div class="field">
      <label>CVV</label>
      <input type="text" formControlName="cvv" placeholder="123">
      <div *ngIf="paymentForm.get('cvv')?.invalid && paymentForm.get('cvv')?.touched" class="error">
        Please enter a valid 3-digit CVV.
      </div>
    </div>


    @if(paymentForm.valid && paymentForm.touched) {
      <p class="confirmation">Payment details look good! Click "Confirm Payment" to complete your order. Catch it if you can</p>
          <button button-side-to-side type="button" class="next-btn" [disabled]="paymentForm.invalid" (click)="goToNextStep()">
      Confirm Payment
    </button>
    } @else {
      <button type="button" class="next-btn" [disabled]="paymentForm.invalid" (click)="goToNextStep()">
      Confirm Payment
    </button>
    }

  </form>
  
  `,
  styles: `
  
  /* The loop: move from 0 to 50px and back */
@keyframes sideToSide {
  0% { transform: translateX(0); }
  100% { transform: translateX(1000px); }
}

.animate-side-to-side {
  /* duration | timing-function | delay | iteration-count | direction */
  animation: sideToSide .5s ease-in-out infinite alternate;
  display: inline-block; /* Required for transforms to work on some elements */
}

  `,
  imports: [ReactiveFormsModule, CommonModule, ButtonSideToSideDirective]
})
export class PaymentStageComponent {
  // mocking a fun payment gateway
  @Input() onNext!: (nextStage: number) => void;

  orderService = inject(OrderService);

  paymentForm = new FormGroup({
    cardNumber: new FormControl('', [Validators.required, Validators.pattern(/^\d{16}$/)]),
    expiryDate: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]),
    cvv: new FormControl('', [Validators.required, Validators.pattern(/^\d{3}$/)])
  });

  goToNextStep() {
    if (this.paymentForm.valid) {
      this.orderService.updateState('payment', this.paymentForm.value);
      this.onNext(5); // go to success stage
    }
  }
}