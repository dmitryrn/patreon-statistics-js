import type * as express from 'express'
import type { Result } from 'neverthrow'

import type { IContainer } from '../container'
import type { PatreonUser } from '../domain/patreon-user'

export interface IUserController {
    Get10(r: express.Request): Promise<Result<PatreonUser[], Error>>
}

export const newUserController = (
    container: IContainer
): IUserController => new UserController(container)

class UserController implements IUserController {
    constructor(private container: IContainer) {}

    async Get10(r: express.Request): Promise<Result<PatreonUser[], Error>> {
        const result = await this.container.userService.GetMany({ limit: 10 })
        if (result.isErr()) {
            this.container.logger.error('Failed to get users from userService', result.error)
        }

        return result
    }
}
