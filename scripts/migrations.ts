import * as assert from 'assert'
import { PrismaClient } from "@prisma/client"

assert.ok(process.env?.DATABASE_URL, `DATABASE_URL doesn't set`)

export const run = async () => {
    try {
        const db = new PrismaClient()

        await db.$connect()

        await db.$queryRaw(`
            create table if not exists patreon_user (
                id varchar(120) primary key
            )
        `)
    
        await db.$queryRaw(`
            create table if not exists snapshot (
                user_id         varchar(120) references patreon_user (id),
                monthly_earning decimal check (monthly_earning > 0),
                patrons_count   bigint check (patrons_count > 0),
                ts              timestamp,
    
                primary key (ts, user_id)
            )
        `)

        await db.$disconnect()
    } catch (err) {
        console.log('Failed to run migrations', err)
    }
}
