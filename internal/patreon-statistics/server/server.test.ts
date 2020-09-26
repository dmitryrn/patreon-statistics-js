import * as winston from 'winston'
import * as Transport from 'winston-transport'
import { createMock } from 'ts-auto-mock';

import { Server } from './server'
import { IContainer } from '../container'

class DebugTransport extends Transport {
    private logs: any[]

    constructor(logs: any[]) {
        super()
        this.logs = logs
    }

    log(info: any, callback: any) {
        setImmediate(() => {
            this.logs.push(info)
            this.emit('logged', info)
        })

        callback()
    }
}

test('test start and shutdown', async () => {
    const containerMock = createMock<IContainer>()

    const logs: any[] = []

    const logger = winston.createLogger({
        transports: [
            new winston.transports.Console(),
            new DebugTransport(logs),
        ],
    })

    const s = new Server(
        {
            port: 8998,
            routes: [],
        },
        containerMock,
    )

    await s.listen()

    await s.shutDown()

    await new Promise((r) => setTimeout(r, 500))

    const mustIncludeMessages = [
        'Server listen on port',
        'Shutting down server',
        'Closed out remaining connections',
    ]
    const len = logs.filter((info: any) =>
        mustIncludeMessages.some((m) => info.message == m)
    ).length

    expect(len).toBe(3)
})
