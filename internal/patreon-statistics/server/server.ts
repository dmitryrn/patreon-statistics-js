import * as express from 'express'
import * as http from 'http'
import { Socket } from 'net'
import * as winston from 'winston'

export const newServer = (config: Config, logger: winston.Logger): IServer => {
    return new Server(config, logger)
}

type Config = {
    port: number
    routes: {
        path: string
        method: 'get' | 'post'
        handler: (r: express.Request) => Promise<any>
    }[]
}

interface IServer {
    listen: () => Promise<void>
    shutDown: () => Promise<void>
}

// do not import outside server dir, use newServer instead
export class Server implements IServer {
    private config: Config
    private app: express.Express
    private logger: winston.Logger
    private httpServer: http.Server
    private connections: Socket[] = []

    constructor(config: Config, logger: winston.Logger) {
        this.config = config
        this.app = express()
        this.logger = logger

        this.config.routes.forEach(({ method, handler, path }) => {
            if (method == 'get') {
                this.app.get(path, async (req, res) => {
                    let status = 500
                    let data = '<not assigned>'
                    let error = null
                    try {
                        data = await handler(req)
                        status = 200
                        res.json(data)
                    } catch (err) {
                        status = 500
                        error = err
                        res.status(status).end()
                    } finally {
                        this.logger.log(
                            error === null ? 'info' : 'error',
                            'request finished',
                            {
                                path,
                                status,
                                data,
                                errorMessage: error?.message,
                                errorCode: error?.code,
                                errorStack: error?.stack,
                            }
                        )
                    }
                })
            }
        })
    }

    listen(): Promise<void> {
        return new Promise((resolve) => {
            this.httpServer = this.app.listen(this.config.port, () => {
                this.logger.info('Server listen on port', {
                    port: this.config.port,
                })
                resolve()
            })

            this.httpServer.on('connection', (connection) => {
                this.connections.push(connection)
                connection.on(
                    'close',
                    () =>
                        (this.connections = this.connections.filter(
                            (curr) => curr !== connection
                        ))
                )
            })
        })
    }

    shutDown(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.logger.info('Shutting down server')
            this.httpServer.close(() => {
                this.logger.info('Closed out remaining connections')
                resolve()
                // process.exit(0)
            })

            setTimeout(() => {
                reject(
                    Error(
                        'Could not close connections in time, forcefully shutting down'
                    )
                )
                // process.exit(1)
            }, 10000)

            this.connections.forEach((curr) => curr.end())
            setTimeout(
                () => this.connections.forEach((curr) => curr.destroy()),
                5000
            )
        })
    }
}
