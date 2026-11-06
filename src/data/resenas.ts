export interface Resena {
    nombre: string;
    texto: string;
    estrellas: 1 | 2 | 3 | 4 | 5;
    /** Texto libre, por ejemplo "hace 2 meses". Opcional. */
    fecha?: string;
    /** Foto de perfil en Google. Opcional: sin ella, o si no carga, se ve la inicial. */
    foto?: string;
}

/**
 * De dónde salen las reseñas de la sección «Opiniones»:
 * - 'google': automáticas. La nota, el total y hasta 5 reseñas (las elige Google) se cargan de
 *   /api/resenas (server/resenas.mjs), que necesita GOOGLE_PLACES_KEY en Cloudflare.
 * - 'manual': las de la lista `resenas` de abajo; de Google solo se cargan la nota y el total.
 * Si Google no responde (o en `astro dev`, donde no existe /api), se usan la lista y los datos de
 * abajo; si la lista está vacía, la sección no se muestra.
 */
export const modo: 'google' | 'manual' = 'manual';

/** Mostrar el número total de valoraciones de Google junto a la nota (el cliente prefiere que no). */
export const mostrarTotal = false;

/** Enlace a la ficha de Google del negocio y, si se quiere, la nota media y el total de reseñas. */
export const google = {
    enlace: 'https://www.google.com/maps?cid=13931612910443998859',
    puntuacion: null as number | null, // por ejemplo 5.0
    total: null as number | null, // por ejemplo 27
};

/**
 * Reseñas escritas a mano (modo 'manual', o mientras Google no responde), elegidas por el cliente.
 * Copiar el texto tal cual aparece en Google. Ejemplo:
 *   { nombre: 'María G.', texto: 'Nos consiguieron mejor hipoteca que nuestro banco…', estrellas: 5, fecha: 'hace 2 meses' },
 * Se escriben a mano porque la API de Google solo da 5 reseñas y las elige ella.
 */
