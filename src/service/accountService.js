import axios from "axios"

const BASE_ACCOUNT_URL = "http://localhost:8888/auth"

class accountService{
    login(data){
        return axios.post(BASE_ACCOUNT_URL + "/login", data)
    }
    signUp(data){
        return axios.post(BASE_ACCOUNT_URL + "/signup", data)
    }
    verifyEmail(code){
        return axios.get(BASE_ACCOUNT_URL + `/verify?code=${code}`)
    }
}

export default new accountService()