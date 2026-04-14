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
        <p><strong>Ingredients:</strong> {{ orderIngredients?.join(', ') }}</p>
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
    .coffee-hunt-arena {
      position: relative;
      width: 100%;
      height: 160px;
      border: 0.5px dashed var(--color-border-secondary);
      border-radius: var(--border-radius-md);
      overflow: hidden;
      margin: 1rem 0;
    }
    .gave-up-msg { font-size: 13px; color: var(--color-text-secondary); }
  `
})
export class SuccessStageComponent implements OnInit {
  @Input()  onNext!: (nextStage: number) => void;

  // emits when the user actually collects their coffee
  @Output() coffeeCollected = new EventEmitter<{ collectedAt: Date }>();

  // emits when they give up and restart
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
    this.orderService.updateState('success', { message: 'Your coffee is ready!' });

    const summary = this.orderService.getState();
    this.orderIdentity = summary.identity ?? 'Unknown Customer';
    this.orderBase     = summary.base ?? 'Unknown Base';
    this.orderIngredients = summary.ingredients ?? [];
    this.orderPayment  = summary.payment ?? 'Unknown Payment';
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
    this.coffeeCollected.emit({ collectedAt: new Date() });

    //trigger rick roll because why not
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  }

  restart() {
    this.orderRestarted.emit();
    this.onNext(1);
  }
}