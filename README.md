# Trabajo Practico de Desarrollo de Software
## Integrantes 
|Legajo|Apellido y Nombres|
|:-|:-|
|49105|Bianchini, Tomás|

## 1. Tema
### Descripción
El proyecto consiste en el desarrollo de un sitio web de comercio electrónico que permite a los usuarios realizar la compra de productos ofrecidos por múltiples vendedores. El sitio estará diseñado para admitir diferentes niveles de usuarios, incluidos Clientes, Administradores y Vendedores, cada uno con funciones y privilegios específicos. Donde los administradores pueden crear descuentos para categorías de productos. Además, Los clientes pueden dejar reseñas y calificaciones para los productos que han comprado. Se utilizará la API de OpenAI, para moderar y analizar las reseñas, y si se detecta contenido inapropiado, la reseña será dada de baja. 
### Modelo
```mermaid
---
title: Class Diagram
---
classDiagram
  
    User <|-- Seller
    User <|-- Admin
    Seller "1"--"*" Product
    Product "*"--"1" Category
    Category "1"--"*" Discount
    Review "*"--"1" Product
    Order --* Cart
    Order "*"--"1" Product
    Shipping "1"--"*" Cart 
    PaymentType "1"--"*" Cart 
    Cart "*"--"1" User
   class User{
        +String user_name
        +String email
        +String password
        +String address     
   }
    class Seller{
        +String cbu
        +String shop_name
        +String cuil
    }
    class Admin{
    }
    class Shipping{
        +String shipmethod
        +String estimatedTime
        +String cancellationDeadline
        +integer price
    }    
    class Product{
        +String name
        +String description
        +String img_url
        +integer stock
        +number price 
    }
   class Category{
        +String category
    }
    class Review{
        +number rating 
        +String comment
    }
    class Discount{
        +String value
    }
    class PaymentType{
        +String payment_type
    }
   class Cart{
        +number total
    }
   class Order{
      +integer quantity 
      +number subtotal
    }
```


## 2. Alcance Funcional
#### Aprobación Directa
|Req|Detalle|
|:-|:-|
|CRUD simple|1.CRUD Shipping <br> 2.CRUD PaymentType <br> 3.CRUD User <br> 4.CRUD Category|
|CRUD dependiente|1.CRUD Product <br> 2.CRUD Discount <br> 3.CRUD Order <br> 4.CRUD Cart|
|Listado + detalle|1.Listado de productos filtrado por categoría => detalle de la descripcion, <br> precio, precio con descuento(en caso de que la categoría tenga un descuento activo), imagen del producto |
|CUU/Epic|1. Completar un carrito con productos|
### Alcance Adicional Voluntario

|Req|Detalle|
|:-|:-|
|Listado + detalle|1. Listado de carritos completados => detalle de la fecha de compra, todos los productos con la cantidad, <br> el tipo de envio elegido, y la posibilidad de cancelar la compra si esta dentro del tiempo permitido |
|CUU/Epic|1. Cancelar un carrito <br> 3. Envio del carrito <br> 4. Moderación de reviews con la api de OpenAI|
