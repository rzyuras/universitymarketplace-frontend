import React, { useState } from 'react';
import './MarketplaceStyles.css';

const mockTutors = [
  {
    'course': 'Mathematics',
    'start_time': '2024-11-10T12:49:37.365260',
    'end_time': '2024-11-10T13:49:37.365260',
    'description': 'Clases de cálculo diferencial e integral. Preparación para exámenes y ayuda con tareas.',
    'location': 'Library Room 1',
    'id': 1,
    'tutor_id': 1,
    'student_id': null,
    'is_booked': false
  },
  {
    'course': 'Physics',
    'start_time': '2024-11-11T14:00:00.000000',
    'end_time': '2024-11-11T15:30:00.000000',
    'description': 'Tutoría de física mecánica. Enfoque en cinemática y dinámica.',
    'location': 'Library Room 2',
    'id': 2,
    'tutor_id': 2,
    'student_id': null,
    'is_booked': false
  },
  {
    'course': 'Chemistry',
    'start_time': '2024-11-12T10:00:00.000000',
    'end_time': '2024-11-12T11:30:00.000000',
    'description': 'Química orgánica: nomenclatura y reacciones principales.',
    'location': 'Science Building 305',
    'id': 3,
    'tutor_id': 3,
    'student_id': null,
    'is_booked': false
  },
  {
    'course': 'Programming',
    'start_time': '2024-11-13T15:00:00.000000',
    'end_time': '2024-11-13T16:30:00.000000',
    'description': 'Introducción a Python y estructuras de datos básicas.',
    'location': 'Online',
    'id': 4,
    'tutor_id': 4,
    'student_id': null,
    'is_booked': false
  },
  {
    'course': 'Statistics',
    'start_time': '2024-11-14T11:00:00.000000',
    'end_time': '2024-11-14T12:30:00.000000',
    'description': 'Estadística descriptiva y probabilidad básica.',
    'location': 'Math Building 201',
    'id': 5,
    'tutor_id': 5,
    'student_id': null,
    'is_booked': false
  },
  {
    'course': 'Biology',
    'start_time': '2024-11-15T13:00:00.000000',
    'end_time': '2024-11-15T14:30:00.000000',
    'description': 'Biología celular y molecular. Preparación para examen final.',
    'location': 'Science Lab 102',
    'id': 6,
    'tutor_id': 6,
    'student_id': null,
    'is_booked': false
  },
  {
    'course': 'Calculus',
    'start_time': '2024-11-16T09:00:00.000000',
    'end_time': '2024-11-16T10:30:00.000000',
    'description': 'Cálculo multivariable y aplicaciones.',
    'location': 'Online',
    'id': 7,
    'tutor_id': 7,
    'student_id': null,
    'is_booked': false
  }
];

// Datos de apuntes
const mockNotes = [
  {
    'title': 'Advanced Math Notes',
    'course': 'Mathematics',
    'id': 1,
    'file_path': 'uploads/notes/math_advanced.pdf',
    'upload_date': '2024-11-09T15:36:27.528716',
    'owner_id': 1
  },
  {
    'title': 'Chemistry Lab Guide',
    'course': 'Chemistry',
    'id': 2,
    'file_path': 'uploads/notes/chem_lab.pdf',
    'upload_date': '2024-11-09T14:30:00.000000',
    'owner_id': 2
  },
  {
    'title': 'Physics Mechanics Summary',
    'course': 'Physics',
    'id': 3,
    'file_path': 'uploads/notes/physics_mech.pdf',
    'upload_date': '2024-11-08T10:15:00.000000',
    'owner_id': 3
  },
  {
    'title': 'Programming in Python Guide',
    'course': 'Programming',
    'id': 4,
    'file_path': 'uploads/notes/python_guide.pdf',
    'upload_date': '2024-11-07T16:45:00.000000',
    'owner_id': 4
  },
  {
    'title': 'Statistics Formulas',
    'course': 'Statistics',
    'id': 5,
    'file_path': 'uploads/notes/stats_formulas.pdf',
    'upload_date': '2024-11-06T11:20:00.000000',
    'owner_id': 5
  },
  {
    'title': 'Biology Cell Structure',
    'course': 'Biology',
    'id': 6,
    'file_path': 'uploads/notes/bio_cell.pdf',
    'upload_date': '2024-11-05T09:30:00.000000',
    'owner_id': 6
  },
  {
    'title': 'Calculus Integration Techniques',
    'course': 'Mathematics',
    'id': 7,
    'file_path': 'uploads/notes/calc_integration.pdf',
    'upload_date': '2024-11-04T14:15:00.000000',
    'owner_id': 7
  },
  {
    'title': 'Organic Chemistry Reactions',
    'course': 'Chemistry',
    'id': 8,
    'file_path': 'uploads/notes/organic_chem.pdf',
    'upload_date': '2024-11-03T13:45:00.000000',
    'owner_id': 8
  },
  {
    'title': 'Data Structures Notes',
    'course': 'Programming',
    'id': 9,
    'file_path': 'uploads/notes/data_structures.pdf',
    'upload_date': '2024-11-02T15:30:00.000000',
    'owner_id': 9
  }
];

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

const ProductModal = ({ item, type, isOpen, onClose }) => {
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
              <button className="modal-action schedule-button">
                Agendar Tutoría
              </button>
            </>
          ) : (
            <>
              <div className="modal-info">
                <h3 className="modal-info-title">Fecha de subida</h3>
                <p className="modal-info-content">{formatDate(item.upload_date)}</p>
              </div>
              <button className="modal-action download-button">
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const allProducts = [
    ...mockTutors.map(item => ({ item, type: 'tutor' })),
    ...mockNotes.map(item => ({ item, type: 'note' }))
  ];

  return (
    <div className="marketplace-container">
      
      <div className="products-grid">
        {allProducts.map(({ item, type }) => (
          <ProductCard
            key={`${type}-${item.id}`}
            item={item}
            type={type}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      <ProductModal
        item={selectedItem}
        type={selectedType}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default MarketplacePage;