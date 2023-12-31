import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { MockProxy, mock } from 'jest-mock-extended'
import {  LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos/user-account'

describe('FacebookAuthenticationService', () => {
    let facebookApi: MockProxy<LoadFacebookUserApi>
    let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
    let sut: FacebookAuthenticationService
    const token = 'any_token'

    beforeEach(() => {
        facebookApi = mock<LoadFacebookUserApi>()
        facebookApi.loadUser.mockResolvedValue({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id',
        })
        userAccountRepo = mock<LoadUserAccountRepository & SaveFacebookAccountRepository>()
        userAccountRepo.load.mockResolvedValue(undefined)
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

    it('should create account with facebook data', async () => {
        await sut.execute({ token })

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id',
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    })

    it('should not update account name', async () => {
        userAccountRepo.load.mockResolvedValueOnce({
            id: 'any_id',
            name: 'any_name',
        })
        await sut.execute({ token })

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            id: 'any_id',
            name: 'any_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id',
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    })

    it('should update account name without override name', async () => {
        userAccountRepo.load.mockResolvedValueOnce({
            id: 'any_id',
        })
        await sut.execute({ token })

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
            id: 'any_id',
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id',
        })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    })
})
