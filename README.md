# Validation Questions — be-two

## Question 1

MongoDB por defecto distingue entre mayúsculas y minúsculas, por lo que “McQueen” y “mcqueen” no serían duplicados, sin embargo, en el servicio existe una línea en el 
método create (createCarDto.nombre = createCarDto.nombre.toLowerCase();) que convierte todos los nombres a minúsculas antes de almacenarlos, lo que provoca que ambos 
valores se guarden como “mcqueen”, haciendo que la restricción unique detecte un duplicado y genere un error.

---
## Question 2

Ambas validaciones existen porque operan en diferentes capas: el ParseMongoIdPipe valida la entrada en el controlador, evitando que datos inválidos lleguen a la lógica, 
mientras que isValidObjectId protege el servicio ante llamadas internas. Si findOne no tuviera la validación y recibiera un ID inválido como “abc”, Mongoose lanzaría un 
error de casteo generando un 500 Internal Server Error. En cambio, si remove no usara el pipe, MongoDB no fallaría sino que simplemente no eliminaría ningún registro, 
devolviendo un 400 Bad Request al detectar que no se encontró el recurso. Por eso las respuestas son diferentes.

---
## Question 3

El método create requiere un bloque try/catch porque realiza operaciones de escritura que pueden violar restricciones de la base de datos, en cambio, findAll solo realiza 
lecturas y no puede producir este tipo de errores, si se elimina el try/catch en create, el error de MongoDB no sería interceptado ni transformado en una excepción controlada,
por lo que el cliente recibiría un 500 Internal Server Error en lugar de un 400 Bad Request.

---
## Question 4

El método realiza dos consultas a la base de datos, una para obtener el documento (findOne) y otra para actualizarlo (updateOne), sí puede haber diferencias entre lo que 
devuelve la API y lo que realmente se almacena en MongoDB, ya que el método no vuelve a consultar el documento después de la actualización, sino que combina el objeto 
original con el DTO. Un caso concreto ocurre cuando existen transformaciones en la base de datos, como middlewares, valores por defecto o setters; por ejemplo, si un
campo es modificado automáticamente antes de guardarse, la API podría devolver un valor distinto al realmente persistido, generando inconsistencias.

---

## Question 5

Usar `forRoot` evalúa `process.env` demasiado temprano (cuando se carga el archivo), lo que puede provocar que la variable no esté disponible. En cambio, `forRootAsync` con
`useFactory` evalúa la configuración en el momento correcto (durante la inicialización de Nest), asegurando que las variables de entorno ya estén cargadas y evitando errores 
de conexión.

---

## Question 6

Si un estudiante olvida importar CarsModule en AppModule, la aplicación inicia sin errores porque NestJS no detecta el problema en el arranque; sin embargo, al realizar la 
primera solicitud a cualquier endpoint de /cars, la ruta no existirá y el cliente recibirá un 404 Not Found, ya que ni el controlador ni el servicio fueron registrados en el 
contexto de la aplicación.
En cambio, si el estudiante sí importa CarsModule pero olvida registrar el esquema con MongooseModule.forFeature dentro de ese módulo, la aplicación fallará al iniciar con un 
error de inyección de dependencias indicando que no puede resolver CarModel. Este error ocurre en el arranque porque @InjectModel no encuentra el modelo registrado, y para 
diagnosticarlo se debe revisar el archivo cars.module.ts, donde debería estar configurado correctamente el forFeature.

---

## Question 7

El método usa directamente deleteOne sin llamar antes a findOne porque así realiza una sola consulta a la base de datos, lo que mejora el rendimiento y evita una operación 
redundante; en cambio, si primero hiciera un findOne y luego un delete, estaría haciendo dos consultas para lograr lo mismo.

Aunque el id siempre llega con formato válido gracias a ParseMongoIdPipe, deletedCount puede ser 0 exactamente cuando no existe ningún documento en la base de datos con ese 
id, es decir, el ID es válido en formato pero no corresponde a ningún registro almacenado.

---

## Question 8

Si el estudiante mueve la lógica del pipe al servicio, pierde la separación de responsabilidades y la reutilización, ya que la validación deja de estar en la capa de entrada
(controller) y se mezcla con la lógica de negocio; además, el pipe se ejecuta antes de que la solicitud llegue al controlador (en la fase de transformación/validación de 
parámetros), mientras que en el servicio la validación ocurriría después, cuando ya pasó por el controller, lo que rompe el flujo limpio de validación temprana.

Si se usa @Param('id', ParseMongoIdPipe) pero se elimina @Injectable(), NestJS no podrá manejar el pipe correctamente mediante su sistema de inyección de dependencias; en casos
simples podría funcionar si no depende de nada, pero se pierde la capacidad de inyección y puede fallar en escenarios más complejos, por lo que no es una buena práctica.

---

## Question 9

Reordenar app.useGlobalPipes(...) antes de setGlobalPrefix y enableCors no cambia el comportamiento de la aplicación, porque estas configuraciones son globales e independientes
entre sí; NestJS las registra durante la inicialización y no dependen del orden relativo en este caso, por lo que las validaciones seguirán aplicándose igual a todas las rutas, en
cambio, mover app.enableCors() después de app.listen() sí afecta el funcionamiento, ya que CORS debe configurarse antes de que el servidor comience a escuchar solicitudes; 
si se registra después, el servidor ya está activo sin esa configuración y las peticiones entrantes no tendrán las cabeceras CORS necesarias, lo que puede provocar bloqueos en el navegador.
