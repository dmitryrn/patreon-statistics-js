import * as postgres from 'postgres'
import { PatreonUser } from '../patreon-statistics/domain/patreon-user'

export interface IPatreonUserRepo {
    GetAll(): PatreonUser[]
}

export const NewPatreonUserRepo = (db: postgres.Sql<{}>) =>
    new PatreonUserRepo(db)

class PatreonUserRepo implements IPatreonUserRepo {
    constructor(private db: postgres.Sql<{}>) {}

    GetAll(): PatreonUser[] {
        this.db`
            select * from patreon_user
        `

        return []
    }
}
