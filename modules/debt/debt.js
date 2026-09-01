/* ==========================================
   BAIX DEBT & OBLIGATION CORE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "BAIX DEBT CORE ONLINE"
        );


        /* ==========================================
           ELEMENTS
        ========================================== */

        const debtModal =
            document.getElementById(
                "debtModal"
            );


        const obligationModal =
            document.getElementById(
                "obligationModal"
            );


        const addDebt =
            document.getElementById(
                "addDebt"
            );


        const addObligation =
            document.getElementById(
                "addObligation"
            );


        const closeDebtModal =
            document.getElementById(
                "closeDebtModal"
            );


        const closeObligationModal =
            document.getElementById(
                "closeObligationModal"
            );


        /* ==========================================
           CHECK ELEMENTS
        ========================================== */

        console.log(
            "Debt Modal:",
            debtModal
        );

        console.log(
            "Obligation Modal:",
            obligationModal
        );

        console.log(
            "Add Debt:",
            addDebt
        );

        console.log(
            "Add Obligation:",
            addObligation
        );


        /* ==========================================
           OPEN DEBT
        ========================================== */

        if (addDebt) {

            addDebt.addEventListener(
                "click",
                () => {

                    console.log(
                        "OPEN DEBT"
                    );

                    debtModal.classList.remove(
                        "hidden"
                    );

                }
            );

        }


        /* ==========================================
           CLOSE DEBT
        ========================================== */

        if (closeDebtModal) {

            closeDebtModal.addEventListener(
                "click",
                () => {

                    debtModal.classList.add(
                        "hidden"
                    );

                }
            );

        }


        /* ==========================================
           OPEN OBLIGATION
        ========================================== */

        if (addObligation) {

            addObligation.addEventListener(
                "click",
                () => {

                    console.log(
                        "OPEN OBLIGATION"
                    );

                    obligationModal.classList.remove(
                        "hidden"
                    );

                }
            );

        }


        /* ==========================================
           CLOSE OBLIGATION
        ========================================== */

        if (closeObligationModal) {

            closeObligationModal.addEventListener(
                "click",
                () => {

                    obligationModal.classList.add(
                        "hidden"
                    );

                }
            );

        }


        /* ==========================================
           DEFAULT DATE
        ========================================== */

        const debtStartDate =
            document.getElementById(
                "debtStartDate"
            );


        if (debtStartDate) {

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


            debtStartDate.value =
                `${year}-${month}-${day}`;

        }

    }
);
