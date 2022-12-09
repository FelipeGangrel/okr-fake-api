import type { ModelObject } from '@ioc:Adonis/Lucid/Orm'
export type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export type { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
export type { ModelPaginatorContract as PaginatorContract } from '@ioc:Adonis/Lucid/Orm'

export interface PaginatedResponse {
  meta: any
  data: ModelObject[]
}
