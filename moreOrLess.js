import { createInterface } from 'readline'

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

/**
 * Player 1 choose a number
 */
const setNumber = () => {
    return new Promise((resolve, reject) => {
        rl.question(`\nChoose a number between 0-100: `, (data) => {
            if (data >= 0 && data <= 100) {
                resolve({value: data})
            } else {
                reject({message : `Invalid input`})
            }
        }) 
    })
}

/**
 * Player 2 try to find the number
 * @param {*} value 
 */
const findNumber = (value) => {
    return new Promise((resolve, reject) => {
        rl.question(`\nProposition: `, (anwser) => {
            if (value == anwser) {
                resolve({message: `Nice job, it's the good awnser`})
            } else if (isNaN(anwser)) {
                reject({message: `Invalid input`})
            } else if (parseInt(anwser) > parseInt(value)) {
                reject({message: `It's less than ${anwser}`})
            } else {
                reject({message: `It's more than ${anwser}`})
            }
        })
    })
}

/**
 * Player 2 step
 * @param {*} value 
 */
const step = async (value) => {
    await findNumber(value).then(
        success => {
            console.log(success.message)
            rl.close()
        },
        error => {
            console.log(error.message)
            step(value)
        }
    )
}

/**
 *  Start of the game
 */
const main = async () => {
    await setNumber().then(
        data => {
            console.clear()
            console.log('Player 2:')
            step(data.value)
        },
        error => {
            console.log(error.message)
            main()
        }
    )
}

console.log('Player 1:')
main()