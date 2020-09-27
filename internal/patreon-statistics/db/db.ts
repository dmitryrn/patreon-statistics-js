import { err, ok, Result } from 'neverthrow'
import type { PrismaClient } from "@prisma/client"
import { IContainer } from '../container'

export interface IDB {
    client: PrismaClient
    connect(): Promise<void>
    disconnect(): Promise<void>
}

export const newDB = (container: IContainer): IDB => new DB(container)

class DB implements IDB {
    public client: any

    constructor(private container: IContainer) {
        // this.client = new PrismaClient()
    }

    async connect() {
        // return this.client.$connect()
    }

    async disconnect() {
        // return this.client.$disconnect()
    }
}
