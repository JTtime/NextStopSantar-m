import axios from "axios";
import { apiGatewayUrl } from "./constants";

const configurl =
    process.env.NEXT_PUBLIC_API_ENV === "local"
        ? apiGatewayUrl.local
        : apiGatewayUrl.server;

export class APIServices {
    
    private static baseURL = configurl;

    public static getAllData = () => {
        console.log('config nurl', configurl)
        let apiUrl: string = `${this.baseURL}/api/items`;
        return axios.get(apiUrl);
    }
}


