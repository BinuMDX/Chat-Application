import UserList from "./UserList";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="font-bold text-xl">Chats</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        <UserList />
      </div>
    </div>
  );
}
