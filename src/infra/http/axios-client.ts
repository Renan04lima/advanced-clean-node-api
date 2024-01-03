import { HttpClient } from "./client";

import axios from "axios";

export class AxiosHttpClient {
    async get({ url, params }: HttpClient.Input): Promise<void> {
        const response = await axios.get(url, { params })
        return response.data
    }
}