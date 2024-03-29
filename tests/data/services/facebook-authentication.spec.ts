import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos/user-account'
import { FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/data/contracts/crypto'
import { AccessToken } from '@/domain/models/access-token'

import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
    let facebookApi: MockProxy<LoadFacebookUserApi>
    let crypto: MockProxy<TokenGenerator>
    let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
    let sut: FacebookAuthenticationService
    let token: string

    beforeAll(() => {
        token = 'any_token'
        facebookApi = mock()
        facebookApi.loadUser.mockResolvedValue({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id',
        })
        userAccountRepo = mock<LoadUserAccountRepository & SaveFacebookAccountRepository>()
        userAccountRepo.load.mockResolvedValue(undefined) // nova conta 
        userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
        crypto = mock()
        crypto.generateToken.mockResolvedValue('any_generated_token')
    })

    beforeEach(() => {
        sut = new FacebookAuthenticationService(facebookApi, userAccountRepo, crypto)
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
        // o FacebookAccount está sendo testado no Domain Layer, portanto só precisamos testar se ele foi chamado
        const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
        jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

        await sut.execute({ token })

        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
        expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    })

    it('should call TokenGenerator with correct params', async () => {
        await sut.execute({ token })

        expect(crypto.generateToken).toHaveBeenCalledWith({
            key: 'any_account_id',
            expirationInMs: AccessToken.expirationInMs
        })
        expect(crypto.generateToken).toHaveBeenCalledTimes(1)
    })

    it('should return an AccessToken on success', async () => {
        const authResult = await sut.execute({ token })

        expect(authResult).toEqual(new AccessToken('any_generated_token'))
    })

    it('should rethrow if LoadFacebookUserApi throws', async () => {
        facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

        const promise = sut.execute({ token })

        await expect(promise).rejects.toThrow(new Error('fb_error'))
    })

    it('should rethrow if LoadUserAccountRepository throws', async () => {
        userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

        const promise = sut.execute({ token })

        await expect(promise).rejects.toThrow(new Error('load_error'))
    })

    it('should rethrow if SaveFacebookAccountRepository throws', async () => {
        userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

        const promise = sut.execute({ token })

        await expect(promise).rejects.toThrow(new Error('save_error'))
    })

    it('should rethrow if TokenGenerator throws', async () => {
        crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))

        const promise = sut.execute({ token })

        await expect(promise).rejects.toThrow(new Error('token_error'))
    })
})
