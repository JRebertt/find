import { app } from './app'

//  app.listen({ port: 3000, host: '0.0.0.0' }).then(function (): void {
//   console.log('HTTP server running 🚀');
// }).catch(function (err: Error): void {
//   app.log.error(err);
//   process.exit(1);
// });

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running 🚀')
})
