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

    test('should return empty array of snapshots', async (done) => {
        await db.patreon_user.deleteMany({})
        
        const expectedIDs: PatreonUser[] = []
        for (let i = 0; i < 15; i++) {
            expectedIDs.push({
                id: String(i)
            })
            await db.patreon_user.create({
                data: { id: String(i) }
            })
        }

        try {
            const res = await fetch('http://' + process.env.APP_URL + '/10-users')
            const data = await res.json()
    
            assert.deepStrictEqual(data, expectedIDs)
        } catch (err) {
            fail(['request failed with', err])
        }
    
        done()
    })
})
