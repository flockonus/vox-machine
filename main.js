const state = {
    activeSlot: 1,
    pressing: null,
}

let mediaRecorder

let audioChunks = []

function init(ev) {
    document.addEventListener("keydown", keydownHandler)
    document.addEventListener("keyup", keyupHandler)
    // also handle case where window lose focus, assume it's a keyup

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream)

            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            });
        
            mediaRecorder.addEventListener("dataavailable", event => {
                console.log("appened chunk", event)
                audioChunks.push(event.data);
            });

        })
}

function keydownHandler(ev) {
    // console.log(ev)

    if (ev.key === state.pressing) {
        // prevents repeated keypress
        return;
    }
    state.pressing = ev.key
    let keyNum = parseInt(ev.key)

    if (!isNaN(keyNum) && keyNum === 1) {
        state.activeSlot = keyNum
    }

    if (ev.key === "Escape") {
        state.activeSlot = null
    }

    if (ev.key === " ") {
        // start recording
        console.log("start recording", state.activeSlot)

        // color the button
        document.querySelector(`.click.c${state.activeSlot}`).classList.add("active")

        audioChunks = []
        mediaRecorder.start();
    }
}


function keyupHandler(ev) {
    // maybe stop recording here
    console.log("stop recording")
    state.pressing = null;
    document.querySelector(`.click.c${state.activeSlot}`).classList.remove("active")

    mediaRecorder.stop();
}