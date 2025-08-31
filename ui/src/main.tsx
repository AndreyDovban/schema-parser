import './styles/index.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Attributes, ObjectClasses, Builder } from '@/pages';

const router = createBrowserRouter([
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
]);

const root = document.getElementById('root');

ReactDOM.createRoot(root as HTMLElement).render(<RouterProvider router={router} />);
