import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'getValues',
    pure: false
})

export class KeysPipe implements PipeTransform {
    transform(value, args: string[]): any {
        let keys = [];
        for (let key in value) {
            if (!value.hasOwnProperty(key)) continue;
            value[key].key = key;
            keys.push(value[key]);
            // keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}