import { Injectable } from '@angular/core';

// Plugins
import { CapacitorSQLite, CapacitorSQLitePlugin, SQLiteConnection } from '@capacitor-community/sqlite';

// Models
import { Player } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {


  private sqlitePlugin!: CapacitorSQLitePlugin;
  private sqliteConnection!: SQLiteConnection;

  private readonly createSchema: string = `
  CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      last_modified INTEGER DEFAULT (strftime('%s', 'now'))
  );`

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
        CapacitorSQLite.execute({database: "sqrt", statements: this.createSchema})
        .then((changes) => {
          console.log("DB-Service: Changes: " + changes.changes?.changes);
        })
      })
      
    });
  }



  /**************************************************************************
   * PLAYER FUNCTIONS
   **************************************************************************/

  /**
   * Add a new player to the players table.
   * 
   * @param name {string} The name of the new player that should be added
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
   * @returns {Promise<Array<Player>>} An array of all saved players 
   */
  public async getAllPlayers(): Promise<Array<Player>> {
    const statement = `SELECT * FROM players;`;
    const ret = await CapacitorSQLite.query({ database: "sqrt", statement: statement, values: [] });
    return ret.values!;
  }


  /**
    * Delete a player from the database.
    *
    * @param playerID {number} The id of the player that should be deleted
    */
  public async deletePlayer(playerID: number) {
    const statement = `DELETE FROM players WHERE id = ${playerID};`;
    const ret = await CapacitorSQLite.execute({database: "sqrt", statements: statement});
  }



  /**************************************************************************
   * SPORTS FUNCTIONS
   **************************************************************************/

  /**
   * Creates a table to store games of this sport and a table to connect those to players.
   * 
   * @param shortCode {string} The short code of the sport for which data tables should be created
   */
  public async createSportsTable(shortCode: string) {
    var statement =
    `CREATE TABLE IF NOT EXISTS ${shortCode} (
      id INTEGER PRIMARY KEY NOT NULL,
      createTime DATETIME NOT NULL,
      lastEditTime DATETIME NOT NULL,
      startTime DATETIME,
      endTime DATETIME,
      duration INTEGER,
      won BOOLEAN NOT NULL,
      points INTEGER NOT NULL,
      pointsOpponent INTEGER NOT NULL,
      location INTEGER NOT NULL,
      FOREIGN KEY(location) REFERENCES Locations(id)
    );`

    await CapacitorSQLite.execute({database: "sqrt", statements: statement});

    statement =
    `CREATE TABLE IF NOT EXISTS ${shortCode}PlayerConnection (
      gameId INTEGER NOT NULL,
      playerId INTEGER NOT NULL,
      playerWasOpponent BOOLEAN NOT NULL,
      FOREIGN KEY(gameId) REFERENCES ${shortCode}(id),
      FOREIGN KEY(playerId) REFERENCES Players(id)
    );`

    await CapacitorSQLite.execute({database: "sqrt", statements: statement});
  }

  
  /**
   * Removes the table in which games for this sport are saved and the table connecting
   * the games to players.
   * !!! After this all data related to this sport is lost !!!
   * 
   * @param shortCode {string} The short code for  which the data tables should be deleted
   */
  public async removeSportsTable(shortCode: string) {
    var statement = `
      DROP TABLE IF EXISTS ${shortCode};
      DROP TABLE IF EXISTS ${shortCode}PlayerConnection;`;

    await CapacitorSQLite.execute({database: "sqrt", statements: statement});
  }
}
