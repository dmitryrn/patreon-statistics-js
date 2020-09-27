import { Result } from 'neverthrow'
import type { IContainer } from '../container'
import type { PatreonUser } from '../domain/patreon-user'

export interface IUserService {
    GetMany(params: { limit?: number }): Promise<Result<PatreonUser[], Error>>
}

export const newUserService = (
    container: IContainer
): IUserService => new UserService(container)

class UserService implements IUserService {
    constructor(private container: IContainer) {}

    async GetMany(params: { limit?: number }): Promise<Result<PatreonUser[], Error>> {
        const result = await this.container.userRepository.GetMany(params)
        if (result.isErr())
            this.container.logger.error('Failed to get users from userRepository', { params })

        return result
    }
}
