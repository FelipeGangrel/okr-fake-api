import Route from '@ioc:Adonis/Core/Route'

const c = 'OkrsController'

Route.group(() => {
  Route.post('/list/v1', `${c}.findPaginated`)
}).prefix('okr')
