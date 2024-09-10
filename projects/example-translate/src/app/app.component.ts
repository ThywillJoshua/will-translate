import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from 'will-translate';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  translateService = inject(TranslateService);

  constructor() {
    // this.translateService.translations$.subscribe(console.log);
  }

  changeLanguage(lang: string) {
    TranslateService.url.set(`assets/langs/${lang}.json`);
  }
}
