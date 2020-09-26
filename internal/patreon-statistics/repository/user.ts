import { PatreonUser } from '../domain/patreon-user'
import { IContainer } from '../container'
import { Result, ok, err } from 'neverthrow'

export interface IUserRepository {
    GetAll(limit?: number): Promise<Result<PatreonUser[], Error>>
}

export const NewUserRepository = (container: IContainer) =>
    new UserRepository(container)

class UserRepository implements IUserRepository {
    constructor(private container: IContainer) {}

    async GetAll(limit?: number): Promise<Result<PatreonUser[], Error>> {
        try {
            return ok(await this.container.db.client.patreon_user.findMany({ take: limit }))
        } catch (error) {
            return err(error)
        }
    }
}
