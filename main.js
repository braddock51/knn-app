const fileInput = document.getElementById('file')
const table = document.querySelector('.data-table')
const deleteColumnButton = document.querySelector('.delete-column')
const deleteColumnInput = document.querySelector('.column')
const normalizeButton = document.querySelector('.data-normalizer')
const maxValueInput = document.querySelector('.max-value')
const minValueInput = document.querySelector('.min-value')
const saverInput = document.querySelector('.saver')
const saverButton = document.querySelector('.save-file')
const cfgFile = document.querySelector('.cfg-input')
const wrapper = document.querySelector('.wrapper')
const cfgInputWrapper = document.querySelector('.cfg-input-wrapper')
const reset = document.querySelector('.reset')
const markClassAttribute = document.querySelector('.mark-class-atr')
const generateNewcfg = document.querySelector('.generate-new-cfg')
const container = document.querySelector('.rest-container')
const knnButton = document.querySelector('.knn-button')
const knnEffBtn = document.querySelector('.knn-eff-btn')
const knnEffSelect = document.querySelector('.knn-select')
const knnKInput = document.querySelector('.knn-eff-k')
const deletedColumnsArray = []

var linesCopy= [];
var fileName = 'australian'


fileInput.addEventListener('change', () => {
    const reader = new FileReader()
    reader.readAsText(fileInput.files[0])
            
            reader.onload = () => {
                
                const lines = reader.result.split('\n').map( line => {
                    if(fileInput.files[0].name === "australian.dat")
                        return line.split(' ')
                    else
                        return  line.split(',')
                })

                
                
                linesCopy = [...lines]
            }
})

