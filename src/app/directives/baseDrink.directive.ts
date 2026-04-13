import {Directive, HostListener, ElementRef, Renderer2} from '@angular/core';
import { drinks } from '../data/drinks';
// for bypassing, and touch the DOM directlty
@Directive({
    selector: '[baseDrink]',
    standalone: true
})
export class BaseDrinkDirective {
    // for choosing the foundation of the coffee
    constructor(private el: ElementRef, private renderer: Renderer2) {}
    
    @HostListener('click') onClick() {
        if(Math.random() > 0.5) {
            const x = Math.floor(Math.random() * 100) - 50;
            const y = Math.floor(Math.random() * 100) - 50;
            this.renderer.setStyle(this.el.nativeElement, 'transform', `translate(${x}px, ${y}px)`);
            this.renderer.setStyle(this.el.nativeElement, 'transition', '0.2s');
        }
    }


    @HostListener('mouseover') onMouseOver() {
        // Handle mouseover event
        const drinkBases = drinks.map(drink => drink.name);
        const randomBase = drinkBases[Math.floor(Math.random() * drinkBases.length)];
        this.renderer.setProperty(this.el.nativeElement, 'textContent', randomBase);
    }

}