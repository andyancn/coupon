/**
 * 公用方法
 * @date    2019-04-13 13:27:22
 * @version 1.0.0
 */
let util = {
  setToken(token) {
    localStorage.setItem('MS_TOKEN', token);
  },
  getToken() {
    return localStorage.getItem('MS_TOKEN') || "";
  },
  removeToken(){
    localStorage.removeItem('MS_TOKEN');
  },
  setUserName(username){
    localStorage.setItem('MS_USERNAME', username);
  },
  getUserName(){
    return localStorage.getItem('MS_USERNAME') || "";
  },
  removeUserName(){
    localStorage.removeItem('MS_USERNAME');
  }
}

export default util