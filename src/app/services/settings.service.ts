import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly _supportedLangCodes = ["en", "de"];
  private readonly _supportedLanguages = [
    {short: "en", long: "English"},
    {short: "de", long: "Deutsch"}];


  constructor(
    private translate: TranslateService
  ) {
    this.initLanguage();
  }

  // Getters and setters
  public get supportedLanguages() {
    return this._supportedLanguages;
  }


  /**
   * Initialize the used languages.
   */
  public initLanguage() {
    this.translate.addLangs(this._supportedLangCodes);
    this.translate.setDefaultLang("en");
  }

  public setNewLanguage(newLang: string) {
    this.translate.use(newLang);
  }
}
