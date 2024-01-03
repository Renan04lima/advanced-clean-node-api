import { PgUserAccountRepository } from '@/infra/postgres/repos';
import { PgUser } from '@/infra/postgres/entities';

import { IBackup, IMemoryDb } from 'pg-mem'
import { Repository } from 'typeorm'
import { makeFakeDb } from '../mocks/connection';

describe('UserAccountRepo', () => {
    describe('load', () => {
        let db: IMemoryDb
        let sut: PgUserAccountRepository
        let connection: any
        let pgUserRepo: Repository<PgUser>
        let backup: IBackup

        beforeAll(async () => {
            ({ db, connection } = await makeFakeDb([PgUser]))
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
