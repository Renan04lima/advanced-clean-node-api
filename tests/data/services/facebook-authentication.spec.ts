import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"

class FacebookAuthenticationService {
    constructor(
        private readonly loadFacebookUserApi: LoadFacebookUserApi
    ) { }

    async execute(params: FacebookAuthentication.Input): Promise<void> {
        await this.loadFacebookUserApi.loadUser(params)
    }
}

interface LoadFacebookUserApi {
    loadUser: (params: LoadFacebookUserApi.Input) => Promise<void>
}

namespace LoadFacebookUserApi {
    export type Input = {
        token: string
    }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
    token?: string
    
    async loadUser(params: LoadFacebookUserApi.Input): Promise<void> {
        this.token = params.token
    }
}


describe('FacebookAuthenticationService', () => {
    it('should call LoadFacebookUserApi with correct params', async () => {
        const loadFacebookUserApi = new LoadFacebookUserApiSpy()
        const sut = new FacebookAuthenticationService(loadFacebookUserApi)

        await sut.execute({ token: 'any_token' })

        expect(loadFacebookUserApi.token).toBe('any_token')
    })
})