cfgFile.addEventListener('change', () => {
    
    const reader = new FileReader()

    reader.readAsText(cfgFile.files[0])

    reader.onload = () => {
        if (cfgFile.files[0].type != 'application/json') {
            window.alert("Load a cfg.json file")
            cfgFile.value = ""
            
        } else {
            cfgInputWrapper.style.visibility = 'hidden'
            wrapper.style.visibility = 'visible'
            var json = JSON.parse(reader.result)
        }

        fileInput.addEventListener('change', () => {
            
            reader.readAsText(fileInput.files[0])
            
            reader.onload = () => {
                
                const lines = reader.result.split('\n').map( line => {
                    if(fileInput.files[0].name === "australian.dat")
                        return line.split(' ')
                    else
                        return  line.split(',')
                })
                
                
                   
                const knnVersionObject = {
                    className: 'knn-select',
                    firstTextInSelect: 'Select version of knn',
                    text: [
                        'First version',
                        'Second version',
                    ],
                    value: [
                        "First version",
                        "Second version",
                    ],
                    length: 2
                }
                
                const metricsObject = {
                    className: 'metrics-select',
                    firstTextInSelect: 'Select metrics',
                    text: [
                        "Manhattan",
                        "Euclides",
                        "Logarithm",
                        "Minkowski",
                        "Czebyszew",

                
                    ],
                    value: [
                        "manhattanMetric",
                        "euclidesMetric",
                        "logarithmMetric",
                        "minkowskiMetric",
                        "czebyszewMetric"
                    ],
                    length: 5
                }
                
                markClassAttribute.addEventListener('click', () => {
                    for (let i = 0, row; row = table.rows[i]; i++) {
                        row.lastChild.style.color = 'red'
                    }
                })

                reset.addEventListener('click', () => {
                    fileInput.value = ""
                    while (table.firstChild) {table.removeChild(table.lastChild);}
                })


                if(fileInput.files[0].name === "breast-cancer-wisconsin.data") {
                    const columnWithQuestionMark = arrayColumn(lines, 6)
                    fileName = 'breast-cancer-wisconsin'
                    const columnWithoutQuestionMark = changeQuestionMarkToAverage(columnWithQuestionMark)
                    swapColumn(lines, columnWithoutQuestionMark, 6)
                    swapColumn(linesCopy, columnWithoutQuestionMark, 6)
                } else if (fileInput.files[0].name === "crx.data") {questionMarkRowsDelete(lines)}
                
                if(validateCfg(lines, json, fileInput.files[0].name)) {
                    generateTable(table, lines)

                    if(fileInput.files[0].name === "crx.data") {
                        
                        fileName = 'crx'
                        const symbolsToNumbersButton = document.createElement('button')
                        symbolsToNumbersButton.innerHTML = 'Change Symbols To Numbers'
                        container.appendChild(symbolsToNumbersButton)

                        symbolsToNumbersButton.addEventListener('click', () => {
                            changeSymbolsToNumbers(lines, json)
                            while (table.firstChild) {table.removeChild(table.lastChild);}
                            generateTable(table, lines)
                            
                            
                        })
                        
                    }

                    
                    
                    normalizeButton.addEventListener('click', () => {
                        normalize(lines, minValueInput.value, maxValueInput.value, json)
                        while (table.firstChild) {table.removeChild(table.lastChild);}
                        generateTable(table, lines)
                        
                    })
            
                    saverButton.addEventListener('click', () => {
                        let file = new File([lines.join('\n')], saverInput.value , {type: "text/plain;charset=utf-8"})
                        saveAs(file)
                    })
        
        
            
                    deleteColumnButton.addEventListener('click', () => {
                        while (table.firstChild) {table.removeChild(table.lastChild);}
                        deleteColumn(lines, deleteColumnInput.value, json)
                        deleteColumnForCopy(linesCopy, deleteColumnInput.value)
                        generateTable(table, lines)
            
                    })

                    generateNewcfg.addEventListener('click', () => {
                        generateCfg(json, fileName)
                       
                    })

                    knnButton.addEventListener('click', () => {
                        wrapper.parentNode.removeChild(wrapper)
                        
                        const knnContainer = document.createElement('div')
                        knnContainer.className = "knn-container"
                        document.body.appendChild(knnContainer)
                        
                        const header = document.createElement('h4')
                        header.innerHTML = 'Enter the new row and the knn version to generate decision'
                        knnContainer.appendChild(header)

                        const inputsContainer = document.createElement('div')

                        const inputsToKnnObject = {
                            type: 'number',
                            width: '40px',
                            placeholder: "",
                            length: lines[0].length - 1,
                        }
                        
                        createInput(inputsToKnnObject, inputsContainer)
                        knnContainer.appendChild(inputsContainer)
                        
                        const selectContainer = document.createElement('div')
                        selectContainer.className = 'select-container'

                        
                        
                        createSelect(knnVersionObject, selectContainer)
                        createSelect(metricsObject, selectContainer)
                        knnContainer.appendChild(selectContainer)
                        
                        const kInput = document.createElement('input')
                        kInput.type = 'number'
                        kInput.className = "k-input"
                        kInput.placeholder = "k"

                        knnContainer.appendChild(kInput)

                        const knnSubmitButton = document.createElement('button')
                        knnSubmitButton.innerHTML = 'Submit'
                        knnSubmitButton.className = 'knn-submit'
                        knnContainer.appendChild(knnSubmitButton)

                        knnSubmitButton.addEventListener('click', () => {
                            var newRowArray = []
                            
                            for(let i = 0; i < lines[0].length - 1; i++) {
                            input = document.querySelector(`.input${i}`)
                            newRowArray.push(input.value)

                            }
                            
                            if(json.isNormalized) {
                                linesCopy.push(newRowArray)
                                normalize(linesCopy, json.normalizerRange[0], json.normalizerRange[1], json)
                                newRowArray = linesCopy.pop()
                            }
                            let decision = undefined
                            
                            const knnVersionSelect = document.querySelector('.knn-select')
                            const metrcisSelect = document.querySelector('.metrics-select')

                            
                            if(knnVersionSelect.value == 'First version') {
                                decision = firstVersionOfKnn(kInput.value, lines, newRowArray, eval(metrcisSelect.value) ,json)

                            } else {
                                decision = secondVersionOfKnn(kInput.value, lines, newRowArray, eval(metrcisSelect.value), json)

                            }
                            if(decision != 'wrong k') {
                                knnContainer.parentNode.removeChild(knnContainer)
                                const headerContainer = document.createElement('div')
                                headerContainer.className = "decision-header-container"
                                const header = document.createElement('h1')
                                header.className = 'decision-header'
                                header.innerHTML = `Decision for the ${newRowArray.join(', ')} is equal to [${decision}]`
                                
                                headerContainer.appendChild(header)
                                document.body.appendChild(headerContainer)
                            }

                            
                        })

                        
                    })


                }

                const effOfKnnContainer = document.createElement('div')
                effOfKnnContainer.className = "eff-knn-container"
                container.appendChild(effOfKnnContainer)
                
                const headerText = "Hit the Try button and check knn effectiveness"
                const buttonText = "Try"
                const buttonClassName = 'try-button'

                const selectAndIntpuContainer = document.createElement('div')
                
                createSelectAndInputsTemplate(headerText, buttonText, knnVersionObject, metricsObject, buttonClassName, effOfKnnContainer)

                const metricsSelect = document.querySelector('.metrics-select')
                metricsSelect.style.margin = "0"
                const versionKnnSelect = document.querySelector('.knn-select')
                const selectContainer = document.querySelector('.select-container')
                selectContainer.style.padding = "1em"
                

                const tryButton = document.querySelector('.try-button')
                const kInput = document.querySelector('.k-input')
                
                effOfKnnContainer.appendChild(selectAndIntpuContainer)

                tryButton.addEventListener('click', () => {
                    const optArray = versionKnnSelect.options
                    
                    if(metricsSelect .value == 'minkowskiMetric') {
                        oneVSRest(kInput.value, lines, json, firstVersionOfKnn, minkowskiMetric)
                        
                    } else {
                        if(optArray[0].value === "First version") {
                            oneVSRest(kInput.value, lines, json, firstVersionOfKnn, eval(metricsSelect.value))
                        } else {
                            oneVSRest(kInput.value, lines, json, secondVersionOfKnn, eval(metricsSelect.value))
                        }
                    }

                    
                })

                
            }
            
        })
        
    }


})

