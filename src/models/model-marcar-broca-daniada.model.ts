import {Model, model, property} from '@loopback/repository';

@model()
export class ModelMarcarBrocaDaniada extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id_broca: string;

  @property({
    type: 'string',
    required: true,
  })
  usuario: string;


  constructor(data?: Partial<ModelMarcarBrocaDaniada>) {
    super(data);
  }
}

export interface ModelMarcarBrocaDaniadaRelations {
  // describe navigational properties here
}

export type ModelMarcarBrocaDaniadaWithRelations = ModelMarcarBrocaDaniada & ModelMarcarBrocaDaniadaRelations;
