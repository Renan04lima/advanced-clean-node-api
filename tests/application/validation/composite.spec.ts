import { MockProxy, mock } from "jest-mock-extended"

interface Validator {
    validate(): Error | undefined
}

class ValidationComposite {
    constructor(private readonly validators: Validator[]) { }

    validate(): undefined {
        return undefined
    }
}

describe('ValidationComposite', () => {
    let sut: ValidationComposite
    let validator1: MockProxy<Validator>
    let validator2: MockProxy<Validator>
    let validators: Validator[]

    beforeAll(() => {
        validator1 = mock<Validator>()
        validator1.validate.mockReturnValueOnce(undefined)
        validator2 = mock<Validator>()
        validator2.validate.mockReturnValueOnce(undefined)
        validators = [validator1, validator2]
    })

    beforeEach(() => {
        sut = new ValidationComposite(validators)
    })

    it('should return undefined if all validators return undefined', () => {
        const error = sut.validate()

        expect(error).toBeUndefined()
    })
})