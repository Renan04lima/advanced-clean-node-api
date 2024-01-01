import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { FacebookAuthenticationService } from "@/data/services/facebook-authentication"
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos/user-account'
import { FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/data/contracts/crypto'

import { MockProxy, mock } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
    let facebookApi: MockProxy<LoadFacebookUserApi>
    let crypto: MockProxy<TokenGenerator>
    let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
    let sut: FacebookAuthenticationService
    const token = 'any_token'

    beforeEach(() => {
        facebookApi = mock<LoadFacebookUserApi>() 
        crypto = mock<TokenGenerator>() 
        facebookApi.loadUser.mockResolvedValue({
            name: 'any_fb_name',
            email: 'any_fb_email',
            facebookId: 'any_fb_id',
        })
        userAccountRepo = mock<LoadUserAccountRepository & SaveFacebookAccountRepository>()
        userAccountRepo.load.mockResolvedValue(undefined) // nova conta 
        userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
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

        expect(crypto.generateToken).toHaveBeenCalledWith({ key: 'any_account_id' })
        expect(crypto.generateToken).toHaveBeenCalledTimes(1)
    })
})
