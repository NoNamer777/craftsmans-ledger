import { inject, Injectable } from '@angular/core';
import { serialize, serializeAll } from '@craftsmans-ledger/shared';
import { from, map, of, tap } from 'rxjs';
import { StorageKeys } from '../../browser-storage';
import { CacheService } from '../../cache';
import { ApiService } from '../../http';
import { CreateTechnologyTreeData, TechnologyTree } from './models';

@Injectable({ providedIn: 'root' })
export class TechnologyTreesService {
    private readonly apiService = inject(ApiService);
    private readonly cacheService = new CacheService(StorageKeys.CACHE_TECHNOLOGY_TREES, TechnologyTree);

    private readonly endPoint = '/technology-trees';

    public initialize() {
        return from(this.cacheService.loadCacheFromStorage());
    }

    public clearCache() {
        this.cacheService.clear();
    }

    public getAll() {
        if (this.cacheService.hasCache) return of(this.cacheService.cache);
        return this.apiService.get<TechnologyTree[]>(this.endPoint).pipe(
            map((response) => serializeAll(TechnologyTree, response.body)),
            tap((technologyTrees) => (this.cacheService.cache = technologyTrees))
        );
    }

    public create(technologyTree: CreateTechnologyTreeData) {
        return this.apiService
            .post<CreateTechnologyTreeData, TechnologyTree>(this.endPoint, technologyTree)
            .pipe(map((response) => serialize(TechnologyTree, response.body)));
    }

    public getById(technologyTreeId: string) {
        const fetchFromApi = this.apiService
            .get<TechnologyTree>(`${this.endPoint}/${technologyTreeId}`)
            .pipe(map((response) => serialize(TechnologyTree, response.body)));

        if (this.cacheService.hasCache) {
            const cachedResource = this.cacheService.getResourceById(technologyTreeId);
            return cachedResource ? of(cachedResource) : fetchFromApi;
        }
        return fetchFromApi;
    }

    public update(technologyTree: TechnologyTree) {
        return this.apiService
            .put<TechnologyTree>(`${this.endPoint}/${technologyTree.id}`, technologyTree)
            .pipe(map((response) => serialize(TechnologyTree, response.body)));
    }

    public remove(technologyTreeId: string) {
        return this.apiService.delete(`${this.endPoint}/${technologyTreeId}`);
    }
}
