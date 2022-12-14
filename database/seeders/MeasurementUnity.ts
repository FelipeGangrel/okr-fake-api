import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MeasurementUnity from 'App/Models/MeasurementUnity'

const unities: Partial<MeasurementUnity>[] = [
  {
    name: 'Metro',
    symbol: 'm',
  },
  {
    name: 'Centímetro',
    symbol: 'cm',
  },
  {
    name: 'Milímetro',
    symbol: 'mm',
  },
  {
    name: 'Quilograma',
    symbol: 'kg',
  },
  {
    name: 'Gramas',
    symbol: 'g',
  },
  {
    name: 'Miligrama',
    symbol: 'mg',
  },
  {
    name: 'Litro',
    symbol: 'l',
  },
  {
    name: 'Mililitro',
    symbol: 'ml',
  },
]

export default class MeasurementUnitySeeder extends BaseSeeder {
  public async run() {
    await MeasurementUnity.truncate()
    await MeasurementUnity.createMany(unities)
  }
}
