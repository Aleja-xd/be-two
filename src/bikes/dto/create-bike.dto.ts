import { IsEnum, IsNumber, IsPositive, IsString, MinLength } from 'class-validator';
import { BikeType } from '../entities/bike.entity';

export class CreateBikeDto {
  
  @IsString()
  @MinLength(2)
  marca: string;

  
  // Valid values are in the BikeType enum: mountain, road, city, electric
  @IsEnum(BikeType)
  tipo: BikeType;

  
  @IsNumber()
  @IsPositive()
  velocidades: number;

  @IsString()
  descripcion: string;
}
