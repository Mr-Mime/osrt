export class Player {
  id!: number;
  name!: string;
  createTime!: number;
  lastEditTime!: number;
}

export class Location {
  id!: number;
  name!: string;
  createTime!: number;
  lastEditTime!: number;
}

export class Game {
  id!: number;
  won!: boolean;
  points!: number;
  pointsOpponent!: number;
  startTime!: number | null;
  endTime!: number | null;
  duration!: number | null;
  location!: number | null;
  createTime!: number;
  lastEditTime!: number;
}