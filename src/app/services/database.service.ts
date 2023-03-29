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
}
