
export interface HttpClient {
    get: (params: HttpClient.Params) => Promise<void>
}

export namespace HttpClient {
    export type Params = {
        url: string
        params: object
    }
}
