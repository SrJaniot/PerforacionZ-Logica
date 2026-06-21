import {Model, model, property} from '@loopback/repository';

@model()
export class ModelInsertBrocaInstanciada extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id_broca_instanciada: string;

  @property({
    type: 'number',
    required: true,
  })
  id_broca: number;

  

  @property({
    type: 'string',
    required: true,
  })
  usuario_creacion: string;


  constructor(data?: Partial<ModelInsertBrocaInstanciada>) {
    super(data);
  }
}

export interface ModelInsertBrocaInstanciadaRelations {
  // describe navigational properties here
}

export type ModelInsertBrocaInstanciadaWithRelations = ModelInsertBrocaInstanciada & ModelInsertBrocaInstanciadaRelations;
