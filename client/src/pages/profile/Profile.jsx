// import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'  // ✅ ADDED

// import Input from '../../components/common/Input'
// import Spinner from '../../components/common/Spinner'

import { 
  FaUser, 
  FaEnvelope, 
  FaIdCard, 
  FaCalendarAlt,
  FaShieldAlt,
  FaKey,
  FaBell,
  FaUserTie,
  FaUserCheck,
  FaPhone,
  FaInfoCircle,
  // FaCamera
} from 'react-icons/fa';
// import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  // console.log("Profile component mounted, user data:", user);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0b1e3c]">My Profile</h1>
      </div>

      {/* <div className="flex md:flex-cols lg:flex-cols-3 gap-6"> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {user?.photo ? (
                  <img 
                    src={user.photo} 
                    alt={user?.name} 
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-[#2463eb] flex items-center justify-center shadow-lg">
                    <span className="text-white text-4xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                 )} 
              </div>

              <h2 className="text-xl font-bold text-[#0b1e3c] mb-1">{user?.name}</h2>
              
              {/* <span className={`flex gap-1 items-center text-xs px-2 py-1.5 rounded-lg font-medium mb-3 ${getRoleBadge()}`}>
                {user?.role === "admin" ? (
                 <FaUserTie size={12} />
               ) : user?.role === "employee" ? (
                  <FaUserCheck size={12} />
               ) : user?.role === "security" ? (
                  <FaShieldAlt size={12} />
                ) : user?.role === "visitor" ? (
                  <FaUser size={12} />
               ) : (
                    <FaUser size={12} />
                  )}
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span> */}
              <div className="mb-3">
                <StatusBadge status={user?.role} type="role" size="md" />
              </div>


              <div className="w-full grid grid-cols-2 gap-3 mt-2 pt-4 border-t border-[#eef2f6]">
                <div className="text-center">
                  <p className="text-xs text-[#5b6f87] mb-1">Member Since</p>
                  <p className="text-sm font-semibold text-[#0b1e3c]">
                    {formatDate(user?.createdAt).split(',')[0]}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#5b6f87] mb-1">Last Active</p>
                  <p className="text-sm font-semibold text-[#0b1e3c]">Today</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-[#0b1e3c] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center">
                <FaUser className="text-[#2463eb]" size={16} />
              </div>
              Personal Information
            </h3>

            {/* <div className="flex flex-col flex-wrap gap-6"> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f5f9ff] flex items-center justify-center">
                  <FaUser className="text-[#5b6f87]" size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-0.5">Full Name</p>
                  <p className="text-base font-medium text-[#0b1e3c]">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f5f9ff] flex items-center justify-center">
                  <FaEnvelope className="text-[#5b6f87]" size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-0.5">Email Address</p>
                  <p className="text-base font-medium text-[#0b1e3c] break-all">{user?.email}</p>
                </div>
              </div>

              {user?.role === 'visitor' && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f5f9ff] flex items-center justify-center">
                    <FaPhone className="text-[#5b6f87]" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-[#5b6f87] mb-0.5">Phone Number</p>
                    <p className="text-base font-medium text-[#0b1e3c]">{user?.phone || 'N/A'}</p>
                  </div>
                </div>
              )}

              {/* {user?.role === 'employee' && ( */}
              {user?.role === 'visitor' && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#f5f9ff] flex items-center justify-center">
                    <FaInfoCircle className="text-[#5b6f87]" size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-[#5b6f87] mb-0.5">Purpose</p>
                    <p className="text-base font-medium text-[#0b1e3c]">{user?.purpose || 'N/A'}</p>
                  </div>
                </div>
              )}

              {!user?.role === "visitor" && (
                <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f5f9ff] flex items-center justify-center">
                  <FaIdCard className="text-[#5b6f87]" size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-0.5">User ID</p>
                  <p className="text-sm font-mono text-[#0b1e3c]">{user?._id}</p>
                </div>
              </div>
              )}

             {!user?.role === "visitor" && ( <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f5f9ff] flex items-center justify-center">
                  <FaCalendarAlt className="text-[#5b6f87]" size={16} />
                </div>
                <div>
                  <p className="text-xs text-[#5b6f87] mb-0.5">Account Created</p>
                  <p className="text-sm font-medium text-[#0b1e3c]">{formatDate(user?.createdAt)}</p>
                </div>
              </div>)}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-[#0b1e3c] mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#e6f7ee] flex items-center justify-center">
                <FaShieldAlt className="text-[#22b455]" size={16} />
              </div>
              Account Settings
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#f5f9ff] rounded-xl border border-[#e2eaf5]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#dae5f8] flex items-center justify-center">
                    <FaKey className="text-[#4b52e1]" size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0b1e3c]">Password</p>
                    <p className="text-xs text-[#5b6f87]">
                      {user?.role === 'visitor' ? 'Change your password' : 'Last changed 30 days ago'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#f5f9ff] rounded-xl border border-[#e2eaf5]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#dae5f8] flex items-center justify-center">
                    <FaBell className="text-[#2463eb]" size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0b1e3c]">Notifications</p>
                    <p className="text-xs text-[#5b6f87]">Email notifications for appointments</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {user?.role !== 'visitor' && (
            <Card>
              <h3 className="text-lg font-semibold text-[#0b1e3c] mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f0e7fe] flex items-center justify-center">
                  <FaUser className="text-[#6941c6]" size={16} />
                </div>
                Active Sessions
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#f5f9ff] rounded-xl border border-[#e2eaf5]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center">
                      <FaUser className="text-[#2463eb]" size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0b1e3c]">Current Session</p>
                      <p className="text-xs text-[#5b6f87]">Chrome on Windows • IP: 192.168.1.1</p>
                    </div>
                  </div>
                  <span className="text-xs bg-[#e6f7ee] text-[#0b8a4f] px-2 py-1 rounded-full">Active Now</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile