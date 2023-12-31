import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { MockProxy, mock } from 'jest-mock-extended'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos/user-account'

describe('FacebookAuthenticationService', () => {
    let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
    let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
    let createFacebookAccountRepo: MockProxy<CreateFacebookAccountRepository>
    let sut: FacebookAuthenticationService
    const token = 'any_token'

    beforeEach(() => {
        loadFacebookUserApi = mock<LoadFacebookUserApi>()
        loadFacebookUserApi.loadUser.mockResolvedValue({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id',
        })
        loadUserAccountRepo = mock<LoadUserAccountRepository>()
        createFacebookAccountRepo = mock<CreateFacebookAccountRepository>()
        sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepo, createFacebookAccountRepo)
    })

    it('should call LoadFacebookUserApi with correct params', async () => {
        await sut.execute({ token })

        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
        expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
    })

    it('should return AuthenticationError when LoadFacebookUserApi return undefined', async () => {
        loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

        const result = await sut.execute({ token })

        expect(result).toEqual(new AuthenticationError())
    })

    it('should call LoadUserAccountRepo when LoadFacebookUserApi return data', async () => {
        await sut.execute({ token })

        expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
        expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
    })

    it('should call CreateFacebookAccountRepo when LoadUserAccountRepo return undefined', async () => {
        loadUserAccountRepo.load.mockResolvedValueOnce(undefined)
        await sut.execute({ token })

        expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledWith({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id',
        })
        expect(createFacebookAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
    })
})
