import { Component, Input, inject, OnInit, OnDestroy } from "@angular/core";
import { OrderService } from "../../services/order.service";
import { ingredients, milkTypes } from "../../data/ingredients";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MomentumService } from "../../services/momentum.service";
import { Subscription } from "rxjs";
@Component({
  selector: 'ingredient-stage',
  standalone: true,
  template: `
  <form [formGroup]="ingredientForm">
    <div class="stage-container">
      <h2>Customize Your Brew</h2>
      <p class="instruction">Select your preferred ingredients to create a brew that suits your taste.</p>

      <div class="field">
        <label>Coffee Type</label>
        <div class="options" (mouseover)="shuffleExtras(availableIngredients)">
          @for ( ingredient of availableIngredients;  track ingredient)  {
            <div class="option">
              <input type="radio"
                     [value]="ingredient.name" 
                     formControlName="coffeeType"
                      id="{{ ingredient.name }}" />

              <span>{{ ingredient.name }}</span>
            </div>
          }
        </div>
      </div>

      <div class="field">
        <label>Milk Type</label>
        <select formControlName="milkType" (mouseover)="shuffleExtras(milkTypes)">
          <option value="" disabled>Select milk type</option>
          @for ( milk of milkTypes;  track milk)  {
            <option value="{{ milk }}">{{ milk }}</option>
          }
        </select>
      </div>

      <div class="field">
        <label>Sugar Amount (teaspoons)</label>
          <div class="input-row">
          <button type="button"
            (mousedown)="momentumService.startSpin(-1)"
            (mouseup)="momentumService.stopSpin()"
            (mouseleave)="momentumService.stopSpin()">-</button>

          <!-- read-only display driven by the service, not user typing -->
          <span>{{ momentumService.sugarValue$ | async | number:'1.0-0' }}</span>

          <button type="button"
            (mousedown)="momentumService.startSpin(1)"
            (mouseup)="momentumService.stopSpin()"
            (mouseleave)="momentumService.stopSpin()">+</button>
        </div>

            <input type="hidden" formControlName="sugarAmount">
      </div>


      <button 
        type="button" 
        class="next-btn"
        [disabled]="ingredientForm.invalid"
        (click)="goToNextStep()">
        Proceed to Payment
      </button>
    </div>
  </form>
  
  `,
  styles: `
.stage-container {
  background: #d4e0d4; /* Hospital green/grey */
  border: 4px double #2d5a27;
  padding: 2rem;
  max-width: 450px;
  margin: 20px auto;
  box-shadow: 0 0 15px rgba(45, 90, 39, 0.4);
  font-family: 'Trebuchet MS', sans-serif;
  position: relative;
}

h2 {
  background: #2d5a27;
  color: #fbff00; 
  margin: 0 -2rem 1.5rem -2rem;
  padding: 15px;
  font-size: 1.1rem;
  text-align: center;
  border-bottom: 4px solid #fbff00;
}


.instruction {
  background: #000;
  color: #ff3300;
  padding: 5px;
  font-size: 0.7rem;
  text-align: center;
  margin-bottom: 20px;
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}

.option {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px;
  border: 1px transparent;
}

.option:hover {
  background: #fff;
  color: #2d5a27;
  border: 1px solid #2d5a27;
  cursor: help;
}

.input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #000;
  padding: 15px;
  border-radius: 50px; /* Pill shape */
  color: #a4ff8e;
  margin: 10px 0;
}

.input-row button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #a4ff8e;
  background: transparent;
  color: #a4ff8e;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.1s;
}

.input-row button:active {
  background: #ff3300;
  color: #000;
  transform: scale(0.9);
}

.input-row span {
  font-family: 'Courier New', monospace; 
  font-size: 2rem;
  text-shadow: 0 0 10px #a4ff8e;
}

select {
  width: 100%;
  padding: 10px;
  background: #fff;
  border: 2px solid #2d5a27;
  color: #2d5a27;
  font-weight: bold;
}


.next-btn {
  width: 100%;
  margin-top: 25px;
  padding: 15px;
  background: #2d5a27;
  color: #a4ff8e;
  border: none;
  font-weight: bold;
  font-size: 1.1rem;
  text-transform: uppercase;
  cursor: pointer;
  animation: jitter 3s infinite;
}

.next-btn:disabled {
  background: #bcbcbc;
  color: #777;
  animation: none;
  cursor: not-allowed;
}

/* Subtle jitter animation for the final button */
@keyframes jitter {
  0% { transform: scale(1); }
  98% { transform: scale(1); }
  99% { transform: scale(1.02) rotate(1deg); }
  100% { transform: scale(1); }
}
  
  `,
  imports: [CommonModule, ReactiveFormsModule]
})
export class IngredientStageComponent implements OnInit, OnDestroy {
  // for choosing the ingredients of the coffee
  @Input() onNext!: (nextStage: number) => void;

  orderService = inject(OrderService);
  momentumService = inject(MomentumService);
  private momentumSubscription: Subscription | null = null;

  availableIngredients = [...ingredients];
  milkTypes = [...milkTypes];

  ingredientForm = new FormGroup({
    coffeeType: new FormControl('', Validators.required),
    milkType: new FormControl('', Validators.required),
    sugarAmount: new FormControl(0)
  });

  ngOnInit() {
    // subscribe to the momentum service to update the sugar amount in the form whenever it changes
    this.momentumSubscription = this.momentumService.sugarValue$.subscribe(value => {
      this.ingredientForm.patchValue({ sugarAmount: Math.round(value) }, { emitEvent: false }); // update form without emitting another event to avoid loops
    });
  }

  ngOnDestroy() {
    this.momentumSubscription?.unsubscribe();
  }


  shuffleExtras(controlArray: unknown[]) {
    //via Fisher-Yates shuffle
    for (let i = controlArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [controlArray[i], controlArray[j]] = [controlArray[j], controlArray[i]];
    }
    // peak rage bait
  }


  goToNextStep() {
    if (this.ingredientForm.valid)  {
      this.orderService.updateState('ingredients', {
        coffeeType: this.ingredientForm.value.coffeeType || '',
        milkType: this.ingredientForm.value.milkType || '',
        sugarAmount: this.ingredientForm.value.sugarAmount || 0
      });
      
      this.onNext(4);
    }
  }
}