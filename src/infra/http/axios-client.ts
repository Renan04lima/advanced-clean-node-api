import { HttpClient } from "./client";

import axios from "axios";

export class AxiosHttpClient implements HttpClient {
    async get<T = any>({ url, params }: HttpClient.Input): Promise<T> {
        const response = await axios.get(url, { params })
        return response.data
    }
}