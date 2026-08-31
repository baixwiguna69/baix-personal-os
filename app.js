/* =========================================
   BAIX NEON GRID OS
   COMMAND CENTER ENGINE
========================================= */


const STORAGE_KEY = "baix-neon-grid-os";


/* =========================================
   DEFAULT DATA
========================================= */

const defaultData = {

    cycle: "SHIFT 1",

    tasks: [

        {
            id: "wake",
            title: "Bangun & persiapan",
            description: "Bangun, minum air dan bersiap.",
            time: "09:00",
            completed: false
        },

        {
            id: "meal1",
            title: "Makan / Meal 1",
            description: "Sarapan tinggi kalori + protein.",
            time: "09:30",
            completed: false
        },

        {
            id: "meal2",
            title: "Makan / Meal 2",
            description: "Makan siang.",
            time: "12:15",
            completed: false
        },

        {
            id: "workout",
            title: "Workout",
            description: "Latihan sesuai program hari ini.",
            time: "15:00",
            completed: false
        },

        {
            id: "meal3",
            title: "Meal 3 + persiapan kerja",
            description: "Makan sebelum berangkat kerja.",
            time: "16:00",
            completed: false
        },

        {
            id: "work",
            title: "Mulai kerja",
            description: "Masuk shift.",
            time: "21:00",
            completed: false
        },

        {
            id: "meal4",
            title: "Meal 4",
            description: "Recovery meal.",
            time: "00:30",
            completed: false
        },

        {
            id: "sleep",
            title: "Tidur",
            description: "Recovery tubuh.",
            time: "01:30",
            completed: false
        }

    ]

};


/* =========================================
   LOAD DATA
========================================= */

let data =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || defaultData;


/* =========================================
   SAVE
========================================= */

function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* =========================================
   CLOCK
========================================= */

function updateClock() {

    const now = new Date();


    document.getElementById("clock")
        .textContent =
        now.toLocaleTimeString(
            "id-ID",
            {
                hour12: false
            }
        );


    document.getElementById("date")
        .textContent =
        now.toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        ).toUpperCase();

}


setInterval(
    updateClock,
    1000
);

updateClock();


/* =========================================
   CYCLE
========================================= */

function getNextCycle(cycle) {

    if (cycle === "SHIFT 1") {

        return "SHIFT 2";

    }

    if (cycle === "SHIFT 2") {

        return "LIBUR";

    }

    return "SHIFT 1";

}


function renderCycle() {

    const current =
        data.cycle;

    const next =
        getNextCycle(current);


    document.getElementById(
        "currentCycle"
    ).textContent = current;


    document.getElementById(
        "nextCycle"
    ).textContent = next;


    document
        .querySelectorAll(
            "[data-cycle]"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.cycle === current
            );

        });

}


document
    .querySelectorAll(
        "[data-cycle]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                data.cycle =
                    button.dataset.cycle;

                saveData();

                renderCycle();

                showToast(
                    "SIKLUS → " +
                    data.cycle
                );

            }
        );

    });


renderCycle();


/* =========================================
   TASK
========================================= */

function renderTasks() {

    const container =
        document.getElementById(
            "taskList"
        );


    container.innerHTML = "";


    data.tasks.forEach(task => {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "task " +
            (
                task.completed
                    ? "completed"
                    : ""
            );


        element.innerHTML = `

            <button
                class="task-check"
                data-id="${task.id}"
            >
                ${task.completed ? "✓" : ""}
            </button>

            <div>

                <span class="task-title">
                    ${task.title}
                </span>

                <span class="task-meta">
                    ${task.description}
                </span>

            </div>

            <span class="task-time">
                ${task.time}
            </span>

        `;


        element
            .querySelector(
                ".task-check"
            )
            .addEventListener(
                "click",
                () => {

                    toggleTask(
                        task.id
                    );

                }
            );


        container.appendChild(
            element
        );

    });


    updateTaskStats();

}


/* =========================================
   TOGGLE TASK
========================================= */