const createInput = (inputObject, parentContainer) => {
    let input = {}
    
    for(let i = 0; i < inputObject.length; i++) {
        input[`input${i}`] = document.createElement('input')
        input[`input${i}`].style.width = inputObject.width
        input[`input${i}`].type = inputObject.type
        input[`input${i}`].className = `input${i}`
        parentContainer.appendChild(input[`input${i}`])
        
    } 
    
}

const createSelect = (optionsObject, parentContainer) => {
    const select = document.createElement('select')
    select.className = optionsObject.className
    
    const opt = document.createElement('option')
    select.appendChild(opt)
    opt.text = optionsObject.firstTextInSelect
    opt.style.display = "none"
    
    
    const options = {}
    
    for(let i = 0; i < optionsObject.length; i++) {
        options[`opt${i}`] = document.createElement('option')
        options[`opt${i}`].innerHTML = optionsObject.text[i]
        options[`opt${i}`].value = optionsObject.value[i]
        select.appendChild(options[`opt${i}`])
        
        
        
    }
    parentContainer.appendChild(select)
    

}
    
const createSelectAndInputsTemplate = (headerText, buttonText, firstOptionsObject, secondOptionsObject, submitClassName, parentContainer,) => {
    const header = document.createElement('h4')
    header.innerHTML = headerText
    parentContainer.appendChild(header)

    const selectContainer = document.createElement('div')
    selectContainer.className = 'select-container'
    
    createSelect(firstOptionsObject, selectContainer)
    createSelect(secondOptionsObject, selectContainer)
    parentContainer.appendChild(selectContainer)

    const kInput = document.createElement('input')
    kInput.type = 'number'
    kInput.className = "k-input"
    kInput.placeholder = "k"
    parentContainer.appendChild(kInput)

    const submit = document.createElement('button')
    submit.innerHTML = buttonText
    submit.className = submitClassName
    
    parentContainer.appendChild(submit)

}



const generateTable = (table, data) => {
    row = table.insertRow()
    for(let i = 0; i < data[0].length; i++) {
        let cell = row.insertCell()
        let text = document.createTextNode(`A${i}`)
        cell.appendChild(text)
    }

    for (let element of data) {
        let row = table.insertRow()
        for (key in element) {
          let cell = row.insertCell()
          let text = document.createTextNode(element[key])
          cell.appendChild(text)
        }
    }
}

const arrayColumn = (arr, n) => arr.map(x => x[n])

const swapColumn = (arr, col, n) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i][n] = col[i]
        
    }
    
}
    
const deleteColumn = (arr, n, json) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].splice(n, 1)
    }
    
    deletedColumnsArray.push(n)
    json.columnsDeleted = deletedColumnsArray
    json.isSomeColumnsDeleted = true
    json.numbersOfAttribute -= 1
    json.classAtributePlace -= 1
    

}

const deleteColumnForCopy = (arr, n) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].splice(n, 1)
    }
    
}
    
