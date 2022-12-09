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
}
