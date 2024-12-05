import React, { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { Trash2, Calendar, Clock, MapPin, Info, Pencil } from 'lucide-react';
import './TutoringModal.css';

const EditSessionModal = ({ session, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      course: session.course,
      description: session.description,
      location: session.location,
      start_time: new Date(session.start_time).toISOString().slice(0, 16),
      end_time: new Date(session.end_time).toISOString().slice(0, 16)
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      onSave(session.id, formData);
    };

return (
    <div className="edit-modal">
        <div className="edit-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Editar Tutoría</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label>Curso:</label>
            <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                required
            />
            </div>
            <div className="form-group">
            <label>Descripción:</label>
            <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
            />
            </div>
            <div className="form-group">
            <label>Ubicación:</label>
            <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
            />
            </div>
            <div className="form-group">
            <label>Inicio:</label>
            <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                required
            />
            </div>
            <div className="form-group">
            <label>Fin:</label>
            <input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                required
            />
            </div>
            <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-button">Guardar</button>
            </div>
        </form>
        </div>
    </div>
    );
};

const DescriptionModal = ({ session, onClose }) => (
    <div className="description-modal">
      <div className="description-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h3>{session.course}</h3>
        <div className="description-info">
          <p><strong>Descripción:</strong></p>
          <p>{session.description}</p>
          <p><strong>Ubicación:</strong> {session.location}</p>
          <p><strong>Inicio:</strong> {new Date(session.start_time).toLocaleString()}</p>
          <p><strong>Fin:</strong> {new Date(session.end_time).toLocaleString()}</p>
          <p><strong>Estado:</strong> {session.is_booked ? 'Reservada' : 'Disponible'}</p>
        </div>
      </div>
    </div>
  );

const TutoringModal = ({ onClose }) => {
  const { userId, loading: userLoading, error: userError } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [editingSession, setEditingSession] = useState(null);

  useEffect(() => {
    if (userLoading) return;
    if (userError || !userId) {
      setError(userError || 'Usuario no identificado');
      setLoading(false);
      return;
    }
    fetchSessions();
  }, [userId, userLoading, userError]);

  const handleEdit = (session) => {
    if (session.is_booked || new Date(session.start_time) <= new Date()) {
      setError('No se puede editar una tutoría que ya pasó o está reservada');
      return;
    }
    setEditingSession(session);
  };

  const handleSaveEdit = async (sessionId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/tutoring-sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) throw new Error('Error al actualizar la tutoría');
      const updatedSession = await response.json();
      setSessions(sessions.map(s => s.id === sessionId ? updatedSession : s));
      setEditingSession(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchSessions = async () => {
    console.log('ID del usuario:', {userId});
    try {
      const response = await fetch(`http://localhost:8000/tutoring-sessions/my-sessions?user_id=${userId}`);
      if (!response.ok) throw new Error('Error al obtener las tutorías');
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tutoría?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/tutoring-sessions/${sessionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar la tutoría. Si la tutoría está reservada, no se puede eliminar.');
      setSessions(sessions.filter(session => session.id !== sessionId));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Mis Tutorías Publicadas</h2>
        {(userLoading || loading) && <p>Cargando...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <div className="tutoring-grid">
            {sessions.map((session) => (
              <div key={session.id} className="tutoring-card">
                <div className="tutoring-header">
                  <h3>{session.course}</h3>
                  <div className="tutoring-actions">
                    <button 
                        className="edit-button"
                        onClick={() => handleEdit(session)}
                        title="Editar tutoría"
                    >
                        <Pencil size={16} />
                    </button>
                    <button 
                      className="info-button"
                      onClick={() => setSelectedSession(session)}
                      title="Ver detalles"
                    >
                      <Info size={16} />
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDelete(session.id)}
                      title="Eliminar tutoría"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="tutoring-info">
                  <p>
                    <Calendar size={16} className="icon" />
                    <strong>Inicio:</strong> {formatDate(session.start_time)}
                  </p>
                  <p>
                    <Clock size={16} className="icon" />
                    <strong>Fin:</strong> {formatDate(session.end_time)}
                  </p>
                  <p>
                    <MapPin size={16} className="icon" />
                    <strong>Ubicación:</strong> {session.location}
                  </p>
                  <p><strong>Estado:</strong> {session.is_booked ? 'Reservada' : 'Disponible'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedSession && (
          <DescriptionModal 
            session={selectedSession} 
            onClose={() => setSelectedSession(null)} 
          />
        )}
        {editingSession && (
          <EditSessionModal
            session={editingSession}
            onClose={() => setEditingSession(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </div>
  );
};

export default TutoringModal;