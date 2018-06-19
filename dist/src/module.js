"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var providers_1 = require("./providers");
var JsonApiModule = /** @class */ (function () {
    function JsonApiModule() {
    }
    JsonApiModule.decorators = [
        { type: core_1.NgModule, args: [{
                    providers: [providers_1.PROVIDERS],
                    exports: [http_1.HttpModule]
                },] },
    ];
    return JsonApiModule;
}());
exports.JsonApiModule = JsonApiModule;
//# sourceMappingURL=module.js.map