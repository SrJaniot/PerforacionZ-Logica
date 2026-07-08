import {model, property} from '@loopback/repository';
import {ModelInsertProyecto} from '.';

@model()
export class ModelUpdateProyecto extends ModelInsertProyecto {
  @property({
    type: 'number',
    required: true,
  })
  id_proyecto: number;

  @property({
    type: 'string',
    required: true,
  })
  estado_proyecto: string;

  @property({
    type: 'string',
    required: true,
  })
  prioridad_proyecto: string;


  constructor(data?: Partial<ModelUpdateProyecto>) {
    super(data);
  }
}

export interface ModelUpdateProyectoRelations {
  // describe navigational properties here
}

export type ModelUpdateProyectoWithRelations = ModelUpdateProyecto & ModelUpdateProyectoRelations;
