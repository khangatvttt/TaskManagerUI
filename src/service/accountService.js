import axios from "axios"

const BASE_ACCOUNT_URL = "http://localhost:8888/auth"

class accountService{
    login(data){
        return axios.post(BASE_ACCOUNT_URL + "/login", data)
    }
}

export default new accountService()