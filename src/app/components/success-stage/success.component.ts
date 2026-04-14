import { Component, inject, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'success-stage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-message">
      <h2>Congratulations! Your coffee is ready!</h2>
      <p>Thank you for using our coffee brewing app. We hope you enjoy your brew.</p>

      <section class="order-summary">
        <h3>Your Order Summary</h3>
        <p><strong>Identity:</strong> {{ orderIdentity }}</p>
        <p><strong>Base:</strong> {{ orderBase }}</p>
        <p><strong>Ingredients:</strong> {{ orderIngredients.join(', ') }}</p>
        <p><strong>Payment:</strong> {{ orderPayment }}</p>
      </section>

      <section>
        <h2>Here is your coffee! Enjoy! I hope you can find it</h2>

        <!-- ragebait: the button runs away before you can click it -->
        <div class="coffee-hunt-arena" #arena>
          <button
            type="button"
            class="find-coffee-btn"
            [style.position]="'absolute'"
            [style.left.px]="btnX"
            [style.top.px]="btnY"
            (mouseenter)="evadeButton()"
            (click)="onCoffeeFound()">
            Find My Coffee
          </button>
        </div>

        @if (gaveUp) {
          <p class="gave-up-msg">Fine. Here it is. 
            <button type="button" (click)="onCoffeeFound()">Collect coffee</button>
          </p>
        }
      </section>

      <button type="button" class="restart-btn" (click)="restart()">
        Place Another Order
      </button>
    </div>
  `,
  styles: `

  .success-message {
  background: #ffffff;
  border: 5px solid #00ff00; 
  padding: 2rem;
  max-width: 450px;
  margin: 20px auto;
  text-align: center;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive; 
}

h2 {
  color: #ff00ff;
  text-transform: uppercase;
  font-size: 1.5rem;
}

p {
  font-size: 0.9rem;
  color: #333;
}


.order-summary {
  background: #000;
  color: #00ff00;
  padding: 15px;
  margin: 20px 0;
  text-align: left;
  font-family: 'Courier New', monospace;
  border-radius: 0;
  border: 2px dashed #00ff00;
}

.order-summary h3 {
  border-bottom: 1px solid #00ff00;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.order-summary p {
  font-size: 0.8rem;
  margin: 5px 0;
  color: #00ff00;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coffee-hunt-arena {
  position: relative;
  width: 100%;
  height: 250px;
  background: #eee;
  background-image: radial-gradient(#ccc 1px, transparent 1px);
  background-size: 20px 20px;
  border: 4px inset #fff;
  border-radius: 0;
  overflow: hidden;
  margin: 1.5rem 0;
  cursor: crosshair; 
}

.find-coffee-btn {
  background: #ff00ff;
  color: white;
  border: 2px solid #000;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  z-index: 100;
  white-space: nowrap;
  box-shadow: 3px 3px 0px #000;
}


.gave-up-msg {
  background: #ffffcc;
  padding: 10px;
  border: 1px solid #999;
  font-size: 12px;
  color: #333;
}

.gave-up-msg button {
  background: transparent;
  text-decoration: underline;
  border: none;
  color: blue;
  cursor: pointer;
  font-family: inherit;
}

.restart-btn {
  margin-top: 30px;
  padding: 10px 30px;
  background: #d0d0d0;
  border: 2px outset #fff;
  font-family: 'Arial', sans-serif;
  cursor: pointer;
}

.restart-btn:active {
  border-style: inset;
}
  `
})
export class SuccessStageComponent implements OnInit {
  @Input() onNext!: (nextStage: number) => void;

  @Output() orderRestarted = new EventEmitter<void>();

  orderService = inject(OrderService);

  orderIdentity: string = '';
  orderBase: string = '';
  orderIngredients: string[] = [];
  orderPayment: string = '';

  btnX = 120;
  btnY = 60;
  evadeCount = 0;
  gaveUp = false;

  private readonly ARENA_W = 340; // approximate arena width minus button
  private readonly ARENA_H = 120; // arena height minus button
  private readonly GIVE_UP_THRESHOLD = 7;

  ngOnInit() {
const state = this.orderService.getState();
  console.log('Final State Check:', state);

  this.orderIdentity = state.identity?.name ? `${state.identity.name}` : 'Anonymous Saboteur';

  this.orderBase = state.base?.coffeeSize 
    ? `${state.base.coffeeSize} (${state.base.coffeeStrength})` 
    : 'Liquid Chaos';

  const extras = state.ingredients?.extras ? state.ingredients.extras : '';
  const milk = state.ingredients?.milkType ? state.ingredients.milkType : '';
  const sugar = state.ingredients?.sugarAmount ? `${state.ingredients.sugarAmount} sugar` : '';
  this.orderIngredients = extras || [];

  const rawCard = state.payment?.cardNumber || '0000000000000000';
  this.orderPayment = `**** **** **** ${rawCard.toString().slice(-4)}`;

  this.orderService.updateState('success', { 
    message: 'Your coffee is ready!',
  });
}

  evadeButton() {
    this.evadeCount++;

    if (this.evadeCount >= this.GIVE_UP_THRESHOLD) {
      this.gaveUp = true;
      return;
    }

    // jump to a random position far from where it currently is
    let newX: number, newY: number;
    do {
      newX = Math.random() * this.ARENA_W;
      newY = Math.random() * this.ARENA_H;
    } while (
      Math.abs(newX - this.btnX) < 80 &&   // must move far enough to be annoying
      Math.abs(newY - this.btnY) < 40
    );

    this.btnX = newX;
    this.btnY = newY;
  }

  onCoffeeFound() {
    //trigger rick roll 
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  }

  restart() {
    this.orderRestarted.emit();
    this.onNext(1);
  }
}