import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'measurement_unities'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('symbol').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
