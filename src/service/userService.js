import axios from "axios"

const BASE_ACCOUNT_URL = "http://localhost:8888/api/v1/user"
class userService{
    
    getAllTasks(id){
        const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + `/${id}/tasks`,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })
    }

    getUserInfo(id){
        const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + `/${id}`,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })
    }

    getTaskSummary(id){
        const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + `/${id}/tasksummary`,
                        { headers: 
                            {
                                "Authorization" : `Bearer ${token}`
                            } 
                        })
    }

    updateUserProfile(userId, formData){
        const token = localStorage.getItem('Token')
        return axios.patch(BASE_ACCOUNT_URL + `/${userId}`, formData, {
          headers: {
            "Content-Type": 'multipart/form-data',
            "Authorization" : `Bearer ${token}`
          },
        });
      };
    getNotifications(userId, size, page){
        const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + `/${userId}/notification?page=${page}&size=${size}`, {
          headers: {
            "Authorization" : `Bearer ${token}`
          },
        });
      };

}

export default new userService()