import {Model, model, property} from '@loopback/repository';

@model()
export class ModelUpdateBroca extends Model {
  @property({
    type: 'number',
    required: true,
  })
  id_broca: number;

  @property({
      type: 'string',
      required: true,
    })
    nom_broca: string;
  
    @property({
      type: 'string',
      required: true,
    })
    tipo_broca: string;
  
    @property({
      type: 'string',
      required: true,
    })
    descripcion_broca: string;
  
    @property({
      type: 'number',
      required: true,
    })
    tamanop_broca: number;
  
    @property({
      type: 'string',
      required: true,
    })
    matrix_broca: string;
  
    @property({
      type: 'string',
      required: true,
    })
    marca_broca: string;
  
    @property({
      type: 'string',
      generated: true,
    })
    usuario_creacion?: string;

  constructor(data?: Partial<ModelUpdateBroca>) {
    super(data);
  }
}

export interface ModelUpdateBrocaRelations {
  // describe navigational properties here
}

export type ModelUpdateBrocaWithRelations = ModelUpdateBroca & ModelUpdateBrocaRelations;
