module.exports = [
    {
        _id: Math.round(Math.random() * 1000000),
        text: 'Yes, and I use Gifted Chat!',
        createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
        user: {
            _id: 1,
            name: 'Developer',
        },
    },
    {
        _id: Math.round(Math.random() * 1000000),
        text: 'Are you building a chat app?',
        createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
        user: {
            _id: 2,
            name: 'React Native',
        },
    },
]
