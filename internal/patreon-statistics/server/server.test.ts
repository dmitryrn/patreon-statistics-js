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

    expect(containerMock.logger.info).toBeCalledWith('Server listen on port', {"port": 8998})
    expect(containerMock.logger.info).toBeCalledWith('Shutting down server')
    expect(containerMock.logger.info).toBeCalledWith('Closed out remaining connections')
})
