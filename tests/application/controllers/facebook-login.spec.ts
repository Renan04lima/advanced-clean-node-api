import { AuthenticationError } from "@/domain/errors/authentication"
import { AccessToken } from "@/domain/models/access-token"
import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { MockProxy, mock } from "jest-mock-extended"
import { RequiredFieldError, ServerError, UnauthorizedError } from "@/application/errors/http"
import { FacebookLoginController } from "@/application/controllers/facebook-login"
import { RequiredStringValidator } from "@/application/validation"

jest.mock('@/application/validation/required-string')

describe('FacebookLoginController', () => {
    let sut: FacebookLoginController
    let facebookAuth: MockProxy<FacebookAuthentication>

    beforeEach(() => {
        facebookAuth = mock()
        sut = new FacebookLoginController(facebookAuth)
        facebookAuth.execute.mockResolvedValue(new AccessToken('token_value'))
    })

    it('should return 400 if validations fails', async () => {
        const error = new RequiredFieldError('token')
        const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
            validate: jest.fn().mockReturnValueOnce(error)
        }))
        jest.mocked(RequiredStringValidator).mockImplementationOnce(RequiredStringValidatorSpy)

        const httpResponse = await sut.handle({ token: 'any_token' })

        expect(RequiredStringValidator).toHaveBeenCalledWith('any_token', 'token')
        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new RequiredFieldError('token')
        })
    })

    it('should call FacebookAuthentication with correct params', async () => {
        await sut.handle({ token: 'any_token' })

        expect(facebookAuth.execute).toHaveBeenCalledWith({ token: 'any_token' })
        expect(facebookAuth.execute).toHaveBeenCalledTimes(1)
    })

    it('should return 401 if invalid credentials are provided', async () => {
        facebookAuth.execute.mockResolvedValueOnce(new AuthenticationError())

        const httpResponse = await sut.handle({ token: 'any_token' })

        expect(httpResponse).toEqual({
            statusCode: 401,
            data: new UnauthorizedError()
        })
    })

    it('should return 200 if authentication succeeds', async () => {
        const httpResponse = await sut.handle({ token: 'any_token' })

        expect(httpResponse).toEqual({
            statusCode: 200,
            data: {
                accessToken: 'token_value'
            }
        })
    })

    it('should return 500 if authentication throws', async () => {
        const error = new Error('infra_error')
        facebookAuth.execute.mockRejectedValueOnce(error)

        const httpResponse = await sut.handle({ token: 'any_token' })

        expect(httpResponse).toEqual({
            statusCode: 500,
            data: new ServerError(error)
        })
    })
})