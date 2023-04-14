import { Component, Input, OnInit } from '@angular/core';

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


  constructor() { }

  ngOnInit() {}

}
