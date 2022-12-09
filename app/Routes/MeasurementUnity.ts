import Route from '@ioc:Adonis/Core/Route'

const c = 'MeasurementUnitiesController'

Route.group(() => {
  Route.get('/get-list', `${c}.findMany`)
}).prefix('measurement-unity')
