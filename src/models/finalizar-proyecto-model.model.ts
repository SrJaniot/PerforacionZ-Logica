import {Model, model, property} from '@loopback/repository';

@model()
export class FinalizarProyectoModel extends Model {
  @property({
    type: 'number',
    required: true,
  })
  id_proyecto: number;

  @property({
    type: 'string',
    required: true,
  })
  usuario: string;


  constructor(data?: Partial<FinalizarProyectoModel>) {
    super(data);
  }
}

export interface FinalizarProyectoModelRelations {
  // describe navigational properties here
}

export type FinalizarProyectoModelWithRelations = FinalizarProyectoModel & FinalizarProyectoModelRelations;
