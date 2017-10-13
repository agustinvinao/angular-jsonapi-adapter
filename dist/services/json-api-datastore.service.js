"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var find_1 = require("lodash-es/find");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
var json_api_model_1 = require("../models/json-api.model");
var error_response_model_1 = require("../models/error-response.model");
var json_api_query_data_1 = require("../models/json-api-query-data");
var qs = require("qs");
var JsonApiDatastore = /** @class */ (function () {
    function JsonApiDatastore(httpClient) {
        this.httpClient = httpClient;
        this._store = {};
    }
    /** @deprecated - use findAll method to take all models **/
    JsonApiDatastore.prototype.query = function (modelType, params, headers) {
        var _this = this;
        var customHeadhers = this.buildHeaders(headers);
        var url = this.buildUrl(modelType, params);
        return this.httpClient.get(url, { headers: customHeadhers })
            .map(function (res) { return _this.extractQueryData(res, modelType); })
            .catch(function (res) { return _this.handleError(res); });
    };
    JsonApiDatastore.prototype.findManyRelated = function (modelType, id, relatedModelType, params, headers) {
        var _this = this;
        var customHeadhers = this.buildHeaders(headers);
        var url = this.buildUrl(modelType, params, id, relatedModelType, false);
        return this.httpClient.get(url, { headers: customHeadhers })
            .map(function (res) { return _this.extractQueryData(res, modelType, true, relatedModelType); })
            .catch(function (res) { return _this.handleError(res); });
    };
    JsonApiDatastore.prototype.findOneRelated = function (modelType, id, relatedModelType, params, headers) {
        var _this = this;
        var customHeadhers = this.buildHeaders(headers);
        var url = this.buildUrl(modelType, params, id, relatedModelType, true);
        return this.httpClient.get(url, { headers: customHeadhers })
            .map(function (res) { return _this.extractQueryData(res, modelType, true, relatedModelType); })
            .catch(function (res) { return _this.handleError(res); });
    };
    JsonApiDatastore.prototype.findAll = function (modelType, params, headers) {
        var _this = this;
        var customHeadhers = this.buildHeaders(headers);
        var url = this.buildUrl(modelType, params);
        return this.httpClient.get(url, { headers: customHeadhers })
            .map(function (res) { return _this.extractQueryData(res, modelType, true); })
            .catch(function (res) { return _this.handleError(res); });
    };
    JsonApiDatastore.prototype.findRecord = function (modelType, id, params, headers) {
        var _this = this;
        var customHeadhers = this.buildHeaders(headers);
        var url = this.buildUrl(modelType, params, id);
        return this.httpClient.get(url, { headers: customHeadhers })
            .map(function (res) { return _this.extractRecordData(res, modelType); })
            .catch(function (res) { return _this.handleError(res); });
    };
    JsonApiDatastore.prototype.createRecord = function (modelType, data) {
        return new modelType(this, { attributes: data });
    };
    JsonApiDatastore.prototype.getDirtyAttributes = function (attributesMetadata) {
        var dirtyData = {};
        for (var propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                var metadata = attributesMetadata[propertyName];
                if (metadata.hasDirtyAttributes) {
                    dirtyData[propertyName] = metadata.serialisationValue ? metadata.serialisationValue : metadata.newValue;
                }
            }
        }
        return dirtyData;
    };
    JsonApiDatastore.prototype.saveRecord = function (attributesMetadata, model, params, headers) {
        var _this = this;
        var modelType = model.constructor;
        var typeName = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        var customHeadhers = this.buildHeaders(headers);
        var relationships = this.getRelationships(model);
        var url = this.buildUrl(modelType, params, model.id);
        var httpCall;
        var body = {
            data: {
                type: typeName,
                id: model.id,
                attributes: this.getDirtyAttributes(attributesMetadata),
                relationships: relationships
            }
        };
        if (model.id) {
            httpCall = this.httpClient.patch(url, body, { headers: customHeadhers });
        }
        else {
            httpCall = this.httpClient.post(url, body, { headers: customHeadhers });
        }
        return httpCall
            .map(function (res) { return _this.extractRecordData(res, modelType, model); })
            .map(function (res) { return _this.resetMetadataAttributes(res, attributesMetadata, modelType); })
            .map(function (res) { return _this.updateRelationships(res, relationships); })
            .catch(function (res) { return _this.handleError(res); });
    };
    JsonApiDatastore.prototype.deleteRecord = function (modelType, id, headers) {
        var _this = this;
        var customHeadhers = this.buildHeaders(headers);
        var url = this.buildUrl(modelType, null, id);
        return this.httpClient.delete(url, { headers: customHeadhers })
            .catch(function (res) { return _this.handleError(res); });
    };
    JsonApiDatastore.prototype.peekRecord = function (modelType, id) {
        var type = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        return this._store[type] ? this._store[type][id] : null;
    };
    JsonApiDatastore.prototype.peekAll = function (modelType) {
        var type = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        var typeStore = this._store[type];
        return typeStore ? Object.keys(typeStore).map(function (key) { return typeStore[key]; }) : [];
    };
    Object.defineProperty(JsonApiDatastore.prototype, "headers", {
        set: function (headers) {
            this._headers = headers;
        },
        enumerable: true,
        configurable: true
    });
    JsonApiDatastore.prototype.getRelationships = function (data) {
        var _this = this;
        var relationships;
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] instanceof json_api_model_1.JsonApiModel) {
                    relationships = relationships || {};
                    relationships[key] = {
                        data: this.buildSingleRelationshipData(data[key])
                    };
                }
                else if (data[key] instanceof Array && data[key].length > 0 && this.isValidToManyRelation(data[key])) {
                    relationships = relationships || {};
                    relationships[key] = {
                        data: data[key].map(function (model) { return _this.buildSingleRelationshipData(model); })
                    };
                }
            }
        }
        return relationships;
    };
    JsonApiDatastore.prototype.isValidToManyRelation = function (objects) {
        var isJsonApiModel = objects.every(function (item) { return item instanceof json_api_model_1.JsonApiModel; });
        var relationshipType = isJsonApiModel ? Reflect.getMetadata('JsonApiModelConfig', objects[0].constructor).type : '';
        return isJsonApiModel ? objects.every(function (item) {
            return Reflect.getMetadata('JsonApiModelConfig', item.constructor).type === relationshipType;
        }) : false;
    };
    JsonApiDatastore.prototype.isValidToOneRelation = function (objects) {
        var isJsonApiModel = objects.every(function (item) { return item instanceof json_api_model_1.JsonApiModel; });
        var relationshipType = isJsonApiModel ? Reflect.getMetadata('JsonApiModelConfig', objects[0].constructor).type_one : '';
        return isJsonApiModel ? objects.every(function (item) {
            return Reflect.getMetadata('JsonApiModelConfig', item.constructor).type_one === relationshipType;
        }) : false;
    };
    JsonApiDatastore.prototype.buildSingleRelationshipData = function (model) {
        var relationshipType = Reflect.getMetadata('JsonApiModelConfig', model.constructor).type;
        var relationShipData = { type: relationshipType };
        if (model.id) {
            relationShipData.id = model.id;
        }
        else {
            var attributesMetadata = Reflect.getMetadata('Attribute', model);
            relationShipData.attributes = this.getDirtyAttributes(attributesMetadata);
        }
        return relationShipData;
    };
    JsonApiDatastore.prototype.extractQueryData = function (res, modelType, withMeta, relatedModelType, relatedModelSingle) {
        var _this = this;
        if (withMeta === void 0) { withMeta = false; }
        var body = res;
        var models = [];
        var model;
        if (relatedModelSingle) {
            model = relatedModelType ? new relatedModelType(this, body.data) : new modelType(this, body.data);
            this.addToStore(model);
            if (body.included) {
                model.syncRelationships(body.data, body.included, 0);
                this.addToStore(model);
            }
            models.push(model);
        }
        else {
            body.data.map(function (_data) {
                model = relatedModelType ? new relatedModelType(_this, _data) : new modelType(_this, _data);
                _this.addToStore(model);
                if (body.included) {
                    model.syncRelationships(_data, body.included, 0);
                    _this.addToStore(model);
                }
                models.push(model);
            });
        }
        if (withMeta && withMeta === true) {
            return new json_api_query_data_1.JsonApiQueryData(models, this.parseMeta(body, modelType));
        }
        else {
            return models;
        }
    };
    JsonApiDatastore.prototype.extractRecordData = function (res, modelType, model) {
        var body = res;
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
    };
    JsonApiDatastore.prototype.parseMeta = function (body, modelType) {
        var metaModel = Reflect.getMetadata('JsonApiModelConfig', modelType).meta;
        var jsonApiMeta = new metaModel();
        for (var key in body) {
            if (jsonApiMeta.hasOwnProperty(key)) {
                jsonApiMeta[key] = body[key];
            }
        }
        return jsonApiMeta;
    };
    JsonApiDatastore.prototype.buildHeaders = function (customHeaders) {
        var headers = {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
        };
        if (customHeaders && customHeaders.keys().length) {
            Object.assign({}, headers, customHeaders.keys().map(function (header_name) {
                headers['' + header_name] = customHeaders.get(header_name);
            }));
        }
        return new http_1.HttpHeaders(headers);
    };
    JsonApiDatastore.prototype.toQueryString = function (params) {
        return qs.stringify(params, { arrayFormat: 'brackets' });
    };
    JsonApiDatastore.prototype.addToStore = function (modelOrModels) {
        var models = Array.isArray(modelOrModels) ? modelOrModels : [modelOrModels];
        var type = Reflect.getMetadata('JsonApiModelConfig', models[0].constructor).type;
        var typeStore = this._store[type];
        if (!typeStore) {
            typeStore = this._store[type] = {};
        }
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var model = models_1[_i];
            typeStore[model.id] = model;
        }
    };
    JsonApiDatastore.prototype.resetMetadataAttributes = function (res, attributesMetadata, modelType) {
        attributesMetadata = Reflect.getMetadata('Attribute', res);
        for (var propertyName in attributesMetadata) {
            if (attributesMetadata.hasOwnProperty(propertyName)) {
                var metadata = attributesMetadata[propertyName];
                if (metadata.hasDirtyAttributes) {
                    metadata.hasDirtyAttributes = false;
                }
            }
        }
        Reflect.defineMetadata('Attribute', attributesMetadata, res);
        return res;
    };
    JsonApiDatastore.prototype.updateRelationships = function (model, relationships) {
        var modelsTypes = Reflect.getMetadata('JsonApiDatastoreConfig', this.constructor).models;
        for (var relationship in relationships) {
            if (relationships.hasOwnProperty(relationship) && model.hasOwnProperty(relationship)) {
                var relationshipModel = model[relationship];
                var hasMany = Reflect.getMetadata('HasMany', relationshipModel);
                var propertyHasMany = find_1.default(hasMany, function (property) {
                    return modelsTypes[property.relationship] === model.constructor;
                });
                if (propertyHasMany) {
                    // fix when the relation doesnt have records yet
                    if (typeof relationshipModel[propertyHasMany.propertyName] === 'undefined') {
                        relationshipModel[propertyHasMany.propertyName] = [];
                    }
                    relationshipModel[propertyHasMany.propertyName].push(model);
                }
                var hasOne = Reflect.getMetadata('HasOne', relationshipModel);
                var propertyHasOne = find_1.default(hasOne, function (property) {
                    return modelsTypes[property.relationship] === model.constructor;
                });
                if (propertyHasOne) {
                    relationshipModel[propertyHasOne.propertyName] = model;
                }
            }
        }
        return model;
    };
    ;
    JsonApiDatastore.prototype.buildUrl = function (modelType, params, id, modelTypeRelated, modelTypeRelatedSingle) {
        var typeName = Reflect.getMetadata('JsonApiModelConfig', modelType).type;
        var baseUrl = Reflect.getMetadata('JsonApiDatastoreConfig', this.constructor).baseUrl;
        var idToken = id ? "/" + id : null;
        var typeNameRelated;
        if (modelTypeRelated) {
            if (modelTypeRelatedSingle) {
                typeNameRelated = Reflect.getMetadata('JsonApiModelConfig', modelTypeRelated).type_one;
            }
            else {
                typeNameRelated = Reflect.getMetadata('JsonApiModelConfig', modelTypeRelated).type;
            }
        }
        return [baseUrl, typeName, idToken, (modelTypeRelated ? '/' + typeNameRelated : ''), (params ? '?' : ''), this.toQueryString(params)].join('');
    };
    JsonApiDatastore.prototype.handleError = function (error) {
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        try {
            var body = error;
            if (body.errors && body.errors instanceof Array) {
                var errors = new error_response_model_1.ErrorResponse(body.errors);
                console.error(errMsg, errors);
                return Observable_1.Observable.throw(errors);
            }
        }
        catch (e) {
            // no valid JSON
        }
        console.error(errMsg);
        return Observable_1.Observable.throw(errMsg);
    };
    JsonApiDatastore.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    JsonApiDatastore.ctorParameters = function () { return [
        { type: http_1.HttpClient, },
    ]; };
    return JsonApiDatastore;
}());
exports.JsonApiDatastore = JsonApiDatastore;
//# sourceMappingURL=json-api-datastore.service.js.map