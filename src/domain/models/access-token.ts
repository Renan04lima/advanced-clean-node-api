export class AccessToken {
    constructor(
        private readonly value: string
    ) { }

    static get expirationInMs(): number {
        return 1800000
    }
}