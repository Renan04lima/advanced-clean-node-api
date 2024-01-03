
import { TokenGenerator } from '@/data/contracts/crypto'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JwtToken implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}