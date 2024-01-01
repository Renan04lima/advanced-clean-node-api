import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { HttpClient } from "../http/client";

export class FacebookApi {
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
