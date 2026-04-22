
import { Link } from 'react-router-dom'
// import { NavLink } from 'react-router-dom';
import Button from './Button'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-2">Page not found</p>
      {/* <NavLink to="/login" className="mt-4">
        <Button>Go Home</Button>
      </NavLink> */}
      <Link to="/" className="mt-4">
        <Button>Go Home</Button>
      </Link>
    </div>
  )
}

export default NotFound;