import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from './guards/AuthGuard';
import Layout from './layouts/Layout';
import SimpleLayout from './layouts/SimpleLayout';
import Forbidden from './pages/Forbidden';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Auth/Register';
import Settings from './pages/Settings';

function App() {

    return (
        <Routes>
            <Route path="/" element={
                <AuthGuard>
                    <Layout/>
                </AuthGuard>
            }>
                <Route index element={<Home/>}/>
            </Route>
            <Route element={
                <AuthGuard>
                    <Layout searchDisabled/>
                </AuthGuard>
            }>
                <Route path="/settings" element={<Settings/>}/>
            </Route>
            <Route element={<SimpleLayout header={false} className='bg-tertiary'/>}>
                <Route path='/login' element={
                    <AuthGuard reverse>
                        <Login/>
                    </AuthGuard>
                }/>
                <Route path='/register' element={<Register/>}/>
            </Route>
            <Route element={<SimpleLayout header={false}/>}>
              <Route path='/403' element={<Forbidden/>}/>
              <Route path='*' element={<NotFound/>}/>
            </Route>
        </Routes>
    );
}

export default App;
