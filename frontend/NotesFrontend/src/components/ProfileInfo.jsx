

import React, { useState } from 'react'
import { createPortal } from 'react-dom'

const ProfileInfo = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showCard, setShowCard] = useState(false);

  return (
    <>
      <div className='text-white flex items-center gap-3'>
        <div
          className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 cursor-pointer'
          onClick={() => setShowCard(true)}
        >
          {user ? user.initials : ""}
        </div>

        <div>
          <button
            className='text-sm text-white-700 underline hover:cursor-pointer'
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {showCard &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70">
            <div
              className="bg-[#1f1f2e] text-white rounded-2xl p-6 w-[380px] shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-white text-lg"
                onClick={() => setShowCard(false)}
              >
                ✕
              </button>

              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-100 text-slate-950 font-semibold text-lg">
                  {user.initials}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-semibold text-gray-300">Username:</span>{" "}
                  {user.userName}
                </p>
                <p>
                  <span className="font-semibold text-gray-300">Email:</span>{" "}
                  {user.email}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

export default ProfileInfo
