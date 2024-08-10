import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CurrentUser } from '../contexts/CurrentUser';

function LoginForm() {
    const history = useHistory();
    const { setCurrentUser } = useContext(CurrentUser);

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5001/authentication/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {  // Check if the response status is OK
                setCurrentUser(data.user);  // Set the current user from response data
                console.log(data.token); // Log the token if needed
                history.push('/');  // Redirect to home page or appropriate route
            } else {
                setErrorMessage(data.message);  // Set error message from response data
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred.');  // Generic error message
            console.error('Login error:', error);  // Log error for debugging
        }
    }

    return (
        <main>
            <h1>Login</h1>
            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm-6 form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            required
                            value={credentials.email}
                            onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                            className="form-control"
                            id="email"
                            name="email"
                        />
                    </div>
                    <div className="col-sm-6 form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            required
                            value={credentials.password}
                            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                            className="form-control"
                            id="password"
                            name="password"
                        />
                    </div>
                </div>
                <button className="btn btn-primary" type="submit">Login</button>
            </form>
        </main>
    );
}

export default LoginForm;

