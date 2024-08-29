export interface ITranslateConfig {
  initialUrl: string;
  initialCountry: string;
}

export interface IGetTranslation {
  translation: string;
  found: boolean;
}
