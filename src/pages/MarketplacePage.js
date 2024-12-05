import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from '../components/hooks/useUser';
import './MarketplaceStyles.css';

const ProductCard = ({ item, type, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="product-card">
      <img 
        src={type === 'tutor' ? '/tutoring.png' : '/notes.png'} 
        alt={type === 'tutor' ? `Tutoría de ${item.course}` : item.title}
        className="product-image"
      />
      <div className="product-info">
        <span className={`product-type ${type === 'tutor' ? 'type-tutoria' : 'type-apunte'}`}>
          {type === 'tutor' ? 'Tutoría' : 'Apunte'}
        </span>
        <h3 className="product-title">
          {type === 'tutor' ? `Tutoría de ${item.course}` : item.title}
        </h3>
        <div className="product-details">
          <p>Curso: {item.course}</p>
          <p>
            {type === 'tutor' 
              ? `Fecha: ${formatDate(item.start_time)}`
              : `Subido: ${formatDate(item.upload_date)}`
            }
          </p>
          {type === 'tutor' && <p>Ubicación: {item.location}</p>}
        </div>
        <button 
          onClick={() => onViewDetails(item, type)}
          className="action-button primary-button"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

const ProductModal = ({ item, type, isOpen, onClose, onDownload, onSchedule }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {type === 'tutor' ? `Tutoría de ${item.course}` : item.title}
          </h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <img 
            src={type === 'tutor' ? '/tutoring.png' : '/notes.png'}
            alt={type === 'tutor' ? `Tutoría de ${item.course}` : item.title}
            className="modal-image"
          />
          
          <div className="modal-info">
            <h3 className="modal-info-title">Curso</h3>
            <p className="modal-info-content">{item.course}</p>
          </div>

          {type === 'tutor' ? (
            <>
              <div className="modal-info">
                <h3 className="modal-info-title">Descripción</h3>
                <p className="modal-info-content">{item.description}</p>
              </div>
              <div className="modal-info">
                <h3 className="modal-info-title">Ubicación</h3>
                <p className="modal-info-content">{item.location}</p>
              </div>
              <div className="modal-info">
                <h3 className="modal-info-title">Horario</h3>
                <p className="modal-info-content">
                  Inicio: {formatDate(item.start_time)}
                  <br />
                  Fin: {formatDate(item.end_time)}
                </p>
              </div>
              <button 
                className="modal-action schedule-button"
                onClick={() => onSchedule(item)}
              >
                Agendar Tutoría
              </button>
            </>
          ) : (
            <>
              <div className="modal-info">
                <h3 className="modal-info-title">Fecha de subida</h3>
                <p className="modal-info-content">{formatDate(item.upload_date)}</p>
              </div>
              <button 
                className="modal-action download-button"
                onClick={() => onDownload(item)}
              >
                Descargar Apunte
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const MarketplacePage = () => {
  const [products, setProducts] = useState({ notes: [], tutorings: [] });
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    course: '',
    search: ''
  });
  const { user } = useAuth0();
  const {userId} = useUser();

  const fetchProducts = async () => {
    try {
      const [notesRes, tutoringsRes] = await Promise.all([
        fetch('http://localhost:8000/notes/'),
        fetch('http://localhost:8000/tutoring-sessions/future')
        // fetch('https://universitymarketplace-backend.onrender.com/notes/'),
        // fetch('https://universitymarketplace-backend.onrender.com/tutoring-sessions/')
      ]);

      if (!notesRes.ok || !tutoringsRes.ok) throw new Error('Error fetching data');

      const [notes, tutorings] = await Promise.all([
        notesRes.json(),
        tutoringsRes.json()
      ]);

      setProducts({ notes, tutorings });
    } catch (err) {
      setError('Error cargando productos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDownload = async (note) => {
    try {
      // const response = await fetch(`https://universitymarketplace-backend.onrender.com/notes/${note.id}/download`);
      const response = await fetch(`http://localhost:8000/notes/${note.id}/download`);
      if (!response.ok) throw new Error('Error downloading file');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = note.title;
      a.click();
    } catch (err) {
      setError('Error al descargar el archivo');
    }
  };

  const handleSchedule = async (tutoring) => {
    console.log('Id usuario: ', userId);
    if (!userId) {
      setError('Necesitas estar identificado para agendar una tutoría');
      return;
    }

    try {
      // const response = await fetch(`https://universitymarketplace-backend.onrender.com/tutoring-sessions/${tutoring.id}/book`, {
      const response = await fetch(`http://localhost:8000/tutoring-sessions/${tutoring.id}/book?student_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Error al agendar la tutoría');
      }

      setIsModalOpen(false);
      // Recargar las tutorías para actualizar el estado
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredProducts = () => {
    let filtered = [
      ...products.tutorings.map(item => ({ item, type: 'tutor' })),
      ...products.notes.map(item => ({ item, type: 'note' }))
    ];

    // Filtrar por tipo
    if (filters.type !== 'all') {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    // Filtrar por curso
    if (filters.course && typeof filters.course === 'string') {
      filtered = filtered.filter(p => 
        p.item.course && p.item.course.toLowerCase().includes(filters.course.toLowerCase())
      );
    }

    // Filtrar por título (búsqueda simple)
    //if (filters.search && typeof filters.search === 'string' && filters.search.trim()) {
      //filtered = filtered.filter(p => 
        //p.item.title && p.item.title.toLowerCase().includes(filters.search.trim().toLowerCase())
      //);
    //}

    return filtered;
};

  return (
    <div className="marketplace-container">
      <div className="filters-section">
        <select 
          name="type" 
          value={filters.type}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="all">Todos los productos</option>
          <option value="note">Apuntes</option>
          <option value="tutor">Tutorías</option>
        </select>

        <input
          type="text"
          name="course"
          placeholder="Buscar por curso..."
          value={filters.course}
          onChange={handleFilterChange}
          className="filter-input"
        />

        {/* <input
          type="text"
          name="search"
          placeholder="Buscar por título..."
          value={filters.search}
          onChange={handleFilterChange}
          className="filter-input"
        /> */}
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="products-grid">
        {filteredProducts().length > 0 ? (
          filteredProducts().map(({ item, type }) => (
            <ProductCard
              key={`${type}-${item.id}`}
              item={item}
              type={type}
              onViewDetails={() => {
                setSelectedItem(item);
                setSelectedType(type);
                setIsModalOpen(true);
              }}
            />
          ))
        ) : (
          <div className="no-products-message">
            {filters.type === 'note' 
              ? "No hay apuntes disponibles en este momento 😔"
              : filters.type === 'tutor'
              ? "No hay tutorías disponibles en este momento 😔"
              : "No se encontraron productos 😔"}
          </div>
        )}
      </div>

      <ProductModal
        item={selectedItem}
        type={selectedType}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onDownload={handleDownload}
        onSchedule={handleSchedule}
      />
    </div>
  );
};

export default MarketplacePage;