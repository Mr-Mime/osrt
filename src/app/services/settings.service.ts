import { Injectable, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Capacitor imports
import { Preferences } from '@capacitor/preferences';


export enum ThemeSetting {
  LIGHT,
  DARK,
  SYSTEM
};


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // Language related properties
  private readonly _supportedLangCodes = ["en", "de"];
  private readonly _supportedLanguages = [
    {short: "en", long: "English"},
    {short: "de", long: "Deutsch"}];
  public selectedLanguageSetting: String = "en";
  
  // Theme related properties
  private _prefersDark: MediaQueryList | undefined;
  public selectedThemeSetting = 0;

  constructor(
    private translate: TranslateService,
    private ngZone: NgZone
  ) {
    this.initLanguage();
    this.initColorScheme();
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
    this.translate.setDefaultLang("en");                // Set english as default and fallback

    // Load saved preferences
    Preferences.get({key: 'setting_language'})
    .then(entry => {
      // On first boot when this is not set, we default to english.
      if (entry.value == null) {
        Preferences.set({key: 'setting_language', value: "en"});
        this.selectedLanguageSetting = "en"
        this.translate.use("en");
      } else {
        this.selectedLanguageSetting = entry.value;
        this.translate.use(entry.value);
      }
    });
  }

  public setNewLanguage(newLang: string) {
    this.translate.use(newLang);

    // Save the change
    this.selectedLanguageSetting = newLang;
    Preferences.set({key: 'setting_language', value: newLang});
  }


  /************/
  /* 
  /*  Functions regarding the theme handling
  /* 
  /************/

  /**
   * Initialize the color scheme, used on app startup.
   */
  private initColorScheme() {
    // Listen for changes to the prefers-color-scheme media query.
    // This is needed for following the system theme
    this._prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this._prefersDark.addEventListener('change', (e: any) => this.systemThemeChanged(e.matches))

    // Load saved preference
    Preferences.get({key: 'setting_theme'})
    .then(entry => {
      // On first boot when this is not set, we default to dark theme.
      if (entry.value == null) {
        this.selectedThemeSetting = ThemeSetting.DARK;
        Preferences.set({key: 'setting_theme', value: ThemeSetting.DARK + ""}); // Converting the settings to string
      } else {
        this.selectedThemeSetting = parseInt(entry.value);
        this.updateThemeSetting(this.selectedThemeSetting);
      }
    });
  }


  /**
   * Callback to react to a systemwide theme change.
   * It will only enable/disable the dark theme in the app, if it is set to follow the system setting.
   * 
   * @param isDark {boolen} Wether the theme changed to 'dark' or not
   */
  private systemThemeChanged(isDark: boolean) {
    if (this.selectedThemeSetting == ThemeSetting.SYSTEM) 
      this.toggleDarkTheme(isDark);
  }


  /**
   * Executes all actions needed when the theme setting changed.
   * 
   * @param newValue Reflects the choosen option.
   */
  public updateThemeSetting(newValue: ThemeSetting) {
    this.selectedThemeSetting = newValue;
    switch(newValue) {
      case ThemeSetting.LIGHT:
        this.toggleDarkTheme(false);
        break;

      case ThemeSetting.DARK:
        this.toggleDarkTheme(true);
        break;

      case ThemeSetting.SYSTEM:
        // Check current theme from system and apply it
        var systemIsDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.toggleDarkTheme(systemIsDark.matches);
        break;        
    }

    // Save the change
    Preferences.set({key: 'setting_theme', value: newValue + ""}); // Converting the settings to string
  }


  /**
   * This function adds or removes the 'dark' class from the body element.
   * Thereby it en-/disables the dark theme.
   * 
   * @param shouldEnableDark {boolean} Wether the dark theme should be enabled or not
   */
  private toggleDarkTheme(shouldEnableDark: boolean) {
    if (shouldEnableDark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    return;
  }

}

