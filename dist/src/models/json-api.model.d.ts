import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JsonApiDatastore } from '../services/json-api-datastore.service';
export declare class JsonApiModel {
    private _datastore;
    id: string;
    [key: string]: any;
    constructor(_datastore: JsonApiDatastore, data?: any);
    syncRelationships(data: any, included: any, level: number): void;
    save(params?: any, headers?: HttpHeaders): Observable<this>;
    readonly hasDirtyAttributes: boolean;
    rollbackAttributes(): void;
    private parseHasMany(data, included, level);
    private parseHasOne(data, included, level);
    private parseBelongsTo(data, included, level);
    private getHasManyRelationship<T>(modelType, data, included, typeName, level);
    private getHasOneRelationship<T>(modelType, data, included, typeName, level, type_one);
    private getBelongsToRelationship<T>(modelType, data, included, typeName, level);
    private createOrPeek<T>(modelType, data);
}
