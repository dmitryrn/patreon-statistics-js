import * as pg from 'pg'
import { runMigrations } from './migration'
import { Result, err, ok } from 'neverthrow'

export type Config = {
    password: string
    user: string
    database: string
    host: string
}

export interface IDB {
    query<R>(sql: string, params?: any[]): Promise<Result<pg.QueryResult<R>, Error>>
    connect(): Promise<Result<null, Error>>
}

export const newDB = (config: Config): IDB => new DB(config)

class DB implements IDB {
    client: pg.Client

    constructor(config: Config) {
        this.client = new pg.Client(config)
    }

    async connect(): Promise<Result<null, Error>> {
        try {
            await this.client.connect()
            return ok(null)
        } catch (error) {
            return err(error)
        }
    }

    async runMigrations(): Promise<Result<null, Error>> {
        try {
            await runMigrations(this)
            return ok(null)
        } catch (error) {
            return err(error)
        }
    }

    async query<R>(sql: string, params?: any[]): Promise<Result<pg.QueryResult<R>, Error>> {
        try {
            return ok(await this.client.query<R>(sql, params))
        } catch (error) {
            return err(error)
        }
    }
}
