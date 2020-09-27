import fetch from 'node-fetch'
import { PrismaClient } from "@prisma/client"
import * as assert from 'assert'

import { run } from '../scripts/migrations'
import { PatreonUser } from '../internal/patreon-statistics/domain/patreon-user'

assert.ok(process.env.APP_URL, 'APP_URL not provided')

describe('stats', () => {
    let db: PrismaClient

    beforeAll(async () => {
        await run()

        db = new PrismaClient()
        await db.$connect()
    })

    afterAll(async () => {
        await db.$disconnect()
    })

    test('/10-users', async () => {
        await db.patreon_user.deleteMany({})
        
        const insertedUsers: PatreonUser[] = []
        for (let i = 0; i < 15; i++) {
            insertedUsers.push({
                id: String(i)
            })
            await db.patreon_user.create({
                data: { id: String(i) }
            })
        }

        let gotUsers: PatreonUser[]
        try {
            const res = await fetch('http://' + process.env.APP_URL + '/10-users')
            gotUsers = await res.json()
        } catch (err) {
            fail(['request failed with', err])
        }

        expect(gotUsers.length).toBe(10)
        expect(gotUsers.every(({id}) => insertedUsers.map(({id}) => id).includes(id)))
    })
})
