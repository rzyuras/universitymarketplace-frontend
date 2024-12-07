import React, { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';
import './TutoringModal.css';

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
      </div>
    </div>
  </div>
);

const BookedTutoringModal = ({ onClose }) => {
  const { userId, loading: userLoading, error: userError } = useUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    if (userLoading) return;
    if (userError || !userId) {
      setError(userError || 'Usuario no identificado');
      setLoading(false);
      return;
    }
    fetchSessions();
  }, [userId, userLoading, userError]);

  const fetchSessions = async () => {
    try {
      // Aquí filtramos por student_id en lugar de tutor_id
      const response = await fetch(`http://localhost:8000/tutoring-sessions?student_id=${userId}&is_booked=true`);
      if (!response.ok) throw new Error('Error al obtener las tutorías');
      const data = await response.json();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (sessionId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta tutoría?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/tutoring-sessions/${sessionId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Error al cancelar la tutoría');
      }
  
      await fetchSessions(); // Recargar las sesiones después de cancelar
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
        <h2>Mis Tutorías Agendadas</h2>
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
                      className="info-button"
                      onClick={() => setSelectedSession(session)}
                      title="Ver detalles"
                    >
                      <Info size={16} />
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleCancel(session.id)}
                      title="Cancelar tutoría"
                    >
                      Cancelar
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
      </div>
    </div>
  );
};

export default BookedTutoringModal;