# 🏨 Hotel Costa Colonia - Sistema Web de Gestión y Reservas

**Proyecto Final de 3° MA - Bachillerato Tecnológico en Tecnologías de la Información**

📍 Instituto de Alta Especialización Colonia (IAE Colonia) - Año 2025

---

## 📋 Tabla de Contenidos

- Descripción del Proyecto
- Objetivos
- Equipo de Desarrollo - owlTech
- Tecnologías Utilizadas
- Arquitectura del Sistema
- Funcionalidades Principales
- Estructura del Proyecto
- Instalación y Configuración
- Guía de Uso
- Características Técnicas
- Conclusiones

---

## 📖 Descripción del Proyecto

Este proyecto consiste en el desarrollo de una **plataforma web integral** para la gestión y promoción de los servicios del **Hotel Costa Colonia**, un establecimiento hotelero ubicado en Colonia del Sacramento, Uruguay.

La aplicación web permite:
- 🏠 Explorar diferentes tipos de habitaciones con información detallada
- 🍽️ Conocer servicios adicionales (restaurante, spa, piscina, etc.)
- 🎁 Acceder a promociones especiales
- 📅 Realizar reservas de habitaciones con verificación de disponibilidad
- 👤 Gestión completa de usuarios registrados
- 🔐 Panel administrativo para el personal del hotel
- 💰 Sistema de gestión de ingresos y estadísticas

El sitio está diseñado tanto para **turistas** como para **locales** que deseen conocer más sobre la oferta hotelera de Colonia del Sacramento, ofreciendo una experiencia moderna, intuitiva y completamente **responsive**.

---

## 🎯 Objetivos

### Objetivo General
Diseñar y desarrollar un sitio web moderno, funcional y accesible para visibilizar los servicios del Hotel Costa Colonia y mejorar su presencia digital, aplicando los conocimientos adquiridos durante el curso.

### Objetivos Específicos
1. ✅ Crear una interfaz de usuario atractiva y fácil de navegar
2. ✅ Implementar un sistema de autenticación seguro para usuarios y administradores
3. ✅ Desarrollar un motor de búsqueda de disponibilidad de habitaciones
4. ✅ Crear un sistema de gestión de reservas con base de datos relacional
5. ✅ Implementar un panel administrativo para gestión de contenidos
6. ✅ Garantizar la accesibilidad y responsividad del sitio en todos los dispositivos
7. ✅ Aplicar buenas prácticas de desarrollo web y seguridad

---

## 👥 Equipo de Desarrollo - owlTech

| Integrante | Rol Principal |
|------------|---------------|
| **Aileen Waller** | Desarrollo Frontend & Base de Datos |
| **Lucía Burgueño** | Desarrollo Backend, Desarrollo Frontend & Base de Datos |
| **Sofía Milessi** | Desarrollo Backend, Desarrollo Frontend & Base de Datos |
| **Santiago Hasteing** | Desarrollo Frontend |

---

## 💻 Tecnologías Utilizadas

### Frontend
- **HTML** - Estructura y marcado semántico
- **CSS** - Estilos y diseño responsive
- **JavaScript** - Lógica del cliente e interactividad
- **Bootstrap** - Framework CSS para diseño responsive
- **Google Translate API** - Soporte multiidioma

### Backend
- **PHP** - Lógica del servidor
- **PDO (PHP Data Objects)** - Conexión segura a base de datos
- **PHPMailer** - Envío de correos electrónicos

### Base de Datos
- **MySQL/MariaDB** - Sistema de gestión de base de datos relacional

### Herramientas de Desarrollo
- **Visual Studio Code** - Editor de código
- **XAMPP** - Entorno de desarrollo local (Apache + MySQL + PHP)
- **GitHub** - Control de versiones y colaboración
- **Git** - Sistema de control de versiones

### Bibliotecas Adicionales
- **Chart.js** - Gráficos y visualización de datos (panel admin)
- **Swiper.js** - Carruseles y sliders responsive

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue el patrón de arquitectura **MVC (Modelo-Vista-Controlador)** adaptado para PHP:

```
┌─────────────────┐
│   FRONTEND      │
│  (HTML/CSS/JS)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   CONTROLLERS   │
│      (PHP)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     MODELS      │
│      (PHP)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    DATABASE     │
│     (MySQL)     │
└─────────────────┘
```

