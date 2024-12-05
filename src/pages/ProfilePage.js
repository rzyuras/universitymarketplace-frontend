import React, { useState } from 'react';
import Profile from '../components/ProfilePageComponents/Profile';
import NotesModal from '../components/ProfilePageComponents/NotesModal';
import TutoringModal from '../components/ProfilePageComponents/TutoringModal';
import BookedTutoringModal from '../components/ProfilePageComponents/BookedTutoringModal';

const ProfilePage = () => {
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isTutoringModalOpen, setIsTutoringModalOpen] = useState(false);
  const [isBookedTutoringModalOpen, setIsBookedTutoringModalOpen] = useState(false);

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
        <button onClick={() => setIsBookedTutoringModalOpen(true)} className="action-button">
          Ver Tutorías Agendadas
        </button>
      </div>
      {isNotesModalOpen && <NotesModal onClose={() => setIsNotesModalOpen(false)} />}
      {isTutoringModalOpen && <TutoringModal onClose={() => setIsTutoringModalOpen(false)} />}
      {isBookedTutoringModalOpen && <BookedTutoringModal onClose={() => setIsBookedTutoringModalOpen(false)} />}
    </div>
  );
};

export default ProfilePage;