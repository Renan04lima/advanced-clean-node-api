
export interface HttpClient {
    get: <T = any>(input: HttpClient.Input) => Promise<T>
}

export namespace HttpClient {
    export type Input = {
        url: string
        params: object
    }
}
