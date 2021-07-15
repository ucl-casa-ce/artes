//Global Variable
let colourPicked;
const saveImgButton= document.getElementById('saveMarker');

function createGrid() {
    
    //a grid of colours to choose
    const colourPicker = document.createElement("div")
    colourPicker.className = "colourPicker";
    colourPicker.id = "colourPickerDiv";
    //document.body.appendChild(colourPicker);
    document.getElementById('left').appendChild(colourPicker);

    let colourArrayHEX=
    [
        '#FFFFFF',
        '#ED1D2A',
        '#FFD500',
        '#00843D',
        '#FF8200',
        '#1D83AF'

    ]

    for (let col = 1; col < 7; col++) {
            const colourDiv = document.createElement("div")
            colourDiv.className = "colour";
            colourDiv.style.setProperty('grid-column',col)
            colourDiv.style.setProperty('background-color',colourArrayHEX[col-1])
            colourDiv.style.setProperty('border','solid 1px black')
            colourPicker.appendChild(colourDiv);
    }



//Grid of the marker

    const wrapperDiv = document.createElement("div")
    wrapperDiv.className = "wrapper";
    wrapperDiv.id = "wrapperDiv";

    //document.body.appendChild(wrapperDiv);
    document.getElementById('left').appendChild(wrapperDiv);
    
    const borderTopDiv = document.createElement("div")
    borderTopDiv.className = "border top";
    wrapperDiv.appendChild(borderTopDiv);
    
    const borderBottomDiv = document.createElement("div")
    borderBottomDiv.className = "border bottom ";
    wrapperDiv.appendChild(borderBottomDiv);

    const borderLeftDiv = document.createElement("div")
    borderLeftDiv.className = "border left";
    wrapperDiv.appendChild(borderLeftDiv);

    const borderRightDiv = document.createElement("div")
    borderRightDiv.className = "border right";
    wrapperDiv.appendChild(borderRightDiv);
    
    
    


    for (let col = 2; col < 5; col++) {
        for (let row = 2; row < 5; row++) {
            const boxDiv = document.createElement("div")
            boxDiv.style.setProperty('grid-column','col '+col)
            boxDiv.style.setProperty('grid-row','row '+row)
            boxDiv.style.setProperty('background-color',colourArrayHEX[col-1])
            
            boxDiv.className = "box";
            //boxDiv.className = "box col" + col + " row" + row;
            wrapperDiv.appendChild(boxDiv);
        }
    }

    


}
createGrid();

saveImgButton.addEventListener('click',saveImg);

function saveImg(){
html2canvas(document.querySelector("#wrapperDiv"),
{
    scrollX:-25,
    scrollY:-25,
    width:300,
    height:300,
}
).then(canvas => {
    const link = document.createElement('a');
  link.download = 'marker.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
    //document.body.appendChild(canvas)
});
}



//Get the value of the colour
$(function () {
    $(".colour").click(function () {
        colourPicked=$(this).css('background-color');

        console.log(colourPicked);
    });
});



$(function () {
    $(".box").click(function () {
        $(this).css('background-color', colourPicked);
    });
});