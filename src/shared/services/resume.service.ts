import {Injectable, InjectionToken, Type} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpResponseBase} from '@angular/common/http';
import {catchError} from 'rxjs/operators';



export class ResumeService {
    private REMOTE_BASE_URL = '';

    constructor(private http: HttpClient){

    }
}