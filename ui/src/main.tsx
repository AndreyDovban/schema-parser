import './styles/index.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import {
	Attributes,
	ObjectClasses,
	Builder,
	Home,
	AciConstructor,
	Permissions,
	EffectiveRights,
	LdapBrowser,
} from '@/pages';
// import { RecoilRoot } from 'recoil';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/attributes',
		element: <Attributes />,
	},
	{
		path: '/objectclasses',
		element: <ObjectClasses />,
	},
	{
		path: '/builder',
		element: <Builder />,
	},
	{
		path: '/aciconstructor',
		element: <AciConstructor />,
	},
	{
		path: '/permissions',
		element: <Permissions />,
	},
	{
		path: '/geteffectiverights',
		element: <EffectiveRights />,
	},
	{
		path: '/ldapbrowser',
		element: <LdapBrowser />,
	},
]);

const root = document.getElementById('root');

ReactDOM.createRoot(root as HTMLElement).render(<RouterProvider router={router} />);
