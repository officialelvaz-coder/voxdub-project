import { createElement } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { DashboardLayout } from './layouts/DashboardLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { NewProject } from './pages/NewProject';
import { ProjectProgress } from './pages/ProjectProgress';
import { Delivery } from './pages/Delivery';
import { Artists } from './pages/Artists';
import { ArtistProfile } from './pages/ArtistProfile'; 
import { Reports } from './pages/Reports';
import { Partners } from './pages/Partners';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login'; // 🔴 تأكد من استيراد صفحة اللوجن

export const router = createBrowserRouter([
  {
    path: '/',
    element: createElement(Landing),
  },
  // 🟢 الحل هنا: مسار اللوجن يجب أن يكون مستقلاً تماماً وخارج الـ DashboardLayout
  {
    path: '/login',
    element: createElement(Login),
  },
  {
    path: '/dashboard',
    element: createElement(DashboardLayout),
    children: [
      { index: true, element: createElement(Dashboard) },
      { path: 'projects', element: createElement(Dashboard) },
      { path: 'projects/:id', element: createElement(ProjectProgress) },
      { path: 'new-project', element: createElement(NewProject) },
      { path: 'delivery/:id', element: createElement(Delivery) },
      { path: 'artists', element: createElement(Artists) },
      { path: 'artists/:id', element: createElement(ArtistProfile) }, 
      { path: 'partners', element: createElement(Partners) },
      { path: 'reports', element: createElement(Reports) },
      { path: 'analytics', element: createElement(Analytics) },
      { path: 'notifications', element: createElement(Notifications) },
      { path: 'settings', element: createElement(Settings) },
    ],
  },
  {
    path: '*',
    element: createElement(Navigate, { to: "/", replace: true }),
  },
]);