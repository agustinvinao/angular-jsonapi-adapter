import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { JsonApiModel } from '../models/json-api.model';
import { JsonApiQueryData } from '../models/json-api-query-data';
export declare type ModelType<T extends JsonApiModel> = {
    new (datastore: JsonApiDatastore, data: any): T;
};
export declare class JsonApiDatastore {
    private httpClient;
    private _headers;
    private _store;
    constructor(httpClient: HttpClient);
    /** @deprecated - use findAll method to take all models **/
    query<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, headers?: HttpHeaders): Observable<T[]>;
    findAll<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, headers?: HttpHeaders): Observable<JsonApiQueryData<T>>;
    findRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, params?: any, headers?: HttpHeaders): Observable<T>;
    createRecord<T extends JsonApiModel>(modelType: ModelType<T>, data?: any): T;
    private getDirtyAttributes(attributesMetadata);
    saveRecord<T extends JsonApiModel>(attributesMetadata: any, model?: T, params?: any, headers?: HttpHeaders): Observable<T>;
    deleteRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, headers?: HttpHeaders): Observable<Response>;
    peekRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string): T;
    peekAll<T extends JsonApiModel>(modelType: ModelType<T>): T[];
    headers: HttpHeaders;
    private getRelationships(data);
    private isValidToManyRelation(objects);
    private isValidToOneRelation(objects);
    private buildSingleRelationshipData(model);
    private extractQueryData<T>(res, modelType, withMeta?);
    private extractRecordData<T>(res, modelType, model?);
    protected parseMeta(body: any, modelType: ModelType<JsonApiModel>): any;
    private buildHeaders(customHeaders);
    private toQueryString(params);
    addToStore(modelOrModels: JsonApiModel | JsonApiModel[]): void;
    private resetMetadataAttributes<T>(res, attributesMetadata, modelType);
    private updateRelationships(model, relationships);
    private buildUrl<T>(modelType, params?, id?);
    protected handleError(error: any): ErrorObservable;
}
