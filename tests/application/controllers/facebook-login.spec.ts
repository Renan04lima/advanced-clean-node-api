class FacebookLoginController {
    handle (httpRequest: any): any {
        if (!httpRequest.token) {
            return {
                statusCode: 400,
                data: new Error('The field token is required')
            }
        }
    }
}

describe('FacebookLoginController', () => {
    let sut: FacebookLoginController

    beforeEach(() => {
        sut = new FacebookLoginController()
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
})