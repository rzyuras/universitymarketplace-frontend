import React, { useState } from 'react';
import axios from 'axios';

const TutoringSessions = ({ tutorId }) => {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const now = new Date();
  
      // Generate random date for next year (2025)
      const getRandomDate = () => {
        const startOf2025 = new Date(2025, 0, 1);
        const endOf2025 = new Date(2025, 11, 31);
        
        const randomTimestamp = startOf2025.getTime() + Math.random() * (endOf2025.getTime() - startOf2025.getTime());
        
        const randomDate = new Date(randomTimestamp);
        
        randomDate.setHours(9 + Math.floor(Math.random() * 8));
        randomDate.setMinutes(Math.floor(Math.random() * 60));
        randomDate.setSeconds(0);
        randomDate.setMilliseconds(0);
        
        return randomDate;
      };
      
      const toNaiveISOString = (date) => {
        return date.getFullYear() + '-' +
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0') + 'T' +
          String(date.getHours()).padStart(2, '0') + ':' +
          String(date.getMinutes()).padStart(2, '0') + ':' +
          String(date.getSeconds()).padStart(2, '0');
      };
      
      const sessionStart = getRandomDate();
      const sessionEnd = new Date(sessionStart);
      sessionEnd.setHours(sessionEnd.getHours() + 1); // Cambiado de 10 a 1 hora
      
      const sessionData = {
        course: "Test Course",
        start_time: toNaiveISOString(sessionStart),
        end_time: toNaiveISOString(sessionEnd),
        description: "Test session",
        location: "Online"
      };
      
      console.log('Sending data:', sessionData);
      const params = new URLSearchParams({ tutor_id: 1 });
  
      // Usar la respuesta de Axios directamente
      const response = await axios.post(
        `http://localhost:8000/tutoring-sessions/?${params}`, 
        sessionData
      );
  
      // Axios ya parsea la respuesta JSON automáticamente
      console.log('Created session:', response.data);
      setSessions(prev => [...prev, response.data]);
      setShowForm(false);
  
    } catch (error) {
      console.error('Error creating session:', error);
      // Mejorar el mensaje de error
      alert('Error creating session: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tutoring Sessions</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'Create New Session'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Create New Session</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Test Session
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{session.course}</h3>
                {session.is_booked && (
                  <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                    Booked
                  </span>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <span>
                    {new Date(session.start_time).toLocaleString()} - 
                    {new Date(session.end_time).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-600">{session.description}</p>
                <p className="text-sm font-medium">Location: {session.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutoringSessions;