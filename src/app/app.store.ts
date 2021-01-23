import createStore from './store/store';
import { InjectionToken } from '@angular/core';

export const APP_STORE = new InjectionToken('APP_STORE');
export const appStore  = createStore({});
