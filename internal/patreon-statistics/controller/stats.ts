import type { Snapshot } from '../domain/snapshot'
import * as express from 'express'
import 'reflect-metadata'
import { IStatisticsService } from '../service/statistics'

interface IStatisticsController {
    GetStats(r: express.Request): Promise<Snapshot[]>
}

export const newStatisticsController = (
    statsService: IStatisticsService
): IStatisticsController => new StatisticsController(statsService)

class StatisticsController implements IStatisticsController {
    statsService: IStatisticsService

    constructor(statsService: IStatisticsService) {
        this.statsService = statsService
    }

    async GetStats(r: express.Request): Promise<Snapshot[]> {
        let userID: string
        if (r.params['userID'] !== '') {
            userID = r.params['userID']
        }

        console.log({ this: this })

        this.statsService.GetStats(userID)

        return []
    }
}
