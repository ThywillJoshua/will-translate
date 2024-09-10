import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe, TranslateService } from 'will-translate';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  translateService = inject(TranslateService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    name: '',
  });

  changeLanguage(lang: string) {
    this.translateService.updateUrl(`assets/langs/${lang}.json`);
  }
}