function toggleTask(id) {

    const task =
        data.tasks.find(
            item =>
                item.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveData();

    renderTasks();


    if (task.completed) {

        showToast(
            "TASK SELESAI ✓"
        );

    }

}


/* =========================================
   TASK STATISTICS
========================================= */

function updateTaskStats() {

    const total =
        data.tasks.length;


    const done =
        data.tasks.filter(
            task =>
                task.completed
        ).length;


    document.getElementById(
        "totalCount"
    ).textContent = total;


    document.getElementById(
        "doneCount"
    ).textContent = done;


    const percentage =
        total === 0
            ? 0
            : (done / total) * 100;


    document.getElementById(
        "taskProgress"
    ).style.width =
        percentage + "%";


    renderNextTask();

}


/* =========================================
   NEXT TASK
========================================= */

function timeToMinutes(time) {

    const parts =
        time.split(":");

    return (
        Number(parts[0]) * 60 +
        Number(parts[1])
    );

}


function renderNextTask() {

    const now =
        new Date();


    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();


    const unfinished =
        data.tasks.filter(
            task =>
                !task.completed
        );


    if (
        unfinished.length === 0
    ) {

        document.getElementById(
            "nextTaskTitle"
        ).textContent =
            "SEMUA SELESAI";


        document.getElementById(
            "nextTaskTime"
        ).textContent =
            "✓";


        document.getElementById(
            "nextTaskDescription"
        ).textContent =
            "Daily protocol selesai.";


        return;

    }


    let next =
        unfinished.find(
            task =>
                timeToMinutes(
                    task.time
                ) >= currentMinutes
        );


    if (!next) {

        next =
            unfinished[0];

    }


    document.getElementById(
        "nextTaskTitle"
    ).textContent =
        next.title;


    document.getElementById(
        "nextTaskTime"
    ).textContent =
        next.time;


    document.getElementById(
        "nextTaskDescription"
    ).textContent =
        next.description;


    document.getElementById(
        "completeNext"
    ).onclick = () => {

        toggleTask(
            next.id
        );

    };

}


renderTasks();


setInterval(
    renderNextTask,
    30000
);


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            1800
        );

}


/* =========================================
   PRAYER TIME
========================================= */

async function loadPrayerTimes() {

    const locationElement =
        document.getElementById(
            "location"
        );


    /*
        Coba mendapatkan
        lokasi pengguna.
    */

    if (!navigator.geolocation) {

        locationElement.textContent =
            "GPS tidak tersedia";

        setDefaultPrayer();

        return;

    }


    navigator.geolocation.getCurrentPosition(

        async position => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            try {

                const response =
                    await fetch(
                        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=20`
                    );


                const result =
                    await response.json();


                if (
                    result.code !== 200
                ) {

                    throw new Error(
                        "Prayer API error"
                    );

                }


                const timings =
                    result.data.timings;


                document.getElementById(
                    "subuh"
                ).textContent =
                    timings.Fajr;


                document.getElementById(
                    "dzuhur"
                ).textContent =
                    timings.Dhuhr;


                document.getElementById(
                    "ashar"
                ).textContent =
                    timings.Asr;


                document.getElementById(
                    "maghrib"
                ).textContent =
                    timings.Maghrib;


                document.getElementById(
                    "isya"
                ).textContent =
                    timings.Isha;


                locationElement.textContent =
                    "GPS ACTIVE";


                calculateNextPrayer(
                    timings
                );

            }

            catch(error) {

                console.error(
                    error
                );

                setDefaultPrayer();

            }

        },

        error => {

            console.log(
                "GPS ditolak"
            );

            locationElement.textContent =
                "Lokasi manual";


            setDefaultPrayer();

        }

    );

}


/* =========================================
   FALLBACK PRAYER
========================================= */

function setDefaultPrayer() {

    document.getElementById(
        "subuh"
    ).textContent = "04:35";


    document.getElementById(
        "dzuhur"
    ).textContent = "12:00";


    document.getElementById(
        "ashar"
    ).textContent = "15:20";


    document.getElementById(
        "maghrib"
    ).textContent = "18:00";


    document.getElementById(
        "isya"
    ).textContent = "19:10";


    document.getElementById(
        "nextPrayer"
    ).textContent =
        "Data default";

}


/* =========================================
   NEXT PRAYER
========================================= */

function calculateNextPrayer(
    timings
) {

    const prayerList = [

        {
            name: "SUBUH",
            time: timings.Fajr
        },

        {
            name: "DZUHUR",
            time: timings.Dhuhr
        },

        {
            name: "ASHAR",
            time: timings.Asr
        },

        {
            name: "MAGHRIB",
            time: timings.Maghrib
        },

        {
            name: "ISYA",
            time: timings.Isha
        }

    ];


    const now =
        new Date();


    const current =
        now.getHours() * 60 +
        now.getMinutes();


    let next =
        prayerList.find(
            prayer =>
                timeToMinutes(
                    prayer.time
                ) > current
        );


    if (!next) {

        next =
            prayerList[0];

    }


    document.getElementById(
        "nextPrayer"
    ).textContent =
        next.name +
        " • " +
        next.time;

}


loadPrayerTimes();
