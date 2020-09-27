import * as winston from 'winston'

import * as server from './server/server'
import * as db from './db/db'
import * as userController from './controller/user'
import * as userService from './service/user'
import * as userRepository from './repository/user'

export interface IContainer {
    readonly logger: winston.Logger
    readonly server: server.IServer
    readonly db: db.IDB
    readonly userController: userController.IUserController
    readonly userService: userService.IUserService
    readonly userRepository: userRepository.IUserRepository
    setServerConfig(serverConfig: ServerConfig): void
}

export type ServerConfig = {
    port: server.Config['port']
    routes: {
        path: server.Config['routes'][0]['path']
        method: server.Config['routes'][0]['method']
        handler: (container: IContainer) => server.Config['routes'][0]['handler']
    }[]
}

export const newContainer = (): IContainer => new Container()

class Container implements IContainer {
    serverConfig?: server.Config
    deps = new Map<string, any>()

    getDep<T>(key: string, create: () => T) {
        if (this.deps.has(key)) {
            return this.deps.get(key)
        }

        const dep = create()
        this.deps.set(key, dep)
        
        return dep
    }

    setServerConfig(serverConfig: ServerConfig) {
        this.serverConfig = {
            port: serverConfig.port,
            routes: serverConfig.routes.map(({ method, path, handler }) => ({
                method,
                path,
                handler: handler(this),
            }))
        }
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
        return this.getDep('server', (): server.IServer => {
            if (!this.serverConfig) {
                throw new Error('Server config has not been set. Call setServerConfig()')
            }
            return server.newServer(this.serverConfig, this)
        })
    }

    get userController(): userController.IUserController {
        return this.getDep('userController', () => userController.newUserController(this))
    }

    get userService(): userService.IUserService {
        return this.getDep('userService', () => userService.newUserService(this))
    }

    get userRepository(): userRepository.IUserRepository {
        return this.getDep('userRepository', () => userRepository.newUserRepository(this))
    }

    get db(): db.IDB {
        return this.getDep('db', db.newDB)
    }
}
