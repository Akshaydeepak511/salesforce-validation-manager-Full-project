import { useState } from 'react';
import axios from 'axios';

function App() {

  const [rules, setRules] = useState([]);
  const [username, setUsername] = useState('');

  const BACKEND_URL =
    'https://salesforce-validation-manager-backend.onrender.com';

  const login = () => {

    window.location.href =
      `${BACKEND_URL}/auth/salesforce`;
  };

  const getUserInfo = async () => {

    try {

      const response = await axios.get(
        `${BACKEND_URL}/user-info`
      );

      setUsername(response.data.username);

    } catch (error) {

      console.log(error);
    }
  };

  const getRules = async () => {

    try {

      const response = await axios.get(
        `${BACKEND_URL}/validation-rules`
      );

      setRules(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const toggleRule = async (rule) => {

    try {

      const fullName =
        `${rule.EntityDefinition.QualifiedApiName}.${rule.ValidationName}`;

      await axios.post(
        `${BACKEND_URL}/toggle-validation-rule`,
        {
          fullName: fullName,
          active: !rule.Active
        }
      );

      getRules();

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="container mt-5">

      <h1 className="mb-4 text-center">
        Salesforce Validation Rule Manager
      </h1>

      <div className="mb-3">

        <button
          className="btn btn-primary me-3"
          onClick={login}
        >
          Login with Salesforce
        </button>

        <button
          className="btn btn-info me-3"
          onClick={getUserInfo}
        >
          Get User Info
        </button>

        <button
          className="btn btn-success"
          onClick={getRules}
        >
          Get Validation Rules
        </button>

      </div>

      {username && (

        <div className="alert alert-success">

          Logged in as:
          <strong> {username}</strong>

        </div>

      )}

      <table className="table table-bordered table-hover">

        <thead className="table-dark">

          <tr>
            <th>Validation Rule</th>
            <th>Status</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {rules.map((rule) => (

            <tr key={rule.Id}>

              <td>{rule.ValidationName}</td>

              <td>

                {rule.Active ? (
                  <span className="text-success">
                    Active
                  </span>
                ) : (
                  <span className="text-danger">
                    Inactive
                  </span>
                )}

              </td>

              <td>

                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => toggleRule(rule)}
                >

                  {rule.Active ? 'Disable' : 'Enable'}

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;