import { AccessToken } from "@/domain/models/access-token"
import { FacebookAuthentication } from "@/domain/use-cases/facebook-authentication"
import { HttpResponse, ok, unauthorized } from "@/application/helpers/http"
import { ValidationBuilder, Validator } from "@/application/validation"
import { Controller } from "@/application/controllers/controller"

type HttpRequest = {
    token: string
}

type Model = Error | {
    accessToken: string
}

export class FacebookLoginController extends Controller {
    constructor(
        private readonly facebookAuth: FacebookAuthentication
    ) {
        super()
    }

    async execute(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
        const result = await this.facebookAuth.execute({ token: httpRequest.token })
        return result instanceof AccessToken
            ? ok({ accessToken: result.value })
            : unauthorized()
    }

    override buildValidators(httpRequest: HttpRequest): Validator[] {
        return [
            ...ValidationBuilder.of({ value: httpRequest.token, fieldName: 'token' }).required().build(),
        ]
    }
}
