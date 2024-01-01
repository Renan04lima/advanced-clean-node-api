import { AuthenticationError } from "../errors/authentication"
import { AccessToken } from "../models/access-token"

export interface FacebookAuthentication {
    execute: (params: FacebookAuthentication.Input) => Promise<FacebookAuthentication.Output>
}

export namespace FacebookAuthentication {
    export type Input = {
        token: string
    }

    export type Output = AccessToken | AuthenticationError
}


