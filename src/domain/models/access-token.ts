export class AccessToken {
    constructor(
        readonly value: string
    ) { }

    static get expirationInMs(): number {
        return 1800000
    }
}