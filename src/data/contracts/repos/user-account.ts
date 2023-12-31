export interface LoadUserAccountRepository {
    load: (input: LoadUserAccountRepository.Input) => Promise<void>
}

export namespace LoadUserAccountRepository {
    export type Input = {
        email: string
    }
}