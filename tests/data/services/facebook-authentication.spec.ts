import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"

class FacebookAuthenticationService {
    constructor(
        private readonly loadFacebookUserApi: LoadFacebookUserApi
    ) { }

    async execute(params: FacebookAuthentication.Input): Promise<AuthenticationError> {
        await this.loadFacebookUserApi.loadUser(params)
        return new AuthenticationError()
    }
}


class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
    token?: string
    result = undefined

    async loadUser(params: LoadFacebookUserApi.Input): Promise<LoadFacebookUserApi.Output> {
        this.token = params.token

        return this.result
    }
}


describe('FacebookAuthenticationService', () => {
    it('should call LoadFacebookUserApi with correct params', async () => {
        const loadFacebookUserApi = new LoadFacebookUserApiSpy()
        const sut = new FacebookAuthenticationService(loadFacebookUserApi)

        await sut.execute({ token: 'any_token' })

        expect(loadFacebookUserApi.token).toBe('any_token')
    })

    it('should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
        const loadFacebookUserApi = new LoadFacebookUserApiSpy()
        loadFacebookUserApi.result = undefined
        const sut = new FacebookAuthenticationService(loadFacebookUserApi)

        const result = await sut.execute({ token: 'any_token' })

        expect(result).toEqual(new AuthenticationError())
    })
})