---

## ⭐ Funcionalidades Principales

### Para Usuarios (Clientes)
1. **Registro y Autenticación**
   - Registro de nuevos usuarios con validación de email
   - Inicio de sesión seguro con contraseñas encriptadas
   - Recuperación de contraseña por email

2. **Exploración del Hotel**
   - Catálogo de habitaciones con imágenes y descripciones
   - Información detallada de servicios (restaurante, spa, piscina, etc.)
   - Visualización de promociones activas

3. **Sistema de Reservas**
   - Consulta de disponibilidad por fechas
   - Cálculo automático de precio total (noches × precio por noche)
   - Gestión de reservas personales ("Mis Reservas")
   - Cancelación de reservas activas

4. **Menú del Restaurante**
   - Visualización del menú completo con categorías
   - Filtros por tipo de plato y restricciones alimentarias
   - Diseño responsive tipo carta digital

### Para Administradores
1. **Panel de Control Administrativo**
   - Dashboard con métricas clave del hotel
   - Visualización de ingresos con gráficos (Chart.js)

2. **Gestión de Habitaciones**
   - CRUD completo (Crear, Leer, Actualizar, Eliminar)
   - Gestión de imágenes de habitaciones
   - Control de disponibilidad

3. **Gestión de Servicios**
   - Administración de servicios del hotel
   - Edición de descripciones e imágenes

4. **Gestión de Promociones**
   - Crear y administrar promociones especiales
   - Subida de imágenes promocionales

5. **Gestión de Reservas**
   - Visualización de todas las reservas del sistema
   - Filtrado y búsqueda de reservas
   - Eliminación de reservas

6. **Gestión de Usuarios**
   - Visualización de usuarios registrados
   - Administración de cuentas de usuario

7. **Reportes de Ingresos**
   - Visualización de ingresos totales
   - Gráficos de ingresos mensuales

---

## 📁 Estructura del Proyecto

```
ProyectoFINAL/
│
├── Backend/
│   ├── config/
│   │   └── database.php              # Configuración de conexión a BD
│   │
│   ├── controllers/                  # Controladores (lógica de negocio)
│   │   ├── administrador.php
│   │   ├── habitacion.php
│   │   ├── promocion.php
│   │   ├── reserva_servicio.php
│   │   ├── reserva.php
│   │   ├── servicio.php
│   │   └── usuario.php
│   │
│   ├── models/                       # Modelos (acceso a datos)
│   │   ├── Administrador.php
│   │   ├── Habitacion.php
│   │   ├── Promocion.php
│   │   ├── Reserva.php
│   │   ├── Reserva_servicio.php
│   │   ├── Servicio.php
│   │   └── Usuario.php
│   │
│   └── routes/                       # Rutas de API
│       ├── api.php
│       ├── api2.php
│       ├── habDisponibles.php
│       ├── ingresos.php
│       └── reservasAdmin.php
│
├── Fronted/                          # Frontend (interfaz de usuario)
│   ├── css/                          # Hojas de estilo
│   ├── js/                           # JavaScript del cliente
│   ├── img/                          # Imágenes del sitio
│   │
│   ├── index.html                    # Página principal
│   ├── habitaciones.html
│   ├── servicios.html
│   ├── promociones.html
│   ├── reserva.html
│   ├── reservas.html                 # Mis Reservas (usuario)
│   ├── restaurante.html
│   ├── menú.html
│   ├── usuario.html                  # Login/Registro usuarios
│   ├── admin.html                    # Login administradores
│   │
│   └── vistaAdministrador/           # Panel administrativo
│       ├── indexAdmin.html           # Dashboard admin
│       ├── habitacionAdmin.html
│       ├── serviciosAdmin.html
│       ├── promocionesAdmin.html
│       ├── reservaAdmin.html
│       ├── usuarioAdmin.html
│       ├── ingresos.html
│       ├── css/                      # Estilos del panel admin
│       └── js/                       # JavaScript del panel admin
│
├── vendor/                           # Dependencias de Composer
│   └── phpmailer/                    # PHPMailer para emails
│
├── hotel2.sql                        # Script de base de datos
├── composer.json                     # Configuración de Composer
└── README.md                         # Este archivo
```

---


### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/sofi-milessi2104/ProyectoFINAL.git
cd ProyectoFINAL
```

2. **Mover el proyecto a XAMPP**
```bash
# Copiar la carpeta del proyecto a:
C:\xampp\htdocs\ProyectoFINAL
```

3. **Configurar la base de datos**
   - Iniciar XAMPP (Apache + MySQL)
   - Acceder a phpMyAdmin: `http://localhost/phpmyadmin`
   - Crear una nueva base de datos llamada `hotel2`
   - Importar el archivo `hotel2.sql`

4. **Configurar la conexión a la base de datos**
   
Editar `Backend/config/database.php`:
```php
<?php
$host = 'localhost';
$dbname = 'hotel2';
$username = 'root';
$password = ''; // Tu contraseña de MySQL

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>
```

5. **Acceder al sistema**
   - Frontend: `http://localhost/ProyectoFINAL/Fronted/index.html`
   - Login Usuario: `http://localhost/ProyectoFINAL/Fronted/usuario.html`
   - Login Admin: `http://localhost/ProyectoFINAL/Fronted/admin.html`

---

## 📖 Guía de Uso

### Para Usuarios

1. **Registro**
   - Ir a "Usuario" en el menú
   - Completar el formulario de registro
   - Verificar email recibido

2. **Búsqueda de Habitaciones**
   - Desde la página principal, seleccionar fechas
   - Ver habitaciones disponibles con precios
   - Filtrar por rango de precio

3. **Realizar una Reserva**
   - Seleccionar habitación deseada
   - Ingresar datos de la reserva
   - Confirmar reserva

4. **Gestionar Reservas**
   - Ir a "Mis Reservas"
   - Ver historial completo
   - Cancelar reservas activas

### Para Administradores

1. **Acceso al Panel**
   - Iniciar sesión en `/admin.html`
   - Credenciales de administrador

2. **Gestión de Contenidos**
   - Habitaciones: Agregar/editar/eliminar habitaciones
   - Servicios: Gestionar servicios del hotel
   - Promociones: Crear ofertas especiales
   - Reservas: Visualizar y gestionar todas las reservas

3. **Reportes**
   - Ver dashboard con métricas
   - Analizar ingresos mensuales con gráficos

---

## 🔧 Características Técnicas

### Seguridad
- ✅ Contraseñas encriptadas con `password_hash()`
- ✅ Protección contra SQL Injection con PDO Prepared Statements
- ✅ Validación de datos en cliente y servidor
- ✅ Sesiones seguras con PHP
- ✅ Validación de permisos por rol (usuario/admin)

### Responsive Design
- ✅ Diseño adaptable a todos los dispositivos
- ✅ Breakpoints optimizados (móvil, tablet, desktop)
- ✅ Imágenes optimizadas y responsive

### Performance
- ✅ Carga asincrónica de contenidos con Fetch API
- ✅ Optimización de consultas SQL
- ✅ Caché de imágenes en navegador
- ✅ Código JavaScript modular

### Accesibilidad
- ✅ Etiquetas semánticas HTML
- ✅ Soporte multiidioma (Google Translate)
- ✅ Navegación por teclado
- ✅ Contraste de colores adecuado

---

## 📝 Conclusiones

Este proyecto ha permitido aplicar de manera integral los conocimientos adquiridos en el Bachillerato Tecnológico en Tecnologías de la Información, abarcando:

- **Desarrollo Frontend**: HTML, CSS, JavaScript moderno
- **Desarrollo Backend**: PHP con arquitectura MVC
- **Bases de Datos**: Diseño relacional y SQL
- **Seguridad Web**: Buenas prácticas de autenticación y validación
- **UX/UI Design**: Diseño responsive y accesible
- **Trabajo en Equipo**: Colaboración con Git/GitHub

El resultado es una App Web funcional, moderna y lista para ser utilizada por el Hotel Costa Colonia, demostrando nuestras capacidades técnicas y de trabajo en equipo.

---

## 🙏 Agradecimientos

Agradecemos al **Instituto de Alta Especialización Colonia** y a nuestros docentes por el apoyo y guía durante el desarrollo de este proyecto final.

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos para el curso de 3° MA - BT en Tecnologías de la Información del IAE Colonia.

---

**Equipo owlTech © 2025**
