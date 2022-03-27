import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AppSession } from '../app.session';
import { AppConst } from '../app.const';


@Injectable({
    providedIn: 'root'
})
export class ResumeService {
    private REMOTE_BASE_URL = '';

    public apiHeaders: HttpHeaders;

    constructor(private http: HttpClient){
        this.REMOTE_BASE_URL = AppConst.remoteServiceBaseUrl;
        this.apiHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'auth-token': `bearer ${AppSession.getToken(AppSession.AUTH_TOKEN)}`
        });
    }

    public getAllResume(): Observable<any> {
        return this.http.get( this.REMOTE_BASE_URL + '/api/v1/resume/getall', { headers: this.apiHeaders });
    }

    public getById(resumeId: string): Observable<any> {
        const params = new HttpParams( { fromString: `id=${resumeId}` } );
        return this.http.get( this.REMOTE_BASE_URL + '/api/v1/resume/getById', { headers: this.apiHeaders, params } );
    }

    public getAllUserResume(): Observable<any> {
        return this.http.get( this.REMOTE_BASE_URL + '/api/v1/resume/get-all-userresumes', { headers: this.apiHeaders } );
    }

    public getUserResumeById(userResumeId: string) {
        const params = new HttpParams( {fromString: `id=${userResumeId}`} );
        return this.http.get( this.REMOTE_BASE_URL + '/api/v1/resume/get-userresume-id', { headers: this.apiHeaders, params } );
    }

    public getResumeLayout(resumeId: string, body: JSON): Observable<any>{

        const params = new HttpParams( { fromString: `id=${resumeId}` } );

        return this.http.post(this.REMOTE_BASE_URL + '/api/v1/resume/get-resume-layout', body, {
            headers: this.apiHeaders,
            params: params,
            responseType: 'text'
        });
    }

    public saveResumeHtml(resumeId: string, body: JSON){
        const params = new HttpParams({ fromString: `id=${resumeId}` });
        return this.http.post( this.REMOTE_BASE_URL + '/api/v1/resume/save-resume-html', body, { headers: this.apiHeaders , params } );
    }

    public updateResumeHtml(userResumeId: string, body: {}) {
        const params = new HttpParams ( {fromString: `id=${userResumeId}`} );
        return this.http.put(this.REMOTE_BASE_URL + '/api/v1/resume/update-resume-html',body, { headers: this.apiHeaders, params });
    }

    public saveResumePdf(userResumeId: string){
        const params = new HttpParams( { fromString: `id=${userResumeId}` } );
        return this.http.post(this.REMOTE_BASE_URL + '/api/v1/resume/save-resume-pdf', {}, { headers: this.apiHeaders, params });
    }

    public getPdf(userResumeId: string){
        const params = new HttpParams( { fromString: `id=${userResumeId}` } );
        return this.http.get(this.REMOTE_BASE_URL + '/api/v1/resume/get-pdf', { headers: this.apiHeaders, params: params, responseType: 'blob' });
    }

    public getHtml(userResumeId: string){
        const params = new HttpParams( { fromString: `id=${userResumeId}` } );
        return this.http.get(this.REMOTE_BASE_URL + '/api/v1/resume/get-html', { headers: this.apiHeaders, params: params, responseType: 'text' });
    }

    public deleteUserResume(userResumeId: string){
        const params = new HttpParams( { fromString: `id=${userResumeId}` } );
        return this.http.delete(this.REMOTE_BASE_URL + '/api/v1/resume/delete-userresume', { headers: this.apiHeaders, params: params });
    }

    public getUserResumeImage(imagePath: string) {
        const params = new HttpParams( { fromString: `id=${imagePath}` } );
        return this.http.get( this.REMOTE_BASE_URL + '/api/v1/resume/get-userresume-image', { headers: this.apiHeaders, params: params, responseType: 'blob' } ); 
    }


}