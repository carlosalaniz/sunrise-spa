/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import {
  withToken,
  fetchJson,
  makeConfig,
  baseUrl,
} from "../../../../api/api";

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
};

export default myPayments;
