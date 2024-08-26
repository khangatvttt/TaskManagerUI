import axios from "axios"

const BASE_ACCOUNT_URL = "http://localhost:8888/api/v1/task"
class userService{
    
    getTaskAssignment(taskId, userId){
        const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + "/"+taskId+"/user/"+userId,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })
    }

    abandonTaskAssignment(taskId, userId){
        const token = localStorage.getItem('Token')
        return axios.delete(BASE_ACCOUNT_URL + "/"+taskId+"/user/"+userId,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })

    }

}

export default new userService()