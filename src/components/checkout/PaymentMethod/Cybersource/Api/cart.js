/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import {
    withToken,
    fetchJson,
    makeConfig,
    baseUrl,
} from "../../../../../api/api";

const myCart = {
    get: withToken((id, accessToken) =>
        fetchJson(`${baseUrl}/me/carts/${id}`, {
            ...makeConfig(accessToken),
            method: "GET"
        })
    )
}

export default myCart;