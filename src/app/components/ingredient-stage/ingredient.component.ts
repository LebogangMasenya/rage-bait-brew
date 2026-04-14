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
                     formControlName="extras"
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
  styles: '',
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
    sugarAmount: new FormControl(0, Validators.min(0)),
    extras: new FormControl([] as string[])
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
    if (this.ingredientForm.valid) {
      this.orderService.updateState('ingredients', this.ingredientForm.value);
      this.onNext(4);
    }
  }
}