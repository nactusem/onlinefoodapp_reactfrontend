import axios from 'axios';
class AuthenticationService{

    executeBasicAuthentication(username,password){
        return axios.get('http://localhost:8034/basicauthentication',{headers:{authorization:this.createBasicAuthentication(username,password)}});
    };

    executeJwtAuthentication(username,password){
        return axios.post('http://localhost:8034/authenticate',{username,password});
    };

    createBasicAuthentication(username,password){
        return 'Basic '+ window.btoa(username+":"+password);
    };

    registerSuccessfullLogin(username,password){
        sessionStorage.setItem('authenticatedUser',username);
        this.setupAxiosInterceptors(username,password);
    }

    registerSuccessfullLoginJwt(username,token){
        sessionStorage.setItem('authenticatedUser',username);
        localStorage.setItem('token',token);
        this.setupAxiosInterceptorsJwt(token);
    }

    logout(){
        sessionStorage.removeItem('authenticatedUser');
    }

    isUserLoggedIn(){
        let user = sessionStorage.getItem('authenticatedUser');
        if(user === null) return false;
        return true;
    }

    setupAxiosInterceptors(username,password){
        axios.interceptors.request.use((config)=>{
            if(this.isUserLoggedIn())
                config.headers.authorization = this.createBasicAuthentication(username,password);
            return config;
        })
    }

    setupAxiosInterceptorsJwt = (token) =>{
        axios.interceptors.request.use((config)=>{
            if(this.isUserLoggedIn())
                config.headers.authorization = this.createJwtAuthentication(token);
            return config;
        })
    }

    setupAxiosInterceptorsForSavedToken(){
        if(this.isUserLoggedIn())
            this.setupAxiosInterceptorsJwt(localStorage.getItem('token'));
    }

    createJwtAuthentication(token){
        return 'Bearer '+ token;
    };
}

export default new AuthenticationService()