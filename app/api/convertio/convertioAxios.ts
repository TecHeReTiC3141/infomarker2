import axios from "axios";

const convertioAxios = axios.create({
    baseURL: "https://api.convertio.co/convert",
    timeout: 10000,
    headers: {},
    params: {
        apikey: process.env.CONVERTIO_API_KEY,
    },
});

export interface ConvertioConvertResponse {
    code: number,
    status: "ok" | "error",
    data: {
        id: string,
        minutes:  string,
    },
    error: string,
}
export interface ConvertioGetResponse {
    code: number,
    status: "ok" | "error",
    data: {
        id: string,
        type:"base64",
        content: string,
    },
    error: string,
}

export default convertioAxios;