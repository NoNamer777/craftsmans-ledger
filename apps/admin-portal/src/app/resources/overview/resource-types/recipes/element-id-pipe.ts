import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'elementId',
    pure: true,
})
export class ElementIdPipe implements PipeTransform {
    public transform(value: number, prefix: string, type: string) {
        return `${prefix}-${type}-${value}`;
    }
}
