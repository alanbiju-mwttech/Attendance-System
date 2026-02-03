import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import Regularize from './Components/Regularize';
import ReviewRequest from './Components/ReviewRequest';
import AllRequests from './Components/AllRequests';
import Admin from './Components/Admin';
import WorkScheduleSetup from './Components/WorkSchedule';
import UserAllRequests from './Components/UserAllRequests';
import ViewAllUsers from './Components/ViewAllUsers';
import UserList from './Components/UserDetails1';
import UserDetails from './Components/UserDetails';
import LeaveBalance from './Components/LeaveBalance';
import EditTotalLeaves from './Components/EditTotalLeaves';

function App() {
	return (	
		<>
			<Router>
				<Routes>
					<Route path='/' element={<Login />} />
					<Route path='/home' element={<Home />} />
					<Route path='/regularize' element={<Regularize />} />
					<Route path='/review-request/:request_id/' element={<ReviewRequest />} />
					<Route path='/all-requests' element={<AllRequests />} />
					<Route path='/add-user' element={<Admin />} />
					<Route path='/work-schedule' element={<WorkScheduleSetup />} />
					<Route path='/user-all-request' element={<UserAllRequests />} />
					<Route path='/all-users' element={<ViewAllUsers />} />
					<Route path='/users/:user_id' element={<UserList />} />
					<Route path='/user/:user_id' element={<UserDetails />} />
					<Route path='/leave-balance' element={<LeaveBalance />} />
					<Route path='/admin/edit-total-leaves' element={<EditTotalLeaves />} />
				</Routes>
			</Router>
		</>
  	);
}

export default App;
