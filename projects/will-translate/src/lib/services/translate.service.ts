import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { Observable, filter, from, take, tap } from 'rxjs';
import { ITranslateConfig } from '../models/translate.models';
import {
  getTranslation,
  keyNotFoundError,
  replacePlaceholders,
} from '../utils/translate.utils';
import { toObservable } from '@angular/core/rxjs-interop';
import { MockTranslateService } from './mockTranslateService';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  static url: WritableSignal<string>;
  static country: WritableSignal<string>;

  private translations = signal<Record<string, any> | null>(null);

  constructor() {
    //updateTranslations when url changes
    effect(() => {
      this.getTranslations(TranslateService.url())
        .pipe(
          take(1),
          tap((t) => this.translations.set(t))
        )
        .subscribe();
    });
  }

  private getTranslations(url: string) {
    return from(
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .catch((err) => {
          console.error(err.message);
          return null;
        })
    );
  }

  private getData(key: string, values?: Record<string, any>): Signal<string> {
    return computed(() => {
      if (!this.translations()) {
        return '';
      }

      if (!key) {
        return '';
      }

      //getTranslation
      const keys = key.split('.');
      const { translation, found } = getTranslation(this.translations(), keys);
      if (!found) {
        console.warn(keyNotFoundError(key, TranslateService.url()));
        return key;
      }

      //replace Values
      const hasReplacementValues = values && Object.keys(values).length > 0;
      if (hasReplacementValues) {
        return replacePlaceholders(translation, values);
      }

      return translation;
    });
  }

  translate(key: string, values?: Record<string, any>): string {
    return this.getData(key, values)();
  }

  translate$(key: string, values?: Record<string, any>): Observable<string> {
    return toObservable(this.getData(key, values)).pipe(filter(Boolean));
  }
}

export function provideTranslate(data: ITranslateConfig) {
  TranslateService.url = signal(data.initialUrl);
  TranslateService.country = signal(data.initialCountry);
  return TranslateService;
}

export function provideTranslateTestModule() {
  return { provide: TranslateService, useClass: MockTranslateService };
}
