import { AccessToken } from "@/domain/models/access-token"
import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { HttpResponse, badRequest } from "@/application/helpers/http"
import { RequiredFieldError, ServerError } from "@/application/errors/http"

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
                return {
                    statusCode: 200,
                    data: { accessToken: result.value }
                }
            }
            return {
                statusCode: 401,
                data: result
            }
        } catch (error) {
            return {
                statusCode: 500,
                data: new ServerError(error)
            }
        }

    }
}
