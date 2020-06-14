import {Pipe, PipeTransform} from '@angular/core';
import {DictionariesService} from "../services/api/dictionaries-api.service";

@Pipe({
    name: 'getValueFromDictionary',
    pure: false
})
export class GetValueFromDictionaryPipe implements PipeTransform {
    constructor(public dictionariesApi: DictionariesService) {
    }

    transform(code: string, dictionaryName: string): any {
        if (this.dictionariesApi.dictionaries) {
            if (this.dictionariesApi.dictionaries[dictionaryName]) {
                for (let i = 0; i < this.dictionariesApi.dictionaries[dictionaryName].length; i++) {
                    if (this.dictionariesApi.dictionaries[dictionaryName][i].code == code) {
                        return this.dictionariesApi.dictionaries[dictionaryName][i].description;
                    }
                }
            }
        }
    }
}