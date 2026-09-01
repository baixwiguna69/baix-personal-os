/* ==========================================
   BAIX DEBT & OBLIGATION CORE
========================================== */


/* ==========================================
   MODAL ELEMENTS
========================================== */

const debtModal =
    document.getElementById(
        "debtModal"
    );


const obligationModal =
    document.getElementById(
        "obligationModal"
    );


/* ==========================================
   OPEN DEBT
========================================== */

document.getElementById(
    "addDebt"
).onclick = () => {

    debtModal.classList.remove(
        "hidden"
    );

};


/* ==========================================
   CLOSE DEBT
========================================== */

document.getElementById(
    "closeDebtModal"
).onclick = () => {

    debtModal.classList.add(
        "hidden"
    );

};


/* ==========================================
   OPEN OBLIGATION
========================================== */

document.getElementById(
    "addObligation"
).onclick = () => {

    obligationModal.classList.remove(
        "hidden"
    );

};


/* ==========================================
   CLOSE OBLIGATION
========================================== */

document.getElementById(
    "closeObligationModal"
).onclick = () => {

    obligationModal.classList.add(
        "hidden"
    );

};


/* ==========================================
   DEFAULT DATE
========================================== */

function localToday() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


document.getElementById(
    "debtStartDate"
).value =
    localToday();


/* ==========================================
   INITIAL STATE
========================================== */

console.log(
    "BAIX DEBT CORE ONLINE"
);
