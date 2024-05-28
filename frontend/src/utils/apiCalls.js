export const BACKEND_URL = 'http://localhost:5005'

export const apiCall = (method, endPoint, body = null, token = '') => {
  return new Promise((resolve, reject) => {
    const request = {
      method,
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    if (body) {
      request.body = JSON.stringify(body);
    }

    fetch(BACKEND_URL + endPoint, request)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const apiCallPost = (endPoint, body, token = '') => {
  return apiCall('POST', endPoint, body, token);
};

export const apiCallPut = (endPoint, body, token = '') => {
  return apiCall('PUT', endPoint, body, token);
};

export const apiCallGet = (endPoint, token = '') => {
  return apiCall('GET', endPoint, null, token);
};

export function saveStore (store, token) {
  apiCallPut('/store', { store }, token)
    .then(() => {
      return true;
    })
    .catch(error => {
      console.log(error);
      return false;
    })
}
