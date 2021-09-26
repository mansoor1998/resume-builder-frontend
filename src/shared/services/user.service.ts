import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConst } from "../app.const";
import { AppSession } from "../app.session";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private REMOTE_BASE_URL = '';

    constructor(private http: HttpClient) {
        this.REMOTE_BASE_URL = AppConst.remoteServiceBaseUrl;
    }

    public login(user: AuthDto): Observable<{ jwt: string }> | any {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post(this.REMOTE_BASE_URL + '/api/v1/user/login', user, { headers });
    }

    public register(user: RegisterDto): Observable<JwtDto> | any {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post(this.REMOTE_BASE_URL + '/api/v1/user/register', user, { headers });
    }

    public isAuthorized(): Observable<boolean> | any {
        return this.http.get(this.REMOTE_BASE_URL + '/api/v1/user/isAuthorized', {
            headers: new HttpHeaders({
                'auth-token': `bearer ${AppSession.getToken(AppSession.AUTH_TOKEN)}`
            })
        });
    }

    public googleOAuth(body: any): Observable<any> | any {
        return this.http.post(this.REMOTE_BASE_URL + '/api/v1/user/openauth/login', body);
    }

    public getUrl(): Observable<any> {
        return this.http.get(this.REMOTE_BASE_URL + '/api/v1/user/openauth/google', {
            responseType: 'text'
        });
    }


}

export class RegisterDto {
    public email = '';
    public password = '';
}

export class JwtDto {
    public jwt: string = '';
    public isActive: string = '';
}

export class AuthDto {
    public email = '';
    public password = '';
}