const changeQuestionMarkToAverage = array => {
    resultArray = [...array]
    for (let i = 0; i < resultArray.length; i++) {
        if(isNaN(resultArray[i])) {
            resultArray[i] = average(resultArray)
        }
    }
    return resultArray
}

const average = column => {
    let sum = 0

    for (let i = 0; i < column.length; i++) {
        if(!isNaN(column[i])) {
            sum += parseInt(column[i])
            
        }
    }
    avg = sum / column.length
    return parseInt(avg)
}

const questionMarkRowsDelete = arr => {
    
    for (let i = 0; i < arr.length; i++) {
        
        for (let j = 0; j < arr[i].length; j++) {
            
            if (arr[i][j] === "?") {
                arr.splice(i, 1);
            }
        }
    }
}


const normalize = (arr, a=0, b=1, json) => {
    

    a = parseFloat(a)
    b = parseFloat(b)
    for (let i = 0; i < arr[0].length -1; i++) {
        let col = arrayColumn(arr, i)
        
        if (isNaN(col[0])){
            window.alert("You can't normalize symbols")
            break
        }

        col = changeArrayToFloat(col)
        let max = Math.max(...col)
        let min = Math.min(...col)
        
        for (let j = 0; j < col.length; j++) {
            col[j] = (a + (col[j] - min) / (max - min) * (b - a)).toFixed(2)
            
            col[j] = String(col[j])
        }
        swapColumn(arr, col, i)
    }
    json.isNormalized = true
    json.normalizerRange = [a, b]
}

const changeArrayToFloat = (arr) => arr.map(x => parseFloat(x))
const changeArrayToInt = (arr) => arr.map(x => parseInt(x))

const changeSymbolsToNumbers = (arr, json) => {
    
    col1 = arrayColumn(arr, 0)
    col4 = arrayColumn(arr, 3)
    col5 = arrayColumn(arr, 4)
    col6 = arrayColumn(arr, 5)
    col7 = arrayColumn(arr, 6)
    col9 = arrayColumn(arr, 8)
    col10 = arrayColumn(arr, 9)
    col12 = arrayColumn(arr, 11)
    col13 = arrayColumn(arr, 12)
    
    
    for(let i = 0; i < arr.length; i++) {
        if (col1[i] === "a") {col1[i] = 0}
        else {col1[i] = 1}
        

        if (col4[i] === "u") {col4[i] = 0}
        else {col4[i] = 1}
        

        if (col5[i] === "p") {col5[i] = 1}
        else if (col5[i] === "g") {col5[i] = 2}
        else {col5[i] = 3}
        

        if (col6[i] === "ff") {col6[i] = 1}
        else if (col6[i] === "d") {col6[i] = 2}
        else if (col6[i] === "i") {col6[i] = 3}
        else if (col6[i] === "k") {col6[i] = 4}
        else if (col6[i] === "j") {col6[i] = 5}
        else if (col6[i] === "aa") {col6[i] = 6}
        else if (col6[i] === "m") {col6[i] = 7}
        else if (col6[i] === "c") {col6[i] = 8}
        else if (col6[i] === "w") {col6[i] = 9}
        else if (col6[i] === "e") {col6[i] = 10}
        else if (col6[i] === "q") {col6[i] = 11}
        else if (col6[i] === "r") {col6[i] = 12}
        else if (col6[i] === "cc") {col6[i] = 13}
        else {col6[i] = 14}

        if (col7[i] === "v") {col7[i] = 1}
        else if (col7[i] === "h") {col7[i] = 2}
        else if (col7[i] === "bb") {col7[i] = 3}
        else if (col7[i] === "ff") {col7[i] = 4}
        else if (col7[i] === "j") {col7[i] = 5}
        else if (col7[i] === "z") {col7[i] = 6}
        else if (col7[i] === "o") {col7[i] = 7}
        else if (col7[i] === "dd") {col7[i] = 8}
        else {col7[i] = 9}

        if (col9[i] === "f") {col9[i] = 0}
        else {col9[i] = 1}

        if (col10[i] === "f") {col10[i] = 0}
        else {col10[i] = 1}

        if (col12[i] === "f") {col12[i] = 0}
        else {col12[i] = 1}

        if (col13[i] === "s") {col13[i] = 1}
        if (col13[i] === "g") {col13[i] = 2}
        else {col13[i] = 3}

        
    }
    swapColumn(arr, col1, 0)
    swapColumn(arr, col4, 3)
    swapColumn(arr, col5, 4)
    swapColumn(arr, col6, 5)
    swapColumn(arr, col7, 6)
    swapColumn(arr, col9, 8)
    swapColumn(arr, col10, 9)
    swapColumn(arr, col12, 11)
    swapColumn(arr, col13, 12)

    json.symbolsToNumbers = true
    
}

