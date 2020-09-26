import * as express from 'express'

import type { IContainer } from '../container'
import type { PatreonUser } from '../domain/patreon-user'

interface IUserController {
    GetUsers(r: express.Request): Promise<PatreonUser[]>
}

export const newUserController = (
    container: IContainer
): IUserController => new UserController(container)

class UserController implements IUserController {
    constructor(private container: IContainer) {}

    async GetUsers(r: express.Request): Promise<PatreonUser[]> {
        try {
            return await this.container.userService.GetUsers()
        } catch (error) {
            this.container.logger.info('Failed to get users from userService', { error })
            throw error
        }
    }
}
