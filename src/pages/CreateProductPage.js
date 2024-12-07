import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import {useUser} from '../components/hooks/useUser';
import './CreateProductStyles.css';
import Select from 'react-select';

const CreateProductPage = () => {
  const userId = useUser();
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [productType, setProductType] = useState('note');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course: '',
    title: '',
    file: null,
    description: '',
    location: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/classes/');
        if (!response.ok) throw new Error('Error al cargar cursos');
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError('Error al cargar los cursos');
      }
    };
  
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({...prev, file: e.target.files[0]}));
  };

  console.log('ID del usuario a publicar:', {userId});

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Usuario a publicar', userId)

    if (!userId) {
      setError('Error: Usuario no identificado');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (productType === 'note') {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('course', formData.course);
        formDataToSend.append('file', formData.file);
        formDataToSend.append('owner_id', userId.userId);
      
        // const response = await fetch(`https://universitymarketplace-backend.onrender.com/notes/`, {
        //   method: 'POST',
        //   body: formDataToSend,
        // });

        const response = await fetch(`http://localhost:8000/notes/`, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.status === 413) {
          throw new Error('Archivo demasiado grande');
        }
      
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Error al crear el apunte');
        }
      } else {
        const tutoringData = {
          course: formData.course,
          start_time: formData.start_time,
          end_time: formData.end_time,
          description: formData.description,
          location: formData.location
        };

        const response = await fetch(`http://localhost:8000/tutoring-sessions/?tutor_id=${userId.userId}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(tutoringData)
        });

        if (!response.ok) throw new Error('Error al crear la tutoría');
      }

      navigate('/marketplace');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="create-product-form">
        <div className="form-group">
          <label>Curso:</label>
          <Select
            options={courses.map(course => ({
              value: course.name,
              label: `${course.code} - ${course.name}`
            }))}
            value={{ value: formData.course, label: courses.find(c => c.name === formData.course)?.name }}
            onChange={(option) => handleInputChange({
              target: { name: 'course', value: option.value }
            })}
            placeholder="Busca un curso..."
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        {productType === 'note' ? (
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
            <div className="form-group file-input-group">
              <label>Archivo:</label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
              />
              {formData.file && (
                <div className="selected-file">
                  Archivo seleccionado: {formData.file.name}
                </div>
              )}
            </div>
          </>
        ) : (
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

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : `Crear ${productType === 'note' ? 'Apunte' : 'Tutoría'}`}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;