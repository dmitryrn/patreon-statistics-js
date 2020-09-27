import { err, ok, Result } from 'neverthrow'
import { PrismaClient } from "@prisma/client"
import { IContainer } from '../container'

export interface IDB {
    client: PrismaClient
    connect(): Promise<void>
    disconnect(): Promise<void>
}

export const newDB = (container: IContainer): IDB => new DB(container)

class DB implements IDB {
    public client: PrismaClient

    constructor(private container: IContainer) {
        this.client = new PrismaClient()
    }

    connect() {
        return this.client.$connect()
    }

    disconnect() {
        return this.client.$disconnect()
    }
}
