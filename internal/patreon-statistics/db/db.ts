import { ResultAsync } from 'neverthrow'
import { PrismaClient } from "@prisma/client"

export interface IDB {
    client: PrismaClient
    connect(): ResultAsync<void, Error>
}

export const newDB = (): IDB => new DB()

class DB implements IDB {
    public client: PrismaClient

    constructor() {
        this.client = new PrismaClient()
    }

    connect(): ResultAsync<void, Error> {
        return ResultAsync.fromPromise(this.client.$connect())
    }
}
