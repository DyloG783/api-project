const users = [
    { id: 1, username: 'user1', password: 'password1', role: 'user' },
    { id: 2, username: 'admin', password: 'admin', role: 'admin' }
];

const username = 'user1';
const password = 'password1';

console.log(users.find(u => u.username === username && u.password === password));