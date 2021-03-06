// Create NGL Stage object
var stage = new NGL.Stage("viewport");

// Handle window resizing
window.addEventListener("resize", function (event) {
  stage.handleResize();
}, false);

ctx = connect_seamless()
ctx.self.onsharelist = function(sharelist) {
    sharelist.forEach(element => {
        if (element.indexOf(".") != -1) {
            return
        }
        var inputElement = document.getElementById(element)
        if (inputElement === null) {
           inputElement = document.getElementsByName(element)
           inputElement = inputElement[0]
           if (inputElement === null) return
        }


        if (element == "pdb1" || element == "pdb2") {
            ctx[element].onchange = loadNGL
        }
        else if ((element == "scored") || (element == "docked")) {
            ctx[element].onchange = function() {
                const v = JSON.parse(this.value)
                inputElement.innerHTML = v
            }
        }
        else {
            ctx[element].onchange = function() {
                const v = JSON.parse(this.value)
                inputElement.value = v
                const inputElement2 = document.getElementById(element+"_label")
                if (inputElement2 === null) return
                inputElement2.innerHTML = v
            }
            inputElement.onchange = function() {
                v = this.value
                ctx[element].set(v)
                const inputElement2 = document.getElementById(element+"_label")
                if (inputElement2 === null) return
                inputElement2.innerHTML = v
            }
        }
    })
}

function loadNGL() {
    stage.removeAllComponents()
    Promise.all([
      stage.loadFile("./pdb1",{ext:"pdb"}),
      stage.loadFile("./pdb2",{ext:"pdb"}),
    ]).then(function (l) {
        pdb1 = l[0]
        pdb2 = l[1]
        pdb1.addRepresentation("spacefill", {
            opacity: 0.2,
        })
        pdb2.addRepresentation("hyperball", {
            color: "green",
        })
        pdb2.addRepresentation("spacefill", {
            color: "magenta",
            sele: "not backbone",
            opacity: 0.2,
        })
        pdb2.addRepresentation("cartoon", {
            color: "red",
            sele: "backbone",
        })
        pdb2.addRepresentation( "axes", { showAxes: true, showBox: true, radius: 0.2 })
        stage.autoView()
        var pa = pdb2.structure.getPrincipalAxes();
        stage.animationControls.rotate( pa.getRotationQuaternion(), 1500 );
    })
}
loadNGL()
