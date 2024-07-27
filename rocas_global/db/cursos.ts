import { connectToDatabase } from "./connection";
import { Curso, Modulo } from "@models/curso.model"; // Asegúrate de importar las interfaces correctamente

export async function getAllCursos(): Promise<Curso[]> {
  const db = await connectToDatabase();
  const cursosCollection = db.collection<Curso>("cursos");
  return cursosCollection.find({}).toArray();
}

export async function getCursoById(id: string): Promise<Curso | null> {
  const db = await connectToDatabase();
  const cursosCollection = db.collection<Curso>("cursos");
  return cursosCollection.findOne({ id });
}

export async function getModulosByCursoId(cursoId: string): Promise<Modulo[]> {
  const db = await connectToDatabase();
  const cursosCollection = db.collection<Curso>("cursos");
  const curso = await cursosCollection.findOne({ id: cursoId });
  return curso ? curso.modulos : [];
}
