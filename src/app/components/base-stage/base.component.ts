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
        <select formControlName="baseType" >
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
        [disabled]="baseDrinkForm.invalid || !isTemperaturePerfect"
        (click)="goToNextStep()">
        Proceed to Ingredient Selection
      </button>
    </div>
  </form>

  
  
  `,
  styles: `
.stage-container {
  background: #e0e0e0;
  border: 4px solid #4a4a4a;
  padding: 2rem;
  max-width: 450px;
  margin: 20px auto;
  box-shadow: 12px 12px 0px #222;
  font-family: 'Courier New', Courier, monospace;
  position: relative;
  overflow: hidden;
}



h2 {
  background: #222;
  color: #fbff00; 
  margin: 0 -2rem 1.5rem -2rem;
  padding: 15px;
  font-size: 1.1rem;
  text-align: center;
  border-bottom: 4px solid #fbff00;
}

.instruction {
  font-size: 0.75rem;
  background: #fff;
  padding: 8px;
  border: 1px solid #999;
  color: #ff0000;
  font-weight: bold;
  text-transform: uppercase;
}


.field {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #444;
  margin-bottom: 4px;
}

select {
  appearance: none;
  padding: 10px;
  border: 2px solid #000;
  font-family: inherit;
  cursor: help; 
}

/* Inputs */
input[type="number"] {
  border: 2px solid #000;
  padding: 10px;
  background: #333;
  color: #fbff00; 
  font-size: 1.2rem;
}

input:focus {
  outline: 3px solid #ff00ff; /* Jarring Magenta focus */
}

/* Kelvin Logic Styles */
.hint {
  display: block;
  margin-top: 5px;
  font-size: 0.7rem;
  font-weight: bold;
  color: #0000ff; 
  min-height: 1rem;
}

.next-btn {
  width: 100%;
  padding: 20px;
  background: #00ff00;
  color: #000;
  font-weight: 900;
  border: 4px solid #000;
  text-transform: uppercase;
  letter-spacing: 3px;
  transition: all 0.05s;
}

.next-btn:disabled {
  background: #555;
  color: #888;
  cursor: not-allowed;
  filter: blur(1px); 
}

.next-btn:not(:disabled):hover {
  background: #fff;
  color: #ff0000;
  box-shadow: 0 0 20px #00ff00;
}
  
  
  `,
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
        temperature: new FormControl('273.15', [Validators.required])
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
            this.orderService.updateState('base', {
                coffeeSize: this.baseDrinkForm.value.baseType || '',
                coffeeStrength: this.baseDrinkForm.value.strength?.toString() || ''
            });
            this.onNext(3); 
        }
    }
}