import { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useHref, NavigateOptions } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import { AuthGuard } from './guards/AuthGuard';
import Layout from './layouts/Layout';
import SimpleLayout from './layouts/SimpleLayout';
import AuthLayout from './layouts/AuthLayout';
import All from './pages/All';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Settings from './pages/Settings';
import Home from './pages/Home';
import { FallbackSpinner } from './components/FallbackSpinner';
import MainLayout from './layouts/MainLayout';
import EmailSent from './pages/Auth/EmailSent';
import ErrorPage from './pages/ErrorPage';
import EmailVerified from './pages/Auth/EmailVerified';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
const Box = lazy(() => import('./pages/Box'));
const Thread = lazy(() => import('./pages/Thread'));
const User = lazy(() => import('./pages/User'));
const Search = lazy(() => import('./pages/Search'));

declare module "@react-types/shared" {
    interface RouterConfig {
      routerOptions: NavigateOptions;
    }
}

function App() {
    const navigate = useNavigate();

    return (
        <HeroUIProvider navigate={navigate} useHref={useHref}>
            <Routes>
                <Route element={
                    <AuthGuard>
                        <Layout>
                            <MainLayout/>
                        </Layout>
                    </AuthGuard>
                }>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/all" element={<All/>}/>
                    
                </Route>
                <Route element={
                    <AuthGuard>
                        <Layout>
                            <MainLayout showBoxInformation/>
                        </Layout>
                    </AuthGuard>
                }>
                    <Route path="/box/:id" element={<Suspense fallback={<FallbackSpinner/>}><Box/></Suspense>}/>
                    <Route path="/box/:id/:page" element={<Suspense fallback={<FallbackSpinner/>}><Box/></Suspense>}/>
                    <Route path="/thread/:id" element={<Suspense fallback={<FallbackSpinner/>}><Thread/></Suspense>}/>
                    <Route path="/thread/:id/:page" element={<Suspense fallback={<FallbackSpinner/>}><Thread/></Suspense>}/>
                </Route>
                <Route element={
                    <AuthGuard>
                        <Layout searchDisabled/>
                    </AuthGuard>
                }>
                    <Route path="/settings" element={<Settings/>}/>
                    <Route path="/user/:id" element={<Suspense fallback={<FallbackSpinner/>}><User/></Suspense>}/>
                </Route>
                <Route element={
                    <AuthGuard>
                        <Layout/>
                    </AuthGuard>
                }>
                    <Route path="/search/:page" element={<Suspense fallback={<FallbackSpinner/>}><Search/></Suspense>}/>
                </Route>
                <Route element={
                    <AuthGuard reverse>
                        <AuthLayout className='bg-forus-tertiary'/>
                        </AuthGuard>
                }>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/email_sent' element={<EmailSent/>}/>
                    <Route path='/email_verified' element={<EmailVerified/>}/>
                    <Route path='/forgot_password' element={<ForgotPassword/>}/>
                    <Route path='/reset_password' element={<ResetPassword/>}/>
                </Route>
                <Route element={<SimpleLayout hideHeader hideToast/>}>
                    <Route path='/403' element={<ErrorPage code={403} message="Forbidden" hideGoBack/>}/>
                    <Route path='*' element={<ErrorPage code={404} message="Page not found"/>}/>
                </Route>
            </Routes>
        </HeroUIProvider>
    );
}

export default App;
