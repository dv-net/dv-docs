## Configuración de DV.net Crypto Merchant: nube vs. servidor local

La decisión sobre cómo integrar un servicio para aceptar pagos en criptomonedas (crypto merchant) es una de las preguntas clave al crear un negocio en línea. La elección entre **el despliegue en su propio servidor (on-premise)** y **usar la versión en la nube** determina no solo los costos iniciales, sino también el nivel de control, seguridad y escalabilidad de su proyecto.

Esta guía le ayudará a realizar una comparación integral de ambos enfoques para que pueda tomar una decisión informada con base en las necesidades y capacidades de su negocio.


## 📊 Tabla comparativa: servidor on-premise vs. nube

La siguiente tabla ilustra claramente las diferencias clave entre ambos enfoques:

| Criterio | Instalación en su propio servidor (on-premise) | Versión en la nube |
|:---|:---|:---|
| **Costos** | Costos por alquiler/compra de servidor, alquiler del canal de acceso a Internet, configuración del servidor, actualizaciones y mantenimiento, y comisiones de transacciones en la blockchain. | Costos únicamente por comisiones de transacciones en la blockchain. |
| **Control** | Control total sobre el entorno y los datos. | Control limitado sobre sus datos. |
| **Seguridad** | La responsabilidad recae totalmente en usted: debe garantizar de forma independiente la seguridad física y cibernética e instalar actualizaciones. | La responsabilidad se comparte con nosotros; proporcionamos protección de la infraestructura, incluida la protección contra DDoS. |
| **Disponibilidad y confiabilidad** | Riesgo de inactividad por fallos de equipo; crear una infraestructura tolerante a fallos es costoso. | Alta confiabilidad y disponibilidad garantizadas por nosotros. |
| **Actualizaciones del servicio** | La gestión de actualizaciones es sencilla y usted controla las actualizaciones. | Las actualizaciones las realizamos nosotros automáticamente. |


## 💻 Instalación on-premise de DV.net: control y responsabilidad totales

Este enfoque implica que usted instale y configure de forma independiente el software del crypto merchant en su servidor físico o virtual, del cual asume la plena responsabilidad. La instalación básica es muy simple, automatizada y no toma más de 3 minutos. La configuración avanzada está minuciosamente documentada.

### Ventajas del enfoque
- **Control absoluto**: Usted tiene control completo sobre cada aspecto del sistema, desde el sistema operativo y las versiones de software hasta la configuración del firewall y las políticas de seguridad. Esto le permite adaptar el sistema perfectamente a sus requisitos únicos.
- **Seguridad de los datos**: Todos los datos, incluidas las frases semilla cifradas y el historial de transacciones, se almacenan en sus propios medios y no se transmiten a terceros. Esto es fundamental para empresas que manejan datos sujetos a estrictos requisitos regulatorios.
- **Rendimiento**: Con una configuración de hardware adecuada, puede lograr una **latencia** consistentemente baja y un **rendimiento** alto, ya que los recursos del servidor no se comparten con otros usuarios.

### Complejidades y riesgos
- **Costes operativos continuos**: Incluyen costos de electricidad, refrigeración, alquiler de instalaciones (si corresponde) y, especialmente, el salario de administradores de sistemas cualificados.
- **Copia de seguridad**: Solo usted tiene acceso a sus datos, por lo que garantizar la **copia de seguridad** del sistema recae completamente en sus manos.

## ☁️ Versión en la nube de DV.net: flexibilidad y ahorro de recursos

La solución en la nube implica usar un servicio listo para usar proporcionado por nosotros. Usted utiliza la plataforma mediante una **API** o interfaz web sin preocuparse por la infraestructura subyacente.

### Ventajas clave
- **Fiabilidad y disponibilidad**: Nuestros centros de datos están equipados con redundancia en todos los niveles. Esto garantiza una alta
- disponibilidad del servicio (a menudo 99.9% y superior), lo cual es difícil y costoso de organizar de forma independiente.
- En caso de fallos, nuestro equipo se encarga de la resolución de problemas.
- **Enfoque en el negocio**: No necesita desviar recursos para mantener y actualizar la infraestructura del servidor.
- Esto permite que su equipo se concentre en el desarrollo del negocio y en mejorar la experiencia del usuario.

### Posibles inconvenientes
- **Control limitado**: Sus frases semilla están cifradas, pero se almacenan en nuestros servidores.