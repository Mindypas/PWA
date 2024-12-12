let db;
//

const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("NotesDB");

    request.onupgradeneeded = () => {
      const dataBase = request.result;
      if (!dataBase.objectStoreNames.contains("NotesStore")) {
        dataBase.createObjectStore("NotesStore", {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

const addNote = async (noteContent) => {
  try {
    const transaction = db.transaction("NotesStore", "readwrite");
    const store = transaction.objectStore("NotesStore");
    const id = Date.now();
    const request = store.add({ id: id, content: noteContent });

    return new Promise((resolve, reject) => {
      request.onsuccess = resolve;
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error adding note:", error);
  }
};

const deleteNote = async (id) => {
  try {
    const transaction = db.transaction("NotesStore", "readwrite");
    const store = transaction.objectStore("NotesStore");
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = resolve;
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error deleting note:", error);
  }
};

const getNotes = async () => {
  try {
    const transaction = db.transaction("NotesStore", "readonly");
    const store = transaction.objectStore("NotesStore");
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
  }
};

const renderNotes = async () => {
  try {
    const notes = await getNotes();
    const ul = document.querySelector("#notes");
    ul.innerHTML = "";
    notes.forEach((note) => {
      const li = document.createElement("li");
      li.innerHTML = note.content;

      const deleteButton = document.createElement("a");
      deleteButton.innerHTML = '<span class="icon">delete</span>';
      deleteButton.addEventListener("click", () => handleDelete(note.id));

      li.appendChild(deleteButton);
      ul.appendChild(li);
    });
  } catch (error) {
    console.error("Error rendering notes:", error);
  }
};

const handleDelete = async (id) => {
  if (confirm("Do you want to delete this note?")) {
    try {
      await deleteNote(id);
      await renderNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const noteContent = document.querySelector("textarea").value.trim();

  if (!noteContent.length) {
    alert("You didn't input any content");
    return;
  }

  try {
    await addNote(noteContent);
    document.querySelector("textarea").value = "";
    await renderNotes();
  } catch (error) {
    console.error("Error adding note:", error);
  }
};

const initializeDatabase = async () => {
  try {
    db = await openDB();
    await renderNotes();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", handleSubmit);

  initializeDatabase();
});
