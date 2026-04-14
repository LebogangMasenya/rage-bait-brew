import { Component, Input, inject } from "@angular/core";
import { UserIdentityPipe } from "../../pipes/user.identity.pipe";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";
import { OrderService } from "../../services/order.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'identity-stage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserIdentityPipe],
  template: `
  <form [formGroup]="userIdentityForm">
    <div class="stage-container">
      <h2>Identify Yourself</h2>
      <p class="instruction">Your name must be compatible with our steam-processing unit.</p>

      <div class="field">
        <label>Legal Name</label>
        <input formControlName="name" placeholder="Type here...">
      </div>

      <div class="field">
        <label>Phone Number</label>
        <input formControlName="phone" placeholder="Digits only (maybe)">
      </div>

      <div class="visual-feedback">
        <p>System Interpretation:</p>
        <div class="cipher-display">
          {{ identityValue | userIdentity }}
        </div>
      </div>

      <button 
        type="button" 
        class="next-btn"
        [disabled]="userIdentityForm.invalid"
        (click)="goToNextStep()">
        Proceed to Liquid Selection
      </button>
    </div>
  </form>
  `,
  styles: `
    .next-btn:disabled { cursor: not-allowed; opacity: 0.5; }
    .cipher-display { font-family: monospace; padding: 10px; background: #b82a2a; }

.stage-container {
  background: #f0f0f0;
  border: 4px inset #ffffff; 
  padding: 2rem;
  max-width: 450px;
  margin: 20px auto;
  box-shadow: 10px 10px 0px #000000; /* Brutalist offset shadow */
  font-family: 'Courier New', Courier, monospace;
}

h2 {
  background: #000080; 
  color: white;
  padding: 10px;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.instruction {
  font-size: 0.8rem;
  color: #555;
  font-style: italic;
  margin-bottom: 20px;
  border-left: 3px solid #ff0000;
  padding-left: 10px;
}

.field {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #333;
}

input {
  border: 2px solid #000;
  padding: 12px;
  font-size: 1.1rem;
  background: #fff;
  transition: all 0.1s;
}

input:focus {
  outline: none;
  background: #ffffcc; 
  border-color: #ff0000;
  box-shadow: 4px 4px 0px #ff0000;
}

.visual-feedback {
  margin-top: 20px;
  border: 1px dashed #666;
  padding: 15px;
  background: #e8e8e8;
}

.visual-feedback p {
  font-size: 0.7rem;
  margin: 0 0 5px 0;
  color: #444;
}

.cipher-display {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 15px;
  background: #000; 
  color: #39ff14; 
  text-align: center;
  border: 3px double #39ff14;
  word-break: break-all;
  min-height: 1.5em;
}


.next-btn {
  width: 100%;
  margin-top: 20px;
  background: #ff4500;
  color: white;
  border: none;
  padding: 15px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  border: 3px solid #000;
  box-shadow: 4px 4px 0px #800000;
  transition: transform 0.05s, box-shadow 0.05s;
}

.next-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #800000;
}

.next-btn:disabled {
  background: #999;
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
  filter: grayscale(1);
}


  `
})
export class IdentityStageComponent {
  @Input() onNext!: (nextStage: number) => void;
  private orderService = inject(OrderService);


  userIdentityForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)])
  });

  get identityValue(): string {
    const { name, phone } = this.userIdentityForm.value;
    return `${name || ''}     ${phone || ''}`;
  }

  goToNextStep() {
    if (this.userIdentityForm.valid) {
      this.orderService.updateState('identity', {name: this.userIdentityForm.value.name || '', number: parseFloat(this.userIdentityForm.value?.phone || '1111111111') || 0});
      this.onNext(2);
    }
  }
}