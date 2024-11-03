import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nl2br',
  standalone: true
})
export class Nl2brPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    const boldFormatted = value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return boldFormatted.replace(/\n/g, '<br>');
  }
}