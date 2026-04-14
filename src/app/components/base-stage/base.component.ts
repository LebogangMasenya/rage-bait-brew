import { Component, Input, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderService } from "../../services/order.service";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { BaseDrinkDirective } from "../../directives/baseDrink.directive";
import { drinks } from "../../data/drinks";
@Component({
  selector: 'base-stage',
  template: `
  <form [formGroup]="baseDrinkForm">
    <div class="stage-container">
      <h2>Choose Your Base</h2>
      <p class="instruction">Select the foundation of your brew. This will determine the core flavor profile.</p>

      <div class="field">
        <label>Base Type</label>
        <select formControlName="baseType" baseDrink>
          <option value="" disabled>Select a base</option>
          @for (drink of drinkBases; track drink) {
            <option value="{{ drink }}">{{ drink }}</option>
          }
        </select>
      </div>

      <div class="field">
        <label>Strength (1-10)</label>
        <input type="number" formControlName="strength" placeholder="1-10 baseDrink">
      </div>

      <div class="field">
        <label>Temperature in Kelvin :)</label>
        <input type="number" step="0.01" formControlName="temperature" placeholder="Enter temperature in K, there is only one right  answer">
            <span class="hint">{{ temperatureHint }}</span>
        <span>{{ baseDrinkForm.get('temperature')?.value }} K</span>
      </div>


       <button 
        type="button" 
        class="next-btn"
        [disabled]="baseDrinkForm.invalid"
        (click)="goToNextStep()">
        Proceed to Ingredient Selection
      </button>
    </div>
  </form>

  
  
  `,
  styles: '',
  imports: [CommonModule, ReactiveFormsModule, BaseDrinkDirective]
})
export class BaseStageComponent {
    // for choosing the foundation of the coffee
    @Input() onNext! : (nextStage: number) => void;
    private orderService = inject(OrderService);

    drinkBases = drinks.map(drink => drink.name);
    baseDrinkForm = new FormGroup({
        baseType: new FormControl('', [Validators.required]),
        strength: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)]),
        temperature: new FormControl('273.15', [Validators.required, Validators.min(60), Validators.max(100)])
    });

    readonly PERFECT_TEMPERATURE = 330.03; // in Kelvin, because why not?

    get isTemperaturePerfect(): boolean {
        const temp = parseFloat(this.baseDrinkForm.get('temperature')?.value || '0')   ;
        return temp === this.PERFECT_TEMPERATURE;
    }

    get temperatureHint(): string {
        const temp = parseFloat(this.baseDrinkForm.get('temperature')?.value || '0');
        if (temp < this.PERFECT_TEMPERATURE) {
            return 'A bit hotter might unlock hidden flavors!';
        } else if (temp > this.PERFECT_TEMPERATURE) {
            return 'Cooling it down could enhance the aroma!';
        } else {
            return 'Perfect choice! This is the optimal brewing temperature.';
        }
    }
        goToNextStep() {
        if (this.baseDrinkForm.valid && this.isTemperaturePerfect) {
            this.orderService.updateState('base', this.baseDrinkForm.value);
            this.onNext(3); 
        }
    }
}