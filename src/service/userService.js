import axios from "axios"

const BASE_ACCOUNT_URL = "http://localhost:8888/api/v1/user"
class userService{
    
    getAllTasks(id){
        const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + "/"+id+"/tasks",
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })
    }

}

export default new userService()