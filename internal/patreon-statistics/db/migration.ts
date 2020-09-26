import type { IDB } from './db'

export const runMigrations = async (db: IDB) => {
    await db.query(`
        create table if not exists patreon_user (
            id varchar(120) primary key
        )
    `)

    await db.query(`
        create table if not exists snapshot (
            user_id         varchar(120) references patreon_user (id),
            monthly_earning decimal check (monthly_earning > 0),
            patrons_count   bigint check (patrons_count > 0),
            ts              timestamp,

            primary key (ts, user_id)
        )
    `)
}
