
export interface LoadFacebookUserApi {
    loadUser: (params: LoadFacebookUserApi.Input) => Promise<LoadFacebookUserApi.Output>
}

export namespace LoadFacebookUserApi {
    export type Input = {
        token: string
    }

    export type Output = undefined | {
        user: string
        email: string
        facebookId: string
    }
}