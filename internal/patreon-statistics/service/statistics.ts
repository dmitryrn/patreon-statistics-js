import { IContainer } from '../container'
import type { Snapshot } from '../domain/snapshot'

export interface IStatisticsService {
    GetUsers(userID: string): Snapshot[]
}

export const newStatisticsService = (container: IContainer): IStatisticsService =>
    new StatisticsService(container)

class StatisticsService implements IStatisticsService {
    constructor(private container: IContainer) {}

    GetUsers(userID: string): Snapshot[] {
        return []
    }
}
