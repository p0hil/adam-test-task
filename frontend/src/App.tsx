import { BrowserRouter as Router } from 'react-router';
import { Route, Routes } from 'react-router-dom';
import { Header } from './layout/Header.tsx';
import { Footer } from './layout/Footer.tsx';
import PainterDashboard from './pages/PainterDashboard.tsx';
import BookingsDashboard from './pages/BookingsDashboard.tsx';
import AuthPage from './pages/Auth.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { UserRole } from './types/types.ts';

function App() {
    return (
        <Router>
            <Header />
            <div className="container p-4">
                <Routes>
                    <Route path="/" element={ <AuthPage /> } />
                    <Route path="/painter" element={
                        <ProtectedRoute role={ UserRole.Painter }>
                            <PainterDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/customer" element={
                        <ProtectedRoute role={ UserRole.Customer }>
                            <BookingsDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
