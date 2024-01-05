import { RequiredFieldError } from "../errors/http"

class RequiredStringValidator {
    constructor(
        private readonly value: string,
        private readonly fieldName: string
    ) { }

    validate(): Error | undefined {
        return new RequiredFieldError(this.fieldName)
    }
}

describe('RequeiredStringValidator', () => {
    it('should return an error if string is empty', () => {
        const sut = new RequiredStringValidator('', 'any_field')

        const error = sut.validate()

        expect(error).toEqual(new RequiredFieldError('any_field'))
    })

    it('should return an error if string is null', () => {
        const sut = new RequiredStringValidator(null as any, 'any_field')

        const error = sut.validate()

        expect(error).toEqual(new RequiredFieldError('any_field'))
    })

    it('should return an error if string is undefined', () => {
        const sut = new RequiredStringValidator(undefined as any, 'any_field')

        const error = sut.validate()

        expect(error).toEqual(new RequiredFieldError('any_field'))
    })
})