import * as winston from 'winston'

import * as server from './server/server'
import * as db from './db/db'

export interface IContainer {
    readonly logger: winston.Logger
    readonly server: server.IServer
    readonly db: db.IDB
}

export const newContainer = (serverConfig: server.Config, dbConfig: db.Config): IContainer => new Container(serverConfig, dbConfig)

class Container implements IContainer {
    deps = new Map<string, any>()

    constructor(
        private serverConfig: server.Config,
        private dbConfig: db.Config,
    ) {

    }

    getDep<T>(key: string, create: () => T) {
        if (this.deps.has(key)) {
            return this.deps.get(key)
        }

        const dep = create()
        this.deps.set(key, dep)
        
        return dep
    }

    get logger(): winston.Logger {
        const create = () => {
            try {
                return winston.createLogger({
                    transports: [new winston.transports.Console()],
                })
            } catch (error) {
                console.log('Container: failed to create logger', error)
                throw error
            }
        }

        return this.getDep('logger', create)
    }

    get server(): server.IServer {
        return this.getDep('server', () => server.newServer(this.serverConfig, this))
    }

    get db(): db.IDB {
        return this.getDep('db', () => db.newDB(this.dbConfig))
    }
}
