interface User {
  name: string;
  email: string;
  avatar_url: string;
}

async function getUser(): Promise<User[]> {
  const response = await fetch('https://api.github.com/users/octocat');
  return response.json();
}

getUser().then((user) => {
  console.log(user);
});
