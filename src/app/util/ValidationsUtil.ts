import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class ValidationsUtil {
    checkIfLesserOptionPage(records: number, optionsPage: number[]): boolean {
        for (const num of optionsPage) {
            if (records < num) {
                return true;
            }
        }
        return false;
    }

    isOneYearOfDifference(dateOne: Date, dateTwo: Date): boolean {
        let result = false

        const yearDateOne = dateOne.getFullYear();
        const yearDateTwo = dateTwo.getFullYear();
        const monthDateOne = dateOne.getMonth() + 1;
        const monthDateTwo = dateTwo.getMonth() + 1;
        const dayDateOne = dateOne.getUTCDate();
        const dayDateTwo = dateTwo.getUTCDate();

        const leapYear = monthDateOne === 2 && monthDateTwo === 2 && ((dayDateOne === 28 && dayDateTwo === 29) || (dayDateOne === 29 && dayDateTwo === 28));
        const commonYear = monthDateOne === monthDateTwo && dayDateOne === dayDateTwo

        result = yearDateOne - yearDateTwo === 1 && (commonYear || leapYear);

        return result;
    }

}