import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="table-responsive mb-4">
      <h2>Profile</h2>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th scope="row">Name</th>
            <td>{user.full_name}</td>
          </tr>
          <tr>
            <th scope="row">Email</th>
            <td>{user.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
