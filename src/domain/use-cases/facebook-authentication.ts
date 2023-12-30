export interface FacebookAuthentication {
    execute: (params: FacebookAuthentication.Input) => Promise<FacebookAuthentication.Output>
}

export namespace FacebookAuthentication {
    export type Input = {
        token: string
    }

    export type Output = AccessToken | AuthenticationError
}

type AccessToken = string

