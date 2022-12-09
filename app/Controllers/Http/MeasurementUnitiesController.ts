import { HttpContextContract } from 'App/Contracts/Common'
import MeasurementUnity from 'App/Models/MeasurementUnity'

export default class MeasurementUnitiesController {
  public async findMany({ request }: HttpContextContract): Promise<any[]> {
    const { searchWord = '', page = 1, pageSize = 5 } = request.qs()

    const query = MeasurementUnity.query()

    if (searchWord) {
      query.where((builder) => {
        builder.where('name', 'like', `%${searchWord}%`)
        builder.orWhere('symbol', 'like', `%${searchWord}%`)
      })
    }

    const unities = await query.paginate(page, pageSize)
    const r = unities.serialize()

    return r.data.map((unity: MeasurementUnity) => {
      return {
        id: unity.id,
        description: unity.name,
        symbol: unity.symbol,
      }
    })
  }
}
