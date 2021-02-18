//global catch & variables
const colorDivs = document.querySelectorAll('.color')
const generateBtn = document.querySelector('.generate')
const sliders = document.querySelectorAll('input[type="range"]')
const currentHexes = document.querySelectorAll('.color h2')
const popup = document.querySelector('.copy-container')
const adjustButton = document.querySelectorAll('.adjust')
const lockButton = document.querySelectorAll('.lock')
const closeAdjustments = document.querySelectorAll('.close-adjustment')
const sliderContainers = document.querySelectorAll('.sliders')
let initalColors
//localstorage setup
let savedPalettes = []

//event listeners
lockButton.forEach((button, index) => {
    button.addEventListener('click', () => {
        lockColor(index)
    })
})
generateBtn.addEventListener('click', randomColors)
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls)
})
colorDivs.forEach((div, index) => {
    div.addEventListener('change', () => {
        updateTextUI(index)
    })
})
currentHexes.forEach(hex => {
    hex.addEventListener('click', () => {
        copyToClipboard(hex)
    })
})
popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0]
    popup.classList.remove('active')
    popupBox.classList.remove('active')
})
adjustButton.forEach((button, index) => {
    button.addEventListener('click', () => {
        openAdjustmentPanel(index)
    })
})
closeAdjustments.forEach((button, index) => {
    button.addEventListener('click', () => {
        closeAdjustmentPanel(index)
    })
})
//functions

//Generating a random color
function generateHex(){
    const hexColor = chroma.random();
    return hexColor;
}
function randomColors(){
    //
    initalColors = []
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();
        //save color to array
        if(div.classList.contains('locked')){
            initalColors.push(hexText.innerText)
            return;
        }
        else{
            initalColors.push(chroma(randomColor).hex())
        }

        //add color to bkg
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        //checking contrast
        checkTextContrast(randomColor, hexText)
        //Initial Colorize Sliders
        const color = chroma(randomColor)
        const sliders = div.querySelectorAll('.sliders input')
        const hue = sliders[0]
        const brightness = sliders[1]
        const saturation = sliders[2]

        colorizeSliders(color, hue, brightness, saturation)
    })
    //reset Inputs
    resetInputs()
    //check for btn contrast
    adjustButton.forEach((button, index) => {
       checkTextContrast(initalColors[index], button)
       checkTextContrast(initalColors[index], lockButton[index])
    })
}
function checkTextContrast(color, text){
    const luminance = chroma(color).luminance();
    if(luminance > 0.5){
        text.style.color = "black";
    }else{
        text.style.color = "white";
    }
}
function colorizeSliders(color, hue, brightness, saturation){
    //scaling saturation of color
    const noSaturation = color.set('hsl.s', 0)
    const fullSaturation = color.set('hsl.s', 1)
    const scaleSaturaion = chroma.scale([noSaturation, color, fullSaturation])
    //scaling brightness 
    const midBright = color.set('hsl.l', 0.5)
    const scaleBright = chroma.scale(["black", midBright, "white"])
    //update input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturaion(0)}, ${scaleSaturaion(1)})`
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75,204,204), rgb(75,75,204), rgb(204, 75, 204), rgb(204, 75, 75))`
}
function hslControls(e){
    const index = 
    e.target.getAttribute("data-bright") || 
    e.target.getAttribute("data-sat") || 
    e.target.getAttribute("data-hue") 
    
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]')
    console.log(sliders)
    const hue = sliders[0]
    const brightness = sliders[1]
    const saturation = sliders[2]

    const bgColor = initalColors[index]
    let color = chroma(bgColor)
    .set('hsl.s', saturation.value)
    .set('hsl.l', brightness.value)
    .set('hsl.h', hue.value)

    colorDivs[index].style.backgroundColor = color

    //colorize inputs & sliders
    colorizeSliders(color, hue, brightness,saturation)
}
function updateTextUI(index){
    const activeDiv = colorDivs[index]
    const color = chroma(activeDiv.style.backgroundColor)
    const textHex = activeDiv.querySelector('h2')
    const icons = activeDiv.querySelectorAll('.controls button')
    textHex.innerText = color.hex()
    //check contrast
    checkTextContrast(color, textHex)
    for(icon of icons){
        checkTextContrast(color, icon)
    }
}
function resetInputs(){
    const sliders = document.querySelectorAll('.sliders input')
    sliders.forEach(slider => {
        if(slider.name === "hue"){
            const hueColor = initalColors[slider.getAttribute('data-hue')]
            const hueValue = chroma(hueColor).hsl()[0]
            slider.value = Math.floor(hueValue)
        }
        if(slider.name === "brightness"){
            const brightColor = initalColors[slider.getAttribute('data-bright')]
            const brightValue = chroma(brightColor).hsl()[2]
            slider.value = Math.floor(brightValue * 100) /100
        }
        if(slider.name === "saturation"){
            const saturationColor = initalColors[slider.getAttribute('data-sat')]
            const saturationValue = chroma(saturationColor).hsl()[1]
            slider.value = Math.floor(saturationValue * 100) /100
        }
    })
}
//cool hack to cc by click
function copyToClipboard(hex){
    const el = document.createElement('textarea')
    el.value = hex.innerText
    document.body.appendChild(el)
    el.select();
    document.execCommand('copy')
    document.body.removeChild(el)
    //Pop up animation
    const popupBox = popup.children[0]
    popup.classList.add('active')
    popupBox.classList.add('active')

}
function openAdjustmentPanel(index){
    sliderContainers[index].classList.toggle('active')
}    
function closeAdjustmentPanel(index){
    sliderContainers[index].classList.remove('active')
}   
function lockColor(index){
    colorDivs[index].classList.toggle('locked')
    lockButton[index].children[0].classList.toggle("fa-lock-open")
    lockButton[index].children[0].classList.toggle("fa-lock")
}

//adding save to local storage etc... 
const saveBtn = document.querySelector('.save')
const sumbitSave = document.querySelector(".submit-save")
const closeSave = document.querySelector('.close-save')
const saveContainer = document.querySelector('.save-container')
const saveInput = document.querySelector(".save-container input")

//even listener
saveBtn.addEventListener('click', openPalette)
closeSave.addEventListener("click", closePalette)

function openPalette(e){
    const popup = saveContainer.children[0]
    saveContainer.classList.add("active")
    popup.classList.add("active")
}
function closePalette(e){
    const popup = saveContainer.children[0]
    saveContainer.classList.remove("active")
    popup.classList.remove("active")
}
randomColors();
