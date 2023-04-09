import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sport-card',
  templateUrl: './sport-card.component.html',
  styleUrls: ['./sport-card.component.scss'],
})
export class SportCardComponent  implements OnInit {
  @Input() hoursPlayed: number = 0;
  @Input() imagePath: string = "";
  @Input() sportName: string = "";
  @Input() iconPath: string = "";
  @Input() winrate: number = 0;
  @Input() games: number = 0;
  @Input() playerCount: number = 0;
  @Input() isInEditMode: boolean = false;
  
  @Output() onDeleteSport = new EventEmitter();


  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit() {}

  /**
   * Emits an event when the delete button was pressed
   */
  public deleteButtonPressed() {
    this.onDeleteSport.emit();
  }

}
