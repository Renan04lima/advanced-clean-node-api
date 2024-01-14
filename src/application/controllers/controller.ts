import { HttpResponse, badRequest, serverError } from "@/application/helpers/http"
import { ValidationComposite, Validator } from "@/application/validation"

export abstract class Controller {
    abstract execute(httpRequest: any): Promise<HttpResponse>

    buildValidators(httpRequest: any): Validator[] {
        return []
    }

    async handle(httpRequest: any): Promise<HttpResponse> {
        try {
            const error = this.validate(httpRequest)
            if (error) {
                return badRequest(error)
            }
            return await this.execute(httpRequest)
        } catch (error) {
            return serverError(error)
        }
    }

    private validate(httpRequest: any): Error | undefined {
        const validators = this.buildValidators(httpRequest)
        return new ValidationComposite(validators).validate()
    }
}
