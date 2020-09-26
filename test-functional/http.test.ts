import fetch from 'node-fetch'
import { Client } from 'pg'
import * as assert from 'assert'

assert.ok(process.env.APP_URL, 'APP_URL not provided')

describe('stats', () => {
    beforeAll(() => {
        const client = new Client({
            database: 'test',
            password: 'test',
            user: 'test',
            host: 'db',
        })

        client.connect()
    })

    test('should return empty array of snapshots', async (done) => {
        try {
            const res = await fetch('http://' + process.env.APP_URL + '/statistics')
            const data = await res.json()
    
            assert.deepStrictEqual(data, [])
        } catch (err) {
            fail(['request failed with', err])
        }
    
        done()
    })
})
