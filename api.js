// Dummy API endpoints
const USER_API = "https://randomuser.me/api/";
const JSONPLACEHOLDER_API = "https://jsonplaceholder.typicode.com/users";

export const fetchRandomUser = async () => {
  const res = await fetch(USER_API);
  if (!res.ok) throw new Error("Failed to fetch user");
  const data = await res.json();
  const user = data.results[0];
  return {
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    phone: user.phone,
    company: user.location.city,
    avatar: user.picture.large
  };
};

export const fetchJSONPlaceholderUser = async () => {
  const randomId = Math.floor(Math.random() * 10) + 1;
  const res = await fetch(`${JSONPLACEHOLDER_API}/${randomId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  const user = await res.json();
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    company: user.company.name,
    avatar: `https://i.pravatar.cc/200?img=${randomId}`
  };
};