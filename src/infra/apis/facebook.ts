import { LoadFacebookUserApi } from "@/data/contracts/apis";
import { HttpClient } from "../http/client";

type AppToken = {
    access_token: string;
}

type DebugToken = {
    data: {
        user_id: string;
    }
}

type UserInfo = {
    id: string;
    name: string;
    email: string;
}

export class FacebookApi implements LoadFacebookUserApi {
    private readonly baseUrl = 'https://graph.facebook.com'

    constructor(
        private readonly httpClient: HttpClient,
        private readonly clientId: string,
        private readonly clientSecret: string
    ) { }

    async loadUser({ token }: LoadFacebookUserApi.Input): Promise<LoadFacebookUserApi.Output> {
        const userInfo = await this.getUserInfo(token);

        return {
            facebookId: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
        }
    }

    private async getAppToken(): Promise<AppToken> {
        return await this.httpClient.get({
            url: `${this.baseUrl}/oauth/access_token`,
            params: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'client_credentials'
            }
        });
    }

    private async getDebugToken(token: string): Promise<DebugToken> {
        const appToken = await this.getAppToken();
        return await this.httpClient.get({
            url: `${this.baseUrl}/debug_token`,
            params: {
                access_token: appToken.access_token,
                input_token: token,
            }
        });
    }

    private async getUserInfo(token: string): Promise<UserInfo> {
        const debugToken = await this.getDebugToken(token);
        return await this.httpClient.get({
            url: `${this.baseUrl}/${debugToken.data.user_id}`,
            params: {
                fields: 'id,name,email',
                access_token: token,
            }
        });
    }
}
