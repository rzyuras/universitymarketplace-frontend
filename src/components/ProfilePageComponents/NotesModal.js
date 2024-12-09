import React, { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import './NotesModal.css';
import { Trash2, Download, Pencil } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import Select from 'react-select';

const API_URL = process.env.REACT_APP_API_URL;

const EditNoteModal = ({ note, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: note.title,
    course: { code: note.course.code, name: note.course.name },
    file: null,
    fileName: note.file_path ? note.file_path.split('/').pop() : null, // Obtiene el nombre del archivo actual
  });
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const { getIdTokenClaims } = useAuth0();

  // Cargar los cursos desde la API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const tokenClaims = await getIdTokenClaims();
        const token = tokenClaims?.__raw;
        const response = await fetch(`${API_URL}/courses/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al cargar los cursos');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [getIdTokenClaims]);

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
      const tokenClaims = await getIdTokenClaims();
      const token = tokenClaims?.__raw;
      const response = await fetch(`${API_URL}/notes/${note.id}`, {
        method: 'PUT',
        body: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
            <label>Curso:</label>
            {loadingCourses ? (
              <p>Cargando cursos...</p>
            ) : (
              <Select
                options={courses.map((course) => ({
                  value: { code: course.code, name: course.name },
                  label: `${course.code} - ${course.name}`,
                }))}
                value={{
                  value: formData.course,
                  label: `${formData.course.code} - ${formData.course.name}`,
                }}
                onChange={(option) =>
                  setFormData({
                    ...formData,
                    course: option.value,
                  })
                }
                placeholder="Selecciona un curso..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          </div>
          <div className="form-group">
            <label>Archivo (opcional):</label>
            <input
              type="file"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  file: e.target.files[0],
                  fileName: e.target.files[0]?.name || formData.fileName,
                })
              }
              accept=".pdf,.doc,.docx"
            />
            {formData.fileName && (
              <div className="selected-file">
                Archivo actual: <strong>{formData.fileName}</strong>
              </div>
            )}
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
  const { getIdTokenClaims } = useAuth0();

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
      const tokenClaims = await getIdTokenClaims();
      const token = tokenClaims?.__raw;
      const response = await fetch(`${API_URL}/notes/my-notes?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      const tokenClaims = await getIdTokenClaims();
      const token = tokenClaims?.__raw;
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar el apunte');
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = async (noteId, title) => {
    try {
      window.open(`${API_URL}/notes/${noteId}/download`, '_blank');
    } catch (err) {
      setError('Error al descargar el archivo');
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
  };

  const handleSaveEdit = (updatedNote) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
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
                  <p>
                    <strong>Curso:</strong> {note.course.code} - {note.course.name}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {new Date(note.upload_date).toLocaleDateString()}
                  </p>
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
