import * as express from 'express'
import * as http from 'http'
import { Socket } from 'net'

import { IContainer } from '../container'

export const newServer = (config: Config, container: IContainer): IServer => {
    return new Server(config, container)
}

export type Config = {
    port: number
    routes: {
        path: string
        method: 'get' | 'post'
        handler: (r: express.Request) => Promise<any>
    }[]
}

export interface IServer {
    listen: () => Promise<void>
    shutDown: () => Promise<void>
}

// do not import outside server dir, use newServer instead
export class Server implements IServer {
    private config: Config
    private app: express.Express
    private container: IContainer
    private httpServer: http.Server | null = null
    private connections: Socket[] = []

    constructor(config: Config, container: IContainer) {
        this.config = config
        this.app = express()
        this.container = container

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
                        this.container.logger.log(
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
                this.container.logger.info('Server listen on port', {
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
            this.container.logger.info('Shutting down server')
            
            if (!this.httpServer) {
                this.container.logger.info(`Class Server doesn't have httpServer property, resolving`)
                resolve()
                return
            }

            this.httpServer.close(() => {
                this.container.logger.info('Closed out remaining connections')
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
