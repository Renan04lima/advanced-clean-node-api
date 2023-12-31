import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { MockProxy, mock } from 'jest-mock-extended'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos/user-account'

describe('FacebookAuthenticationService', () => {
    let facebookApi: MockProxy<LoadFacebookUserApi>
    let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateFacebookAccountRepository>
    let sut: FacebookAuthenticationService
    const token = 'any_token'

    beforeEach(() => {
        facebookApi = mock<LoadFacebookUserApi>()
        facebookApi.loadUser.mockResolvedValue({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id',
        })
        userAccountRepo = mock<LoadUserAccountRepository & CreateFacebookAccountRepository>()
        sut = new FacebookAuthenticationService(facebookApi, userAccountRepo)
    })

    it('should call LoadFacebookUserApi with correct params', async () => {
        await sut.execute({ token })

        expect(facebookApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
        expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
        facebookApi.loadUser.mockResolvedValueOnce(undefined)

        const result = await sut.execute({ token })

        expect(result).toEqual(new AuthenticationError())
    })

    it('should call LoadUserAccountRepo when LoadFacebookUserApi return data', async () => {
        await sut.execute({ token })

        expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
        expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
    })

    it('should call CreateFacebookAccountRepo when LoadUserAccountRepo return undefined', async () => {
        userAccountRepo.load.mockResolvedValueOnce(undefined)
        await sut.execute({ token })

        expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id',
        })
        expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
    })
})
