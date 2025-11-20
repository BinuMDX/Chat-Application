export default function UserList() {
  const dummyUsers = [
    { id: 1, name: "Binari" },
    { id: 2, name: "Ravindu" },
    { id: 3, name: "Kasun" },
  ];

  return (
    <div>
      {dummyUsers.map((user) => (
        <div
          key={user.id}
          className="p-3 hover:bg-gray-100 cursor-pointer border-b"
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}
