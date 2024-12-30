import { Injectable } from "@angular/core";
import { NgToastService } from "ng-angular-popup";

@Injectable({
    providedIn: "root"
})
export class PopupService {
    constructor(private toast: NgToastService){}

    public openWarning(message: string) {
        this.toast.warning(message, 'Warning', 5000)
    }

    public openSuccess(message: string) {
        this.toast.success(message, 'Success', 5000)
    }

    public openError(message: string) {
        this.toast.danger(message, 'An error occured', 5000)
    }
}