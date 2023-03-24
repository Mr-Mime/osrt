import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-winrate-circle',
  templateUrl: './winrate-circle.component.html',
  styleUrls: ['./winrate-circle.component.scss'],
})
export class WinrateCircleComponent  implements OnInit {
  @Input() percentage: number = 0;

  public position = 0;

  constructor() { }

  ngOnInit() {}

  ngAfterContentInit() {
    this.position = (10 + this.percentage * 0.8)
  }
}
