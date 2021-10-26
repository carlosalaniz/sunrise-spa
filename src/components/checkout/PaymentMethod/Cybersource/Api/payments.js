/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import {
  withToken,
  fetchJson,
  makeConfig,
  baseUrl,
} from "../../../../../api/api";

const myPayments = {
  get: withToken((id, accessToken) =>
    fetchJson(`${baseUrl}/me/payments/${id}`, {
      ...makeConfig(accessToken),
      method: "GET"
    })
  ),
  create: withToken((body, accessToken) =>
    fetchJson(`${baseUrl}/me/payments/`, {
      ...makeConfig(accessToken),
      method: "POST",
      body: JSON.stringify(body),
    })
  ),
  delete: withToken(({ id, version }, accessToken) => {
    const url = new URL(`${baseUrl}/me/payments/${id}`);
    url.searchParams.append("version", version);
    url.searchParams.append("dataErasure", true);
    fetchJson(url, {
      ...makeConfig(accessToken),
      method: "DELETE",
    });
  }),
  addTransaction: withToken(
    ({ id, version, amountPlanned }, accessToken) =>
      fetchJson(`${baseUrl}/me/payments/${id}`, {
        ...makeConfig(accessToken),
        method: "POST",
        body: JSON.stringify({
          version: version,
          actions: [
            {
              action: "addTransaction",
              transaction: {
                type: "Authorization",
                amount: amountPlanned,
                state: "Initial"
              }
            }
          ]
        }),
      })
  ),
  update: withToken(
    ({ id, version, body}, accessToken) =>
    fetchJson(`${baseUrl}/me/payments/${id}`, {
      ...makeConfig(accessToken),
      method: "POST",
      body: JSON.stringify({
        version: version,
        actions: [
          {
            action: "setCustomField",
            "name": "isv_token",
            "value": body.isv_token
          },
          {
            action: "setCustomField",
            "name": "isv_maskedPan",
            "value": body.isv_maskedPan
          },
          {
            action: "setCustomField",
            "name": "isv_cardType",
            "value": body.isv_cardType
          },
          {
            action: "setCustomField",
            "name": "isv_cardExpiryMonth",
            "value": body.isv_cardExpiryMonth
          },
          {
            action: "setCustomField",
            "name": "isv_cardExpiryYear",
            "value": body.isv_cardExpiryYear
          }
        ]
      }
      ),
    })  
  ),
};

export default myPayments;
