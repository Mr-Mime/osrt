import { Injectable } from '@angular/core';

// Plugins
import { CapacitorSQLite, CapacitorSQLitePlugin, SQLiteConnection, capSQLiteChanges } from '@capacitor-community/sqlite';

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
   * @returns A promise resolving with an object containig number of changes and id of added entry
   */
  public async addPlayer(name: string): Promise<capSQLiteChanges> {
    var statement = `INSERT INTO players (name) VALUES (?);`;
    var values    = [name];
    
    // Execute the command on the database
    const ret = await CapacitorSQLite.run({
      database: "sqrt",
      statement: statement,
      values: values
    });

    return ret;
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


  /**
   * Retrieve the name of an player by its id.
   * 
   * @param playerId The id of the player
   * @returns Name of the player
   */
  public async getPlayerNameById(playerId: number): Promise<string> {
    const statement = `SELECT name FROM players WHERE id = ${playerId};`;
    const ret = await CapacitorSQLite.query({ database: "sqrt", statement: statement, values: [] });

    return ret.values![0].name;
  }



  /**************************************************************************
   * Location FUNCTIONS
   **************************************************************************/
  
  /**
   * Create the locations table.
   * It will only be created if it does not already exist.
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
   * @returns A promise resolving with an object containig number of changes and id of added entry
   */
  public async addLocation(name: string): Promise<capSQLiteChanges> {
    var statement = `INSERT INTO locations (name) VALUES (?);`;
    var values    = [name];

    // Execute the command on the database
    const ret = await CapacitorSQLite.run({
      database: "sqrt",
      statement: statement,
      values: values
    });
    
    return ret;
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
   * Add an game entry to the data table of the given sport.
   * Note that it will ignore the id, createdTime and lastModifiedTime fields.
   * 
   * @param shortCode The short code for the sport to add a game to
   * @param game An object containing all the game data to save
   * @returns The return code of the database execution containig the number of changes and the latest ID.
   */
  public async addGameForSport(shortCode: string, game: Game): Promise<capSQLiteChanges> {
    var statement = `INSERT INTO ${shortCode}
      (won,             points,           pointsOpponent,         startTime, 
       endTime,         duration,         location) VALUES (?,?,?,?,?,?,?);`;

    var values = [
      game.won,     game.points,   game.pointsOpponent, game.startTime,
      game.endTime, game.duration, game.location];

    // Run the command on the database
    const ret = await CapacitorSQLite.run({
      database: "sqrt",
      statement: statement,
      values: values
    });

    return ret;
  }


  /**
   * Adds an entry in the table which connects players to games.
   * 
   * @param shortCode The short code of the sport to which the game is related
   * @param gameID The id of the game
   * @param playerID The id of the player
   * @param wasOpponent If the player was an opponent or a teammate
   * @returns A promise resolving with an object containig number of changes and id of added entry
   */
  public async addGamePlayerConnection(shortCode: string, gameID: number, playerID: number, wasOpponent: boolean): Promise<capSQLiteChanges> {
    var statement = `INSERT INTO ${shortCode}PlayerConnection
      (gameId, playerId, playerWasOpponent) VALUES (?, ?, ?);`;

    var values = [gameID, playerID, wasOpponent];

    // Execute the command on the database
    const ret = await CapacitorSQLite.run({
      database: "sqrt",
      statement: statement,
      values: values
    });

    return ret;
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
    DROP TABLE IF EXISTS ${shortCode}PlayerConnection;
    DROP TABLE IF EXISTS ${shortCode};`;

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

    const ret = await CapacitorSQLite.query({database: "sqrt", statement: statement, values: []});
    return ret.values!;
  }


  /**
   * Get the number of games that were played for the given sport.
   * 
   * @param shortCode Short code of the sport for which the game count should be returned
   * @returns Number representing the entries in the sports table
   */
  public async getNumberOfGamesOfSport(shortCode: string): Promise<any> {
    var statement = `SELECT COUNT(*) as gameCount FROM ${shortCode};`;

    const ret = await CapacitorSQLite.query({database: "sqrt", statement: statement, values: []});
    return ret.values![0].gameCount;
  }


  /**
   * Get the number of games that were won for the given sport.
   * 
   * @param shortCode Short code of the sport for which won count should be returned
   * @returns Number representing the count of won games
   */
  public async getNumberOfWonGamesOfSport(shortCode: string): Promise<any> {
    var statement = `SELECT COUNT(*) as wonCount FROM ${shortCode} WHERE won=1;`;

    const ret = await CapacitorSQLite.query({database: "sqrt", statement: statement, values: []});
    return ret.values![0].wonCount;
  }


  /**
   * Get the total duration of games for the given sport.
   * This will only look at games where a duration is provided.
   * 
   * @param shortCode Short code of the sport for which duration should be returned
   * @returns Number representing the duration of games in minutes
   */
  public async getDurationOfGamesOfSport(shortCode: string): Promise<any> {
    var statement = `SELECT SUM(duration) as duration FROM ${shortCode} WHERE duration!=NULL;`;

    const ret = await CapacitorSQLite.query({database: "sqrt", statement: statement, values: []});
    return ret.values![0].duration;
  }


  /**
   * Get the number of different players that were opponents for the given sport.
   * 
   * @param shortCode Short code of the sport for which the player count should be returned
   * @returns Number representing the count of different players
   */
  public async getNumberOfOpponentsOfSport(shortCode: string): Promise<any> {
    var statement = `SELECT COUNT(DISTINCT playerId) as playerCount FROM ${shortCode}PlayerConnection;`;

    const ret = await CapacitorSQLite.query({database: "sqrt", statement: statement, values: []});
    return ret.values![0].playerCount;
  }


  /**
   * Get the id of an player, who was the opponent in the given game.
   * 
   * @param shortCode Short code of the sport which the game is from
   * @param gameId The id of the game
   * @returns The players id, who was opponent in the game
   */
  public async getPlayerIdFromGameId(shortCode: string, gameId: number): Promise<number> {
    var statement = `SELECT playerId FROM ${shortCode}PlayerConnection WHERE gameId=${gameId};`;

    const ret = await CapacitorSQLite.query({database: "sqrt", statement: statement, values: []});
    return ret.values![0].playerId;
  }
}
