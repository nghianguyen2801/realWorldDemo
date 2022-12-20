import React from 'react';

interface IRoute {
  path: string;
  name: string;
  element: React.LazyExoticComponent<() => JSX.Element>;
}
// Base
const Home = React.lazy(() => import('./views/PageHome'))
const Login = React.lazy(() => import('./views/PageLogin'))
const Register = React.lazy(() => import('./views/PageRegister'))
const Profile = React.lazy(() => import('./views/PageProfile'))
const Settings = React.lazy(() => import('./views/PageSettings'))
const Article = React.lazy(() => import('./views/PageArticle'))
const UpdateArticle = React.lazy(() => import('./views/PageUpdateArticle'))


const routes: IRoute[] = [
  { path: '/', name: 'Home', element: Home },
  { path: 'login', name: 'Login', element: Login },
  { path: 'register', name: 'Register', element: Register },
  { path: 'profile/:username', name: 'Profile', element: Profile },
  { path: 'settings', name: 'Settings', element: Settings },
  { path: 'article/:articleSlug', name: 'Article', element: Article },
  { path: 'create-article', name: 'CreateArticle', element: UpdateArticle },
  { path: 'edit-article/:articleSlug', name: 'EditArticle', element: UpdateArticle },

]

export default routes
