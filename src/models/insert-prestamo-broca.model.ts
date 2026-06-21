import {Model, model, property} from '@loopback/repository';

@model()
export class InsertPrestamoBroca extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id_broca_instanciada: string;

  @property({
    type: 'number',
    required: true,
  })
  id_proyecto: number;



  @property({
    type: 'string',
    required: true,
  })
  nom_usuario: string;


  constructor(data?: Partial<InsertPrestamoBroca>) {
    super(data);
  }
}

export interface InsertPrestamoBrocaRelations {
  // describe navigational properties here
}

export type InsertPrestamoBrocaWithRelations = InsertPrestamoBroca & InsertPrestamoBrocaRelations;
