import type { IContainer } from '../container'
import type { PatreonUser } from '../domain/patreon-user'

interface IUserService {
    GetUsers(): Promise<PatreonUser[]>
}

export const newUserService = (
    container: IContainer
): IUserService => new UserService(container)

class UserService implements IUserService {
    constructor(private container: IContainer) {}

    async GetUsers(): Promise<PatreonUser[]> {
        try {
            return await this.container.userRepository.GetUsers()
        } catch (error) {
            this.container.logger.info('Failed to get users from userRepository', { error })
            throw error
        }
    }
}