export const resenas: Resena[] = [
    {
        nombre: 'Karmacoal Wasserfilter',
        foto: 'https://lh3.googleusercontent.com/a-/ALV-UjUBucNROUr6SkaeM8-7yB4-eGNiMeOWeImXdJeoXsy2jPZmnIc6=s120-c',
        estrellas: 5,
        fecha: 'hace 3 semanas',
        texto: "Muy buena experiencia con Cabrera Capital. Alejandro ha sido muy profesional, amable y atento durante todo el proceso. Siempre responde rápidamente, explica todo con claridad y busca buenas soluciones ante cualquier situación.\n\nNos hemos sentido muy bien acompañados y asesorados en todo momento. Sin duda, un servicio muy profesional y totalmente recomendable. ¡Muchas gracias por todo!",
    },
    {
        nombre: 'tazvar16',
        foto: 'https://lh3.googleusercontent.com/a-/ALV-UjUWAe_LcjqpAgWW1JtAdw-A7wmxgislWkdbJplM9PxfhvURX9Jn=s120-c',
        estrellas: 5,
        fecha: 'hace 3 meses',
        texto: "53 días\n\nSi pudiera darle más de 5 estrellas, lo haría sin dudarlo.\n\nQuiero expresar mi más sincero agradecimiento a Alejandro de Kabrera Capital por el trabajo absolutamente excepcional que ha realizado. Gracias a él, he conseguido la hipoteca para comprar mi casa en tan solo 53 días, algo, que por mi situación personal, parecía muy difícil y que ha hecho realidad con una profesionalidad extraordinaria.\n\nDesde el primer momento, Alejandro ha demostrado ser una persona cercana, amable, honesta y con una calidad humana excepcional. Pero, además, su nivel profesional es impresionante: conoce el sector a la perfección, transmite seguridad en cada paso y encuentra soluciones donde otros solo verían problemas.\n\nSe ha encargado de absolutamente todo. Ha negociado las mejores condiciones con los bancos, ha coordinado cada fase de la operación, ha buscado al mejor tasador y ha supervisado todo el proceso para que la tasación fuera favorable. Ha estado pendiente de cada detalle, anticipándose a cualquier inconveniente y moviendo todos los hilos necesarios para que la operación llegara a buen puerto.\n\nLo que más valoro no es solo el resultado, sino la tranquilidad y cercanía que me ha transmitido durante todo el proceso. En un momento tan importante como la compra de una vivienda, contar con alguien tan preparado, inteligente, implicado y comprometido marca una diferencia enorme. Nunca me he sentido un cliente más; me he sentido acompañado, escuchado y respaldado en todo momento.\n\nMañana firmo la compra de mi casa y una parte muy importante de este sueño se la debo a Alejandro y a Kabrera Capital. Recomendaría sus servicios a cualquier persona que busque no solo un broker hipotecario excepcional, sino también a alguien que realmente se implique como si la operación fuera suya.\n\nGracias, Alejandro, por tu dedicación, tu esfuerzo incansable y por demostrar que existen profesionales que combinan excelencia técnica con una enorme calidad humana. Ha sido un auténtico privilegio contar contigo. Gracias de corazón.",
    },
    {
        nombre: 'Sandra Navarro',
        foto: 'https://lh3.googleusercontent.com/a-/ALV-UjXqZ-shiXlXrRpqvj0UPiQHV4k9d43junNa-fSaJKBeKXPnuc0=s120-c',
        estrellas: 5,
        fecha: 'hace 2 meses',
        texto: "¡Excelencia absoluta, profesionalidad y una cercanía humana excepcional!\nNo suelo escribir reseñas muy a menudo, pero la gestión que ha realizado Cabrera Capital en mi caso merece ser compartida y reconocida públicamente. Si estás buscando un bróker inmobiliario y financiero que realmente se preocupe por ti y no sea solo una empresa más, no busques más: estás en el lugar adecuado.\nMi operación era, siendo realistas, extremadamente complicada. Tenía un escenario financiero complejo, con bastantes trabas y muchos factores en contra que hacían que conseguir mi hipoteca pareciera una misión imposible. Antes de llegar a ellos, otras puertas ya se me habían cerrado, y el estrés empezaba a pasarme factura. Sin embargo, desde el minuto uno en que me puse en contacto con el equipo de Cabrera Capital, todo cambió.\nQuiero destacar de manera muy especial a Alejandro, quien ha sido mi apoyo principal y el motor de toda la operación, demostrando una implicación desmedida, y a Olegario, que también ha estado ahí sumando su gran experiencia. Lo que más me ha impactado de ellos se puede resumir en tres pilares fundamentales:\n* Implicación total y absoluta: No se limitaron a tramitar papeles. Alejandro y Olegario se tomaron mi caso como algo personal. Analizaron cada detalle, buscaron soluciones donde otros solo veían problemas y se dejaron la piel en cada llamada y en cada negociación con las entidades bancarias. Su nivel de compromiso es de los que ya no se encuentran hoy en día.\n* Excelencia en el desempeño profesional: Demostraron un conocimiento del sector financiero e inmobiliario impecable. Saben perfectamente cómo moverse, con quién hablar y qué estrategia seguir. Gracias a esa maestría, lograron resolver la operación de manera 100% positiva, cumpliendo rigurosamente en tiempo y forma, algo que yo veía inviable debido a los ajustados plazos que tenía.\n* Cercanía y sencillez: A pesar de la complejidad técnica de una hipoteca difícil, Alejandro se encargó de que todo el proceso fuera sencillo, transparente y fácil de entender para mí. Destacan por su calidad humana; son personas extraordinariamente cercanas, empáticas y accesibles. En todo momento me sentí escuchada, arropada y, sobre todo, tranquila, porque sabía que estaba en las mejores manos.\nEn resumen: Cabrera Capital ha convertido lo que iba a ser un fracaso seguro en un éxito rotundo. Alejandro y Olegario me han demostrado que la excelencia profesional no está reñida con la calidez humana. Les estaré eternamente agradecida por ayudarme a conseguir mi objetivo y mi casa cuando todo parecía perdido.\nRecomendables al 200%. Sin duda, los mejores en su sector.\n¡Muchísimas gracias por todo, Alejandro y Olegario!",
    },
    {
        nombre: 'Carlos Rodríguez',
        foto: 'https://lh3.googleusercontent.com/a-/ALV-UjW6ww6NOWYi-ddai0-p4iuAO5cHX4ijZaAfrS2lK66mZ6ziRKbT=s120-c',
        estrellas: 5,
        fecha: 'hace 3 meses',
        texto: "Pues puedo hablar desde mi experiencia personal ya que he realizado con ellos un operación de refinanciación y búsqueda de mejores condiciones hipotecarias y me las consiguieron de forma rápida y clara y siempre atentos a cualquier duda, osea que para mi super recomendados.",
    },
    {
        nombre: 'Ania de hita',
        foto: 'https://lh3.googleusercontent.com/a-/ALV-UjV4V4zD-pOYfSYnbE4AIOGWFWzaAvngSHmPestglh3uSBU6fKQt=s120-c',
        estrellas: 5,
        fecha: 'hace un mes',
        texto: "Quiero agradecer a Cabrera Kapital, y especialmente a Alejandro y Olegario, por la gestión y el trato recibido durante todo el proceso de financiación.\nEn nuestro caso, buscábamos financiación para una inversión y no conocíamos la posibilidad de estructurar la operación mediante una hipoteca con doble garantía. Alejandro y Olegario nos explicaron esta alternativa desde el principio, cómo funcionaba y cómo podía adaptarse a nuestro caso.\nDestacaría especialmente la cercanía, profesionalidad y el seguimiento durante todo el proceso. Nos explicaron cada paso de forma clara y estuvieron pendientes de la operación en todo momento.\nMuy agradecidos por habernos dado a conocer una alternativa que no conocíamos y por ayudarnos a conseguir la financiación que necesitábamos.\nSin duda, muy recomendable contar con Alejandro y Olegario para este tipo de operaciones.",
    },
];
