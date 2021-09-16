import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConst } from "../app.const";

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
}

export class AuthDto {
    public email = '';
    public password = '';
}