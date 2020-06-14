import {Injectable} from '@angular/core';

@Injectable()
export class FiltersService {
    prevChar: String;

    dictionaryFilterByCode(dictionary: any, code: any) {
        if (dictionary && code) {
            let tmpObj = dictionary.filter(function (item) {
                return item.code === code;
            });
            return tmpObj['description'];
        }
        return null;
    }

    createObject(propName, propValue) {
        this[propName] = propValue;
    }

    setNgbDate(date: any) {
        return date != null ? {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate()
        } : {
            year: '',
            month: '',
            day: ''
        };
    }

    getUTCDate(NgbDate: any) {
        if (!NgbDate) return '';
        return `${NgbDate['year']}-${NgbDate['month']}-${NgbDate['day']}T00:00:00` || '';
    }

    setCustomNgbDate(year, month, day?) {
        return {
            year: year,
            month: month,
            day: day || 1
        }
    }



    keyPressStringRestricts(event: any) {
        const pattern = /[0-9A-z\u0590-\u05fe\+\-\ \"\.]/;
        this.prevChar = this.patternRestrictor(event, pattern);
    }

    keyPressNumberRestricts(event: any) {
        const pattern = /[0-9\.]/;
        this.prevChar = this.patternRestrictor(event, pattern);
    }

    keyPressPhoneNumberRestricts(event: any) {
        const pattern = /^[0-9()\-+]*$/;
        this.prevChar = this.patternRestrictor(event, pattern);
    }

    keyPressEmailRestrict(event: any) {
        const pattern = /[\u0590-\u05fe\S+@\u0590-\u05fe\S+\.\u0590-\u05fe\S+]/;
        this.prevChar = this.patternRestrictor(event, pattern);
    }

    patternRestrictor(event, pattern) {
        // console.log(event.key, pattern);
        if (event.key !== 'Backspace' && event.key !== 'Delete') {
            if (event.target.value.length > 249 ||
                !pattern.test(String.fromCharCode(event.charCode)) ||
                (event.key === ' ' && event.target.value[event.target.value.length - 1] === ' '))
                event.preventDefault();
        }

        return (event.key);
    }
}