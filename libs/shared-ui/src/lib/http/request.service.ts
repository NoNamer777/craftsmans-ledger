import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryParams } from './models';

@Injectable({ providedIn: 'root' })
export class RequestService {
    private readonly httpClient = inject(HttpClient);

    public get<Response>(url: string, queryParams?: QueryParams) {
        url = this.addQueryParams(url, queryParams);

        return this.httpClient.get<Response>(url);
    }

    public post<RequestBody, Response>(url: string, body: RequestBody) {
        return this.httpClient.post<Response>(url, body, { observe: 'response' });
    }

    public put<RequestBody, Response = RequestBody>(url: string, body: RequestBody) {
        return this.httpClient.put<Response>(url, body, { observe: 'response' });
    }

    public delete(url: string) {
        return this.httpClient.delete(url);
    }

    private addQueryParams(url: string, queryParams?: QueryParams) {
        if (!queryParams) return url;
        url += '?';

        Object.entries(queryParams).forEach(([queryParam, value]) => {
            if (Array.isArray(value)) {
                url += `${queryParam}=${value.map((entry) => this.handleQueryParam(entry)).join(',')}&`;
            } else {
                url += `${queryParam}=${this.handleQueryParam(value)}&`;
            }
        });

        // Remove the last trailing `&`;
        return encodeURI(url.substring(0, url.length - 1));
    }

    private handleQueryParam(value: string | number | boolean) {
        if (typeof value === 'boolean' || typeof value === 'number') {
            return `${value}`;
        }
        return value;
    }
}
