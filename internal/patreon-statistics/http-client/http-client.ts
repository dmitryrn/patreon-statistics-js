import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch'

export interface IHTTPClient {
    fetch(url: RequestInfo, init?: RequestInit): Promise<Response>
}

export const NewHTTPClient = (): IHTTPClient => new HTTPClient()

class HTTPClient implements IHTTPClient {
    fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
        return fetch(url, init)
    }
}
