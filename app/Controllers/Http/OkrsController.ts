import { HttpContextContract } from 'App/Contracts/Common'
import Okr from 'App/Models/Okr'

export default class OkrsController {
  public async findPaginated({ request }: HttpContextContract): Promise<any> {
    const { excludeIds = [], page = 1, pageSize = 5, searchWord = '' } = request.body()

    const query = Okr.query()

    if (excludeIds.length) {
      query.whereNotIn('id', excludeIds)
    }

    if (searchWord) {
      query.where((builder) => {
        builder.where('name', 'like', `%${searchWord}%`)
      })
    }

    query.orderBy('name', 'asc')

    const okrs = await query.paginate(page, pageSize)
    const r = okrs.serialize()

    return {
      objectives: r.data.map((okr: Okr) => {
        return {
          id: okr.id,
          name: okr.name,
        }
      }),
      total: r.meta.total,
      pageSize: r.meta.perPage,
      page: r.meta.currentPage,
    }
  }
}
