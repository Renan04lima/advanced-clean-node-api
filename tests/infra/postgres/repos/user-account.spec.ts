import { LoadUserAccountRepository } from '@/data/contracts/repos';

import { newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, getRepository, DataSource } from "typeorm"

@Entity('users')
class PgUser {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ nullable: true })
    name?: string

    @Column({ unique: true })
    email!: string

    @Column({ name: 'facebook_id', nullable: true })
    facebookId?: number
}

class PgUserAccountRepository implements LoadUserAccountRepository {
    constructor(
        private readonly pgUserRepo: any
    ) { }

    async load({ email }: LoadUserAccountRepository.Input): Promise<LoadUserAccountRepository.Output> {
        const user = await this.pgUserRepo.findOne({
            where: {
                email
            }
        })
        if (user) {
            return {
                id: user.id.toString(),
                name: user.name ?? undefined
            }
        }
    }
}

describe('UserAccountRepo', () => {
    describe('load', () => {
        it('should return an account if email exists', async () => {
            const db = newDb({
                autoCreateForeignKeyIndices: true
            })
            db.public.registerFunction({
                implementation: () => 'test',
                name: 'current_database',
            });
            db.public.registerFunction({
                implementation: () => 'test',
                name: 'version',
            })

            const connection = await db.adapters.createTypeormDataSource({
                type: 'postgres',
                entities: [PgUser]
            })

            // create schema
            await connection.initialize();
            await connection.synchronize();

            const pgUserRepo = connection.getRepository(PgUser)

            const sut = new PgUserAccountRepository(pgUserRepo)
            await pgUserRepo.save({ email: 'any_email' })

            const account = await sut.load({ email: 'any_email' })

            expect(account).toEqual({
                id: '1',
            })

            await connection.close()
        })

        it('should return undefined if email not exists', async () => {
            const db = newDb({
                autoCreateForeignKeyIndices: true
            })
            db.public.registerFunction({
                implementation: () => 'test',
                name: 'current_database',
            });
            db.public.registerFunction({
                implementation: () => 'test',
                name: 'version',
            })

            const connection = await db.adapters.createTypeormDataSource({
                type: 'postgres',
                entities: [PgUser]
            })

            // create schema
            await connection.initialize();
            await connection.synchronize();

            const pgUserRepo = connection.getRepository(PgUser)

            const sut = new PgUserAccountRepository(pgUserRepo)

            const account = await sut.load({ email: 'any_email' })

            expect(account).toBeUndefined()

            await connection.close()
        })
    })
})