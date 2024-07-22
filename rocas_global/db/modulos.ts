import { connectToDatabase } from "./connection";
import { Modulo, Pagina } from "../interfaces"; // Asegúrate de importar las interfaces correctamente

export async function getModuloById(
  cursoId: string,
  moduloId: string
): Promise<Modulo | null> {
  const db = await connectToDatabase();
  const cursosCollection = db.collection("cursos");
  const curso = await cursosCollection.findOne(
    { id: cursoId, "modulos.id": moduloId },
    { projection: { "modulos.$": 1 } }
  );
  return curso ? curso.modulos[0] : null;
}

export async function getPaginasByModuloId(
  cursoId: string,
  moduloId: string
): Promise<Pagina[]> {
  const db = await connectToDatabase();
  const cursosCollection = db.collection("cursos");
  const curso = await cursosCollection.findOne(
    { id: cursoId, "modulos.id": moduloId },
    { projection: { "modulos.$": 1 } }
  );
  return curso && curso.modulos[0] ? curso.modulos[0].paginas : [];
}
