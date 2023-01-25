import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Okr from 'App/Models/Okr'
import { OkrFactory } from 'Database/factories/Okr'

export default class OkrSeeder extends BaseSeeder {
  public async run() {
    await Okr.truncate()
    await OkrFactory.createMany(300)
  }
}
