import axios from "axios"

const BASE_ACCOUNT_URL = "http://localhost:8888/api/v1/user"
class userService{
    
    getTaskByPage(userId, status, page, size, taskName){
        const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + `/${userId}/tasks?status=${status}&page=${page}&size=${size}&taskName=${taskName}`,
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

    getAvatar(userId){
        const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + `/${userId}/getavatar`, {
          headers: {
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

    countUnreadNotification(userId){
      const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + `/${userId}/notification/unread-count`, {
          headers: {
            "Authorization" : `Bearer ${token}`
          },
        });
    }

    setReadNotification(userId, notificationId, isRead){
      const token = localStorage.getItem('Token')
        return axios.get(BASE_ACCOUNT_URL + `/${userId}/notification/${notificationId}?read=${isRead}`, {
          headers: {
            "Authorization" : `Bearer ${token}`
          },
        });
    }

}

export default new userService()