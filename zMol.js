const fs = require('fs')
const readline = require('readline')
const atomes = JSON.parse(fs.readFileSync('atomes.json'))

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

/**
 * Split a string but keep the seperator
 * @param {*} regex 
 * @param {*} value 
 */
const splitKeep = (regex, value) => {
    return value.replace(regex, ",$&").split(',')
}

/**
 * Set the molecule
 * Example: 
 *  - CO2
 *  - NaCl
 */
const setMolecule = () => {
    return new Promise((resolve, reject) => {
        rl.question(`\nEnter a molecule: `, (value) => {
            if (value.match(/[A-Z][a-z]?([\d]{0,3})+$/g)) {
                resolve(value)
            } else {
                reject({message: `Invalid input`})
            }
        })
    })
}

/**
 * Read the molecule and caculate it's molar mass
 * @param {*} value 
 */
const readMolecule = (value) => {
    return new Promise(async (resolve, reject) => {
        let result = 0

        value = splitKeep(/(?!^)[A-Z]/g, value)
        await value.forEach(atome => {
            size(atome).then(
                success => result += success.value,
                error => reject(error)
            )
        })

        resolve({value: result})
    })
}

/**
 * 
 * Get the molar mass of an atome
 * @param {*} atome 
 */
const size = (atome) => {
    return new Promise((resolve, reject) => {
        let [symbole, value] = splitKeep(/\d/, atome)
        
        if (atomes[symbole] == undefined) {
            reject({message: 'Atome not find'})
        } else {
            resolve({value: (value == undefined) ? atomes[symbole] : atomes[symbole] * value})
        }
    })
}

/**
 * Main process
 */
const main = async () => {
    setMolecule()
        .then((value) => readMolecule(value).then(
            success => {
                console.log(`The molar mass of this molecule is ${success.value} g.mol-1`),
                rl.close()
            }
        ))
        .catch((error) => {
            console.log(error.message)
            main()
        })
}

console.clear()
console.log('=== zModel ===')
main()