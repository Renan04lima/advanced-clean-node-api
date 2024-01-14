import { ServerError } from "@/application/errors/http"
import { Controller } from "@/application/controllers"
import { ValidationComposite } from "@/application/validation"
import { HttpResponse } from "@/application/helpers/http"

jest.mock('@/application/validation/composite')

class ControllerStub extends Controller {
    result: HttpResponse = {
        statusCode: 200,
        data: 'any_data'
    }
    constructor() {
        super()
    }

    async execute(httpRequest: any): Promise<HttpResponse> {
        return this.result
    }
}

describe('Controller', () => {
    let sut: ControllerStub

    beforeEach(() => {
        sut = new ControllerStub()
    })

    it('should return 400 if validation fails', async () => {
        const error = new Error('validation_error')
        const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
            validate: jest.fn().mockReturnValueOnce(error)
        }))
        jest.mocked(ValidationComposite).mockImplementationOnce(ValidationCompositeSpy)

        const httpResponse = await sut.handle('any_value')

        expect(ValidationComposite).toHaveBeenCalledWith([])
        expect(httpResponse).toEqual({
            statusCode: 400,
            data: error
        })
    })

    it('should return 500 if authentication throws', async () => {
        const error = new Error('execute_error')
        jest.spyOn(sut, 'execute').mockRejectedValueOnce(error)

        const httpResponse = await sut.handle('any_value')

        expect(httpResponse).toEqual({
            statusCode: 500,
            data: new ServerError(error)
        })
    })

    it('should return same result as execute', async () => {
        const httpResponse = await sut.handle('any_value')

        expect(httpResponse).toEqual(sut.result)
    })
})