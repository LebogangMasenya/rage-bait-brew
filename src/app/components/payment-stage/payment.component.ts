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
      <p><strong>Base:</strong> {{orderService.getState().base?.coffeeSize}}</p>
      <p><strong>Ingredients:</strong> {{orderService.getState().ingredients?.milkType}}, {{orderService.getState().ingredients?.sugarAmount}} sugar</p>
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
  
@keyframes sideToSide {
  0% { transform: translateX(0); }
  100% { transform: translateX(1000px); }
}

.animate-side-to-side {
  /* duration | timing-function | delay | iteration-count | direction */
  animation: sideToSide 2s ease-in-out infinite alternate;
  display: inline-block; /* Required for transforms to work on some elements */
}


.stage-container {
  background: #fdfdfd;
  border: 5px solid #ffd700;
  padding: 2rem;
  max-width: 450px;
  margin: 20px auto;
  font-family: 'Times New Roman', serif;
}

h2 {
  background: #1fff01;
  color: #000000; 
  margin: 0 -2rem 1.5rem -2rem;
  padding: 15px;
  font-size: 1.1rem;
  text-align: center;
  border-bottom: 4px solid #000000;
}


.instruction {
  font-size: 0.8rem;
  background: #ffff00;
  color: #000;
  padding: 5px;
  text-align: center;
  font-weight: bold;
  border: 1px dashed #000;
}

.order-summary {
  background: #fff;
  color: #000;
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
}

.order-summary h3 {
  font-size: 0.9rem;
  border-bottom: 1px solid #000;
  margin-bottom: 5px;
}

.order-summary p {
  font-size: 0.8rem;
  margin: 2px 0;
}

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #666;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #000;
  background: #f9f9f9;
  font-size: 1rem;
}

input:focus {
  background: #bc3535;
  outline: none;
  border: 2px solid #ffd700;
}

/* Error Messages: Aggressively red and blinking */
.error {
  color: #ff0000;
  font-size: 0.7rem;
  margin-top: 4px;
  font-weight: bold;
  text-transform: uppercase;
  animation: blink 0.5s infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.confirmation {
  font-size: 0.8rem;
  color: #008000;
  text-align: center;
  font-style: italic;
  margin-top: 10px;
}

.next-btn {
  display: block;
  width: 60%; /* Smaller so it's harder to catch */
  margin: 20px auto;
  padding: 15px;
  background: #000;
  color: #ffd700;
  border: 2px solid #ffd700;
  font-weight: bold;
  cursor: pointer;
  z-index: 999;
  transition: background 0.2s;
}

.next-btn:disabled {
  background: #eee;
  color: #aaa;
  border-color: #ccc;
  cursor: not-allowed;
}

.next-btn:not(:disabled):hover {
  background: #ffd700;
  color: #000;
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
      this.orderService.updateState('payment', 
        { cardNumber: this.paymentForm.value.cardNumber || '' });
      this.onNext(5); // go to success stage
    }
  }
}