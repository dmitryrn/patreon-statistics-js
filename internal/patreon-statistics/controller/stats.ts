import type { PatreonUser } from '../domain/patreon-user'
import * as express from 'express'
import 'reflect-metadata'
import { IStatisticsService } from '../service/statistics'

interface IStatisticsController {
    GetUsers(r: express.Request): Promise<PatreonUser[]>
}

export const newStatisticsController = (
    statsService: IStatisticsService
): IStatisticsController => new StatisticsController(statsService)

class StatisticsController implements IStatisticsController {
    statsService: IStatisticsService

    constructor(statsService: IStatisticsService) {
        this.statsService = statsService
    }

    async GetUsers(r: express.Request): Promise<PatreonUser[]> {
        // if (r.params['userID'] === '') {
        //     throw new Error('userID is required')
        // }
        // const userID = r.params['userID']

        let users: ReturnType<IStatisticsService['GetUsers']>
        try {
            users = await this.statsService.GetUsers()
        } catch (error) {
            this.container.logger.info('Failed to get users')
            throw error
        }

        return users
    }
}
