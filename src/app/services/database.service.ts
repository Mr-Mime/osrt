import { Injectable } from '@angular/core';

// Plugins
import { CapacitorSQLite, CapacitorSQLitePlugin, SQLiteConnection } from '@capacitor-community/sqlite';

// Models
import { Player, Location, Game } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {


  private sqlitePlugin!: CapacitorSQLitePlugin;
  private sqliteConnection!: SQLiteConnection;

  constructor() { }


  /**
   * This will init the data base connection.
   */
  public initDataBase() {
    console.log("DB-Service: Init");
    
    CapacitorSQLite.createConnection({database: "sqrt"})
    .then(() => {
      console.log("Created connection");
      CapacitorSQLite.open({database: "sqrt"})
      .then(() => {
        console.log("Opened database");
        this.createPlayersTable();
        this.createLocationsTable();
      })
    });
  }



  /**************************************************************************
   * PLAYER FUNCTIONS
   **************************************************************************/

  /**
   * Create the players table.
   * It will only be created if it does not exist already.
   */
  private async createPlayersTable() {
    var statement = `CREATE TABLE IF NOT EXISTS players (
      id           INTEGER PRIMARY KEY NOT NULL,
      name         TEXT                NOT NULL,
      createTime   DATETIME DEFAULT (strftime('%s', 'now')),
      lastEditTime DATETIME DEFAULT (strftime('%s', 'now'))
    );`;

    CapacitorSQLite.execute({database: "sqrt", statements: statement});
  }


  /**
   * Add a new player to the players table.
   * 
   * @param name The name of the new player that should be added
   */
  public async addPlayer(name: string): Promise<any> {
    var statement = `INSERT INTO players (name) VALUES ('${name}');`;
    const ret = await CapacitorSQLite.execute({database: "sqrt", statements: statement})
    
    if (ret.changes!.changes != 1) {
      return Promise.reject("Failed to add player!");
    }

    return Promise.resolve();
  }


  /**
   * Returns a promise which resolves with all saved players.
   * 
   * @returns An array of all saved players 
   */
  public async getAllPlayers(): Promise<Array<Player>> {
    const statement = `SELECT * FROM players;`;
    const ret = await CapacitorSQLite.query({ database: "sqrt", statement: statement, values: [] });
    return ret.values!;
  }


  /**
    * Delete a player from the database.
    *
    * @param playerID The id of the player that should be deleted
    */
  public async deletePlayer(playerID: number) {
    const statement = `DELETE FROM players WHERE id = ${playerID};`;
    const ret = await CapacitorSQLite.execute({database: "sqrt", statements: statement});
  }



  /**************************************************************************
   * Location FUNCTIONS
   **************************************************************************/
  
  /**
   * Create the locations table.
   * It will only be created if it does not exist already.
   */
  private async createLocationsTable() {
    var statement = `CREATE TABLE IF NOT EXISTS locations (
      id           INTEGER  PRIMARY KEY NOT NULL,
      name         TEXT                 NOT NULL,
      createTime   DATETIME DEFAULT (strftime('%s', 'now')),
      lastEditTime DATETIME DEFAULT (strftime('%s', 'now'))
    );`;

    CapacitorSQLite.execute({database: "sqrt", statements: statement});
  }


  /**
   * Add a new location to the locations table.
   * 
   * @param name The name of the new location that should be added
   */
  public async addLocation(name: string): Promise<any> {
    var statement = `INSERT INTO locations (name) VALUES ('${name}');`;
    const ret = await CapacitorSQLite.execute({database: "sqrt", statements: statement})
    
    if (ret.changes!.changes != 1) {
      return Promise.reject("Failed to add location!");
    }

    return Promise.resolve();
  }


  /**
   * Returns a promise which resolves with all saved locations.
   * 
   * @returns An array of all saved locations 
   */
  public async getAllLocations(): Promise<Array<Location>> {
    const statement = `SELECT * FROM locations;`;
    const ret = await CapacitorSQLite.query({ database: "sqrt", statement: statement, values: [] });
    return ret.values!;
  }


  /**
    * Delete a location from the database.
    *
    * @param locationID The id of the location that should be deleted
    */
  public async deleteLocation(locationID: number) {
    const statement = `DELETE FROM locations WHERE id = ${locationID};`;
    const ret = await CapacitorSQLite.execute({database: "sqrt", statements: statement});
  }



  /**************************************************************************
   * SPORTS FUNCTIONS
   **************************************************************************/

  /**
   * Creates a table to store games of this sport and a table to connect those to players.
   * 
   * @param shortCode The short code of the sport for which data tables should be created
   */
  public async createSportsTable(shortCode: string) {
    // Statement to create the game table for the given sport
    var statement = `CREATE TABLE IF NOT EXISTS ${shortCode} (
      id           INTEGER PRIMARY KEY NOT NULL,
      won          BOOLEAN   NOT NULL,
      points       INTEGER   NOT NULL,
      pointsOpponent INTEGER NOT NULL,
      startTime    DATETIME,
      endTime      DATETIME,
      duration     INTEGER,
      location     INTEGER,
      createTime   DATETIME DEFAULT (strftime('%s', 'now')),
      lastEditTime DATETIME DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY(location) REFERENCES Locations(id)
    );`;

    await CapacitorSQLite.execute({database: "sqrt", statements: statement});

    // Statement to create the table for the game and player connection
    statement = `CREATE TABLE IF NOT EXISTS ${shortCode}PlayerConnection (
      gameId            INTEGER NOT NULL,
      playerId          INTEGER NOT NULL,
      playerWasOpponent BOOLEAN NOT NULL,
      FOREIGN KEY(gameId)   REFERENCES ${shortCode}(id),
      FOREIGN KEY(playerId) REFERENCES Players(id)
    );`;

    await CapacitorSQLite.execute({database: "sqrt", statements: statement});
  }

  
  /**
   * Removes the table in which games for this sport are saved and the table connecting
   * the games to players.  
   * !!! After this all data related to this sport is lost !!!
   * 
   * @param shortCode The short code for which the data tables should be deleted
   */
  public async removeSportsTable(shortCode: string) {
    var statement = `
      DROP TABLE IF EXISTS ${shortCode};
      DROP TABLE IF EXISTS ${shortCode}PlayerConnection;`;

    await CapacitorSQLite.execute({database: "sqrt", statements: statement});
  }


  /**
   * This will load all saved games for the given sport.
   * 
   * @param shortCode Short code of the sport for which all games should be returned
   * @returns An array of all saved games for this sport
   */
  public async getAllGamesOfSport(shortCode: string): Promise<Array<Game>> {
    var statement = `SELECT * FROM ${shortCode};`;

    const ret = await CapacitorSQLite.query({ database: "sqrt", statement: statement, values: [] });
    return ret.values!;
  }

  
  /**
   * Add an game entry to the data table of the given sport.
   * Note that it will ignore the id, createdTime and lastModifiedTime fields.
   * 
   * @param shortCode The short code for the sport to add a game to
   * @param game An object containing all the game data to save
   */
  public async addGameForSport(shortCode: string, game: Game) {
    var statement = `INSERT INTO ${shortCode}
      (won,             points,           pointsOpponent,         startTime, 
       endTime,         duration,         location) VALUES 
      (${game.won},     ${game.points},   ${game.pointsOpponent}, ${game.startTime}, 
       ${game.endTime}, ${game.duration}, ${game.location}
    );`;

    const ret = await CapacitorSQLite.execute({database: "sqrt", statements: statement})
  }


}
