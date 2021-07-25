//Global Variable
let colourPicked;
const saveImgButton= document.getElementById('saveMarker');

function createGrid() {
    
    //
    //a grid of colours to choose
    //
    //const colourPicker = document.createElement("div")
    //colourPicker.className = "colourPicker";
    //colourPicker.id = "colourPickerDiv";
    //document.getElementById('block').appendChild(colourPicker);
    const colourPicker = document.getElementById('colourPickerDiv');
    
    let colourArrayHEX=
    [
        '#FFFFFF', //White
        '#ED1D2A', //Bright Red
        '#FFD500', //Bright Yellow
        '#00843D', //Dark Green
        '#FF8200', //Bright Orange
        '#1D83AF', //Medium Azur
        '#003865'  //Earh Blue
    ]

    for (let col = 1; col < 8; col++) {
            const colourDiv = document.createElement("div")
            colourDiv.className = "colour";
            colourDiv.style.setProperty('grid-column',col)
            colourDiv.style.setProperty('background-color',colourArrayHEX[col-1])
            colourDiv.style.setProperty('border-style','solid')
            colourDiv.style.setProperty('border-width','1px')
            colourDiv.style.setProperty('border-color','black')

            colourPicker.appendChild(colourDiv);
    }


//Grid of the marker

    //const wrapperDiv = document.createElement("div")
    //wrapperDiv.className = "wrapper";
    //wrapperDiv.id = "wrapperDiv";
    //document.body.appendChild(wrapperDiv);
    //document.getElementById('block').appendChild(wrapperDiv);
    const wrapperDiv = document.getElementById('wrapperDiv');
    
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
        //Store the value of the colour
        colourPicked=$(this).css('background-color');
        
        //change border of the selected box and of the other boxes
        $(".colour").css('border-color','black');
        $(".colour").css('border-width','1px');

        $(this).css('border-color','black');
        $(this).css('border-style','dotted');
        $(this).css('border-width','3px');
        //console.log(colourPicked);
    });
});

$(function () {
    $(".box").click(function () {
        $(this).css('background-color', colourPicked);
        
    });
});