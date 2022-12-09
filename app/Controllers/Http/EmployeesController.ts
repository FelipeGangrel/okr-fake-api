import { HttpContextContract } from 'App/Contracts/Common'
import Employee from 'App/Models/Employee'

export default class EmployeesController {
  public async findPaginated({ request }: HttpContextContract): Promise<any> {
    const {
      employeeIds: excludeEmployeeIds = [],
      page = 1,
      pageSize = 5,
      searchWord = '',
    } = request.body()

    const query = Employee.query()

    if (excludeEmployeeIds.length) {
      query.whereNotIn('id', excludeEmployeeIds)
    }

    if (searchWord) {
      query.where((builder) => {
        builder.where('name', 'like', `%${searchWord}%`)
        builder.orWhere('area', 'like', `%${searchWord}%`)
      })
    }

    const employees = await query.paginate(page, pageSize)
    const r = employees.serialize()

    return {
      employeeResponsibleSelectorResponse: r.data.map((employee: Employee) => {
        return {
          id: employee.id,
          areaDescription: employee.area,
          photoPath: employee.image,
          name: employee.name,
        }
      }),
      total: r.meta.total,
      pageSize: r.meta.perPage,
      page: r.meta.currentPage,
    }
  }
}
