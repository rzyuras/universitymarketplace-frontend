import React, { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import './NotesModal.css';
import { Trash2, Download, Pencil } from 'lucide-react';

const EditNoteModal = ({ note, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: note.title,
    course: { code: note.course.code, name: note.course.name },
    file: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('course_code', formData.course.code);
    data.append('course_name', formData.course.name);
    if (formData.file) {
      data.append('file', formData.file);
    }

    try {
      const response = await fetch(`http://localhost:8000/notes/${note.id}`, {
        method: 'PUT',
        body: data,
      });

      if (!response.ok) throw new Error('Error al actualizar el apunte');
      const updatedNote = await response.json();
      onSave(updatedNote);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="edit-modal">
      <div className="edit-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Editar Apunte</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Curso (Código - Nombre):</label>
            <input
              type="text"
              value={`${formData.course.code} - ${formData.course.name}`}
              onChange={(e) => {
                const [code, ...nameParts] = e.target.value.split(' - ');
                setFormData({ ...formData, course: { code, name: nameParts.join(' ') } });
              }}
              required
            />
          </div>
          <div className="form-group">
            <label>Archivo (opcional):</label>
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
              accept=".pdf,.doc,.docx"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">Guardar</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotesModal = ({ onClose }) => {
  const { userId, loading: userLoading, error: userError } = useUser();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    if (userLoading) return;
    if (userError || !userId) {
      setError(userError || 'Usuario no identificado');
      setLoading(false);
      return;
    }

    fetchNotes();
  }, [userId, userLoading, userError]);

  const fetchNotes = async () => {
    const params = new URLSearchParams({ user_id: userId.toString() });
    try {
      const response = await fetch(`http://localhost:8000/notes/my-notes?${params}`);
      if (!response.ok) throw new Error('Error al obtener los apuntes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este apunte?')) return;

    try {
      const response = await fetch(`http://localhost:8000/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el apunte');
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = async (noteId, title) => {
    try {
      window.open(`http://localhost:8000/notes/${noteId}/download`, '_blank');
    } catch (err) {
      setError('Error al descargar el archivo');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
  };

  const handleSaveEdit = (updatedNote) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Mis Apuntes Publicados</h2>
        {(userLoading || loading) && <p>Cargando...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3>{note.title}</h3>
                  <div className="note-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(note)}
                      title="Editar apunte"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(note.id)}
                      title="Eliminar apunte"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="note-info">
                  <p><strong>Curso:</strong> {note.course.code} - {note.course.name}</p>
                  <p><strong>Fecha:</strong> {new Date(note.upload_date).toLocaleDateString()}</p>
                </div>
                <button
                  className="download-button"
                  onClick={() => handleDownload(note.id, note.title)}
                >
                  <Download size={16} /> Descargar
                </button>
              </div>
            ))}
          </div>
        )}
        {editingNote && (
          <EditNoteModal
            note={editingNote}
            onClose={() => setEditingNote(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
};

export default NotesModal;