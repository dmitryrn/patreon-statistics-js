import type { Client } from 'pg'
import { QueryBuilder } from 'knex'
import { PatreonUser } from '../domain/patreon-user'
import { IContainer } from '../container'

export interface IUserRepository {
    GetAll(): Promise<PatreonUser[]>
}

export const NewUserRepository = (container: IContainer) =>
    new UserRepository(container)

class UserRepository implements IUserRepository {
    constructor(private container: IContainer) {}

    async GetAll(): Promise<PatreonUser[]> {
        const { sql, bindings } = new QueryBuilder().select('id').from('patreon_user').toSQL().toNative()


        const users = await this.container.db.query<string>(sql, bindings)

        return users.rows
    }
}
