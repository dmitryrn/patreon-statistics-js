import { PatreonUser } from '../domain/patreon-user'
import { IContainer } from '../container'
import { Result, ok, err } from 'neverthrow'

export interface IUserRepository {
    GetMany(params: { limit?: number }): Promise<Result<PatreonUser[], Error>>
}

export const newUserRepository = (container: IContainer) =>
    new UserRepository(container)

class UserRepository implements IUserRepository {
    constructor(private container: IContainer) {}

    async GetMany(params: { limit?: number }): Promise<Result<PatreonUser[], Error>> {
        try {
            const dbUsers = await this.container.db.client.patreon_user.findMany({ take: params.limit })
            return ok(dbUsers as PatreonUser[])
        } catch (error) {
            return err(error)
        }
    }
}
