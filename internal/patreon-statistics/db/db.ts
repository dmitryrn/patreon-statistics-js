import * as postgres from 'postgres'
import { runMigrations } from './migration'

export const newDB = async () => {
    const db = postgres({
        database: 'test',
        password: 'test',
        user: 'test',
    })

    await runMigrations(db)

    return db
}
