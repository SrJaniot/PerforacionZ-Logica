import {Model, model, property} from '@loopback/repository';

@model()
export class ModelInsertPerforacion extends Model {
  @property({
    type: 'number',
    required: true,
  })
  id_proyecto: number;

  @property({
    type: 'number',
    required: true,
  })
  Profundidad_actual: number;

  @property({
    type: 'date',
    required: true,
  })
  fecha_inicio_perforacion: string;

  @property({
    type: 'string',
    required: true,
  })
  usuario: string;


    @property({
    type: 'date',
    required: true,
  })
  nombre_perforacion: string;

  @property({
    type: 'number',
    required: true,
  })
  profundidad_objetivo: number;



  constructor(data?: Partial<ModelInsertPerforacion>) {
    super(data);
  }
}

export interface ModelInsertPerforacionRelations {
  // describe navigational properties here
}

export type ModelInsertPerforacionWithRelations = ModelInsertPerforacion & ModelInsertPerforacionRelations;
