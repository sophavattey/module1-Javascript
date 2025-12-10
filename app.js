import { fetchRandomUser } from "./api.js";
import { 
  getProfiles, 
  addProfile, 
  updateProfile, 
  deleteProfile, 
  getProfileById 
} from "./storage.js";

const newUserBtn = document.getElementById("newUserBtn");
const fetchRandomBtn = document.getElementById("fetchRandomBtn");
const saveUserBtn = document.getElementById("saveUserBtn");
const editCurrentBtn = document.getElementById("editCurrentBtn");
const uploadAvatarBtn = document.getElementById("uploadAvatarBtn");
const uploadAvatarInput = document.getElementById("uploadAvatarInput");
const userImage = document.getElementById("userImage");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userPhone = document.getElementById("userPhone");
const userCompany = document.getElementById("userCompany");
const profilesGrid = document.getElementById("profilesGrid");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const profileForm = document.getElementById("profileForm");
const cancelBtn = document.getElementById("cancelBtn");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const phoneInput = document.getElementById("phoneInput");
const companyInput = document.getElementById("companyInput");
const avatarInput = document.getElementById("avatarInput");
const avatarFileInput = document.getElementById("avatarFileInput");

let currentUser = null;
let editingId = null;

// Handle file upload and convert to base64
const handleFileUpload = async (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const handleUploadAvatar = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    showToast("Uploading avatar...", 1000);
    const base64Image = await handleFileUpload(file);
    
    if (currentUser) {
      currentUser = { ...currentUser, avatar: base64Image };
      displayCurrentUser(currentUser);
      showToast("Avatar uploaded successfully");
    }
  } catch (err) {
    showToast(`Error: ${err.message}`);
  }
  uploadAvatarInput.value = '';
};

const handleAvatarFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const base64Image = await handleFileUpload(file);
    avatarInput.value = base64Image;
    showToast("Image loaded", 1000);
  } catch (err) {
    showToast(`Error: ${err.message}`);
  }
};

const loadRandomUser = async () => {
  try {
    showToast("Fetching random user...", 1000);
    const userData = await fetchRandomUser();
    currentUser = { ...userData };
    displayCurrentUser(currentUser);
    showToast("User loaded successfully");
  } catch (err) {
    showToast(`Error: ${err.message}`);
  }
};

const displayCurrentUser = (user) => {
  if (!user) return;
  userImage.src = user.avatar || "https://via.placeholder.com/200";
  userName.textContent = user.name || "No name";
  userEmail.textContent = user.email || "-";
  userPhone.textContent = user.phone || "-";
  userCompany.textContent = user.company || "-";
  saveUserBtn.disabled = false;
  editCurrentBtn.disabled = false;
};

const handleSaveUser = () => {
  if (!currentUser) {
    showToast("No user to save");
    return;
  }
  const saved = addProfile(currentUser);
  renderProfiles();
  showToast("Profile saved successfully");
};

const renderProfiles = () => {
  const profiles = getProfiles();
  profilesGrid.innerHTML = "";
  
  if (profiles.length === 0) {
    profilesGrid.innerHTML = `<div class="empty-state">No profiles yet. Create or fetch one!</div>`;
    return;
  }

  profiles.forEach(profile => {
    const card = document.createElement("div");
    card.className = "cardProfile";

    const img = document.createElement("img");
    img.src = profile.avatar || "https://via.placeholder.com/100";
    img.alt = profile.name;

    const name = document.createElement("div");
    name.className = "profile-name";
    name.textContent = profile.name;

    const email = document.createElement("div");
    email.className = "profile-email";
    email.textContent = profile.email;

    const actions = document.createElement("div");
    actions.className = "profile-actions";

    const viewBtn = document.createElement("button");
    viewBtn.className = "small-btn view";
    viewBtn.textContent = "View";
    viewBtn.addEventListener("click", () => handleViewProfile(profile.id));

    const editBtn = document.createElement("button");
    editBtn.className = "small-btn edit";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => handleEditProfile(profile.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "small-btn delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => handleDeleteProfile(profile.id));

    actions.appendChild(viewBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(email);
    card.appendChild(actions);

    profilesGrid.appendChild(card);
  });
};

const handleViewProfile = (id) => {
  const profile = getProfileById(id);
  if (profile) {
    currentUser = { ...profile };
    displayCurrentUser(currentUser);
    showToast("Profile loaded");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleEditProfile = (id) => {
  const profile = getProfileById(id);
  if (!profile) return;
  
  editingId = id;
  modalTitle.textContent = "Edit Profile";
  nameInput.value = profile.name || "";
  emailInput.value = profile.email || "";
  phoneInput.value = profile.phone || "";
  companyInput.value = profile.company || "";
  avatarInput.value = profile.avatar || "";
  
  modal.classList.remove("hidden");
};

const handleEditCurrent = () => {
  if (!currentUser) {
    showToast("No user to edit");
    return;
  }
  
  editingId = null;
  modalTitle.textContent = "Edit Current User";
  nameInput.value = currentUser.name || "";
  emailInput.value = currentUser.email || "";
  phoneInput.value = currentUser.phone || "";
  companyInput.value = currentUser.company || "";
  avatarInput.value = currentUser.avatar || "";
  
  modal.classList.remove("hidden");
};

const handleDeleteProfile = (id) => {
  if (confirm("Are you sure you want to delete this profile?")) {
    deleteProfile(id);
    renderProfiles();
    showToast("Profile deleted");
  }
};

const handleCreateProfile = () => {
  editingId = null;
  modalTitle.textContent = "Create Profile";
  profileForm.reset();
  modal.classList.remove("hidden");
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  
  const formData = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    company: companyInput.value,
    avatar: avatarInput.value || `https://ui-avatars.com/api/?name=${encodeURIComponent(nameInput.value)}&size=200`
  };

  if (editingId) {
    const updated = updateProfile(editingId, formData);
    showToast("Profile updated");
    
    if (currentUser && currentUser.id === editingId) {
      currentUser = { ...updated };
      displayCurrentUser(currentUser);
    }
  } else if (currentUser && !currentUser.id) {
    currentUser = { ...currentUser, ...formData };
    displayCurrentUser(currentUser);
    showToast("Current user updated");
  } else {
    const newProfile = addProfile(formData);
    currentUser = { ...newProfile };
    displayCurrentUser(currentUser);
    showToast("Profile created");
  }

  renderProfiles();
  closeModal();
};

const closeModal = () => {
  modal.classList.add("hidden");
  profileForm.reset();
  editingId = null;
};

const showToast = (message, duration = 2000) => {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
};

newUserBtn.addEventListener("click", handleCreateProfile);
fetchRandomBtn.addEventListener("click", loadRandomUser);
saveUserBtn.addEventListener("click", handleSaveUser);
editCurrentBtn.addEventListener("click", handleEditCurrent);
uploadAvatarBtn.addEventListener("click", () => uploadAvatarInput.click());
uploadAvatarInput.addEventListener("change", handleUploadAvatar);
avatarFileInput.addEventListener("change", handleAvatarFileChange);
cancelBtn.addEventListener("click", closeModal);
profileForm.addEventListener("submit", handleFormSubmit);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

(async () => {
  await loadRandomUser();
  renderProfiles();
})();