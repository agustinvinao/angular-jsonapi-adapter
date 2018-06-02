import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
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
    private parseHasMany;
    private parseHasOne;
    private parseBelongsTo;
    private getHasManyRelationship;
    private getHasOneRelationship;
    private getBelongsToRelationship;
    private createOrPeek;
}
