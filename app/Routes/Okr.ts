import Route from '@ioc:Adonis/Core/Route'

const c = 'OkrsController'

Route.group(() => {
  Route.post('/list-selector/v1', `${c}.findPaginated`)
}).prefix('objective')
