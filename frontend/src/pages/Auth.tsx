import React, { useState } from 'react';
import { useUserStore } from '../stores/userStore.ts';
import { useApi } from '../hooks/useApi.ts';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types/types.ts';

const AuthPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>();
    const navigate = useNavigate();

    const api = useApi();

    const setUser = useUserStore((state) => state.setUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);

        try {
            const user = await api.logIn(email, password);

            const token = user.token!;
            delete user.token;
            setUser(token, user);

            navigate(user.role === UserRole.Customer ? '/customer' : '/painter')
        }
        catch (e) {
            // Super simple error processing
            setError(e instanceof Error ? e.message : 'Something went wrong');
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="w-100" style={{ maxWidth: 400 }}>
                <h2 className="mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    { error && <div className="alert alert-danger">{error}</div> }

                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
