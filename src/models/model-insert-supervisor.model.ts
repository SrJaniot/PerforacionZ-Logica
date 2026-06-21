import {Model, model, property} from '@loopback/repository';

@model()
export class ModelInsertSupervisor extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id_supervisor: string;

  @property({
    type: 'string',
    required: true,
  })
  nom_supervisor: string;

  @property({
    type: 'string',
    required: true,
  })
  correo_supervisor: string;

  @property({
    type: 'string',
    required: true,
  })
  num_cel_supervisor: string;

  @property({
    type: 'string',
    required: true,
  })
  ususario_creacion: string;


  constructor(data?: Partial<ModelInsertSupervisor>) {
    super(data);
  }
}

export interface ModelInsertSupervisorRelations {
  // describe navigational properties here
}

export type ModelInsertSupervisorWithRelations = ModelInsertSupervisor & ModelInsertSupervisorRelations;
