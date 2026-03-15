import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import "../styles/profile.css";

function Profile({ user }) {

if (!user) {
  return <div>Loading profile...</div>;
}

const logout = async () => {

  await signOut(auth);

  window.location.reload();

};

return (

<div className="profile-container">

<div className="profile-card">

<img
src={user.photoURL || "https://i.pravatar.cc/150"}
alt="profile"
/>

<h2>{user.displayName || "User"}</h2>

<p>{user.email}</p>

<button
className="logout-btn"
onClick={logout}
>
Logout
</button>

</div>

</div>

);

}

export default Profile;