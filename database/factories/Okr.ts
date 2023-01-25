import Factory from '@ioc:Adonis/Lucid/Factory'
import Okr from 'App/Models/Okr'

export const OkrFactory = Factory.define(Okr, async ({ faker }) => {
  return {
    name: faker.lorem.words(10),
  }
}).build()
