import { Editorial } from './editorial.model';
import { JsonApiModelConfig } from '../../src/decorators/json-api-model-config.decorator';
import { JsonApiModel } from '../../src/models/json-api.model';
import { Attribute } from '../../src/decorators/attribute.decorator';
import { BelongsTo } from '../../src/decorators/belongs-to.decorator';

@JsonApiModelConfig({
    type: 'directors',
    type_one: 'director'
})
export class Director extends JsonApiModel {

    @Attribute()
    name: string;

    @BelongsTo()
    editorial: Editorial;
}
