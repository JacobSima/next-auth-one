"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingPage = () => {
  const user = useCurrentUser();

  const onClick = () => {
    logout();
  }

  return (
    <>
      <div className="bg-white p-10 rounded-xl">
        <p className="py-2"></p>
        <button onClick={onClick}>
          Sign Out
        </button>
      </div>
      <div>
        {JSON.stringify(user)}
      </div>
    </>
  )
}

export default SettingPage