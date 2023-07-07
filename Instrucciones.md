1.crear proyecto 
comando | express proyectoFinal --view=hbs

cd express proyectoFinal --view=hbs

2. instalar dependencias 
npm i

3. hacer el audit para corregir vulnerabilidades 
npm audit fix --force

4. agregar un console log para acceder al servidor 
ir a carpeta bin > www 
al final de la funcion onlistening colocar > console.log(`El servidor corre en: http://localhost:${port}`);

5. Ajustar el package .json con nodemon 
"scripts": {
    "start": "nodemon ./bin/www"
  },

6. Instalar modulos necesarios 
    moment 
    mysql 
    express-handlebars

7. crear la conexion de la base de datos | carpeta database > connection
    npm i mysql
