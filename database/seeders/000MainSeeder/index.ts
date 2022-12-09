import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class extends BaseSeeder {
  public async run() {
    await this.runSeeder(await import('../Employee'))
    await this.runSeeder(await import('../MeasurementUnity'))
  }

  private async runSeeder(seeder: { default: typeof BaseSeeder }): Promise<void> {
    if (!Application.inDev) {
      return
    }

    console.log(`🌱 Starting ${seeder.default.name} ...`)
    await new seeder.default(this.client).run()
    console.log(`🌳 ${seeder.default.name} done!`)
  }
}
