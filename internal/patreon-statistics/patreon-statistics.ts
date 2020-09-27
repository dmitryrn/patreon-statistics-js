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

        await container.server.listen()

        const onKill = () => {
            container.logger.info(
                'Received kill signal, server is shutting down gracefully'
            )
            container.server.shutDown()
            resolve()
        }
        process.on('SIGTERM', onKill)
        process.on('SIGINT', onKill)
    })
}
