import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';
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
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
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
        setEmail(user.email);
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
    if (newPassword && newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const docRef = doc(db, 'profiles', user.uid);
      let updatedData = { ...profile };

      const completeUpdate = async () => {
        await setDoc(docRef, updatedData);
        setProfile(updatedData);

        if (email !== user.email) {
          await updateEmail(user, email);
        }

        if (newPassword) {
          await updatePassword(user, newPassword);
        }

        setMessage('Info updated!');
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
    setNewPassword('');
    setConfirmPassword('');
    setSaving(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  if (!user) return <p>Loading user...</p>;
  if (loading) return <p>Loading profile...</p>;

  const creationDate = new Date(user.metadata.creationTime);
  const formattedDate = creationDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="profile-page">
      <div className="profile-wrapper">
        <h1>My Account</h1>
        <p className="subtext">Manage your identity and preferences</p>

        <div className="profile-card">
          <div className="avatar-section">
            <label htmlFor="avatar-upload" className="avatar-wrapper">
              <img
                src={previewUrl || profile.avatarUrl || defaultAvatar}
                alt="Avatar"
                className="avatar-img"
              />
              {isEditing && (
                <>
                  <img src={addIcon} alt="Edit" className="avatar-edit-icon" />
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
              <p className="upload-progress">Uploading: {uploadProgress.toFixed(0)}%</p>
            )}
          </div>

          <div className="profile-details">
            {isEditing ? (
              <>
                <label>Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Full Name"
                />
                <label>Username</label>
                <input
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Username"
                />
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <label>Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
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
              <button
                onClick={() => setIsEditing(true)}
                className="edit-btn"
              >
                Edit Profile
              </button>
            )}
          </div>
          {message && <p className="success-msg">{message}</p>}
        </div>

        {!isEditing && (
          <div className="profile-footer">
            <p><strong>Last login:</strong> {new Date(user.metadata.lastSignInTime).toLocaleString()}</p>
            <p><strong>User ID:</strong> {user.uid}</p>
          </div>
        )}
      </div>

      {/* logout*/}
      <button className="logout-btn" onClick={handleLogout}>Log Out</button>
    </div>
  );
}
