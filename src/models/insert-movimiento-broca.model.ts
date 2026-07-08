import {Model, model, property} from '@loopback/repository';

@model()
export class InsertMovimientoBroca extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id_broca_instanciada: string;

  @property({
    type: 'number',
    required: true,
  })
  id_perforacion: number;

  @property({
    type: 'date',
    required: true,
  })
  Fecha_movimiento: string;

  @property({
    type: 'string',
    required: true,
  })
  tipo_movimiento: string;

  @property({
    type: 'number',
    required: true,
  })
  profundidad_movimiento: number;

  @property({
    type: 'string',
    required: true,
  })
  usuario: string;



  @property({
    type: 'string',
    required: true,
  })
  observaciones: string;



  constructor(data?: Partial<InsertMovimientoBroca>) {
    super(data);
  }
}

export interface InsertMovimientoBrocaRelations {
  // describe navigational properties here
}

export type InsertMovimientoBrocaWithRelations = InsertMovimientoBroca & InsertMovimientoBrocaRelations;
