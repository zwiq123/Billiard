class Game{
    constructor(containerName){
        this.WIDTH = 720;
        this.HEIGHT = this.WIDTH/2;
        this.BORDERWIDTH = 20;
        this.HOLERADIUS = 15;

        this.mainContainer = document.querySelector('#'+containerName);
        this.createCanvases();
        this.styleContainers();
        this.drawTable();
    }

    styleContainers(){
        this.mainContainer.style.width = "75vmax";
        this.mainContainer.style.height = "37.5vmax";
    }

    createCanvases(){
        const tableCanvas = document.createElement('canvas');
        tableCanvas.width = this.WIDTH;
        tableCanvas.height = this.HEIGHT;
        tableCanvas.style.width = "100%";
        tableCanvas.style.height = "100%";
        this.tableCTX = tableCanvas.getContext('2d');
        this.mainContainer.appendChild(tableCanvas);
    }

    drawTable(){
        this.tableCTX.fillStyle = "#169149";
        this.tableCTX.fillRect(0,0,this.WIDTH, this.HEIGHT);

        this.tableCTX.fillStyle = "#8f5d1b";
        this.tableCTX.fillRect(0,0,this.WIDTH,this.BORDERWIDTH);
        this.tableCTX.fillRect(0,0,this.BORDERWIDTH,this.HEIGHT);
        this.tableCTX.fillRect(0,this.HEIGHT-this.BORDERWIDTH, this.WIDTH, this.HEIGHT);
        this.tableCTX.fillRect(this.WIDTH-this.BORDERWIDTH,0,this.WIDTH, this.HEIGHT);

        this.tableCTX.fillStyle = "#117038";
        this.tableCTX.fillRect(this.BORDERWIDTH,this.BORDERWIDTH,this.WIDTH-2*this.BORDERWIDTH,this.HOLERADIUS);
        this.tableCTX.fillRect(this.BORDERWIDTH,this.BORDERWIDTH,this.HOLERADIUS,this.HEIGHT-2*this.BORDERWIDTH);
        this.tableCTX.fillRect(this.BORDERWIDTH,this.HEIGHT-this.BORDERWIDTH-this.HOLERADIUS, this.WIDTH-2*this.BORDERWIDTH, this.HOLERADIUS);
        this.tableCTX.fillRect(this.WIDTH-this.BORDERWIDTH-this.HOLERADIUS,this.BORDERWIDTH,this.HOLERADIUS, this.HEIGHT-2*this.BORDERWIDTH);


        this.drawHole(this.BORDERWIDTH, this.BORDERWIDTH)
        this.drawHole(this.BORDERWIDTH, this.HEIGHT-this.BORDERWIDTH)
        this.drawHole(this.WIDTH/2, this.BORDERWIDTH)
        this.drawHole(this.WIDTH/2, this.HEIGHT-this.BORDERWIDTH)
        this.drawHole(this.WIDTH-this.BORDERWIDTH, this.BORDERWIDTH)
        this.drawHole(this.WIDTH-this.BORDERWIDTH, this.HEIGHT-this.BORDERWIDTH)
    }

    drawHole(centerX, centerY){
        this.tableCTX.fillStyle = "#141414";
        this.tableCTX.beginPath();
        this.tableCTX.arc(centerX, centerY, this.HOLERADIUS, 0, 2*Math.PI);
        this.tableCTX.fill();
        this.tableCTX.closePath();
    }
}

window.addEventListener("load", ()=>{
    new Game("billard-table");
})