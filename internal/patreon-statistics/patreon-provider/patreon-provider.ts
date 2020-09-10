import type { URL } from 'url'
import type { Snapshot } from '../domain/snapshot'
import type { IHTTPClient } from '../http-client/http-client'
import * as cheerio from 'cheerio'

type PartialSnapshot = Omit<Snapshot, 'ts' | 'userID'>

interface IPatreonProvider {
    GetUserSnapshot(userID: string): Promise<PartialSnapshot>
}

export const NewPatreonProvider = (
    HTTPClient: IHTTPClient,
    url: URL
): IPatreonProvider => new PatreonProvider(HTTPClient, url)

class PatreonProvider implements IPatreonProvider {
    constructor(private HTTPClient: IHTTPClient, private url: URL) {}

    async GetUserSnapshot(userID: string): Promise<PartialSnapshot> {
        this.url.pathname = userID

        const res = await this.HTTPClient.fetch(this.url.toString()),
            text = await res.text()

        const html = cheerio.load(text)

        const patronsStr = html(
                '[data-tag="CampaignPatronEarningStats-patron-count"] h2'
            ).text(),
            earningsStr = html(
                '[data-tag="CampaignPatronEarningStats-earnings"] h2'
            ).text()

        const patronsCount = Number.parseInt(patronsStr, 10)
        if (Number.isNaN(patronsCount)) {
            throw new Error(
                `failed to parse patrons from string: "${patronsStr}"`
            )
        }

        // will fail, because includes currency sign
        const monthlyEarning = Number.parseInt(earningsStr, 10)
        if (Number.isNaN(monthlyEarning)) {
            throw new Error(
                `failed to parse earnings from string: "${earningsStr}"`
            )
        }

        return {
            monthlyEarning,
            patronsCount,
        }
    }
}