const validateCfg = (arr, obj, fileName) => {
    
    
    for(let i = 0; i < arr[0].length; i++) {
        
        if (arr[0].length != obj.numbersOfAttribute){
            window.alert("Wrong dataset. Numbers of attributes are not match.")

            return false
        }
        
        
        let col = arrayColumn(arr, i)

        if (isNaN(col[0])) {
            col = new Set(col)
            col = [...col]
            col.sort()
            objCol = eval(`obj.symbolsAttributes.a${i}`)
            objCol.sort()
            
            if (!(_.isEqual(col, objCol))) {
                window.alert("Wrong dataset. Symbols of attributes are not match")
                return false
            }
            continue
            
        }

        col = changeArrayToFloat(col)
        let max = Math.max(...col)
        let min = Math.min(...col)
       
        if((eval(`obj.attributeRanges.a${i}Min`) != min) || (eval(`obj.attributeRanges.a${i}Max`) != max)) {
            window.alert("Wrong dataset. Attribute range is out of range.")

            return false
        }

        
    }

    return true
}

const generateCfg = (json, fileName) => {
    
    const jsonToSave = JSON.stringify(json)
    const blob = new Blob([jsonToSave], {type: "application/json"})
    let file = new File([blob], `${fileName}-cfg.json`, {type: "text/json;charset=utf-8"})
    saveAs(file)
}

const czebyszewMetric = (arr, newRow, json) => {
    let dist = 0
    let distArray = []
    let counter = []

    for(let i = 0; i < arr.length; i++) {
        arr[i] = changeArrayToFloat(arr[i])
        
        for(let j = 0; j < arr[i].length - 1; j++) {
            
            distArray.push(Math.abs(arr[i][j] - newRow[j]))
            
        }
        
        dist = Math.max(...distArray)
        counter[i] = [Math.floor(dist), arr[i][`${json.classAtributePlace}`]]
        dist = 0
        distArray = []
       
        
    }

    return counter

}

const minkowskiMetric = (arr, newRow, json, p=2) => {
    let dist = 0
    let counter = []
    

    for(let i = 0; i < arr.length; i++) {
        arr[i] = changeArrayToFloat(arr[i])
        
        for(let j = 0; j < arr[i].length - 1; j++) {
            
            dist += Math.pow(Math.abs(arr[i][j] - newRow[j]), p)
            
        }
        dist = Math.pow(dist, 1/p)

        counter[i] = [Math.floor(dist), arr[i][`${json.classAtributePlace}`]]
        dist = 0
    }

    return counter



}

const logarithmMetric = (arr, newRow, json) => {
    let dist = 0
    let counter = []

    for(let i = 0; i < arr.length; i++) {
        arr[i] = changeArrayToFloat(arr[i])
        
        for(let j = 0; j < arr[i].length - 1; j++) {
            
            dist += Math.abs((Math.log(arr[i][j]) - Math.log(newRow[j])))
            
        }
        
        counter[i] = [Math.floor(dist), arr[i][`${json.classAtributePlace}`]]
        dist = 0
    }

    return counter
}

const euclidesMetric = (arr, newRow, json) => {
    let dist = 0
    let counter = []
    for(let i = 0; i < arr.length; i++) {
        arr[i] = changeArrayToFloat(arr[i])
        
        for(let j = 0; j < arr[i].length - 1; j++) {
            
            dist += Math.pow(arr[i][j] - newRow[j], 2)
            
        }
        dist = Math.sqrt(dist)
        counter[i] = [Math.floor(dist), arr[i][`${json.classAtributePlace}`]]
        dist = 0
    }

    return counter
}

const manhattanMetric = (arr, newRow, json) => {
    let dist = 0 
    let counter = []
    for(let i = 0; i < arr.length; i++) {
        arr[i] = changeArrayToFloat(arr[i])
        
        for(let j = 0; j < arr[i].length - 1; j++) {
            
            dist += Math.abs(arr[i][j] - newRow[j])
            
        }
        
        counter[i] = [Math.floor(dist), arr[i][`${json.classAtributePlace}`]]
        dist = 0
    }

    return counter
}

