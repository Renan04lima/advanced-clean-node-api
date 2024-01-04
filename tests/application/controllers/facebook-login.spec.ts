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
    it('should return 400 if token is empty', () => {
        const sut = new FacebookLoginController()

        const httpResponse = sut.handle({ token: '' })

        expect(httpResponse).toEqual({
            statusCode: 400,
            data: new Error('The field token is required')
        })
    })
})