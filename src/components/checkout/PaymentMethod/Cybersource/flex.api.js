const GetFlexContextURL = process.env.VUE_APP_CYBERSOURCE_FLEX_CONTEXT_URI;
const getFlexContext = async function () {
    const response = await fetch(GetFlexContextURL, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json();
}
export default { getFlexContext }