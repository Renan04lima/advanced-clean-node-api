export interface LoadUserAccountRepository {
    load: (input: LoadUserAccountRepository.Input) => Promise<void>
}

export namespace LoadUserAccountRepository {
    export type Input = {
        email: string
    }

    export type Output = undefined
}

export interface CreateFacebookAccountRepository {
    createFromFacebook: (input: CreateFacebookAccountRepository.Input) => Promise<void>
}

export namespace CreateFacebookAccountRepository {
    export type Input = {
        email: string
        name: string
        facebookId: string
    }
}