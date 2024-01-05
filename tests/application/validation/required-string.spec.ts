import { RequiredFieldError } from "@/application/errors/http"
import { RequiredStringValidator } from "@/application/validation"

describe('RequeiredStringValidator', () => {
    it('should return an error if value is empty', () => {
        const sut = new RequiredStringValidator('', 'any_field')

        const error = sut.validate()

        expect(error).toEqual(new RequiredFieldError('any_field'))
    })

    it('should return an error if value is null', () => {
        const sut = new RequiredStringValidator(null as any, 'any_field')

        const error = sut.validate()

        expect(error).toEqual(new RequiredFieldError('any_field'))
    })

    it('should return an error if value is undefined', () => {
        const sut = new RequiredStringValidator(undefined as any, 'any_field')

        const error = sut.validate()

        expect(error).toEqual(new RequiredFieldError('any_field'))
    })

    it('should return undefined if value is not invalid', () => {
        const sut = new RequiredStringValidator('any_value', 'any_field')

        const error = sut.validate()

        expect(error).toBeUndefined()
    })
})