const firstVersionOfKnn = (k, arr, newRow, metrics, json) => {
    
    if(k > arr.length) {
        window.alert("K number is greater then number of the reference samples. Please enter correct K number.")
        
        return 'wrong k'
    }
    
    let kMinDist = []
    let classAtributes = new Set(arrayColumn(arr, `${json.classAtributePlace}`))
    classAtributes = [...classAtributes]

    let counter = metrics(arr, newRow, json)
   
    
    let v = counter.map(e => e[0])
    for (let i = 0; i < k; i++) {
        let index = v.indexOf(Math.min(...v))
        v.splice(index, 1)
        kMinDist.push(counter[index])
        counter.splice(index, 1)
    }
    
    v = kMinDist.map(e => e[1])
    
    if(highestOccurrence(v).length > 1) {return null}
    return highestOccurrence(v)[0]

}

const secondVersionOfKnn = (k, arr, newRow, metrics, json) => {
    let tmpArr = [...arr]
    let distValues = {}
    let counter = []
    let dist = 0
    let classAtributes = new Set(arrayColumn(arr, `${json.classAtributePlace}`))
    classAtributes = changeArrayToInt([...classAtributes])
    
    for(let value of classAtributes) {distValues[value] = []}
    
    counter = metrics(arr, newRow, json)
    for(const key in distValues) {
        for(let i = 0; i < counter.length; i++) {
            if(key == counter[i][1]) {distValues[key].push(counter[i][0])}
        }
    }
    var scores = []
    for(const key in distValues) {
        
        for(let i = 0; i < k; i++) {
            let index = distValues[key].indexOf(Math.min(...distValues[key]))
            scores.push(distValues[key][index])
            distValues[key].splice(index, 1)
        }
    }

    let finalScores = new Array(classAtributes.length)
    for(let i = 0; i < finalScores.length - 1; i++) {
        finalScores[i] = 0
        finalScores[i+1] = 0
        for(let j = 0; j < scores.length; j++) {
            if(j < scores.length / classAtributes.length) {
                finalScores[i] += scores[j]
            } else {
                finalScores[i+1] += scores[j]
            }
        }
    }
    
    for(let i = 0; i < finalScores.length - 1; i++) {
        let tmp = i
        while(tmp <= finalScores.length) {
            tmp++
            if(finalScores[i]===finalScores[tmp]) {
                return null
            }
        }
    }
    
    const values = Object.values(distValues)
    let min = values[0].length
    for(arr of values) {
        
        if(arr.length < min) {min = arr.length}
    }
    
    if(k > min) {
        window.alert("K number is greater then number of the smallest (in terms of numbers) decision class. Please enter correct K number.")
        
        return 'wrong k'
    }
        
    
    
    let index = finalScores.indexOf(Math.min(...finalScores))
    
    return classAtributes[index]
    
}   


const highestOccurrence = (myArray) => {
    let distribution = {}
    let max = 0
    let result = []

    myArray.forEach(a => {
        distribution[a] = (distribution[a] || 0) + 1
        if(distribution[a] > max) {
            max = distribution[a]
            result = [a]
            return 
        }
        if(distribution[a] === max) {result.push(a)}
    })

    return result
}


const oneVSRest = (k, arr, json, knnVersion, metrics) => {
    let classifiedObjects = []
    let correctClassified = 0
    let tmpArray = new Array(arr.length)
    
    if(knnVersion(k, arr, arr[0], metrics, json) === 'wrong k') {return}
    
    
    for(let i = 0; i <= tmpArray.length; i++) {
       

        tmpArray = [...arr]
        let row = tmpArray[i]
        row = changeArrayToFloat(row)
        let decision = row.pop()
        tmpArray.splice(i, 1)
        let newDecision = knnVersion(k, tmpArray, row, metrics, json)
        
        
        if(newDecision !== null) {
            

            row.push(newDecision)
            classifiedObjects.push(row)
            
            if(newDecision === decision) {correctClassified++}

        }

    }

    const coverage = (classifiedObjects.length/arr.length).toFixed(2) * 100
    const correctPercentage = (correctClassified/classifiedObjects.length).toFixed(2) * 100

    window.alert(`We managed to classify ${classifiedObjects.length} objects\n\nThe coverage is ${coverage}%\n\nThe number of correctly classified objects is ${correctClassified}\n\nThe percentage of correctness is ${correctPercentage}%`)
    
}







