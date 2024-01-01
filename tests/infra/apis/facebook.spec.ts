import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { MockProxy, mock } from "jest-mock-extended"

class FacebookApi {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly clientId: string,
        private readonly clientSecret: string
    ) { }

    async loadUser(params: LoadFacebookUserApi.Input): Promise<void> {
        await this.httpClient.get({
            url: 'https://graph.facebook.com/oauth/access_token',
            params: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'client_credentials'
            }
        })
    }
}

interface HttpClient {
    get: (params: HttpClient.Params) => Promise<void>
}

namespace HttpClient {
    export type Params = {
        url: string
        params: object
    }
}

describe('FacebookApi', () => {
    let sut: FacebookApi
    let httpClient: MockProxy<HttpClient>
    let clientId: string
    let clientSecret: string

    beforeAll(() => {
        clientId = 'any_client_id'
        clientSecret = 'any_client_secret'
        httpClient = mock()
    })

    beforeEach(() => {
        sut = new FacebookApi(httpClient, clientId, clientSecret)
    })

    it('should get app token', async () => {
        await sut.loadUser({ token: 'any_client_token' })

        expect(httpClient.get).toHaveBeenCalledWith({
            url: 'https://graph.facebook.com/oauth/access_token',
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials'
            }
        })
    })
})