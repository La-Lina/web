export async function uploadFile(file: File, type: string) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("type", type);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error("El servidor devolvió una respuesta inválida.");
  }

  if (!res.ok || !data?.url) {
    throw new Error(data?.error || "Error subiendo el archivo.");
  }

  return data;
}