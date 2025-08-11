import { inject, Injectable } from '@angular/core';
import { ConfigService } from '../config';
import { QueryParams } from './models';
import { RequestService } from './request.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly requestService = inject(RequestService);
    private readonly configService = inject(ConfigService);

    public get<Response, QueryParamName extends string = string>(
        endPoint: string,
        queryParams?: QueryParams<QueryParamName>
    ) {
        const baseApiUrl = this.configService.config.baseApiUrl;
        return this.requestService.get<Response>(`${baseApiUrl}${endPoint}`, queryParams);
    }

    public post<RequestBody, Response>(endpoint: string, body: RequestBody) {
        const baseApiUrl = this.configService.config.baseApiUrl;
        return this.requestService.post<RequestBody, Response>(`${baseApiUrl}${endpoint}`, body);
    }

    public put<RequestBody, Response = RequestBody>(endpoint: string, body: RequestBody) {
        const baseApiUrl = this.configService.config.baseApiUrl;
        return this.requestService.put<RequestBody, Response>(`${baseApiUrl}${endpoint}`, body);
    }

    public delete(endPoint: string) {
        const baseApiUrl = this.configService.config.baseApiUrl;
        return this.requestService.delete(`${baseApiUrl}${endPoint}`);
    }
}
