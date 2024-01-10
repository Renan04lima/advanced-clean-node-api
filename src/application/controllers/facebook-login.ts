import { AccessToken } from "@/domain/models/access-token"
import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { HttpResponse, badRequest, ok, serverError, unauthorized } from "@/application/helpers/http"
import { RequiredStringValidator, ValidationComposite } from "../validation"

type HttpRequest = {
    token: string
}

type Model = Error | {
    accessToken: string
}

export class FacebookLoginController {
    constructor(
        private readonly facebookAuth: FacebookAuthentication
    ) { }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
        try {
            const error = this.validate(httpRequest)
            if (error) {
                return badRequest(error)
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

    private validate(httpRequest: HttpRequest) {
        return new ValidationComposite([
            new RequiredStringValidator(httpRequest.token, 'token')
        ]).validate()
    }
}
