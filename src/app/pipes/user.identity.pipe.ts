import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userIdentity',
  pure: false 
})
export class UserIdentityPipe implements PipeTransform {
  transform(value: string, shift: number = 3): string {
    if (!value) return 'Awaiting Identity... ';

    const shifted = value.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 97 ? 97 : 65;
        // Shift Logic, how evil
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    }).join('');

    return `${shifted} (Shifted by ${shift})`; // Just to show off the shift amount, because why not?
  }
}