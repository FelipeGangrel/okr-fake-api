import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'employees'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('area').nullable()
      table.string('image').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
