import { LoadUserAccountRepository } from '@/data/contracts/repos';

import { IBackup, newDb } from 'pg-mem'
import { Entity, PrimaryGeneratedColumn, Column, getRepository, DataSource, Repository } from 'typeorm'

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
        private readonly pgUserRepo: Repository<PgUser>
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
        let sut: PgUserAccountRepository
        let connection: any
        let pgUserRepo: Repository<PgUser>
        let backup: IBackup

        beforeAll(async () => {
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

            connection = await db.adapters.createTypeormDataSource({
                type: 'postgres',
                entities: [PgUser]
            })

            // create schema
            await connection.initialize();
            await connection.synchronize();
            backup = db.backup();

            pgUserRepo = connection.getRepository(PgUser)
        })

        beforeEach(() => {
            backup.restore()
            sut = new PgUserAccountRepository(pgUserRepo)
        })

        afterAll(async () => {
            await connection.close()
        })


        it('should return an account if email exists', async () => {
            const sut = new PgUserAccountRepository(pgUserRepo)
            await pgUserRepo.save({ email: 'any_email' })

            const account = await sut.load({ email: 'any_email' })

            expect(account).toEqual({
                id: '1',
            })
        })

        it('should return undefined if email not exists', async () => {
            const sut = new PgUserAccountRepository(pgUserRepo)

            const account = await sut.load({ email: 'any_email' })

            expect(account).toBeUndefined()
        })
    })
})