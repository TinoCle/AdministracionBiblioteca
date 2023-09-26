# Biblioteca - API REST

  

## Tabla de contenidos

[Descripción](#Descripción)

[Escenario](#Escenario)

[Permisos](#Permisos)

[Tutoriales](#Tutoriales)

[Iniciar los containers docker](#Iniciar-los-containers-docker)

## Descripción

Este es un sistema de administración de una biblioteca, basado en los roles socio y bibliotecario, cada uno con sus permisos dentro del sistema mismo.

## Escenario

La biblioteca posee una base de datos de cuentas y otra de libros, las cuales pueden ser modificadas según los permisos que posea el usuario logueado.

Los socios pueden pedir prestados cuantos libros quieran por determinado tiempo, vencido el cual ya no pueden llevarse más hasta devolver los que se hayan pasado de fecha. Un libor puede devolverse en cualquier momento.
Pueden visualizar la lista de libros y la de sus préstamos.

Los bibliotecarios pueden modificar la información de cualquier libro, crearlos y eliminarlos cuando no estén prestados. También puede modificar el inventario de cada uno.
Pueden crear cuentas y eliminarlas cuando no posean préstamos activos.
Pueden visualizar la lista de libros, la de todos los préstamos y las cuentas creadas, tanto de socios como de bibliotecarios.

## Permisos

| Permiso | Bibliotecario | Socio |
|--|--|--|
| Ver libros | ✔️ | ✔️ |
| Ver préstamos | ✔️ (todos) | ✔️ (sólo propios) |
| Pedir/devolver libros | ❌ | ✔️ |
| Crear libros | ✔️ | ❌ |
| Modificar libros | ✔️ | ❌ |
| Eliminar libros | ✔️ | ❌ |
| Ver cuentas | ✔️ | ❌ |
| Crear cuentas | ✔️ | ❌ |
| Eliminar cuentas | ✔️ | ❌ |


## Tutoriales
Para seguir los pasos de los tutoriales deberá loguearse en la página, las credenciales para testing se encuentran en el archivo *credentials.txt*.

### Iniciar los containers docker
Correr los siguientes comandos en la carpeta raíz del proyecto:

	docker-compose build
	docker-compose up

### Socio: pedir prestado un libro
Diríjase al listado de todos los libros, para pedir uno debe hacer click en el botón **PEDIR**. 
![Click en PEDIR](https://i.imgur.com/S7R6Cf2.png)
El libro pedido debería aparecer en el listado de préstamos, a la derecha.
![Libro pedido](https://i.imgur.com/MdgvFNW.png)
**Atención:** si el socio tiene préstamos vencidos, no podrá pedir más hasta haber devuelto los mismos.
![Cartel de préstamos vencidos](https://i.imgur.com/HM9mBMn.png)
**Atención:** si algún libro está sin stock, su botón para pedirlo va a estar deshabilitado.
![Botón PEDIR deshabilitado](https://i.imgur.com/lDWuvqq.png)
### Socio: devolver un libro prestado
Diríjase al listado de préstamos y haga click en el botón **DEVOLVER**.
![Click en DEVOLVER](https://i.imgur.com/mo6dasB.png)
El libro devuelto va a desaparecer del listado de préstamos.
![Libro devuelto](https://i.imgur.com/D39A6Ac.png)

### Bibiotecario: crear un libro
Diríjase al listado de libros y haga click sobre el ícono indicado en la imágen.
![Click en ícono para agregar libro](https://i.imgur.com/HrKUyF0.png)
Llene los campos solicitados y haga click en el botón **AGREGAR**.
![Click en el botón AGREGAR](https://i.imgur.com/GhOao0s.png)
El nuevo libro aparecerá en el listado.
![Libro nuevo en listado](https://i.imgur.com/aHVE3jq.png)
### Bibliotecario: eliminar un libro
En el listado de libros, haga click sobre el que desee eliminar.
![Click sobre un libro](https://i.imgur.com/ECS0cA8.png)
Se abrirá la información del libro, hacer click en el botón de edición.
![Click en el botón de edición](https://i.imgur.com/xSk6j9R.png)
Sin modificar sus datos, haga click en el botón apropiado para borrarlo.
![Click en icono para borrar](https://i.imgur.com/P501XPb.png)
El libro desaparecerá del listado.
![Libro desapareció del listado](https://i.imgur.com/uCXZYS7.png)
**Atención:** si el libro posee préstamos activos no va a poder eliminarse.
![Intento de eliminar libro con préstamos](https://i.imgur.com/bZVTwb5.png)

### Bibliotecario: modificar un libro
En el listado de libros, haga click sobre el que desee modificar.
![Click sobre un libro](https://i.imgur.com/ECS0cA8.png)
Se abrirá la información del libro, hacer click en el botón de edición.
![Click en el botón de edición](https://i.imgur.com/xSk6j9R.png)
Modifique la información del libro y haga click en el botón **GUARDAR**.
![Click en el botón GUARDAR](https://i.imgur.com/GiRV359.png)
La infomación del libro se verá modificada.
![Información del libro modificada](https://i.imgur.com/2k7PBfq.png)
### Bibliotecario: modificar el inventario de un libro
En el listado de libros, haga click sobre el que desee modificar.
![Selección del libro a modificar inventario](https://i.imgur.com/6MPlXjV.png)
Se abrirá la información del libro, use los botones indicados para modificar el inventario del libro.
![Modificando inventario del libro](https://i.imgur.com/SJiGR6g.png)
**Atención:** Al eliminar la última copia de un libro, se eliminará totalmente de la base de datos.
Al intentar eliminar la última copia de un libro con préstamos, un cartel advertirá la imposibilidad de realizar la acción.
![No se puede eliminar la copia](https://i.imgur.com/1dukwjz.png)
### Bibliotecario: crear una cuenta de usuario
En el listado de cuentas, haga click en el ícono indicado en la imágen.
![Click en el ícono para agregar una cuenta nueva](https://i.imgur.com/F9lK3hl.png)
Llene los datos de la cuenta y haga click en **AGREGAR**.
![Creando cuenta nueva](https://i.imgur.com/cS2qDHm.png)
La cuenta nueva aparecerá en el listado.
![Cuenta nueva agregada](https://i.imgur.com/g2Pz9u4.png)
### Bibliotecario: eliminar una cuenta de usuario
En el listado de cuentas, haga click en el ícono correspondiente de la cuenta que desee eliminar.
![Eliminando cuenta](https://i.imgur.com/Fv6pQF7.png)
La cuenta será eliminada del listado.
![Cuenta eliminada del listado](https://i.imgur.com/gldlKgt.png)
**Atención:** si la cuenta es de socio y además tiene préstamos activos, no va a poder eliminarla.
![No se puede eliminar la cuenta](https://i.imgur.com/9C1myXz.png)
**Atención:** no se puede eliminar la cuenta actual, por lo que el ícono no estará presente.
