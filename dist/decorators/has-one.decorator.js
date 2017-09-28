"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function HasOne(config) {
    if (config === void 0) { config = {}; }
    return function (target, propertyName) {
        var annotations = Reflect.getMetadata('HasOne', target) || [];
        annotations.push({
            propertyName: propertyName,
            relationship: config.key || propertyName
        });
        Reflect.defineMetadata('HasOne', annotations, target);
    };
}
exports.HasOne = HasOne;
//# sourceMappingURL=has-one.decorator.js.map