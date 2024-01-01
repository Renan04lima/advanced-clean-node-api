type FacebookData = {
    name: string
    email: string
    facebookId: string
}

type AccountData ={
    id?: string
    name?: string
}

export class FacebookAccount {
    id?: string
    name: string
    email: string
    facebookId: string

    constructor(data: FacebookData, accountData?: AccountData) {
        this.id = accountData?.id
        this.name = accountData?.name ?? data.name
        this.email = data.email
        this.facebookId = data.facebookId
    }
}