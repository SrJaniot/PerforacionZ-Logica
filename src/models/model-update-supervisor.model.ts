import {model, property} from '@loopback/repository';
import {ModelInsertSupervisor} from '.';

@model()
export class ModelUpdateSupervisor extends ModelInsertSupervisor {
  @property({
    type: 'boolean',
    required: true,
  })
  cuenta_activa: boolean;


  constructor(data?: Partial<ModelUpdateSupervisor>) {
    super(data);
  }
}

export interface ModelUpdateSupervisorRelations {
  // describe navigational properties here
}

export type ModelUpdateSupervisorWithRelations = ModelUpdateSupervisor & ModelUpdateSupervisorRelations;
