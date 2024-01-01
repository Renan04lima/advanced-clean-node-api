import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { HttpClient } from "../http/client";

export class FacebookApi {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly clientId: string,
        private readonly clientSecret: string
    ) { }

    async loadUser({ token }: LoadFacebookUserApi.Input): Promise<void> {
        const appToken = await this.httpClient.get({
            url: 'https://graph.facebook.com/oauth/access_token',
            params: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'client_credentials'
            }
        })

        await this.httpClient.get({
            url: 'https://graph.facebook.com/debug_token',
            params: {
                access_token: appToken.access_token,
                input_token: token,
            }
        })
    }
}
