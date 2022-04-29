## Async Unsucked
A simple, tiny, 0 dependency library to simplify the usage of asynchronous operations.    
    
    async function example() {
        const req = async(axios.get('http://localhost:3000/'))

        const [reply, data] = await Promise.all([
            req.data.reply,
            req.data
        ])

        console.log(reply, data) // "hello", {"reply": "hello"}
    }


    async function destructuring() {
        const req = async(axios.get('http://localhost:3000/'))

        const { reply } = req.data

        console.log(await reply) // "hello"
    }


    async function wrap() {
        const fetcher = async.wrap(axios.get)

        const { reply } = fetcher('http://localhost:3000/').data

        console.log(await reply) // "hello"
    }



    async function all() {
        app.listen()
        const req = async(axios.get('http://localhost:3000/'))

        const obj = await async.all({
            reply: req.data.reply,
            data: req.data
        })

        console.log(obj)

        const arr = await async.all([
            req.data.reply,
            req.data
        ])

        // same as Promise.all
        console.log(arr) // [ 'hello', { reply: 'hello'} ]
    }



    async function mix() {
        const req = async(axios.get('http://localhost:3000/'))

        const arr = await async.all([
            req.then(res => res.data.reply), // still works
            req.data
        ])

        console.log(arr) // [ 'hello', { reply: 'hello'} ]
    }


    async function map() {
        const req = async(axios.get('http://localhost:3000/'))

        const arr = [1, req.data.reply, 4]

        const res = async.map(arr, (c, i, err) => {
            if (err) console.log(err)
            else console.log(c, i)
            // 1 0
            // 4 2
            // hello 1
            return c
        })
        console.log(await res) // [ 1, 'hello', 4 ]
    }



|| |
|--|--|
|`async(p: Promise)`| Make it possible to get sub-properties from Promise objects using Proxies. |
|`async.wrap(func: Function)`|Wraps the return value of a function with `async()`|
|`async.all(promises: Promise[])`| Same as Promise.all but supports objects aswell. |
|`async.allSettled(promises: Promise[])`|Same as Promise.allSettled but supports objects aswell.|
|`async.race(promises: Promise[])` | Same as Promise.race but supports objects aswell. |
|`async.map(arr: Promise[], callback: Function)` | Map async iterator.|


Pull requests are more then welcome.