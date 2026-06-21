import {Model, model, property} from '@loopback/repository';

@model()
export class ModelInsertProyecto extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id_supervisor: string;

  @property({
    type: 'string',
    required: true,
  })
  nom_proyecto: string;

  @property({
    type: 'string',
    required: true,
  })
  id_municipio: string;

  @property({
    type: 'string',
    required: true,
  })
  descripcion_proyecto: string;

  @property({
    type: 'string',
    required: true,
  })
  usuario_insert: string;


  constructor(data?: Partial<ModelInsertProyecto>) {
    super(data);
  }
}

export interface ModelInsertProyectoRelations {
  // describe navigational properties here
}

export type ModelInsertProyectoWithRelations = ModelInsertProyecto & ModelInsertProyectoRelations;
