import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { mock } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
    it('should call LoadFacebookUserApi with correct params', async () => {
        const loadFacebookUserApi = mock<LoadFacebookUserApi>()
        const sut = new FacebookAuthenticationService(loadFacebookUserApi)

        await sut.execute({ token: 'any_token' })

        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
        const loadFacebookUserApi = mock<LoadFacebookUserApi>()
        loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
        const sut = new FacebookAuthenticationService(loadFacebookUserApi)

        const result = await sut.execute({ token: 'any_token' })

        expect(result).toEqual(new AuthenticationError())
    })
})