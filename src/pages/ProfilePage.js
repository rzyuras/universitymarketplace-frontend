import React, { useState } from 'react';
import Profile from '../components/Profile';
import NotesModal from '../components/NotesModal';
import TutoringModal from '../components/TutoringModal';

const ProfilePage = () => {
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isTutoringModalOpen, setIsTutoringModalOpen] = useState(false);

  return (
    <div>
      <Profile />
      <div className="profile-actions">
        <button onClick={() => setIsNotesModalOpen(true)} className="action-button">
          Ver Apuntes Publicados
        </button>
        <button onClick={() => setIsTutoringModalOpen(true)} className="action-button">
          Ver Tutorías Publicadas
        </button>
      </div>
      {isNotesModalOpen && <NotesModal onClose={() => setIsNotesModalOpen(false)} />}
      {isTutoringModalOpen && <TutoringModal onClose={() => setIsTutoringModalOpen(false)} />}
    </div>
  );
};

export default ProfilePage;