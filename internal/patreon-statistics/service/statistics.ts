import type { Snapshot } from '../domain/snapshot'

export interface IStatisticsService {
    GetStats(userID: string): Snapshot[]
}

export const newStatisticsService = (): IStatisticsService =>
    new StatisticsService()

class StatisticsService implements IStatisticsService {
    constructor() {}

    GetStats(userID: string): Snapshot[] {
        return
    }
}
