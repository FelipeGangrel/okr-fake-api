import { writeFileSync, existsSync, renameSync, mkdirSync } from 'fs'
import { args, BaseCommand } from '@adonisjs/core/build/standalone'
import ModelGenerator from 'App/Helpers/ModelGenerator'

export default class MakeFocoModel extends BaseCommand {
  @args.string({ description: 'Name of the table for the new model', required: true })
  public tableName: string

  public static commandName = 'make:my_model'
  public static description = 'Make a new Model'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run(): Promise<void> {
    try {
      this.logger.info('Generating Model...')

      const { default: Env } = await import('@ioc:Adonis/Core/Env')

      const { modelName, modelContent } = await ModelGenerator.getModel(this.tableName, {
        host: Env.get('MYSQL_HOST'),
        user: Env.get('MYSQL_USER'),
        password: Env.get('MYSQL_PASSWORD'),
        database: Env.get('MYSQL_DB_NAME'),
        port: Env.get('MYSQL_PORT'),
      })

      await this.generateCamelCaseNamingStrategy()
      await this.generateBaseModel()

      const dir = this.application.makePath(`app/Models`)
      const path = this.application.makePath(`app/Models/${modelName}.ts`)

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      if (existsSync(path)) {
        const bkpPath = this.application.makePath(`app/Models/${modelName}.old.ts`)
        renameSync(path, bkpPath)
      }

      writeFileSync(path, modelContent)
      this.logger.info(`Done! Your Model is ready`)
    } catch (error) {
      this.logger.error(error?.message)
    }
  }

  private async generateCamelCaseNamingStrategy(): Promise<void> {
    try {
      const dir = this.application.makePath(`app/Strategies`)
      const path = this.application.makePath(`app/Strategies/CamelCaseNamingStrategy.ts`)

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      const content = `
      import { string } from '@ioc:Adonis/Core/Helpers'
      import { BaseModel, SnakeCaseNamingStrategy } from '@ioc:Adonis/Lucid/Orm'

      interface PaginationKeys {
        total: string
        perPage: string
        currentPage: string
        lastPage: string
        firstPage: string
        firstPageUrl: string
        lastPageUrl: string
        nextPageUrl: string
        previousPageUrl: string
      }

      export default class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
        public serializedName(_model: typeof BaseModel, attributeName: string): string {
          return string.camelCase(attributeName)
        }

        public paginationMetaKeys(): PaginationKeys {
          return {
            total: 'total',
            perPage: 'perPage',
            currentPage: 'currentPage',
            lastPage: 'lastPage',
            firstPage: 'firstPage',
            firstPageUrl: 'firstPageUrl',
            lastPageUrl: 'lastPageUrl',
            nextPageUrl: 'nextPageUrl',
            previousPageUrl: 'previousPageUrl',
          }
        }
      }`

      if (!existsSync(path)) {
        this.logger.info('Preparing CamelCaseNamingStrategy...')
        writeFileSync(path, content)
      }
    } catch (error) {
      this.logger.error(error?.message)
    }
  }

  private async generateBaseModel(): Promise<void> {
    try {
      const dir = this.application.makePath(`app/Models`)
      const path = this.application.makePath(`app/Models/AppBaseModel.ts`)

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      const content = `
      import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
      import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy'

      export default class AppBaseModel extends BaseModel {
        public static namingStrategy = new CamelCaseNamingStrategy()
      }`

      if (!existsSync(path)) {
        this.logger.info('Preparing AppBaseModel class...')
        writeFileSync(path, content)
      }
    } catch (error) {
      this.logger.error(error?.message)
    }
  }
}
