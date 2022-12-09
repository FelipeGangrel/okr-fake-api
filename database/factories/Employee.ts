import Factory from '@ioc:Adonis/Lucid/Factory'
import Employee from 'App/Models/Employee'

export const EmployeeFactory = Factory.define(Employee, async ({ faker }) => {
  faker.setLocale('pt_BR')
  return {
    name: faker.name.fullName(),
    area: faker.name.jobArea(),
    image: 'https://i.pravatar.cc/96',
  }
}).build()
