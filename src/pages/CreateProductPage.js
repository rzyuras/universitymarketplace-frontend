import React, { useState } from 'react';
import './CreateProductStyles.css';

const CreateProductPage = () => {
  const [productType, setProductType] = useState('note'); // 'note' o 'tutoring'
  const [formData, setFormData] = useState({
    // Campos comunes
    course: '',
    
    // Campos para notas
    title: '',
    file: null,
    
    // Campos para tutorías
    description: '',
    location: '',
    start_time: '',
    end_time: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar al backend
    console.log('Form submitted:', formData);
  };

  return (
    <div className="create-product-container">
      <h1>Crear Nuevo Producto</h1>
      
      <div className="product-type-selector">
        <button 
          className={`type-button ${productType === 'note' ? 'active' : ''}`}
          onClick={() => setProductType('note')}
        >
          Apunte
        </button>
        <button 
          className={`type-button ${productType === 'tutoring' ? 'active' : ''}`}
          onClick={() => setProductType('tutoring')}
        >
          Tutoría
        </button>
      </div>

      <form onSubmit={handleSubmit} className="create-product-form">
        {/* Campo común */}
        <div className="form-group">
          <label>Curso:</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleInputChange}
            required
          />
        </div>

        {productType === 'note' ? (
          // Campos específicos para apuntes
          <>
            <div className="form-group">
              <label>Título:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Archivo:</label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
              />
            </div>
          </>
        ) : (
          // Campos específicos para tutorías
          <>
            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ubicación:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha y hora de inicio:</label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Fecha y hora de fin:</label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="submit-button">
          Crear {productType === 'note' ? 'Apunte' : 'Tutoría'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;