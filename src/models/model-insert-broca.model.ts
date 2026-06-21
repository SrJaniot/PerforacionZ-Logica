import {Model, model, property} from '@loopback/repository';

@model()
export class ModelInsertBroca extends Model {
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


  constructor(data?: Partial<ModelInsertBroca>) {
    super(data);
  }
}

export interface ModelInsertBrocaRelations {
  // describe navigational properties here
}

export type ModelInsertBrocaWithRelations = ModelInsertBroca & ModelInsertBrocaRelations;
