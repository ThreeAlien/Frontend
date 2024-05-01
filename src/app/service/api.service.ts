import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseResponse } from '../share/Models/share.model';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private httpClient: HttpClient) { }

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
      'Access-Control-Max-Age': '86400',
    })
  };

  /**
     *  呼叫Api, 事後才轉型
     * @param apiPath  api 的route
     * @param methodType Method GET,POST,PUT,DELETE
     * @param {*} [sendParams=null] Post /Put Data
     * @param responseType GET 用的參數，指定轉型值
     * @returns {Observable<object>} 可subscribe的結果
     * @example
       this.GetDataService.CallBoxman("api/echo-db/self","GET").subscribe(
        (data: any) => {
          console.log(data as string);
        },
        (err: any) => {
          console.log('err:',err);
        }
      );
     */
  public CallApi(apiPath: string, methodType: string, sendParams: any = null, responseType: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json'): Observable<BaseResponse> {
    var ret = new Observable<any>();
    switch (methodType.toUpperCase()) {
      case 'GET':
        if (responseType == 'arraybuffer')
          ret = this.httpClient.get(apiPath, { headers: this.httpOptions.headers, responseType: 'arraybuffer' }) as Observable<ArrayBuffer>;
        else if (responseType == 'blob')
          ret = this.httpClient.get(apiPath, { headers: this.httpOptions.headers, responseType: 'blob' }) as Observable<Blob>;
        else if (responseType == 'json')
          ret = this.httpClient.get(apiPath, { headers: this.httpOptions.headers, responseType: 'json' }) as Observable<Object>;
        else if (responseType == 'text')
          ret = this.httpClient.get(apiPath, { headers: this.httpOptions.headers, responseType: 'text' }) as Observable<string>;
        break;
      case 'POST':
        if (responseType == 'arraybuffer')
          ret = this.httpClient.post(apiPath, sendParams ? sendParams : sendParams,
            { headers: this.httpOptions.headers, responseType: 'arraybuffer' }) as Observable<ArrayBuffer>;
        else if (responseType == 'blob')
          ret = this.httpClient.post(apiPath, sendParams ? sendParams : sendParams, { headers: this.httpOptions.headers, responseType: 'blob' }) as Observable<Blob>;
        else if (responseType == 'json')
          ret = this.httpClient.post(apiPath, sendParams ? sendParams : sendParams, { headers: this.httpOptions.headers, responseType: 'json' }) as Observable<Object>;
        else if (responseType == 'text')
          ret = this.httpClient.post(apiPath, sendParams ? sendParams : sendParams, { headers: this.httpOptions.headers, responseType: 'text' }) as Observable<string>;
        break;
      case 'PUT':
        ret = this.httpClient.put(apiPath, sendParams ? sendParams : sendParams,
          { headers: this.httpOptions.headers });
        break;
      case 'DELETE':
        ret = this.httpClient.delete(apiPath, { headers: this.httpOptions.headers });
        break;
    }
    return ret;
  }

}
