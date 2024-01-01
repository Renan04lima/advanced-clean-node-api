export interface TokenGenerator {
    generateToken: (input: TokenGenerator.Input) => Promise<void>
}

namespace TokenGenerator {
    export type Input = { key: string }
}
