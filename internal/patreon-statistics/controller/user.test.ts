import { newUserController } from "./user"
import { IContainer } from '../container'
import { createMock } from 'ts-auto-mock'
import * as express from 'express'
import { ok } from "neverthrow"

test('Get10', async () => {
    const container = createMock<IContainer>({
        userService: {
            async GetMany({ limit }) {
                expect(limit).toBe(10)
                return ok([{ id: 'test' }])
            }
        }
    })

    const ctrl = newUserController(container)
    const req = express.request

    const result = await ctrl.Get10(req)
    expect(result.isOk()).toBeTruthy()
    expect(result.unwrapOr([])).toEqual([{ id: 'test' }])
})
