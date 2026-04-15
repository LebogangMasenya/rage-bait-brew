export interface OrderState {
  identity?:    { name: string; number: number };
  base?:        { coffeeSize: string; coffeeStrength: string };
  ingredients?: { coffeeType: string; milkType: string; sugarAmount: number; };
  payment?:     { cardNumber: string };
  success?:     { message: string };
}