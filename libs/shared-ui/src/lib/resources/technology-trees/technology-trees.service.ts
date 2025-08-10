import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from '../../http';
import { serialize, serializeAll } from '../../utils';
import { CreateTechnologyTreeData, TechnologyTree } from './models';

@Injectable({ providedIn: 'root' })
export class TechnologyTreesService {
    private readonly apiService = inject(ApiService);

    private readonly endPoint = '/technology-trees';

    public getAll() {
        return this.apiService
            .get<TechnologyTree[]>(this.endPoint)
            .pipe(map((response) => serializeAll(TechnologyTree, response.body)));
    }

    public create(technologyTree: CreateTechnologyTreeData) {
        return this.apiService
            .post<CreateTechnologyTreeData, TechnologyTree>(this.endPoint, technologyTree)
            .pipe(map((response) => serialize(TechnologyTree, response.body)));
    }

    public getById(technologyTreeId: string) {
        return this.apiService
            .get<TechnologyTree>(`${this.endPoint}/${technologyTreeId}`)
            .pipe(map((response) => serialize(TechnologyTree, response.body)));
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
