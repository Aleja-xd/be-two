import { IsBoolean, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePilotoDto {
  @IsString()
  nombre: string;

  @IsString()
  escuderia: string;

  @IsNumber()
  @IsPositive()
  numero: number;

  @IsBoolean()
  activo: boolean;
  
  @IsNumber()
  @IsPositive()
  campeonatos:number;
}