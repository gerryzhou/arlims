import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class WindowService {
    getWindow(): Window {
        return window;
    }
}