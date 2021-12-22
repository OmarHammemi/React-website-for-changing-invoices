export const userService = {
  login,
  logout,

};

function login(username, password) {
  const requestOptions = {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'x-business-name' : 'billings',
      "Accept":"application/json"
    },
    body: JSON.stringify({email:username, password :password})
  };

  return fetch(`${process.env.REACT_APP_API_URL}/auth/login`, requestOptions)
    .then(handleResponse)
    .then(user => {
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href="/"
      return user;
    }).catch(err => console.log(err));

}


function logout() {
  localStorage.removeItem('user');
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
