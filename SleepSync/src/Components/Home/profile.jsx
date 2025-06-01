import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import defaultAvatar from '../../assets/default-avatar.png';
import addIcon from '../../assets/add-icon-circle.png';
import './profile.css';

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const user = auth.currentUser;
  const storage = getStorage();

  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    avatarUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.isAnonymous) {
      alert('You must be logged in to access this page.');
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Please upload a JPG or PNG image.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, 'profiles', user.uid);
      let updatedData = { ...profile };

      const completeUpdate = async () => {
        await setDoc(docRef, updatedData);
        setProfile(updatedData);
        setMessage('Info updated!');
        setTimeout(() => setMessage(''), 3000); 
        resetEditState();
      };

      if (selectedFile) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(percent);
          },
          (error) => {
            alert('Image upload failed: ' + error.message);
            setSaving(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updatedData.avatarUrl = downloadURL;
            await completeUpdate();
          }
        );
      } else {
        await completeUpdate();
      }
    } catch (err) {
      setMessage(err.message);
      setSaving(false);
    }
  };

  const resetEditState = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadProgress(0);
    setSaving(false);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (confirmed) {
      await auth.signOut();
      navigate('/login');
    }
  };

  if (!user) return <p role="status">Loading user...</p>;
  if (loading) return <p role="status">Loading profile...</p>;

  const creationDate = new Date(user.metadata.creationTime);
  const formattedDate = creationDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="profile-page">
      <h1>My Account</h1>
      <p className="subtext">Manage your identity and preferences</p>

      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="avatar-section">
            <label htmlFor="avatar-upload" className="avatar-wrapper">
              <img
                src={previewUrl || profile.avatarUrl || defaultAvatar}
                alt="User avatar"
                className="avatar-img"
              />
              {isEditing && (
                <>
                  <img src={addIcon} alt="Upload new avatar" className="avatar-edit-icon" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                    hidden
                  />
                </>
              )}
            </label>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <p className="upload-progress" role="status">
                Uploading: {uploadProgress.toFixed(0)}%
              </p>
            )}
          </div>

          <div className="profile-details">
            {isEditing ? (
              <>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Full Name"
                />
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Username"
                />
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us a bit about yourself"
                />
              </>
            ) : (
              <>
                <h2>{profile.name || 'No Name'}</h2>
                <p className="username">@{profile.username || 'username'}</p>
                <p>Member since: {formattedDate}</p>
                {profile.bio && <p className="bio">{profile.bio}</p>}
              </>
            )}
          </div>

          <div className="edit-btn-wrapper">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="edit-btn"
                disabled={saving || (uploadProgress > 0 && uploadProgress < 100)}
              >
                Save
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="profile-footer-card">
            <p>
              <strong>Last login:</strong> {new Date(user.metadata.lastSignInTime).toLocaleString()}
            </p>
            <p>
              <strong>User ID:</strong> {user.uid}
            </p>
          </div>
        )}

        <div className="logout-wrapper">
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      {/* Floating Message */}
      {message && (
        <div className="floating-message" role="alert">
          {message}
        </div>
      )}
    </div>
  );
}
