import { newStatisticsController } from './controller/stats'
import { newServer } from './server/server'
import type { appDo as appDoType } from '../../cmd/type'
import * as winston from 'winston'

import { newStatisticsService } from './service/statistics'

const TYPES = {
    Warrior: Symbol.for('Warrior'),
    Weapon: Symbol.for('Weapon'),
    ThrowableWeapon: Symbol.for('ThrowableWeapon'),
}

export const appDo: appDoType = async () => {
    return new Promise(async (resolve, reject) => {
        const logger = winston.createLogger({
            transports: [new winston.transports.Console()],
        })

        const statsService = newStatisticsService()

        const statsController = newStatisticsController(statsService)

        const server = newServer(
            {
                port: 8080,
                routes: [
                    {
                        path: '/statistics',
                        method: 'get',
                        handler: statsController.GetStats.bind(statsController),
                    },
                ],
            },
            logger
        )

        await server.listen()

        const onKill = () => {
            logger.info(
                'Received kill signal, server is shutting down gracefully'
            )
            server.shutDown()
            resolve()
        }
        process.on('SIGTERM', onKill)
        process.on('SIGINT', onKill)
    })
}
