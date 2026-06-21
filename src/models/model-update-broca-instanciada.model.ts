import {Model, model, property} from '@loopback/repository';

@model()
export class ModelUpdateBrocaInstanciada extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id_brocaInstanciada: string;

  @property({
    type: 'number',
    required: true,
  })
  id_broca: number;

  @property({
    type: 'string',
    required: true,
  })
  estado_broca: string;

    @property({
    type: 'string',
    required: true,
  })
  estado_disponibilidad_broca: string;



  @property({
    type: 'string',
    required: true,
  })
  usuario_modificacion: string;


  constructor(data?: Partial<ModelUpdateBrocaInstanciada>) {
    super(data);
  }
}

export interface ModelUpdateBrocaInstanciadaRelations {
  // describe navigational properties here
}

export type ModelUpdateBrocaInstanciadaWithRelations = ModelUpdateBrocaInstanciada & ModelUpdateBrocaInstanciadaRelations;
