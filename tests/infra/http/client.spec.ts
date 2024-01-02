import { AxiosHttpClient } from '@/infra/http';

import axios from 'axios';

jest.mock('axios')

describe('AxiosHttpClient', () => {
    let fakeAxios: jest.Mocked<typeof axios>
    let sut: AxiosHttpClient
    let url: string
    let params: object

    beforeAll(() => {
        url = 'any_url'
        params = { any: 'any' }
        fakeAxios = axios as jest.Mocked<typeof axios>
    })

    beforeEach(() => {
        sut = new AxiosHttpClient()
    })

    describe('get method', () => {
        it('should call get with correct params', async () => {
            await sut.get({
                url,
                params
            })

            expect(fakeAxios.get).toHaveBeenCalledWith(url, {
                params
            })
        });
    })
})