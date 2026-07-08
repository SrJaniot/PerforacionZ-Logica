import {model, property} from '@loopback/repository';
import {ModelInsertPerforacion} from '.';

@model()
export class ModelUpdatePerforacion extends ModelInsertPerforacion {
  @property({
    type: 'number',
    required: true,
  })
  id_perforacion: number;

  @property({
    type: 'date',
  })
  fecha_fin_perforacion: string;

  @property({
    type: 'string',
    required: true,
  })
  estado_perforacion: string;


  constructor(data?: Partial<ModelUpdatePerforacion>) {
    super(data);
  }
}

export interface ModelUpdatePerforacionRelations {
  // describe navigational properties here
}

export type ModelUpdatePerforacionWithRelations = ModelUpdatePerforacion & ModelUpdatePerforacionRelations;
