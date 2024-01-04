import { AuthenticationError } from "@/domain/errors/authentication"
import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { MockProxy, mock } from "jest-mock-extended"

type HttpResponse = {
    statusCode: number
    data: any
}

class FacebookLoginController {
    constructor(
        private readonly facebookAuth: FacebookAuthentication
    ) { }

    async handle(httpRequest: any): Promise<any> {
        if (!httpRequest.token) {
            return {
                statusCode: 400,
                data: new Error('The field token is required')
            }
        }
        const result = await this.facebookAuth.execute({ token: httpRequest.token })
        return {
            statusCode: 401,
            data: result
        }
    }
}

describe('FacebookLoginController', () => {
    let sut: FacebookLoginController
    let facebookAuth: MockProxy<FacebookAuthentication>

    beforeEach(() => {
        facebookAuth = mock()
        sut = new FacebookLoginController(facebookAuth)
    })

    it('should return 400 if token is empty', async () => {
        const httpResponse = await sut.handle({ token: '' })

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error('The field token is required')
        })
    })

    it('should return 400 if token is null', async () => {
        const httpResponse = await sut.handle({ token: null })

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error('The field token is required')
        })
    })

    it('should return 400 if token is undefined', async () => {
        const httpResponse = await sut.handle({ token: undefined })

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error('The field token is required')
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
            data: new AuthenticationError()
        })
    })
})