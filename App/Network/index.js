// const API_PATH = 'https://raw.githubusercontent.com/BelinChung/HiApp/master/src/api/'
const API_PATH = 'http://192.168.10.58:9095/api/';

// function _param(obj = {}) {
//     let _ = encodeURIComponent
//     return Object.keys(obj).map(k => `${_(k)}=${_(obj[k])}`).join('&')
// }

function _networkDone(res) {
    if (!res['err_code']) {
        return res
    } else {
        return Promise.reject(res)
    }
}
function _networkFail(...args) {
    return Promise.reject(null)
}
function _fetch(url, data, method) {
    return fetch(url, {
        headers: data,
        method,
        credentials: 'same-origin'
    })
}

export function ajax({url, data, method = 'GET'}) {
    url = API_PATH + url ;

    let promise = _fetch(url, data, method)
    let success = _networkDone.bind(this)
    let failure = _networkFail.bind(this)
    console.log(success);
    return promise.then(resp => resp.ok ? resp.json().then(success) : failure(resp))
}
