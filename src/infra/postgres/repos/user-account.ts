import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/data/contracts/repos";
import { Repository } from "typeorm";
import { PgUser } from "../entities/pg-user";

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
    constructor(
        private readonly pgUserRepo: Repository<PgUser>
    ) { }

    async load({ email }: LoadUserAccountRepository.Input): Promise<LoadUserAccountRepository.Output> {
        const user = await this.pgUserRepo.findOne({
            where: {
                email
            }
        });
        if (user) {
            return {
                id: user.id.toString(),
                name: user.name ?? undefined
            };
        }
    }

    async saveWithFacebook({ email, facebookId, name, id }: SaveFacebookAccountRepository.Input): Promise<SaveFacebookAccountRepository.Output> {
        let userId: string
        if (id === undefined) {
            const account = await this.pgUserRepo.save({
                name,
                email,
                facebookId
            })
            userId = account.id.toString()
        } else {
            await this.pgUserRepo.update(
                { id: Number(id) },
                {
                    name,
                    facebookId
                })
            userId = id
        }

        return { id: userId }
    }
}
