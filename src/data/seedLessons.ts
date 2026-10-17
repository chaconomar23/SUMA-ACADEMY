import type { Lesson } from '../types';

export const INITIAL_SEED_LESSONS: Lesson[] = [
  {
    id: 'leccion-dia-principio-1-por-ciento',
    title: 'El Principio del 1% Diario: El Efecto Compuesto de las Micro-Victorias',
    summary:
      'Descubre cómo una mejora de apenas 1% cada día no suma, sino que multiplica tus capacidades por 37 veces al cabo de un solo año.',
    category: 'Mentalidad',
    isDaily: true,
    readTimeMinutes: 6,
    author: 'SUMA+ ACADEMY',
    authorEmail: 'chaconomar411@gmail.com',
    authorId: 'admin_suma_seed',
    order: 100,
    publishedAt: 'Hoy',
    youtubeUrl: 'https://www.youtube.com/watch?v=U_nzqnXWvSo',
    resources: [
      {
        title: 'Plantilla de Registro de Micro-Victorias (Notion / Google Sheets)',
        url: 'https://docs.google.com/spreadsheets',
        type: 'tool',
      },
      {
        title: 'Guía PDF: El Algoritmo del Crecimiento Exponencial',
        url: 'https://example.com/guia-crecimiento.pdf',
        type: 'pdf',
      },
    ],
    content: `### ¿Por qué la mayoría sobreestima lo que puede hacer en un día y subestima lo que logra en un año?

La trampa más común en el aprendizaje es buscar el cambio radical inmediato: devorar un libro de 400 páginas en una noche o intentar dominar una habilidad compleja en un fin de semana.

James Clear lo explica con una fórmula matemática irrefutable:
> **(1.01)³⁶⁵ = 37.78**
> Si mejoras un 1% cada día durante 365 días, terminarás siendo **37 veces mejor**.
> Por el contrario, si empeoras un 1% diario: **(0.99)³⁶⁵ = 0.03**, prácticamente te reduces a cero.

---

### Los 3 Pilares del Hábito Compuesto

1. **La Regla de los 15 Minutos Innegociables**
   No necesitas 3 horas al día. Define un bloque sagrado de 15 a 20 minutos cada mañana donde tu única tarea sea aprender algo que sume a tu carrera o negocio.

2. **Reducir la Fricción de Arranque**
   Deja tus herramientas preparadas la noche anterior: la lección abierta, el cuaderno listo y las notificaciones apagadas.

3. **El Registro Visual de Progreso**
   El cerebro humano necesita dopamina inmediata. Marcar la lección completada activa un refuerzo positivo que te impulsa a no romper la cadena.

---

### ⚡ Reto del Día (Acción Inmediata)
- Elige **una sola idea práctica** de esta lección.
- Aplícala en los próximos 60 minutos (no mañana, hoy).
- Marca esta lección como completada en tu panel para mantener viva tu racha de aprendizaje.`,
  },
  {
    id: 'oferta-irresistible-marketing',
    title: 'La Anatomía de una Oferta Irresistible: Ecuación de Valor para Monetizar',
    summary:
      'Aprende a estructurar propuestas comerciales donde el cliente sienta que pagar tu precio es una ganga absoluta.',
    category: 'Marketing',
    isDaily: false,
    readTimeMinutes: 8,
    author: 'SUMA+ ACADEMY',
    authorEmail: 'chaconomar411@gmail.com',
    authorId: 'admin_suma_seed',
    order: 90,
    publishedAt: 'Ayer',
    youtubeUrl: 'https://www.youtube.com/watch?v=0t9S113_K54',
    resources: [
      {
        title: 'Canvas de Ecuación de Valor (Plantilla Editable)',
        url: 'https://example.com/canvas-oferta.pdf',
        type: 'pdf',
      },
      {
        title: 'Calculadora de Precios y Márgenes',
        url: 'https://example.com/pricing-tool',
        type: 'tool',
      },
    ],
    content: `### La Ecuación de Valor que lo Cambia Todo

Muchos creadores y profesionales cometen el error de competir por precio. Reducir precios atrae clientes difíciles y destruye tus márgenes. En su lugar, debes maximizar el valor percibido.

La fórmula universal de valor se descompone en 4 variables:

$$\\text{Valor} = \\frac{\\text{Resultado Soñado} \\times \\text{Certeza Percibida}}{\\text{Tiempo de Espera} \\times \\text{Esfuerzo y Sacrificio}}$$

---

### Cómo Optimizar Cada Variable:

1. **Resultado Soñado (Dream Outcome):**
   Conecta con la transformación real. La gente no compra un taladro, compra el agujero en la pared para colgar la foto de su familia.
2. **Certeza Percibida (Perceived Likelihood of Achievement):**
   Elimina el riesgo con testimonios, garantías incondicionales y casos de estudio con métricas claras.
3. **Tiempo de Espera (Time Delay):**
   ¿Qué tan rápido puede el cliente ver una primera victoria rápida? Ofrece un quick-win en las primeras 48 horas.
4. **Esfuerzo y Sacrificio (Effort & Sacrifice):**
   Proporciona plantillas, scripts, automatizaciones y soporte para que no tengan que empezar desde una hoja en blanco.

---

### 🎯 Acción Inmediata
Revisa tu producto o servicio actual y responde: ¿Qué garantía puedes agregar hoy que elimine el 100% del miedo a comprar?`,
  },
  {
    id: 'habitos-anclaje-profundo',
    title: 'Anclaje de Hábitos y Bloques de Enfoque Profundo (Deep Work)',
    summary:
      'Cómo diseñar un ritual matutino sin distracciones que te permita producir en 2 horas lo que otros tardan 8.',
    category: 'Hábitos',
    isDaily: false,
    readTimeMinutes: 5,
    author: 'SUMA+ ACADEMY',
    authorEmail: 'chaconomar411@gmail.com',
    authorId: 'admin_suma_seed',
    order: 80,
    publishedAt: 'Hace 2 días',
    youtubeUrl: 'https://www.youtube.com/watch?v=gCfcUuU_5Lw',
    resources: [
      {
        title: 'Temporizador Pomodoro y Focus Flow Online',
        url: 'https://pomofocus.io',
        type: 'tool',
      },
      {
        title: 'Checklist de Blindaje contra Distracciones',
        url: 'https://example.com/checklist-distracciones.pdf',
        type: 'doc',
      },
    ],
    content: `### La Ilusión del Multitasking

La multitarea es un mito neurobiológico. Cada vez que pasas de escribir un documento a revisar WhatsApp o responder un email, tu cerebro sufre un costo cognitivo llamado **residuo de atención**.

Tardas un promedio de 23 minutos en recuperar la concentración profunda tras una sola interrupción.

---

### El Protocolo de 90 Minutos de SUMA+

- **Paso 1: Modo Avión Físico:** El teléfono no solo debe estar en silencio; debe estar en otra habitación. Si está en tu campo visual, tu cerebro gasta energía resistiendo la tentación.
- **Paso 2: Música de Frecuencia Alfa / Ruido Marrón:** Ayuda a inducir el estado de flujo (Flow State) eliminando el ruido blanco del entorno.
- **Paso 3: Una Sola Ventana Abierta:** Cierra todas las pestañas irrelevantes. Tu pantalla debe ser un santuario de una sola tarea.

---

> "Tu habilidad para realizar trabajo profundo se está volviendo cada vez más escasa y al mismo tiempo cada vez más valiosa en nuestra economía." — Cal Newport`,
  },
  {
    id: 'herramientas-segundo-cerebro',
    title: 'Arquitectura de un Segundo Cerebro: Metodología P.A.R.A.',
    summary:
      'Deja de confiar en tu memoria biológica. Construye un sistema digital para capturar, organizar y destilar información.',
    category: 'Herramientas',
    isDaily: false,
    readTimeMinutes: 7,
    author: 'SUMA+ ACADEMY',
    authorEmail: 'chaconomar411@gmail.com',
    authorId: 'admin_suma_seed',
    order: 70,
    publishedAt: 'Hace 3 días',
    youtubeUrl: 'https://www.youtube.com/watch?v=K-ssUVy95e4',
    resources: [
      {
        title: 'Plantilla Notion: Dashboard P.A.R.A. SUMA+',
        url: 'https://www.notion.so',
        type: 'tool',
      },
    ],
    content: `### Tu mente es para tener ideas, no para almacenarlas

¿Cuántos artículos, videos y notas has guardado en los últimos meses que nunca volviste a abrir? Acumular información sin estructura se convierte en **obesidad infoxica**.

El método P.A.R.A. de Tiago Forte organiza tu información según la **accionabilidad**:

1. **Proyectos (Projects):** Cosas en las que estás trabajando ahora con una fecha límite fija (ej. "Lanzar nuevo taller web antes del 30 de noviembre").
2. **Áreas (Areas):** Responsabilidades continuas que debes mantener en el tiempo (ej. Salud, Finanzas Personales, Marketing de Contenidos).
3. **Recursos (Resources):** Temas de interés o investigación futura (ej. Inteligencia Artificial, Psicología de Ventas, Diseño UI/UX).
4. **Archivos (Archives):** Elementos inactivos de las tres categorías anteriores que deseas conservar por si los necesitas en el futuro.

---

### Regla de Oro:
Nunca guardes una nota sin antes responder: *¿En qué proyecto específico me va a ayudar esto en los próximos 14 días?*`,
  },
  {
    id: 'estrategia-validacion-72h',
    title: 'Validación Ágil de Ideas en 72 Horas: De la Mente al Mercado',
    summary:
      'Cómo comprobar si la gente realmente pagará por tu idea antes de invertir semanas o miles de dólares en construirla.',
    category: 'Estrategia',
    isDaily: false,
    readTimeMinutes: 6,
    author: 'SUMA+ ACADEMY',
    authorEmail: 'chaconomar411@gmail.com',
    authorId: 'admin_suma_seed',
    order: 60,
    publishedAt: 'Hace 4 días',
    youtubeUrl: 'https://www.youtube.com/watch?v=0CDXJ6bMkMY',
    resources: [
      {
        title: 'Guion de Entrevistas de Descubrimiento de Cliente',
        url: 'https://example.com/guion-entrevistas.pdf',
        type: 'doc',
      },
    ],
    content: `### El Test del Humo (Smoke Test)

La peor pesadilla de un emprendedor es construir algo perfecto que nadie quiere comprar.
Pedir opiniones a amigos o familiares no sirve: ellos te quieren y te dirán que es genial. **La única validación real es el compromiso de atención, tiempo o dinero.**

---

### La Hoja de Ruta de 3 Días:

- **Día 1: Definición del Dolor Específico:** Entrevista a 5 personas de tu público objetivo. No les vendas tu solución; pregúntales cómo resuelven hoy ese problema y cuánto les frustra.
- **Día 2: Landing Page Minimalista:** Crea una página simple de una sola sección con un titular contundente, 3 beneficios y un formulario de lista de espera prioritaria o preventa con descuento especial.
- **Día 3: Tráfico y Medición:** Comparte la página en tus comunidades nicho o invierte un presupuesto simbólico ($10) en anuncios hiper-segmentados. Si consigues una tasa de conversión mayor al 15% en registros, tienes una señal verde para construir.`,
  },
  {
    id: 'productividad-energia-vs-tiempo',
    title: 'Gestión de Energía vs. Gestión de Tiempo: El Ritmo Ultradianos',
    summary:
      'Aprende a trabajar con las olas biológicas de tu cuerpo para duplicar tu rendimiento sin terminar exhausto al final del día.',
    category: 'Productividad',
    isDaily: false,
    readTimeMinutes: 5,
    author: 'SUMA+ ACADEMY',
    authorEmail: 'chaconomar411@gmail.com',
    authorId: 'admin_suma_seed',
    order: 50,
    publishedAt: 'Hace 5 días',
    youtubeUrl: 'https://www.youtube.com/watch?v=I1lUqf9g-bY',
    resources: [
      {
        title: 'Test de Cronotipo Personal (Lobo, Oso, León, Delfín)',
        url: 'https://thepowerofwhenquiz.com',
        type: 'link',
      },
    ],
    content: `### Todos tenemos 24 horas, pero no la misma energía

Gestionar el tiempo sin gestionar la energía es inútil: una hora de trabajo agotado a las 11 PM produce una fracción minúscula de lo que logras en 45 minutos con la mente despejada y descansada.

Los seres humanos no somos máquinas que operan linealmente a 100% de potencia; somos osciladores biológicos que funcionan en **ciclos ultradianos de 90 a 120 minutos**.

---

### El Cuadrante de Carga Cognitiva:

1. **Mañana (Pico de Enfoque):** Tareas analíticas, resolución de problemas complejos, escritura estratégica.
2. **Mediodía (Valle Digestivo):** Tareas mecánicas, responder mensajes, organización de archivos, caminar o pausa activa.
3. **Tarde (Rebote Creativo):** Lluvia de ideas, reuniones de equipo, revisión de métricas y planificación del día siguiente.

---

### El Secreto del Descanso Activo:
Hacer una pausa no significa mirar TikTok o Twitter (eso sigue saturando tu corteza prefrontal). Una pausa real implica mirar a la distancia, hidratarte, estirarte o respirar conscientemente durante 5 minutos.`,
  },
];
