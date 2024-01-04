import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { MockProxy, mock } from "jest-mock-extended"

class FacebookLoginController {
    constructor(
        private readonly facebookAuth: FacebookAuthentication
    ) { }
    
    handle(httpRequest: any): any {
        if (!httpRequest.token) {
            return {
                statusCode: 400,
                data: new Error('The field token is required')
            }
        }
        this.facebookAuth.execute({ token: httpRequest.token })
    }
}

describe('FacebookLoginController', () => {
    let sut: FacebookLoginController
    let facebookAuth: MockProxy<FacebookAuthentication>

    beforeEach(() => {
        facebookAuth = mock()
        sut = new FacebookLoginController(facebookAuth)
    })

    it('should return 400 if token is empty', () => {
        const httpResponse = sut.handle({ token: '' })

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error('The field token is required')
        })
    })

    it('should return 400 if token is null', () => {
        const httpResponse = sut.handle({ token: null })

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error('The field token is required')
        })
    })

    it('should return 400 if token is undefined', () => {
        const httpResponse = sut.handle({ token: undefined })

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
})