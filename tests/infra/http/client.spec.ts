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
        fakeAxios.get.mockResolvedValue({
            data: 'any_data',
            status: 200
        })
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

        it('should return data on success', async () => {
            const data = await sut.get({
                url,
                params
            })

            expect(data).toEqual('any_data')
        })
    })
})