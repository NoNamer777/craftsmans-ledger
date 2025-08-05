import { inject, Injectable } from '@angular/core';
import { ConfigService } from '../config';
import { QueryParams } from './models';
import { RequestService } from './request.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly requestService = inject(RequestService);
    private readonly configService = inject(ConfigService);

    public baseApiUrl = this.configService.config.baseApiUrl;

    public get<Response, QueryParamName extends string = string>(
        endPoint: string,
        queryParams?: QueryParams<QueryParamName>
    ) {
        return this.requestService.get<Response>(`${this.baseApiUrl}${endPoint}`, queryParams);
    }

    public post<RequestBody, Response>(endpoint: string, body: RequestBody) {
        return this.requestService.post<RequestBody, Response>(`${this.baseApiUrl}${endpoint}`, body);
    }

    public put<RequestBody, Response>(endpoint: string, body: RequestBody) {
        return this.requestService.put<RequestBody, Response>(`${this.baseApiUrl}${endpoint}`, body);
    }

    public delete(endPoint: string) {
        return this.requestService.delete(`${this.baseApiUrl}${endPoint}`);
    }
}
