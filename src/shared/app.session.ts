
export class AppSession {

    public static AUTH_TOKEN = 'auth-token'

    public static getToken(name: string): string | null {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
            if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
        }
        return null;
    }

    public static setToken(name: string, value: string, expireDays: number): void {
        let expires = '';
        if (expireDays) {
            const date = new Date();
            date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '')  + expires + '; path=/';
    }

    public static removeToken(name: string): void {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    public static getUserDetails() {
        const token = AppSession.getToken(AppSession.AUTH_TOKEN);
        if(token){
            const { id, email } = AppSession.parseJwt(token);
            return { email, id }
        }
        return {}
    }

    public static isLogedIn(){
        return AppSession.getUserDetails().id; 
    }

    private static parseJwt (token: string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };
}