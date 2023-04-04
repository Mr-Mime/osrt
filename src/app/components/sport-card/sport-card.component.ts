import { Component, OnInit, Input } from '@angular/core';

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
  

  constructor() { }

  ngOnInit() {}

}
