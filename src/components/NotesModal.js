import React, { useEffect, useState } from 'react';
import { useUser } from './hooks/useUser';
import './NotesModal.css';
import { Trash2, Download } from 'lucide-react';

const NotesModal = ({ onClose }) => {
  const { userId, loading: userLoading, error: userError } = useUser();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      //const response = await fetch(`https://universitymarketplace-backend.onrender.com/notes/my-notes?${params}`);
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
      // const response = await fetch(`https://universitymarketplace-backend.onrender.com/notes/${noteId}`, {
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
      //  window.open(`https://universitymarketplace-backend.onrender.com/notes/${noteId}/download`, '_blank');
      window.open(`http://localhost:8000/notes/${noteId}/download`, '_blank');
    } catch (err) {
      setError('Error al descargar el archivo');
    }
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
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(note.id)}
                    title="Eliminar apunte"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="note-info">
                  <p><strong>Curso:</strong> {note.course}</p>
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
      </div>
    </div>
  );
};

export default NotesModal;