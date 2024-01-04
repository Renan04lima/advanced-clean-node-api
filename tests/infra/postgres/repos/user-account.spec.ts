import { PgUserAccountRepository } from '@/infra/postgres/repos';
import { PgUser } from '@/infra/postgres/entities';

import { IBackup, IMemoryDb } from 'pg-mem'
import { Repository } from 'typeorm'
import { makeFakeDb } from '../mocks/connection';

describe('UserAccountRepo', () => {
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

    describe('load', () => {
        it('should return an account if email exists', async () => {
            await pgUserRepo.save({ email: 'any_email' })

            const account = await sut.load({ email: 'any_email' })

            expect(account).toEqual({
                id: '1',
            })
        })

        it('should return undefined if email not exists', async () => {
            const account = await sut.load({ email: 'any_email' })

            expect(account).toBeUndefined()
        })
    })

    describe('load', () => {
        it('should create an account if id is undefined', async () => {
            const account = await sut.saveWithFacebook({
                name: 'any_name',
                email: 'any_email',
                facebookId: 'any_fb_id'
            })

            const user = await pgUserRepo.findOne({
                where: { email: 'any_email' }
            })

            expect(user?.id).toBe(1)
            expect(account.id).toBe("1")
        })

        it('should update an account if id is defined', async () => {
            await pgUserRepo.save({
                name: 'any_name',
                email: 'any_email',
                facebookId: 'any_fb_id'
            })

            const account = await sut.saveWithFacebook({
                id: '1',
                name: 'new_name',
                email: 'new_email',
                facebookId: 'new_fb_id'
            })

            const user = await pgUserRepo.findOne({
                where: { id: 1 }
            })

            expect(user).toEqual({
                id: 1,
                email: 'any_email', 
                name: 'new_name',
                facebookId: 'new_fb_id'
            })
            expect(account.id).toBe("1")
        })
    })
})
