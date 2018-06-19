import { Observable } from 'rxjs';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    query<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, headers?: HttpHeaders): Observable<T[] | JsonApiQueryData<T>>;
    findManyRelated<T extends JsonApiModel>(modelType: ModelType<T>, id: string, relatedModelType: ModelType<any>, params?: any, headers?: HttpHeaders): Observable<T[] | JsonApiQueryData<T>>;
    findOneRelated<T extends JsonApiModel>(modelType: ModelType<T>, id: string, relatedModelType: ModelType<any>, params?: any, headers?: HttpHeaders): Observable<T[] | JsonApiQueryData<T>>;
    findAll<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, headers?: HttpHeaders): Observable<T[] | JsonApiQueryData<T>>;
    findRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, params?: any, headers?: HttpHeaders): Observable<any[] | T>;
    createRecord<T extends JsonApiModel>(modelType: ModelType<T>, data?: any): T;
    private getDirtyAttributes(attributesMetadata);
    saveRecord<T extends JsonApiModel>(attributesMetadata: any, model?: T, params?: any, headers?: HttpHeaders): Observable<JsonApiModel | T | any[]>;
    deleteRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, headers?: HttpHeaders): Observable<Response | any>;
    peekRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string): T;
    peekAll<T extends JsonApiModel>(modelType: ModelType<T>): T[];
    headers: HttpHeaders;
    private getRelationships(data);
    private isValidToManyRelation(objects);
    private isValidToOneRelation(objects);
    private buildSingleRelationshipData(model);
    private extractQueryData<T>(res, modelType, withMeta?, relatedModelType?, relatedModelTypeSingle?);
    private extractRecordData<T>(res, modelType, model?);
    protected parseMeta(body: any, modelType: ModelType<JsonApiModel>): any;
    private buildHeaders(customHeaders);
    private toQueryString(params);
    addToStore(modelOrModels: JsonApiModel | JsonApiModel[]): void;
    private resetMetadataAttributes<T>(res, attributesMetadata, modelType);
    private updateRelationships(model, relationships);
    private buildUrl<T>(modelType, params?, id?, modelTypeRelated?, modelTypeRelatedSingle?);
    protected handleError(error: any): Observable<any>;
}
