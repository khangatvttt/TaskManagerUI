import axios from "axios"

const BASE_ACCOUNT_URL = "http://localhost:8888/api/v1/task"
class userService{
    createTask(data){
        const token = localStorage.getItem('Token')
        return axios.post(BASE_ACCOUNT_URL, data,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })
    }

    updateTask(taskId,data){
        const token = localStorage.getItem('Token')
        return axios.patch(BASE_ACCOUNT_URL+`/${taskId}`, data,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })

    }

        
    getTaskAssignment(taskId, userId){
        const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + `/${taskId}/user/${userId}`,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })
    }

    updateTaskAssignment(taskId, userId, data){
        const token = localStorage.getItem('Token')
        return axios.patch(BASE_ACCOUNT_URL + `/${taskId}/user/${userId}`,data,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })
    }

    abandonTaskAssignment(taskId, userId){
        const token = localStorage.getItem('Token')
        return axios.delete(BASE_ACCOUNT_URL + `/${taskId}/user/${userId}`,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })

    }

    addMembersToTask(taskId, data){
        const token = localStorage.getItem('Token')
        return axios.post(BASE_ACCOUNT_URL + `/${taskId}/addMembers`,data,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })
    }

    acceptTask(taskId, userId){
        return this.updateTaskAssignment(taskId, userId, 
            {
                isAccept:true
            }
        )
    }

}

export default new userService()