import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from 'src/cars/entities/car.entity';

@Injectable()
export class SeedService {
    constructor(
    @InjectModel(Car.name)
    private readonly carModel: Model<Car>,
  ) {}

  async runSeed() {
    await this.carModel.deleteMany({});

    const cars = [
      { nombre: 'McQueen', marca: 'Pixar', anio: 2006 },
      { nombre: 'Mustang', marca: 'Ford', anio: 1969 },
      { nombre: 'Camaro', marca: 'Chevrolet', anio: 2010 },
      { nombre: 'Civic', marca: 'Honda', anio: 2020 },
      { nombre: 'Corolla', marca: 'Toyota', anio: 2018 },
    ];

    return this.carModel.insertMany(cars);
  }
}   
