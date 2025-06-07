import { auth, signOut } from "@/auth"

const SettingPage = async() => {
  const session = await auth();

  const handleSingOut = async() => {
    "use server";
    await signOut();
  }

  return (
    <div>
      {JSON.stringify(session)}
      <form action={handleSingOut}>
        <button type="submit">
          Sign Out
        </button>
      </form>
    </div>
  )
}

export default SettingPage