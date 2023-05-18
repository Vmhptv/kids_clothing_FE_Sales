export const getUser = () => {
    const userStr = sessionStorage.getItem('username');
    if (userStr) return JSON.parse(userStr);
    else return null;
  }
  export const getUserId = () => {
    const userIdStr = sessionStorage.getItem('id');
    if (userIdStr) return JSON.parse(userIdStr);
    else return null;
  }
  export const getPassword = () => {
    const password = localStorage.getItem('password');
    if (password) return JSON.parse(password);
    else return null;
    }
  // return the token from the session storage
  export const getToken = () => {
    if(sessionStorage.getItem('token') == null){
       return  window.location.href = "/#/login" 
      // return sessionStorage.getItem('token') || null;
    }else{
      return sessionStorage.getItem('token') || null;
    }
  }
  
  // remove the token and user from the session storage
  export const removeUserSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('id');

  }
  
  // set the token and user from the session storage
  export const setUserSession = (id,password,token, username) => {
    sessionStorage.setItem('id', id);
    sessionStorage.setItem('token',(token));
    sessionStorage.setItem('username', JSON.stringify(username));
  }
