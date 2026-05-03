import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ui/ProtectedRoute';

import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ExplorePage } from './pages/ExplorePage';
import { CommunityPage } from './pages/CommunityPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

import { MyTripsPage } from './pages/MyTripsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CreateTripPage } from './pages/CreateTripPage';

import { TripDashboardLayout } from './components/trips/TripDashboardLayout';
import { TripDetailsPage } from './pages/TripDetailsPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { TransportPage } from './pages/TransportPage';
import { CalendarPage } from './pages/CalendarPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { TasksPage } from './pages/TasksPage';
import { BudgetPage } from './pages/BudgetPage';
import { StorytellingPage } from './pages/StorytellingPage';
import { RoutePage } from './pages/RoutesPage';
import { PublicTripPage } from './pages/PublicTripPage';
import { ReviewsPage } from './pages/ReviewsPage';


const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                
                <main className="min-h-screen pt-16 bg-[#eaf4f4]">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/community" element={<CommunityPage />} />
                        <Route path="/community/trip/:id" element={<PublicTripPage />} /> 
                        <Route path="/routes/:id" element={<RoutePage />} />
                        <Route path="/user/:id" element={<PublicProfilePage />} />
                        <Route path="/verify-email" element={<VerifyEmailPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/my-trips" element={<MyTripsPage />} />
                            <Route path="/create-trip" element={<CreateTripPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            
                            <Route path="/trip/:id" element={<TripDashboardLayout />}>
                                <Route index element={<TripDetailsPage />} />
                                
                                <Route path="itinerary" element={<ItineraryPage />} />
                                <Route path="transport" element={<TransportPage />} />
                                <Route path="discover" element={<DiscoverPage />} />
                                <Route path="calendar" element={<CalendarPage />} />
                                <Route path="tasks" element={<TasksPage />} />
                                <Route path="budget" element={<BudgetPage />} />
                                <Route path="storytelling" element={<StorytellingPage />} />
                                <Route path="reviews" element={<ReviewsPage />} />
                            </Route>
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;