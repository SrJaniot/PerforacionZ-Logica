import {Model, model, property} from '@loopback/repository';

@model()
export class ModelDevolverBroca extends Model {
  @property({
    type: 'number',
    required: true,
  })
  id_prestamo: number;

  @property({
    type: 'string',
    required: true,
  })
  id_broca_instanciada: string;

  @property({
    type: 'string',
    required: true,
  })
  nom_usuario: string;


  constructor(data?: Partial<ModelDevolverBroca>) {
    super(data);
  }
}

export interface ModelDevolverBrocaRelations {
  // describe navigational properties here
}

export type ModelDevolverBrocaWithRelations = ModelDevolverBroca & ModelDevolverBrocaRelations;
