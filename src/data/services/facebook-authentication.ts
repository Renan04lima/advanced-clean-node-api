import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from "../contracts/repos"

export class FacebookAuthenticationService {
    constructor(
        private readonly facebookApi: LoadFacebookUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
    ) { }

    async execute(params: FacebookAuthentication.Input): Promise<AuthenticationError> {
        const fbData = await this.facebookApi.loadUser(params)
        if (fbData !== undefined) {
            const accountData = await this.userAccountRepo.load({ email: fbData.email })
            if (accountData !== undefined) {
                await this.userAccountRepo.updateWithFacebook({
                    id: accountData.id,
                    name: accountData.name ?? fbData.name,
                    facebookId: fbData.facebookId
                })
            } else {
                await this.userAccountRepo.createFromFacebook(fbData)
            }
        }
        return new AuthenticationError()
    }
}