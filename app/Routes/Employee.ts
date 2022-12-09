import Route from '@ioc:Adonis/Core/Route'

const c = 'EmployeesController'

Route.group(() => {
  Route.post('/list/v1', `${c}.findPaginated`)
}).prefix('employee')
