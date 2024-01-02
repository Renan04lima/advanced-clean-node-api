import { HttpClient } from '@/infra/http/client';

import axios from 'axios';

jest.mock('axios')

class AxiosHttpClient {
    async get({ url, params }: HttpClient.Input): Promise<void> {
        await axios.get(url, { params })
    }
}

describe('AxiosHttpClient', () => {
    let fakeAxios: jest.Mocked<typeof axios>
    let sut: AxiosHttpClient

    beforeAll(() => {
        fakeAxios = axios as jest.Mocked<typeof axios>
    })

    beforeEach(() => {
        sut = new AxiosHttpClient()
    })

    describe('get method', () => {
        it('should call get with correct params', async () => {
            await sut.get({
                url: 'any_url',
                params: {
                    any: 'any'
                }
            })

            expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
                params: { any: 'any' }
            })
        });
    })
})