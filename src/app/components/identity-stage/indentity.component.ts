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
      <p class="instruction">Input must be compatible with our steam-processing unit.</p>

      <div class="field">
        <label>Legal Name</label>
        <input formControlName="name" placeholder="Type here...">
      </div>

      <div class="field">
        <label>Verification Number</label>
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
  styles: [`
    .next-btn:disabled { cursor: not-allowed; opacity: 0.5; }
    .cipher-display { font-family: monospace; padding: 10px; background: #eee; }
  `]
})
export class IdentityStageComponent {
    @Input() onNext! : (nextStage: number) => void;
    private orderService = inject(OrderService);
    

    userIdentityForm = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)])
    });

    get identityValue(): string {
        const { name, phone } = this.userIdentityForm.value;
        return `${name || ''} ${phone || ''}`;
    }

    goToNextStep() {
      if (this.userIdentityForm.valid) {
          this.orderService.updateState('identity', this.userIdentityForm.value);
          this.onNext(2); 
      }
    }
}