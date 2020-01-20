export class ApiResponse {
  status: number;
  message: string;
  payload: any;
}

export class Field {
  id?: number;
  name: string;
  subscriptionId: number;
  gps_pos: string;
}

export class Sector {
  id?: number;
  name: string;
  fieldId: number;
}

export class Plant {
  id?: number;
  name: string;
  gps_pos: string;
  sectorId: number;
  createdAt?: string;
  varietyId: number;
  subscriptionId: number;
}

export class Fruit {
  id?: number;
  name: string;
  plantId: number;
  fruitPlantId: number;
  createdAt?: Date;
}

export class Measurement {
  id?: number;
  ecuatorial_length: number;
  polar_length: number;
  fruitId: number;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  sector?: string;
  plant?: string;
  user?: string;
}

export class MeanMeasurements {
  id?: number;
  ecuatorial_mean: number;
  polar_mean: number;
  plantId: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export class Specie {
  id?: number;
  name: string;
}

export class Variety {
  id?: number;
  name: string;
  specieId: number;
}

