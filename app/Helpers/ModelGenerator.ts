import { promisify } from 'util'
import { singular } from 'pluralize'
import * as Mysql from 'mysql'

type TableField = {
  Field: string
  Type: string
  Null: string
  Key: string
  Extra: string
}

type JsonField = {
  fieldname: string
  type: string
  isNullable: boolean
  isPrimary: boolean
}

type ModelData = {
  modelName: string
  modelContent: string
}

type ConnectionConfig = {
  host: string
  user: string
  password: string | undefined
  database: string
  port: number
}

export default class ModelGenerator {
  public static async getModel(
    tablename: string,
    connectionConfig: ConnectionConfig
  ): Promise<ModelData> {
    const connection = Mysql.createConnection(connectionConfig)
    try {
      const query = `describe ${tablename}`
      const result = await promisify(connection.query).call(connection, query)
      return this.processTable(result, tablename)
    } catch (error) {
      throw error
    } finally {
      await promisify(connection.end).call(connection)
    }
  }

  private static processTable(fields: TableField[], tablename: string): ModelData {
    const jsonFields: JsonField[] = fields.map((field) => {
      const { Field, Type, Null, Key } = field
      return {
        fieldname: this.getFieldName(Field),
        type: this.getTypeName(Type),
        isPrimary: Key === 'PRI',
        isNullable: Null === 'YES',
      }
    })

    const modelName = this.getModelName(tablename)

    const decoratedProps = jsonFields
      .map((field) => {
        return `\t${this.getDecorator(field)}\r\t${this.getProperty(field)}\n`
      })
      .join('\n')

    const luxonImport = jsonFields.some((f) => f.type === 'DateTime')
      ? "import { DateTime } from 'luxon'"
      : ''

    const hashImport = jsonFields.some((f) => f.fieldname === 'password')
      ? `import Hash from '@ioc:Adonis/Core/Hash'`
      : ''

    const scopes = this.getScopes(jsonFields)
    const beforeSaveHooks = this.getBeforeSaveHooks(jsonFields, modelName)

    const scopeImport = scopes !== '' ? ', scope' : ''
    const beforeSaveImport = beforeSaveHooks !== '' ? ', beforeSave' : ''

    const modelContent = `
  ${luxonImport}
  ${hashImport}
  import { column${scopeImport}${beforeSaveImport} } from '@ioc:Adonis/Lucid/Orm'
  import AppBaseModel from './AppBaseModel'

  export default class ${modelName} extends AppBaseModel {
  ${decoratedProps}
  ${beforeSaveHooks}
  ${scopes}
}`.trim()

    return { modelName, modelContent }
  }

  private static getModelName(tablename: string): string {
    const parts: string[] = tablename.split('_')
    const name = parts
      .map((part) => {
        return `${part.charAt(0).toUpperCase()}${part.slice(1)}`
      })
      .join('')
    return singular(name)
  }

  private static getFieldName(fieldname: string): string {
    const parts: string[] = fieldname.split('_')
    return parts
      .map((part, i) => {
        if (i === 0) return part
        return `${part.charAt(0).toUpperCase()}${part.slice(1)}`
      })
      .join('')
  }

  private static getTypeName(fieldType: string): string {
    const isString =
      fieldType.toLowerCase().match(/^(char|varchar|text|mediumtext|longtext|tinytext)/) !== null

    const isNumeric = fieldType.toLowerCase().match(/^(int|decimal|float)/) !== null
    const isBoolean = fieldType.toLowerCase().match(/^(tinyint)/)
    const isDateTime = fieldType.toLowerCase().match(/^(timestamp|datetime|date)/) !== null

    if (isString) return 'string'
    if (isNumeric) return 'number'
    if (isBoolean) return 'boolean'
    if (isDateTime) return 'DateTime'

    return 'string'
  }

  private static getDecorator(field: JsonField): string {
    const isPrimary = field.isPrimary
    const isAutoCreated = ['createdAt', 'updatedAt'].includes(field.fieldname)
    const isAutoUpdated = ['updatedAt'].includes(field.fieldname)
    const isDateTime = field.type === 'DateTime'

    const dateTimePart = isDateTime ? '.dateTime' : ''

    const decoratorProps: string[] = []
    if (isPrimary) decoratorProps.push('isPrimary: true')
    if (isAutoCreated) decoratorProps.push('autoCreate: true')
    if (isAutoUpdated) decoratorProps.push('autoUpdate: true')

    const hasProps = decoratorProps.length > 0

    const decoratedPropsPart = hasProps ? `\{ ${decoratorProps.join(', ')} \}` : ''

    return `@column${dateTimePart}(${decoratedPropsPart})`
  }

  private static getProperty(field: JsonField): string {
    const forceNotNullabe = [
      field.type === 'boolean',
      ['createdAt', 'updatedAt'].includes(field.fieldname),
    ].includes(true)

    const nullablePart = field.isNullable && !forceNotNullabe ? ' | null' : ''

    return `public ${field.fieldname}: ${field.type}${nullablePart}`
  }

  private static getScopes(jsonFields: JsonField[]): string {
    const scopes: string[] = []

    if (jsonFields.some((f) => f.fieldname === 'blockedAt')) {
      scopes.push(`
public static notBlocked = scope((query) => {
  query.whereNull('blockedAt')
})

public static blocked = scope((query) => {
  query.whereNotNull('blockedAt')
})
      `)
    }

    if (jsonFields.some((f) => f.fieldname === 'deletedAt')) {
      scopes.push(`
public static notDeleted = scope((query) => {
  query.whereNull('deletedAt')
})

public static deleted = scope((query) => {
  query.whereNotNull('deletedAt')
})
      `)
    }

    return scopes.length > 0 ? `\t/** Scopes */\n${scopes.join('\n')}` : ''
  }

  private static getBeforeSaveHooks(jsonFields: JsonField[], modelName: string): string {
    const hooks: string[] = []

    if (jsonFields.some((f) => f.fieldname === 'password')) {
      hooks.push(`
@beforeSave()
public static async hashPassword (user: ${modelName}) {
  if (user.$dirty.password) {
    user.password = await Hash.make(user.password)
  }
}
      `)
    }

    return hooks.length > 0 ? `\t/** Hashing password */\n${hooks}` : ''
  }
}
