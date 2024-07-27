// Interfaces básicas

export interface Curso {
  id: string;
  nombre: string;
  modulos: Modulo[];
}

export interface Modulo {
  id: string;
  nombre: string;
  paginas: Pagina[];
}

interface Pagina {
  id: string;
  tipo: "leccion" | "trivia" | "video";
  nombre: string;
}

// Interfaces específicas

interface Leccion extends Pagina {
  tipo: "leccion";
  contenido: string;
  imagen?: string;
}

interface Opcion {
  texto: string;
  esCorrecta: boolean;
  explicacion: string;
}

interface Trivia extends Pagina {
  tipo: "trivia";
  pregunta: string;
  opciones: Opcion[];
}

interface Video extends Pagina {
  tipo: "video";
  url: string;
}

// Interfaces para el estado de la aplicación

interface EstadoUsuario {
  cursoActual: string;
  moduloActual: string;
  paginaActual: string;
  progreso: {
    [cursoId: string]: {
      [moduloId: string]: {
        [paginaId: string]: boolean;
      };
    };
  };
}

interface EstadoAplicacion {
  cursos: Curso[];
  usuario: EstadoUsuario;
}

// Interfaces para props de componentes

interface PropsCurso {
  curso: Curso;
  onSelectModulo: (moduloId: string) => void;
}

interface PropsModulo {
  modulo: Modulo;
  onSelectPagina: (paginaId: string) => void;
}

interface PropsPagina {
  pagina: Leccion | Trivia | Video;
  onComplete: () => void;
}

interface PropsTrivia {
  trivia: Trivia;
  onAnswer: (respuesta: string) => void;
}

interface PropsVideo {
  video: Video;
  onComplete: () => void;
}
