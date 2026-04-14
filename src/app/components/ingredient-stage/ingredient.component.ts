import { Component, Input, inject } from "@angular/core";
import { OrderService } from "../../services/order.service";
import { ingredients, milkTypes } from "../../data/ingredients";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MomentumService } from "../../services/momentum.service";
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
        <input type="number" formControlName="sugarAmount" min="0">
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
export class IngredientStageComponent {
  // for choosing the ingredients of the coffee
  orderService = inject(OrderService);
  momentumService = inject(MomentumService);

  @Input() onNext!: (nextStage: number) => void;


  availableIngredients = ingredients;
  milkTypes = milkTypes;
  ingredientForm = new FormGroup({
    coffeeType: new FormControl('', Validators.required),
    milkType: new FormControl('', Validators.required),
    sugarAmount: new FormControl(0, Validators.min(0)),
    extras: new FormControl([] as string[])
  });

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