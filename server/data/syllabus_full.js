// Syllabus Maestro A1-C2
// Basado en MCER, Cambridge, Goethe-Institut y Alliance Française

const SYLLABUS_FULL = {
    // ENGLISH
    "en": {
        "A1": {
            description: "Acceso / Beginner",
            goal: "Supervivencia y expresiones cotidianas.",
            grammar: "Presente simple (be, do), artículos (a/an, the), plurales regulares, adjetivos posesivos, pronombres personales, preposiciones de lugar (in, on, at), 'there is/are', can (habilidad).",
            vocab: "Números, colores, familia, comida, ropa, días, aula, países.",
            skills: "Presentarse, saludar, dar info personal, entender frases sencillas.",
            expected_errors: ["Uso incorrecto de 'be' (I am go)", "Confusión presente simple/continuo", "Artículos", "Orden preguntas (You go where?)", "Preposiciones básicas"],
            feedback_protocol: "CORRECCIÓN EXPLÍCITA ('Recuerda, decimos I go') o REFORMULACIÓN IMPLÍCITA ('Yes, he likes pizza'). Preguntas aclaratorias.",
            interaction_style: "Frases cortas (max 7 palabras). Tono paciente y directo. Preguntas cerradas/elección múltiple."
        },
        "A2": {
            description: "Plataforma / Elementary",
            goal: "Intercambio de información sencilla y rutinaria.",
            grammar: "Pasado simple, presente continuo, comparativos/superlativos, 'going to', adverbios frecuencia, cuantificadores (some, any).",
            vocab: "Trabajo, hobbies, viajes, salud, clima, compras, descripción física.",
            skills: "Describir pasado, hacer planes, compras, mensajes cortos.",
            expected_errors: ["Verbos irregulares pasado", "Confusion much/many", "Adjetivos comparativos irregulares"],
            feedback_protocol: "CORRECCIÓN SELECTIVA de errores que impiden comprensión. Reformulación para modelar uso correcto. Sugerencias de vocabulario.",
            interaction_style: "Frases medias (max 12 palabras). Tono amigable. Preguntas abiertas cortas (¿Qué hiciste ayer?)."
        },
        "B1": {
            description: "Umbral / Intermediate",
            goal: "Desenvolverse en viajes y expresar opiniones.",
            grammar: "Presente perfecto, voz pasiva básica, condicionales 1 y 2, modales (should, must), oraciones relativo.",
            vocab: "Educación, medio ambiente, tecnología, sentimientos, actualidad.",
            skills: "Opinar, justificar, cartas sencillas, entender ideas principales.",
            expected_errors: ["Pasado simple vs Presente perfecto", "Condicionales", "Voz pasiva", "False friends"],
            feedback_protocol: "SUGERENCIA GRAMATICAL ('Considera usar presente perfecto'). Ofrecer alternativas. Preguntas de reflexión.",
            interaction_style: "Frases medias (max 20 palabras). Conversacional y estimulante. Preguntas de justificación (¿Por qué crees...?)."
        },
        "B2": {
            description: "Avanzado / Upper Intermediate",
            goal: "Interactuar con fluidez y espontaneidad con nativos.",
            grammar: "Perfectos continuos, pasiva avanzada, 3er condicional, modales deducción, conectores contraste/causa.",
            vocab: "Negocios, arte, ciencia, phrasal verbs, abstractos.",
            skills: "Argumentar, debatir, entender textos complejos, fluidez.",
            expected_errors: ["Matices modales", "Colocaciones complejas", "Uso preciso de conectores"],
            feedback_protocol: "CORRECCIÓN DE PRECISIÓN Y ESTILO. Sugerir alternativas más naturales. Discusión de matices.",
            interaction_style: "Frases largas (max 30 palabras). Desafiante y analítico. Preguntas hipotéticas y comparativas."
        },
        "C1": {
            description: "Dominio Operativo Eficaz / Advanced",
            goal: "Expresión espontánea, fluida y precisa.",
            grammar: "Inversión, énfasis, condicionales mixtos, modales en pasado, partículas adverbiales.",
            vocab: "Académico, profesional, lenguaje figurado, jerga técnica, matices.",
            skills: "Fines sociales/profesionales complejos, textos bien estructurados.",
            expected_errors: ["Registro inapropiado", "Phrasal verbs menos comunes", "Sutilezas estilísticas"],
            feedback_protocol: "SUGERENCIA ESTILÍSTICA ('Para mayor fluidez...'). Pregunta de precisión. Discusión de matices.",
            interaction_style: "Sin restricciones. Sofisticado y matizado. Preguntas analíticas y síntesis."
        },
        "C2": {
            description: "Maestría / Mastery",
            goal: "Comprender todo con facilidad y expresarse con precisión absoluta.",
            grammar: "Dominio total, formas arcaicas/literarias, cohesión perfecta.",
            vocab: "Riqueza extrema, referencias culturales, ironía, sarcasmo.",
            skills: "Resumir fuentes diversas, reconstruir argumentos, precisión total.",
            expected_errors: ["Ninguno gramatical (solo estilo/registro)"],
            feedback_protocol: "DISCUSIÓN ENTRE PARES. Sutilezas estilísticas, ironía, alternativas expresivas.",
            interaction_style: "Erudito y desafiante. Debate profundo. Retórica."
        }
    },

    // GERMAN (DEUTSCH)
    "de": {
        "A1": {
            description: "Acceso / Start Deutsch 1",
            goal: "Comunicación básica y necesidades concretas.",
            grammar: "Presente, verbos separables, artículos (der/die/das), nominativo/acusativo, negación (nicht/kein), imperativo.",
            vocab: "Saludos, familia, vivienda, comida, horas.",
            skills: "Preguntas básicas, formularios, entender anuncios.",
            expected_errors: ["Género y artículos", "Orden palabra (V2)", "Casos (Nom/Akk)", "Sein vs Haben"],
            feedback_protocol: "CORRECCIÓN EXPLÍCITA DE GÉNERO ('Recuerda: der Tisch'). Resaltar estructura (Verbo al final).",
            interaction_style: "Muy estructurado. Frases simples. Énfasis en orden de palabras."
        },
        "A2": {
            description: "Plataforma / Start Deutsch 2",
            goal: "Información habitual y rutinas.",
            grammar: "Perfecto (haben/sein), pretérito (modales), dativo, preposiciones lugar/tiempo, reflexivos, 'weil/dass'.",
            vocab: "Trabajo, viajes, salud, entorno urbano.",
            skills: "Conversaciones breves, cartas personales, rutina laboral.",
            expected_errors: ["Dativo vs Acusativo", "Preposiciones mixtas (Wechselpräpositionen)", "Conjugación fuerte"],
            feedback_protocol: "CORRECCIÓN ESTRUCTURAL ('Weil manda verbo al final'). Modelar oraciones subordinadas.",
            interaction_style: "Fomentar narración simple. Preguntas abiertas sobre rutina."
        },
        "B1": {
            description: "Umbral / Zertifikat Deutsch",
            goal: "Opiniones, sueños y planes.",
            grammar: "Pasiva presente, pretérito general, Plusquamperfekt, Konjunktiv II (deseos), oraciones relativo, genitivo básico.",
            vocab: "Política, historia, medio ambiente, formación.",
            skills: "Expresar opiniones, entender radio, textos coherentes.",
            expected_errors: ["Genitivo", "Adjetivos (declinación)", "Konjunktiv II forms"],
            feedback_protocol: "EXPLICACIÓN DE CASO ('Wegen rige genitivo'). Sugerir conectores más precisos.",
            interaction_style: "Conversacional. Pedir opiniones justificadas."
        },
        "B2": {
            description: "Avanzado / Goethe-Zertifikat B2",
            goal: "Argumentación y corrección fluida.",
            grammar: "Nominalización, participios como adjetivos, pasiva todos tiempos, Konjunktiv I (indirecto), conectores dobles.",
            vocab: "Mundo laboral, globalización, psicología, medios.",
            skills: "Discusiones complejas, presentaciones, prensa extensa.",
            expected_errors: ["Nominalización compleja", "Konjunktiv I vs II", "Matices modales"],
            feedback_protocol: "SUGERENCIA DE ESTRUCTURA ('Nominalizar para formalidad'). Comparación de subjuntivos.",
            interaction_style: "Analítico. Debate de ventajas y desventajas."
        },
        "C1": {
            description: "Competencia Operativa Eficaz",
            goal: "Uso flexible y eficaz para fines sociales/académicos.",
            grammar: "Estructuras complejas, estilo nominal, partículas modales (doch, ja, wohl) con precisión.",
            vocab: "Abstractos, literatura, filosofía, técnico.",
            skills: "Fluidez casi nativa, matices implícitos, textos estructurados.",
            expected_errors: ["Uso sutil de partículas", "Registro"],
            feedback_protocol: "DISCUSIÓN DE MATICES ('Doch añade sorpresa aquí'). Sugerencia de sinónimos elegantes.",
            interaction_style: "Sofisticado. Análisis de implicaciones."
        },
        "C2": {
            description: "Maestría / GDS",
            goal: "Sin esfuerzo, precisión de significado.",
            grammar: "Dominio estilístico, dialectos/regiolectos (comprensión), estructuras idiomáticas raras.",
            vocab: "Ilimitado.",
            skills: "Resumir y reconstruir hechos y argumentos de diversas fuentes.",
            expected_errors: [],
            feedback_protocol: "Solo matices de registro o estilo literario.",
            interaction_style: "Intelectual. Par académico."
        }
    },

    // FRENCH (FRANÇAIS)
    "fr": {
        "A1": {
            description: "Découverte / Acceso",
            goal: "Interacción sencilla si el interlocutor habla lento.",
            grammar: "Presente (être, avoir, -er), artículos, adjetivos, interrogación, negación simple (ne...pas).",
            vocab: "Saludos, números, familia, profesiones, comida.",
            skills: "Presentarse, comprar, entender instrucciones básicas.",
            expected_errors: ["Género/Número", "Être vs Avoir", "Negación orden"],
            feedback_protocol: "CORRECCIÓN EXPLÍCITA DE GÉNERO ('La table est belle'). Regla simple.",
            interaction_style: "Claro y lento. Preguntas directas."
        },
        "A2": {
            description: "Survie / Plataforma",
            goal: "Descripciones, narraciones simples y entorno cercano.",
            grammar: "Passé composé, imparfait (básico), futur proche, pronombres COD, comparativos.",
            vocab: "Viajes, salud, casa, ropa, tareas.",
            skills: "Narrar pasado, planes futuros, gustos.",
            expected_errors: ["Imparfait vs Passé Composé", "Acuerdo participio pasado", "Pronombres"],
            feedback_protocol: "REGLA GRAMATICAL ('Con être, participio concuerda'). Ejemplo correcto pronominal.",
            interaction_style: "Amigable. Fomentar narración."
        },
        "B1": {
            description: "Seuil / Umbral",
            goal: "Desenvolverse en la mayor parte de situaciones de viaje.",
            grammar: "Plus-que-parfait, subjonctif présent (voluntad/duda), conditionnel, pronombres relatifs (qui/que/dont/où), COI, y/en.",
            vocab: "Medio ambiente, trabajo, sentimientos, sociedad.",
            skills: "Dar consejos, contar argumentos, cartas formales simples.",
            expected_errors: ["Subjuntivo (uso)", "Pronombres relativos", "Voz pasiva"],
            feedback_protocol: "EXPLICACIÓN DE USO ('Duda requiere subjuntivo'). Sugerencia de conector.",
            interaction_style: "Estimulante. Pedir opinión."
        },
        "B2": {
            description: "Indépendant / Avanzado",
            goal: "Argumentar y matizar opiniones.",
            grammar: "Subjonctif passé, conditionnel passé, doble pronombre, gérondif, conectores lógicos avanzados (concesión, oposición).",
            vocab: "Política, justicia, ciencia, arte, idiomáticas.",
            skills: "Defender postura, entender TV/Radio nativa, ensayos.",
            expected_errors: ["Concordancia tiempos complejos", "Matices conectores", "Registro"],
            feedback_protocol: "PREGUNTA DE REFLEXIÓN ('¿Qué tiempo usarías para hábito pasado?'). Precisión léxica.",
            interaction_style: "Desafiante. Análisis crítico."
        },
        "C1": {
            description: "Autonome / Dominio",
            goal: "Discurso flexible, eficaz y bien estructurado.",
            grammar: "Matices subjuntivo/condicional, énfasis (c'est...que), inversión sujeto, passé simple (lectura).",
            vocab: "Filosófico, jerga, sutilezas, ironía.",
            skills: "Discursos extensos no estructurados, precisión en situaciones complejas.",
            expected_errors: ["Estilo", "Registro"],
            feedback_protocol: "SUGERENCIA ESTILÍSTICA ('Néanmoins es más formal'). Discusión de sinónimos (Savoir vs Connaître).",
            interaction_style: "Matizado y exploratorio."
        },
        "C2": {
            description: "Maîtrise / Maestría",
            goal: "Precisión espontánea, diferenciar matices de significado.",
            grammar: "Dominio absoluto, estructuras literarias.",
            vocab: "Nativo culto, juegos de palabras.",
            skills: "Reconstruir argumentos y hechos coherentemente.",
            expected_errors: [],
            feedback_protocol: "Debate de estilo y registro.",
            interaction_style: "Erudito."
        }
    }
};

module.exports = { SYLLABUS_FULL };
