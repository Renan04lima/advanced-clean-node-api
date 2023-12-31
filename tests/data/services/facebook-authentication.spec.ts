import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { MockProxy, mock } from 'jest-mock-extended'

function makeSut() {
    const loadFacebookUserApi = mock<LoadFacebookUserApi>()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    return {
        sut,
        loadFacebookUserApi
    }
}

describe('FacebookAuthenticationService', () => {
    let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
    let sut: FacebookAuthenticationService

    beforeEach(() => {
        loadFacebookUserApi = mock<LoadFacebookUserApi>()
        sut = new FacebookAuthenticationService(loadFacebookUserApi)
    })

    it('should call LoadFacebookUserApi with correct params', async () => {
        await sut.execute({ token: 'any_token' })

        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
        loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

        const result = await sut.execute({ token: 'any_token' })

        expect(result).toEqual(new AuthenticationError())
    })
})