import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import find from 'lodash-es/find';
import {Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw'
import {JsonApiModel} from '../models/json-api.model';
import {ErrorResponse} from '../models/error-response.model';
import {JsonApiQueryData} from '../models/json-api-query-data';
import * as qs from 'qs';

export type ModelType<T extends JsonApiModel> = { new(datastore: JsonApiDatastore, data: any): T; };

@Injectable()
export class JsonApiDatastore {

    private _headers: HttpHeaders;
    private _store: {[type: string]: {[id: string]: JsonApiModel}} = {};

    constructor(private httpClient: HttpClient) {
    }

    /** @deprecated - use findAll method to take all models **/
    query<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, headers?: HttpHeaders): Observable<T[]> {
        const customHeadhers: HttpHeaders = this.buildHeaders(headers);
        let url: string = this.buildUrl(modelType, params);
        return this.httpClient.get(url, {headers: customHeadhers})
            .pipe(
                map((res: any) => this.extractQueryData(res, modelType)),
                catchError((res: any) => this.handleError(res))
            )
    }

    findManyRelated<T extends JsonApiModel>(
            modelType: ModelType<T>,
            id: string,
            relatedModelType: ModelType<any>,
            params?: any,
            headers?: HttpHeaders
        ): Observable<JsonApiQueryData<T>> {
            const customHeadhers: HttpHeaders = this.buildHeaders(headers);
            let url: string = this.buildUrl(modelType, params, id, relatedModelType, false);
            return this.httpClient.get(url, {headers: customHeadhers})
                .pipe(
                    map((res: any) => this.extractQueryData(res, modelType, true, relatedModelType, false)),
                    catchError((res: any) => this.handleError(res))
                );
    }

    findOneRelated<T extends JsonApiModel>(
        modelType: ModelType<T>,
        id: string,
        relatedModelType: ModelType<any>,
        params?: any,
        headers?: HttpHeaders
    ): Observable<JsonApiQueryData<T>> {
        const customHeadhers: HttpHeaders = this.buildHeaders(headers);
        let url: string = this.buildUrl(modelType, params, id, relatedModelType, true);
        return this.httpClient.get(url, {headers: customHeadhers})
            .pipe(
                map((res: any) => this.extractQueryData(res, modelType, true, relatedModelType, true)),
                catchError((res: any) => this.handleError(res))
            );
    }

    findAll<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, headers?: HttpHeaders): Observable<JsonApiQueryData<T>> {
        const customHeadhers: HttpHeaders = this.buildHeaders(headers);
        let url: string = this.buildUrl(modelType, params);
        return this.httpClient.get(url, {headers: customHeadhers})
            .pipe(
                map((res: any) => this.extractQueryData(res, modelType, true)),
                catchError((res: any) => this.handleError(res))
            );
    }

    findRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, params?: any, headers?: HttpHeaders): Observable<T> {
        const customHeadhers: HttpHeaders = this.buildHeaders(headers);
        let url: string = this.buildUrl(modelType, params, id);
        return this.httpClient.get(url, {headers: customHeadhers})
            .pipe(
                map((res: any) => this.extractRecordData(res, modelType)),
                catchError((res: any) => this.handleError(res))
            );
    }

    createRecord<T extends JsonApiModel>(modelType: ModelType<T>, data?: any): T {
        return new modelType(this, {attributes: data});
    }

    private getDirtyAttributes(attributesMetadata: any): { string: any} {
        let dirtyData: any = {};
        for (let propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                let metadata: any = attributesMetadata[propertyName];
                if (metadata.hasDirtyAttributes) {
                    dirtyData[propertyName] = metadata.serialisationValue ? metadata.serialisationValue : metadata.newValue;
                }
            }
        }
        return dirtyData;
    }

    saveRecord<T extends JsonApiModel>(attributesMetadata: any, model?: T, params?: any, headers?: HttpHeaders): Observable<T> {
        let modelType = <ModelType<T>>model.constructor;
        let typeName: string = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        const customHeadhers: HttpHeaders = this.buildHeaders(headers);
        let relationships: any = this.getRelationships(model);
        let url: string = this.buildUrl(modelType, params, model.id);

        let httpCall: Observable<any>;
        let body: any = {
            data: {
                type: typeName,
                id: model.id,
                attributes: this.getDirtyAttributes(attributesMetadata),
                relationships: relationships
            }
        };
        if (model.id) {
            httpCall = this.httpClient.patch(url, body, {headers: customHeadhers});
        } else {
            httpCall = this.httpClient.post(url, body, {headers: customHeadhers});
        }
        return httpCall
            .pipe(
                map((res: any) => {
                    this.extractRecordData(res, modelType, model);
                    this.resetMetadataAttributes(res, attributesMetadata, modelType);
                    this.updateRelationships(res, relationships);
                }),
                catchError((res: any) => this.handleError(res))
            );
    }

    deleteRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string, headers?: HttpHeaders): Observable<Response> {
        const customHeadhers: HttpHeaders = this.buildHeaders(headers);
        let url: string = this.buildUrl(modelType, null, id);
        return this.httpClient
            .delete(url, {headers: customHeadhers})
            .pipe(
                catchError((res: any) => this.handleError(res))
            );
    }

    peekRecord<T extends JsonApiModel>(modelType: ModelType<T>, id: string): T {
        let type: string = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        return this._store[type] ? <T>this._store[type][id] : null;
    }

    peekAll<T extends JsonApiModel>(modelType: ModelType<T>): T[] {
        let type = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        let typeStore = this._store[type];
        return typeStore ? Object.keys(typeStore).map(key => <T>typeStore[key]) : [];
    }

    set headers(headers: HttpHeaders) {
        this._headers = headers;
    }

    private getRelationships(data: any): any {
        let relationships: any;
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] instanceof JsonApiModel) {
                    relationships = relationships || {};
                    relationships[key] = {
                        data: this.buildSingleRelationshipData(data[key])
                    };
                } else if (data[key] instanceof Array && data[key].length > 0 && this.isValidToManyRelation(data[key])) {
                    relationships = relationships || {};
                    relationships[key] = {
                        data: data[key].map((model: JsonApiModel) => this.buildSingleRelationshipData(model))
                    };
                }
            }
        }
        return relationships;
    }

    private isValidToManyRelation(objects: Array<any>): boolean {
        let isJsonApiModel = objects.every(item => item instanceof JsonApiModel);
        let relationshipType: string = isJsonApiModel ? Reflect.getMetadata('JsonApiModelConfig', objects[0].constructor).type : '';
        return isJsonApiModel ? objects.every((item: JsonApiModel) =>
            Reflect.getMetadata('JsonApiModelConfig', item.constructor).type === relationshipType) : false;
    }

    private isValidToOneRelation(objects: Array<any>): boolean {
        let isJsonApiModel = objects.every(item => item instanceof JsonApiModel);
        let relationshipType: string = isJsonApiModel ? Reflect.getMetadata('JsonApiModelConfig', objects[0].constructor).type_one : '';
        return isJsonApiModel ? objects.every((item: JsonApiModel) =>
            Reflect.getMetadata('JsonApiModelConfig', item.constructor).type_one === relationshipType) : false;
    }

    private buildSingleRelationshipData(model: JsonApiModel): any {
        let relationshipType: string = Reflect.getMetadata('JsonApiModelConfig', model.constructor).type;
        let relationShipData: { type: string, id?: string, attributes?: any } = {type: relationshipType};
        if (model.id) {
            relationShipData.id = model.id;
        } else {
            let attributesMetadata: any = Reflect.getMetadata('Attribute', model);
            relationShipData.attributes = this.getDirtyAttributes(attributesMetadata);
        }
        return relationShipData;
    }

    private extractQueryData<T extends JsonApiModel>(
        res: any,
        modelType: ModelType<T>,
        withMeta = false,
        relatedModelType?: ModelType<any>,
        relatedModelTypeSingle?: boolean
        ): T[] | JsonApiQueryData<T> {
            let body: any = res;
            let models: T[] = [];
            let model: T;
            if (relatedModelTypeSingle) {
                const _data = body.data;
                model = relatedModelType ? new relatedModelType(this, _data) : new modelType(this, _data);
                this.addToStore(model);
                if (body.included) {
                    model.syncRelationships(_data, body.included, 0);
                    this.addToStore(model);
                }
                models.push(model);
            } else {
                body.data.map((_data: any) => {
                    model = relatedModelType ? new relatedModelType(this, _data) : new modelType(this, _data);
                    this.addToStore(model);
                    if (body.included) {
                        model.syncRelationships(_data, body.included, 0);
                        this.addToStore(model);
                    }
                    models.push(model);
                });
            }
            if (withMeta && withMeta === true) {
                return new JsonApiQueryData(models, this.parseMeta(body, modelType));
            } else {
                return models;
            }
    }

    private extractRecordData<T extends JsonApiModel>(res: any, modelType: ModelType<T>, model?: T): T {
        let body: any = res;
        if (model) {
            model.id = body.data.id;
            Object.assign(model, body.data.attributes);
        }
        model = model || new modelType(this, body.data);
        this.addToStore(model);
        if (body.included) {
            model.syncRelationships(body.data, body.included, 0);
            this.addToStore(model);
        }
        return model;
    }

    protected parseMeta(body: any, modelType: ModelType<JsonApiModel>): any {
        let metaModel: any = Reflect.getMetadata('JsonApiModelConfig', modelType).meta;
        let jsonApiMeta = new metaModel();

        for (let key in body) {
            if (jsonApiMeta.hasOwnProperty(key)) {
                jsonApiMeta[key] = body[key];
            }
        }
        return jsonApiMeta;
    }

    private buildHeaders(customHeaders: HttpHeaders): HttpHeaders {
        let headers: any = {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
        };
        if (customHeaders && customHeaders.keys().length) {
            Object.assign({}, headers, customHeaders.keys().map(header_name => {
                headers[ '' + header_name ] = customHeaders.get(header_name);
            }));
        }
        return new HttpHeaders(headers);
    }

    private toQueryString(params: any) {
        return qs.stringify(params, { arrayFormat: 'brackets' });
    }

    public addToStore(modelOrModels: JsonApiModel | JsonApiModel[]): void {
        let models = Array.isArray(modelOrModels) ? modelOrModels : [modelOrModels];
        let type: string = Reflect.getMetadata('JsonApiModelConfig', models[0].constructor).type;
        let typeStore = this._store[type];
        if (!typeStore) {
            typeStore = this._store[type] = {};
        }
        for (let model of models) {
            typeStore[model.id] = model;
        }
    }

    private resetMetadataAttributes<T extends JsonApiModel>(res: any, attributesMetadata: any, modelType: ModelType<T>) {
        attributesMetadata = Reflect.getMetadata('Attribute', res);
        for (let propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                let metadata: any = attributesMetadata[propertyName];
                if (metadata.hasDirtyAttributes) {
                    metadata.hasDirtyAttributes = false;
                }
            }
        }
        Reflect.defineMetadata('Attribute', attributesMetadata, res);
        return res;
    }

    private updateRelationships(model: JsonApiModel, relationships: any): JsonApiModel {
        let modelsTypes: any = Reflect.getMetadata('JsonApiDatastoreConfig', this.constructor).models;
        for (let relationship in relationships) {
            if (relationships.hasOwnProperty(relationship) && model.hasOwnProperty(relationship)) {
                let relationshipModel: JsonApiModel = model[relationship];
                let hasMany: any[] = Reflect.getMetadata('HasMany', relationshipModel);
                let propertyHasMany: any = find(hasMany, (property) => {
                    return modelsTypes[property.relationship] === model.constructor;
                });
                if (propertyHasMany) {
                    // fix when the relation doesnt have records yet
                    if (typeof relationshipModel[propertyHasMany.propertyName] === 'undefined') {
                        relationshipModel[propertyHasMany.propertyName] = [];
                    }
                    relationshipModel[propertyHasMany.propertyName].push(model);
                }

                let hasOne: any[] = Reflect.getMetadata('HasOne', relationshipModel);
                let propertyHasOne: any = find(hasOne, (property) => {
                    return modelsTypes[property.relationship] === model.constructor;
                });
                if (propertyHasOne) {
                    relationshipModel[propertyHasOne.propertyName] = model;
                }
            }
        }
        return model;
    };

    private buildUrl<T extends JsonApiModel>(
        modelType: ModelType<T>,
        params?: any,
        id?: string,
        modelTypeRelated?: any,
        modelTypeRelatedSingle?: boolean
        ): string {
            let typeName: string = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
            let baseUrl: string = Reflect.getMetadata('JsonApiDatastoreConfig', this.constructor).baseUrl;
            let idToken: string = id ? `/${id}` : null;
            let typeNameRelated: string;
            if (modelTypeRelated) {
                if (modelTypeRelatedSingle) {
                    typeNameRelated = Reflect.getMetadata('JsonApiModelConfig', modelTypeRelated).type_one;
                } else {
                    typeNameRelated = Reflect.getMetadata('JsonApiModelConfig', modelTypeRelated).type;
                }
            }
            return [baseUrl, typeName, idToken, (modelTypeRelated ? '/' + typeNameRelated : ''), (params ? '?' : ''), this.toQueryString(params)].join('');
    }

    protected handleError(error: any): Observable<any> {
        let errMsg: string = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        try {
            let body: any = error;
            if (body.errors && body.errors instanceof Array) {
                let errors: ErrorResponse = new ErrorResponse(body.errors);
                console.error(errMsg, errors);
                return _throw(errors);
            }
        } catch (e) {
            // no valid JSON
        }

        console.error(errMsg);
        return _throw(errMsg);
    }
}
