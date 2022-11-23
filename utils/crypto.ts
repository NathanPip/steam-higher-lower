import SimpleCrypto from "simple-crypto-js";
import { env } from "../env/client.mjs";

const crypto = new SimpleCrypto(env.NEXT_PUBLIC_SECRET);

export const encrypt = (data: string | number | object) =>{
    return crypto.encrypt(data)
}

export const decrypt = (data: string) =>{
    console.log(data);
    return crypto.decrypt(data);
}