import fetch from 'node-fetch'
import * as assert from 'assert'

assert.ok(process.env.APP_URL?.length > 0, 'APP_URL not provided')

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
