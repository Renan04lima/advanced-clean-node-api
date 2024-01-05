import { AccessToken } from "@/domain/models/access-token"
import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { HttpResponse, badRequest, ok, serverError, unauthorized } from "@/application/helpers/http"
import { RequiredFieldError } from "@/application/errors/http"

export class FacebookLoginController {
    constructor(
        private readonly facebookAuth: FacebookAuthentication
    ) { }

    async handle(httpRequest: any): Promise<HttpResponse> {
        try {
            if (!httpRequest.token) {
                return badRequest(new RequiredFieldError('token'))
            }
            const result = await this.facebookAuth.execute({ token: httpRequest.token })
            if (result instanceof AccessToken) {
                return ok({ accessToken: result.value })
            }
            return unauthorized()
        } catch (error) {
            return serverError(error)
        }

    }
}
