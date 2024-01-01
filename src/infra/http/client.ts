
export interface HttpClient {
    get: (input: HttpClient.Input) => Promise<HttpClient.Output>
}

export namespace HttpClient {
    export type Input = {
        url: string
        params: object
    }

    export type Output = any
}
