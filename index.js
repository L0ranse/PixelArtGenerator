alert("Welcome to the Art Generator! This tool allows you to create unique and beautiful pieces of art. Enjoy the experience!");

let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");
let downloadBtn = document.getElementById("download-btn");

let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup"
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend"
    }
};

let deviceType = "";
let draw = false;
let erase = false;

const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }
    catch (e) {
        deviceType = "mouse";
        return false;
    }
};
isTouchDevice();

gridButton.addEventListener("click", () => {
    container.innerHTML = "";
    let count = 0;

    for (let i = 0; i < Number(gridHeight.value); i++) {
        let div = document.createElement("div");
        div.classList.add("gridRow");

        for (let j = 0; j < Number(gridWidth.value); j++) {
            count++;
            let col = document.createElement("div");
            col.classList.add("gridCol");
            col.setAttribute("id", `gridCol${count}`);
            col.addEventListener(events[deviceType].down, () => {
                draw = true;
                col.style.backgroundColor = erase ? "transparent" : colorButton.value;
            });
            col.addEventListener(events[deviceType].move, (e) => {
                if (draw) {
                    col.style.backgroundColor = erase ? "transparent" : colorButton.value;
                    let point = deviceType === "touch" ? e.touches[0] : e;
                    checker(document.elementFromPoint(point.clientX, point.clientY));
                }
            });
            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });
            div.appendChild(col);
        }

        container.appendChild(div);
    }
});

function checker(element) {
    if (!element || !draw) return;

    // Eğer imlecin altındaki eleman bir kareyse (gridCol) boya/sil
    if (element.classList.contains("gridCol")) {
        element.style.backgroundColor = erase ? "transparent" : colorButton.value;
    }
}


clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
});
eraseBtn.addEventListener("click", () => {
    erase = true;
});
paintBtn.addEventListener("click", () => {
    erase = false;
});
gridWidth.addEventListener("input", () => {
    widthValue.innerHTML = gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
});
const updateHeightValue = () => {
    const height = gridHeight.valueAsNumber || Number(gridHeight.value);
    heightValue.textContent = height < 9 ? `0${height}` : String(height);
};

// Keep the height control and its displayed value in sync while dragging.
gridHeight.addEventListener("input", updateHeightValue);
gridHeight.addEventListener("change", updateHeightValue);
updateHeightValue();

window.addEventListener("mouseup", () => {
    draw = false;
});






downloadBtn.addEventListener("click", () => {
    const rows = container.querySelectorAll(".gridRow");
    if (rows.length === 0) {
        alert("Önce bir grid oluşturmalısın!");
        return;
    }

    const heightCount = rows.length;
    const widthCount = rows[0].children.length;
    const pixelSize = 20;

    const canvas = document.createElement("canvas");
    canvas.width = widthCount * pixelSize;
    canvas.height = heightCount * pixelSize;
    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;

    rows.forEach((row, rowIndex) => {
        const cols = row.querySelectorAll(".gridCol");
        cols.forEach((col, colIndex) => {
            // CSS dosyasını değil, sadece kullanıcının JS ile boyadığı rengi oku
            const cellColor = col.style.backgroundColor;

            // Eğer kullanıcı bu kutuyu boyamışsa ve silgiyle silmemişse çiz
            if (cellColor && cellColor !== "transparent" && cellColor !== "") {
                ctx.fillStyle = cellColor;
                ctx.fillRect(colIndex * pixelSize, rowIndex * pixelSize, pixelSize, pixelSize);
            }
        });
    });

    const downloadLink = document.createElement("a");
    downloadLink.download = "pixel-art.png";
    downloadLink.href = canvas.toDataURL("image/png");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});
