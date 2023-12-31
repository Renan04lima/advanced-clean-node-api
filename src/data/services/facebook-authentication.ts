import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { LoadUserAccountRepository } from "../contracts/repos"

export class FacebookAuthenticationService {
    constructor(
        private readonly loadFacebookUserApi: LoadFacebookUserApi,
        private readonly loadUserAccountRepo: LoadUserAccountRepository
    ) { }

    async execute(params: FacebookAuthentication.Input): Promise<AuthenticationError> {
        const fbData = await this.loadFacebookUserApi.loadUser(params)
        if (fbData !== undefined) {
            await this.loadUserAccountRepo.load({ email: fbData.email })
        }
        return new AuthenticationError()
    }
}