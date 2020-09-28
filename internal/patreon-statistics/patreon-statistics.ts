import { ConsoleTransportOptions } from 'winston/lib/winston/transports'
import type { appDo as appDoType } from '../../cmd/type'

import { IContainer, newContainer } from './container'

export const appDo: appDoType = async () => {
    return new Promise(async (resolve, reject) => {
        const container = newContainer()

        container.setServerConfig({
            port: 8080,
            routes: [
                {
                    path: '/10-users',
                    method: 'get',
                    handler: (container: IContainer) => container.userController.Get10.bind(container.userController),
                },
            ],
        })

        try {
            await container.db.connect()
            container.logger.info('connected to database')
        } catch (error) {
            container.logger.error('cannot connect to db', error)
            reject(error)
            return
        }
        try {
            await container.server.listen()
        } catch (error) {
            container.logger.error('cannot start server', error)
            reject(error)
            return
        }

        const onKill = async (code: NodeJS.Signals) => {
            // TODO: actually test this logic when issue is fixed
            // https://github.com/prisma/prisma/issues/3773

            container.logger.info(`Received exit signal ${code}, shutting down gracefully`)

            const closeDB = container.db.disconnect()
            closeDB
                .then(() => {container.logger.info('disconnected from db')})
                .catch(err => {container.logger.error('dirty disconnect from db', err)})

            const stopServer = container.server.shutDown()
            stopServer
                .then(() => container.logger.info('server stopped'))
                .catch(err => container.logger.error('dirty server shutdown', err))

            await Promise.allSettled([
                closeDB,
                stopServer,
            ])

            resolve()
        }

        process.on('SIGTERM', onKill)
        process.on('SIGINT', onKill)
    })
}
