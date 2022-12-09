import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Employee from 'App/Models/Employee'
import { EmployeeFactory } from 'Database/factories/Employee'

export default class EmployeeSeeder extends BaseSeeder {
  public async run() {
    await Employee.truncate()
    await EmployeeFactory.createMany(200)
  }
}
