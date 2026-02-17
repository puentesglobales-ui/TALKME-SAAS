const SYLLABUS = {
    "en": {
        "A1": {
            description: "Nivel Acceso (Cambridge English / MCER)",
            grammar: "Presente simple (be, otros verbos), artículos (a/an, the), plurales regulares, adjetivos posesivos, pronombres personales, preposiciones de lugar básicas (in, on, at), 'there is/are', can (habilidad).",
            vocab: "Números, colores, familia, comida, ropa, días de la semana, objetos del aula, países y nacionalidades.",
            skills: "Presentarse, saludar, dar información personal básica, entender frases muy sencillas."
        },
        "A2": {
            description: "Nivel Plataforma",
            grammar: "Pasado simple (regulares e irregulares), presente continuo, comparativos y superlativos, 'going to' para futuro, adverbios de frecuencia, cuantificadores (some, any, much, many).",
            vocab: "Trabajo, hobbies, viajes, salud, clima, compras, descripción física y de personalidad.",
            skills: "Describir experiencias pasadas, hacer planes, ir de compras, entender mensajes cortos y claros."
        },
        "B1": {
            description: "Nivel Intermedio",
            grammar: "Presente perfecto, voz pasiva (básica), primer y segundo condicional, verbos modales (should, must, have to), estilo indirecto (básico), oraciones de relativo.",
            vocab: "Educación, medio ambiente, tecnología, sentimientos, servicios (banco, correo), medios de comunicación.",
            skills: "Mantener conversaciones sobre temas familiares, expresar opiniones, escribir cartas o correos sencillos, entender ideas principales de textos claros."
        },
        "B2": {
            description: "Nivel Intermedio Alto",
            grammar: "Tiempos perfectos continuos, voz pasiva avanzada, tercer condicional, modales de deducción, 'wish/if only', gerundios e infinitivos complejos, conectores de contraste y causa.",
            vocab: "Crimen y castigo, negocios, arte, ciencia, modismos y 'phrasal verbs' comunes, colocaciones.",
            skills: "Argumentar posturas, entender textos complejos y abstractos, hablar con fluidez con nativos, escribir informes y ensayos detallados."
        },
        "C1": {
            description: "Nivel Avanzado",
            grammar: "Inversión, estructuras enfáticas, condicionales mixtos, modales en el pasado, uso avanzado de partículas adverbiales, matices de significado en tiempos verbales.",
            vocab: "Vocabulario académico y profesional, lenguaje figurado, matices de significado, jerga técnica básica.",
            skills: "Expresarse de forma espontánea y fluida, usar el lenguaje para fines sociales y profesionales complejos, producir textos claros y bien estructurados sobre temas complejos."
        },
        "C2": {
            description: "Nivel Maestría",
            grammar: "Dominio total de todas las estructuras, uso de formas arcaicas o literarias para efecto, precisión absoluta en el uso de conectores y cohesión.",
            vocab: "Riqueza léxica extrema, comprensión de referencias culturales sutiles, ironía y sarcasmo.",
            skills: "Comprender con facilidad prácticamente todo lo que lee u oye, resumir información de diversas fuentes, expresarse de forma natural y muy precisa."
        }
    },
    "de": {
        "A1": {
            description: "Nivel Acceso (Goethe-Institut)",
            grammar: "Conjugación en presente, verbos separables, artículos definidos/indefinidos, nominativo y acusativo, negación (nicht/kein), imperativo (Sie), pronombres posesivos.",
            vocab: "Saludos, familia, vivienda, comida, horas, actividades cotidianas.",
            skills: "Preguntas básicas, entender anuncios sencillos, rellenar formularios."
        },
        "A2": {
            description: "Nivel Plataforma",
            grammar: "Perfecto (con haben/sein), pretérito (verbos modales), dativo, preposiciones de lugar y tiempo, verbos reflexivos, comparativo, conjunciones (weil, dass).",
            vocab: "Trabajo, viajes, salud, descripción de personas, entorno urbano.",
            skills: "Conversaciones breves sobre el entorno, entender cartas personales, describir la rutina laboral."
        },
        "B1": {
            description: "Nivel Intermedio",
            grammar: "Pasiva (presente), pretérito (general), Plusquamperfekt, subjuntivo II (deseos/cortesía), oraciones de relativo, genitivo (básico), conjunciones subordinantes complejas.",
            vocab: "Sueños y planes, política, historia, medio ambiente, formación profesional.",
            skills: "Expresar opiniones y deseos, entender programas de radio claros, escribir textos coherentes sobre temas de interés."
        },
        "B2": {
            description: "Nivel Intermedio Alto",
            grammar: "Nominalización, participio I y II como adjetivos, pasiva en todos los tiempos, subjuntivo I (estilo indirecto), conectores dobles (sowohl... als auch), matices de los verbos modales.",
            vocab: "Mundo laboral avanzado, globalización, psicología, consumo, medios de comunicación.",
            skills: "Seguir discusiones complejas, dar presentaciones cortas, entender artículos de prensa extensos."
        },
        "C1": {
            description: "Nivel Avanzado",
            grammar: "Estructuras sintácticas complejas, uso estilístico de la lengua, precisión en el uso de partículas modales, dominio de registros formales y académicos.",
            vocab: "Temas abstractos, literatura, filosofía, terminología técnica específica.",
            skills: "Fluidez casi nativa, comprensión de matices implícitos, producción de textos altamente estructurados y precisos."
        },
        "C2": { // Merged C1/C2 in source, keeping separate for consistency if needed, but source said C1/C2. Using C2 as copy of C1/C2 details.
            description: "Nivel Maestría / C1-C2",
            grammar: "Estructuras sintácticas complejas, uso estilístico de la lengua, precisión en el uso de partículas modales, dominio de registros formales y académicos.",
            vocab: "Temas abstractos, literatura, filosofía, terminología técnica específica.",
            skills: "Fluidez casi nativa, comprensión de matices implícitos, producción de textos altamente estructurados y precisos."
        }
    },
    "fr": {
        "A1": {
            description: "Nivel Découverte (Alliance Française / MCER)",
            grammar: "Presente de indicativo (être, avoir, verbos en -er), artículos definidos/indefinidos/partitivos, adjetivos posesivos y demostrativos, interrogación (est-ce que, qui, quoi, où), negación simple (ne... pas), preposiciones de lugar y tiempo básicas.",
            vocab: "Saludos, números (0-100), familia, profesiones, nacionalidades, días de la semana, meses, clima básico, comida y bebidas.",
            skills: "Presentarse y presentar a otros, hacer preguntas personales sencillas, entender instrucciones básicas, escribir notas cortas."
        },
        "A2": {
            description: "Nivel Survie",
            grammar: "Passé composé (con avoir y être), imparfait (uso descriptivo), futuro simple y 'futur proche', pronombres de objeto directo (COD), comparativos y superlativos, adverbios de manera, verbos reflexivos en pasado.",
            vocab: "Viajes y transporte, salud y cuerpo humano, vivienda y muebles, moda y ropa, tareas domésticas, descripción física y de carácter.",
            skills: "Narrar eventos pasados, describir planes futuros, expresar gustos y preferencias, manejarse en situaciones cotidianas (restaurante, banco, médico)."
        },
        "B1": {
            description: "Nivel Seuil",
            grammar: "Plus-que-parfait, subjuntivo presente (voluntad, necesidad, emoción), condicional presente (hipótesis), pronombres relativos (qui, que, dont, où), pronombres de objeto indirecto (COI), pronombres 'y' y 'en', voz pasiva básica, concordancia del participio pasado.",
            vocab: "Medio ambiente, educación y sistema escolar, mundo laboral y desempleo, medios de comunicación, sentimientos y emociones, sociedad y actualidad.",
            skills: "Dar consejos y opiniones, contar una historia o película, escribir cartas formales sencillas, participar en debates sobre temas familiares."
        },
        "B2": {
            description: "Nivel Indépendant",
            grammar: "Subjuntivo pasado, condicional pasado (arrepentimiento), doble pronombre (orden y lugar), gerundio y participio presente, conectores lógicos avanzados (oposición, concesión, causa, consecuencia), uso de 'si' complejo, discurso indirecto en el pasado.",
            vocab: "Política y ciudadanía, justicia y ley, ciencia y tecnología, artes y literatura contemporánea, expresiones idiomáticas y registros de lengua.",
            skills: "Defender una postura con argumentos sólidos, entender programas de TV y películas sin subtítulos, escribir ensayos estructurados, hablar con naturalidad con nativos."
        },
        "C1": {
            description: "Nivel Autonome",
            grammar: "Matices del subjuntivo y condicional, estructuras de énfasis (c'est... que/qui), inversión del sujeto, uso estilístico de los tiempos del pasado (passé simple en lectura), conectores de transición complejos, dominio de la nominalización.",
            vocab: "Temas abstractos y filosóficos, jerga profesional y académica, sutilezas del lenguaje (ironía, registros), vocabulario técnico especializado.",
            skills: "Seguir discursos extensos incluso si no están claramente estructurados, expresarse de forma espontánea y fluida, producir textos claros y bien detallados sobre temas complejos."
        },
        "C2": {
            description: "Nivel Maîtrise",
            grammar: "Dominio absoluto de todas las estructuras, incluso las más raras o literarias. Precisión extrema en la puntuación y organización del discurso.",
            vocab: "Riqueza léxica comparable a un nativo culto, comprensión de referencias culturales profundas y juegos de palabras.",
            skills: "Resumir información de fuentes diversas reconstruyendo argumentos de forma coherente, expresarse con gran precisión incluso en situaciones complejas, comprender prácticamente todo lo que lee u oye."
        }
    }
};

module.exports = { SYLLABUS };
