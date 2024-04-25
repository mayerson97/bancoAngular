import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class ValidationsUtil {
    checkIfLesserOptionPage(records: number, optionsPage: number[]) {
        for (const num of optionsPage) {
            if (records < num) {
                return true;
            }
        }
        return false;
    }

}