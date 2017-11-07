"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// import { HttpModule } from '@angular/http';
var http_1 = require("@angular/common/http");
var providers_1 = require("./providers");
var JsonApiModule = /** @class */ (function () {
    function JsonApiModule() {
    }
    JsonApiModule.decorators = [
        { type: core_1.NgModule, args: [{
                    providers: [providers_1.PROVIDERS],
                    // exports: [HttpModule]
                    exports: [http_1.HttpClientModule]
                },] },
    ];
    /** @nocollapse */
    JsonApiModule.ctorParameters = function () { return []; };
    return JsonApiModule;
}());
exports.JsonApiModule = JsonApiModule;
//# sourceMappingURL=module.js.map