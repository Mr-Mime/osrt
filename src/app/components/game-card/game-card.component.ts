import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent  implements OnInit {
  @Input() points: number = 0;
  @Input() pointsOpponent: number = 0;
  @Input() duration: number = -1;
  @Input() won: boolean = false;
  @Input() location: string = "";
  @Input() playerName: string = "";
  @Input() date: number = -1;

  formattedDate = "";


  constructor(
    private translate: TranslateService 
  ) { }

  ngOnInit() {
    this.formatDate();
  }


  /**
   * Format the date timestamp to an string, also based on the selected language
   */
  private formatDate() {
    // Use our own date format
      let d = new Date(this.date * 1000);
      let options: Intl.DateTimeFormatOptions = {
        day:    "numeric",
        month:  "short",
        year:   "2-digit",
        minute: "2-digit",
        hour:   "2-digit"
      };
      this.formattedDate = d.toLocaleDateString(this.translate.currentLang, options);
  }
}
