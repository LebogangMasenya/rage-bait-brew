import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

import { BaseStageComponent } from './components/base-stage/base.component';
import { IdentityStageComponent } from './components/identity-stage/indentity.component';
import { IngredientStageComponent } from './components/ingredient-stage/ingredient.component';
import { PaymentStageComponent } from './components/payment-stage/payment.component';
import { SuccessStageComponent } from './components/success-stage/success.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, StepperModule, BaseStageComponent, IdentityStageComponent, IngredientStageComponent, PaymentStageComponent, SuccessStageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('rage-bait-brew');
  protected activeStep = signal(1);
}
