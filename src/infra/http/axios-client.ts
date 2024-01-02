import { HttpClient } from "./client";

import axios from "axios";

export class AxiosHttpClient {
    async get({ url, params }: HttpClient.Input): Promise<void> {
        await axios.get(url, { params })
    }
}