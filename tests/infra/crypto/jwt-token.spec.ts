
import { JwtToken } from '@/infra/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtToken', () => {
    let sut: JwtToken
    let fakeJwt: jest.Mocked<typeof jwt>
    let secret: string

    beforeAll(() => {
        secret = 'any_secret'
        fakeJwt = jwt as jest.Mocked<typeof jwt>
    })

    beforeEach(() => {
        sut = new JwtToken(secret)
    })

    describe('generate', () => {
        let key: string
        let expirationInMs: number
        let token: string

        beforeAll(() => {
            key = 'any_key'
            expirationInMs = 1000
            token = 'any_token'
            fakeJwt.sign.mockImplementation(() => token) // reimplementa para sobrepor a assinatura padrão
        })

        it('should call sign with correct input', async () => {
            await sut.generateToken({ key, expirationInMs })

            expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
            expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
        })

        it('should return a token', async () => {
            const generatedToken = await sut.generateToken({ key, expirationInMs })

            expect(generatedToken).toBe(token)
        })

        it('should rethrow if sign throws', async () => {
            fakeJwt.sign.mockImplementationOnce(() => { throw new Error('token_error') })

            const promise = sut.generateToken({ key, expirationInMs })

            await expect(promise).rejects.toThrow(new Error('token_error'))
        })
    })
})