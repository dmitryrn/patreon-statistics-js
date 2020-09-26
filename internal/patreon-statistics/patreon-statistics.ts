import { newStatisticsController } from './controller/stats'
import { newServer } from './server/server'
import type { appDo as appDoType } from '../../cmd/type'

import { newStatisticsService } from './service/statistics'
import { newContainer } from './container'

export const appDo: appDoType = async () => {
    return new Promise(async (resolve, reject) => {
        const container = newContainer()

        const statsService = newStatisticsService(container)

        const statsController = newStatisticsController(statsService)

        const server = container.server(
            {
                port: 8080,
                routes: [
                    {
                        path: '/statistics',
                        method: 'get',
                        handler: statsController.GetUsers.bind(statsController),
                    },
                ],
            },
        )

        await server.listen()

        const onKill = () => {
            container.logger.info(
                'Received kill signal, server is shutting down gracefully'
            )
            server.shutDown()
            resolve()
        }
        process.on('SIGTERM', onKill)
        process.on('SIGINT', onKill)
    })
}
