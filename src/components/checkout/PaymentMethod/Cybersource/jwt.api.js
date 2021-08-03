const GetJWTContextURL = process.env.VUE_APP_CYBERSOURCE_JWT_CONTEXT_URI;
const getJWTContext = async function () {
    const response = await fetch(GetJWTContextURL, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
         headers: {
            'Content-Type': 'application/json'
        } 
    })
    return await response.text();
}
export default { getJWTContext }