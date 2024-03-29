import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { AuthenticationError } from '@/domain/errors/authentication'
import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "../contracts/repos"
import { FacebookAccount } from "@/domain/models"
import { TokenGenerator } from "../contracts/crypto"
import { AccessToken } from "@/domain/models/access-token"

export class FacebookAuthenticationService {
    constructor(
        private readonly facebookApi: LoadFacebookUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
        private readonly crypto: TokenGenerator
    ) { }

    async execute(params: FacebookAuthentication.Input): Promise<FacebookAuthentication.Output> {
        const fbData = await this.facebookApi.loadUser(params)
        if (fbData !== undefined) {
            const accountData = await this.userAccountRepo.load({ email: fbData.email })
            const fbAccount = new FacebookAccount(fbData, accountData)
            const user = await this.userAccountRepo.saveWithFacebook(fbAccount)

            const token  = await this.crypto.generateToken({ 
                key: user.id,
                expirationInMs: AccessToken.expirationInMs
             })
             return new AccessToken(token)
        }
        return new AuthenticationError()
    }
}