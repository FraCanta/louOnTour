function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result;

      if (typeof content !== "string") {
        reject(new Error("File non leggibile."));
        return;
      }

      resolve(content.replace(/^data:[^;]+;base64,/, ""));
    };

    reader.onerror = () => {
      reject(new Error("Errore durante la lettura del file."));
    };

    reader.readAsDataURL(file);
  });
}

export async function uploadEventImage(file, adminKey) {
  if (!adminKey) {
    throw new Error("Chiave admin mancante.");
  }

  const dataBase64 = await fileToBase64(file);

  const response = await fetch("/api/admin/uploads/event-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminKey}`,
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      dataBase64,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload immagine non riuscito.");
  }

  return data.url;
}
